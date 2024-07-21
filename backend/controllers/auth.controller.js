import User from '../models/user_model.js';
import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookies } from '../lib/utils/generateToken.js';

export const signup = async (req,res)=> {
  try {
    const {fullName, userName ,email, password}=req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format"});
    }

    const existingUser = await User.findOne({userName})
    if(existingUser){
      return res.status(400).json({ error : "Username is already taken"});
    }

    const existingEmail = await User.findOne({email})
    if(existingEmail){
      return res.status(400).json({ error : "Email is already taken"});
    }

    if(password.length <8){
      return res.status(400).json({ error : "Password must be more than 8 characters"});
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      userName,
      email,
      password:hashedPassword
    })

    if(newUser){
      await newUser.save();
      generateTokenAndSetCookies(newUser._id,res);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        userName: newUser.userName,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.followers,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      });
    } else {
      res.status(400).json({ error: "Invalid user data"}); 
    }
  } catch (error) {
    console.log("Error in sign up controller", error.message);

    res.status(500).json({ error: "Internal server Error" });
  }
}


export const login = async (req, res) => {
  try {
    const {userName,password}= req.body;
    const user =await User.findOne({userName});
    const isPasswordCorrect=await bcrypt.compare(password, user?.password||"");
    
    if(!user || !isPasswordCorrect){
      return res.status(400).json({error: "individual username or password"})
    }

    generateTokenAndSetCookies(user._id,res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      userName: user.userName,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
    })
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({error:"Internal Sever Error"});
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt","",{maxAge:0})
    res.status(200).json({message:"Logged out successsfully"})
  } catch (error) {
    console.log("Error in logout controller",error.message);

  }
};

export const getMe =async (req,res) =>{
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getMe",error.message);
    res.status(500).json({error:"Internal Sever Error"});
  }
}