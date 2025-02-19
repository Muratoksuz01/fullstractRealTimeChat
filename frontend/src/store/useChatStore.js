import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    onlineUsers: [],
    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users")
            set({ users: res.data });

        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },
    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`)
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    setSelectedUser: (user) => set({ selectedUser: user }),
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);

            set({ messages: [...(messages || []), res.data] });
        } catch (error) {
            console.log("hata", error);
            toast.error(error.response);
        }
    },
    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;
        
        
        const socket = useAuthStore.getState().socket;
        console.log("🔵 subscribeToMessages çağrıldı!:",socket);
        
        socket.on("newMessage", (newMessage) => {
            console.log("🔥 newMessage event tetiklendi:", newMessage);
            
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            console.log("✅ Şart kontrolü sonucu:", isMessageSentFromSelectedUser);
    
            if (!isMessageSentFromSelectedUser) return;
    
            set({
                messages: [...get().messages, newMessage],
            });
        });
    },
    
    unsubscribeFromMessages: () => {
        console.log("🔴 unsubscribeFromMessages çağrıldı!");
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },
}))
