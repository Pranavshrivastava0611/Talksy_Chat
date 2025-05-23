import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";


export const useChatStore = create((set,get)=>({
    messages : [],
    users: [],
     selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    

    getUsers : async ()=>{
        set({isUsersLoading: true});
            try{
                const response = await axiosInstance.get("/message/users");
                set({users: response.data});
            }catch(error){
                console.log("error in the getUsers function",error);
                toast.error("Error in fetching users");
            }finally{
                set({isUsersLoading: false});
            }
    },

     getMessages: async (userId) => {
     
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage : async (MessageData)=>{
    // tp get the data we use the get() ;
    const {selectedUser,messages} = get();
    try{
      console.log("response from the sendMessage function",MessageData);
      const res = await axiosInstance.post(`/message/send/${selectedUser._id}`,MessageData);
      set({messages : [...messages,res.data]})
    }catch(error){
      toast.error(error.response.data.message);
      console.log("error in the sendMessage function",error);
    }
  },

  subscribeToMessages : ()=>{
    const {selectedUser} = get();
    if(!selectedUser) return;
    const socket = useAuthStore.getState().socket;

    
    socket.on("newMessage", (newMessage)=>{
      if(newMessage.senderId !== selectedUser._id) return;
      set({messages : [...get().messages,newMessage]});
    })

  },

  unsubscribeToMessages : ()=>{
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
  setSelectedUser : (user)=>{
    set({selectedUser: user});
  },


}))