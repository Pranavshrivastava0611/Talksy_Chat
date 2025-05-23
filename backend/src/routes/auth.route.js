import express from "express"
import { signup , login,logout , updateProfile,checkAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middlware.js";



const router = express.Router();

router.post("/signup" ,signup)

router.post("/login" , login)

router.post("/logout", logout)

router.put("/update-profile",protectRoute ,updateProfile);  // protectRoute act as a middleware which is used to authenticate the user on the update profile req;

router.get("/check", protectRoute,checkAuth)

export default router