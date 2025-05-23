import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUserForSidebar = async (req,res)=>{
    const user = req.user;  // the user came from the protectedRoute middleware;
    try{    
        
        const loggedInUserId = user._id;
        const allUsers = await User.find({ _id : {$ne : loggedInUserId}}).select("-password");

        res.status(200).json(allUsers);
    }catch(error){
        console.log("error in getting the user for the sidebar",error);
        return res.status(500).json({
            message : "Internal server error",
        })
    }
}

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req,res)=>{
    try{
        const senderId = req.user._id;
        const {id : receiverId } = req.params;
        const {text,image} = req.body;
        let imageUrl ;  //initially undefined
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId ,
            receiverId ,
            text,
            image : imageUrl
        })
        await newMessage.save();

        //todo : realtime functionality ;
        const receiverSocketId = getReceiverSocketId(receiverId); // get the socket id of the receiver
        if(receiverSocketId){
          io.to(receiverSocketId).emit("newMessage",newMessage); // emit the new message to the receiver
        }
        //realtime functionality goes here;
        return res.status(201).json(newMessage)
 
    }catch(error){
        console.log("error in sending the messages" , error);
        return res.staus(500).json({
            message : "Internal server error",
        })
    }
}