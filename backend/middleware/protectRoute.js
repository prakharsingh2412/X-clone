import jwt from "jsonwebtoken";
import User from "../models/user_model.js";


export const protectRoute =async (req,res,next)=>{
    try {
        const token=req.cookies.jwt;
        if(!token){
            return res.status(401).json({error: "Unauthorizerd: no token provider"});
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        
        if(!decoded){
            return res.status(401).json({error: "Unauthorizerd: Invalid token"});
        }
        const user = await User.findById(decoded.UserId).select("-password");

        if(!user){
            return res.status(404).json({error: "user not found"});
        }

        req.user =user;
        next();
    } catch (error) {
        console.log("Error in protectRoute controller", error.message);
        res.status(500).json({error:"Internal Sever Error"});
    }
}
        