import jwt from "jsonwebtoken"
import User from "../models/user.model.js"


export const protectRoute = async (req,res,next)=>{

    // since this is a middlware this will contain the next function and this only forward the req to the next function;
    try{
    const token = req.cookies.jwt;

    if(!token){
        return res.status(401).json({
            message : "Unauthorized- No token provided",
        })
    }

    //now if we get the token now we have to verify it;
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    if(!decoded){
        return res.status(401).json({
            message : "Unauthorized- Invalid token",
        })
    }

    const user = await User.findById(decoded.userId).select("-password");
    if(!user){
        return res.status(404).json({
            message: "User not found",
        })
    }

    req.user = user; // since we pass the req from this to other so that's why we pass the req to next;

    next();

}catch(error){
    console.log("error in authentication",error);
    return res.status(500).json({message : "Internal server error"});
}
}