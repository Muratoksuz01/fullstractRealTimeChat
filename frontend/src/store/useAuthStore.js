import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";  
const BASE_URL = import.meta.env.MODE==="development" ? "http://localhost:5001":"/";
export const useAuthStore = create((set,get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isupdatingProfile: false,
    ischeckingAuth: true,
    onlineUsers:[],
    socket:null,
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data.user });
            get().connectSocket();
        } catch (error) {
            console.log("Error in checkAuth:", error);
            set({ authUser: null });
        }
        finally {
            set({ ischeckingAuth: false });
        }
    },
    signup: async (formData) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", formData);
            toast.success("Account created successfully");
            set({ authUser: res.data });
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false });
        }
    },
    logout:async ()=>{
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            get().disconnectSocket();
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    } ,
    login:async(formData)=>{
        set({isLoggingIn:true})
        try {
            const res = await axiosInstance.post("/auth/login", formData);
            set({ authUser: res.data });
            toast.success("Logged in successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },
    updateProfile:async(data)=>{
        set({isupdatingProfile:true})
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("Error in updateProfile:", error);
            toast.error(error.response.data.message);
        } finally {
            set({ isupdatingProfile: false });
        }
    },
    connectSocket:()=>{
        const {authUser} = get();
        console.log("authuserid",authUser?._id);
        if(!authUser || get().socket?.connected) return;
        const socket=io(BASE_URL,{
            query:{
                userId:authUser._id
            }
        });
        socket.connect()
        set({socket});
        socket.on("getOnlineUsers",(data)=>{
            console.log("getOnlineUsers",data);
            set({onlineUsers:data});
        });
      
       

    },
    disconnectSocket:()=>{
        if(get().socket?.connected){
            get().socket.disconnect();
        }
    },
}));
