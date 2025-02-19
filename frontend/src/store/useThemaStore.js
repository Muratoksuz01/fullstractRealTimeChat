import { create } from "zustand";

export const useThemaStore = create((set) => ({
    theme:localStorage.getItem("chat-theme") || "caffee",
    setTheme:(theme)=>{
        localStorage.setItem("chat-theme",theme)
        set({theme})
    }
}))