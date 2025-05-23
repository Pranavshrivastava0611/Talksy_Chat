import {Server} from "socket.io";
import http from "http";
import express from "express";


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
});

const userSocketMap = {}; //to store the socket ids of the users
export function getReceiverSocketId(userId) {
    return userSocketMap[userId]; // return the socket id of the user
}

io.on("connection", (socket) => {
    console.log("a user connected",socket.id);
    const userId = socket.handshake.query.userId; // get the userId from the query params
   if(userId) userSocketMap[userId] = socket.id; // store the socket id in the userSocketMap

   io.emit("getOnlineUsers",Object.keys(userSocketMap)); // emit the online users to all the clients'

    socket.on("disconnect", () => {
        console.log("user disconnected",socket.id);
        delete userSocketMap[userId]; // remove the socket id from the userSocketMap
        io.emit("getOnlineUsers",Object.keys(userSocketMap)); // emit the online users to all the clients
    });
});

export {io,app,server};
