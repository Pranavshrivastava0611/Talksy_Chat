// making the global auth state which we can use everywhere in the app;
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =  import.meta.env.MODE==="development" ? "http://localhost:5000" : "/"; // Replace with your server URL


export const useAuthStore = create((set,get)=>({
    authUser : null,
    isSigningUp : false,
    isLogginUp : false,
    isUpdatingProfile : false,
    isCheckingAuth : true,
    onlineUsers : [],
    socket : null,
   

    checkAuth : async()=>{
        try{
            const res = await axiosInstance.get("/auth/check");
            console.log("response from the checkAuth function", res.data);
            set({authUser : res.data});
            get().connectSocket();
        }catch(error){
            set({authUser : null})
            console.log("error in the checkAuth function",error);

        }finally{
            set({isCheckingAuth : false});
        }
    },

    signup : async (data)=>{
        set({isSigningUp : true});
        try{
            const res = await axiosInstance.post("/auth/signup",data);
            toast.success("Account created successfully")       
            set({authUser : res.data});
            get().connectSocket();
        }catch(error){
            // toast.error(error.response.data.message)
            console.log("error in signup function " ,error)
        }finally{
            set({isSigningUp : false})
        }
    },

    logout : async ()=>{
        try{
             await axiosInstance.post("/auth/logout");
            set({authUser : null});
            toast.success("Logged out successfully");
            get().disconnectSocket();
        }catch(error){
            toast.error(error.response.data.message);
            console.log("error in the logout function",error);
        }
    },

    login : async (data)=>{
        set({isLogginUp : true});
        try{
            const res = await axiosInstance.post("/auth/login",data);
            toast.success("Login successfully");
            set({authUser : res.data});
            get().connectSocket();
        }catch(error){
            console.log("error in the login function",error);
            toast.error(error.response.data.message)
        }finally{
            set({isLogginUp : false});
        }
    },

    updateProfile : async (profileData)=>{
        set({ isUpdatingProfile: true });
        try{
                 const res = await axiosInstance.put("/auth/update-profile",profileData);
                    set({ authUser: res.data });
                    toast.success("Profile updated successfully");
        }catch(error){
            console.log("error in the updatingProfile function", error);
            toast.error(error.response.data.message);
        }finally{
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket : ()=>{
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL,{
            query : {
                userId : authUser._id,
            }
        });
            set({ socket : socket });
        socket.on("getOnlineUsers", (usersIds)=>{
            set({onlineUsers : usersIds});
        })
        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
        });
        socket.connect();
    },
    disconnectSocket : ()=>{
        if(!get().socket) return;
        console.log("disconnecting socket");
        get().socket.disconnect();
        set({socket : null});
    }
}))


