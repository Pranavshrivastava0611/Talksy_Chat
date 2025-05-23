import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";


export const signup =  async (req,res)=>{
  
    const { FullName, email, password } = req.body;
   try{
       
    if (!FullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

        if(password.length < 6){
            return (
              res.status(400),
              json({
                message: "Password must be at least 6 characters long",
              })
            );
        }

        const user = await User.findOne({ email });

        if(user){
            return res.status(400).json({
              message: "Email already exists",
            });
        }
 
         //hash password; salt pepper hashing , traditional way of hashing
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(password,salt);

         const newUser = new User({
            FullName,
            email,
            password : hashedPassword
         })

         if(newUser){
            // generate the jwt token here
            generateToken(newUser._id, res);  
           await newUser.save();
            
           return res.status(201).json({
            _id : newUser._id,
            FullName: newUser.FullName,
          email: newUser.email,
          profilePic: newUser.profilePic,
           })
         }else{
            return res.status(400).json({
                message : "Invalid user data"
            })
         }
   }catch(error){
    console.log("error in creating a user" , error);
    return res.status(500).json({
      message : "Internal server error",
    })
   }
}
export const login =  async (req,res)=>{
    const { email, password } = req.body;
    
    try{
        const user = await User.findOne({ email });
        if(user){
         console.log("user found");
        }else{
          return res.status(400).json({
            message: "Invalid user data",
          });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
          return res.status(400).json({
            message : "Invalid Password",
          })
        }

        generateToken(user._id, res);
        return res.status(200).json({
          _id: user._id,
          FullName: user.FullName,
          email: user.email,
          profilePic: user.profilePic,
        });

    }catch(error){
      console.log("error in login", error);
      res.status(500).json({
        message : "Internal server error",
      })
    }
}
export const logout =  async (req,res)=>{
  try{
     res.cookie("jwt","",{
      maxAge : 0
    })

    res.status(200).json({
      message : "logged out  successful"
    })
  }catch(error){
    console.log("error in logout", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
  
}

export const updateProfile = async (req,res)=>{
  try{ 
    const {profilePic} = req.body;
    
    const userId = req.user._id;

    if(!profilePic){
      return res.status(400).json({
        message : "Profile pic is required"
      })
    }

    const response = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findOneAndUpdate(userId,{
      profilePic : response.secure_url
    },{new : true})  //after applying the new it will return an updated user

    return res.status(200).json(updatedUser)

  }catch(error){
      return res.status(500).json({
        message : "Internal server error",
      })
  }
     
}

export const checkAuth = (req,res)=>{
  try{
      return res.status(200).json(req.user);
  }catch(error){
    console.log("error in the checkAuth controller",error.message);
   return res.status(500).json({
      message : "Internal server error",
    })
  }
}