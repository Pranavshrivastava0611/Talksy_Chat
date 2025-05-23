import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import { conncetDb } from "./lib/db.js";
import cors from "cors"
import {io,app,server} from "./lib/socket.js"
import path from "path"


// by default the node does'nt load the environment variable so for that we use dotenv to lad environment variables;
dotenv.config();
const __dirname = path.resolve();

//all the middleware will be here 
app.use(express.json());  // this allow us to extract the data from the body in json format
app.use(express.urlencoded({ extended: true })); // For form data
app.use(cookieParser()); // this is used to parse the req and get the cookie;
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true,
}))
app.use("/api/auth" , authRoutes)
app.use("/api/message", messageRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}

//listening the server
server.listen(process.env.PORT,()=>{
    console.log("server started at port : " + process.env.PORT);
    conncetDb();
})
