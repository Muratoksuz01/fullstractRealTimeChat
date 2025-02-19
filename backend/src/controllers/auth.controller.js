import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from "bcrypt"; // Doğru

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            generateToken(newUser._id,res)
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                fullName: newUser.fullName,
                profilePic: newUser.profilePic || "",
            });
        } else {
            return res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.log("Error in signup controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const login = async (req, res) => {
    console.log("login fok")
    const {email,password}= req.body
    try {
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({ message:
                 "Invalid Credentials" });
        }
        const isPaswordCorrect= await bcrypt.compare(
            password,user.password)
        if(!isPaswordCorrect){
            return res.status(400).json({ message:
                "Invalid Credentials" });
        }
        generateToken(user._id,res)
        res.status(201).json({
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log("error in login controller ",error.message)
        res.status(500).json({ message: "Internal Server Error" });

    }
}
export const logout = (req, res) => {
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"logged out succeffluly"})
    } catch (error) {
        console.log("error in logıut controller",error.message)
        res.status(500).json({ message: "Internal Server Error" });
 
    }
}
export const updateProfile= async (req,res)=>{
    try {
        const {profilePic}=req.body
        const userId=req.user._id
        if(!profilePic){
            return res.status(400).json({ message: "Profile picture is required" });
        }
        const uploadResponse=await cloudinary.uploader.upload(profilePic)
        const updateUser=await User.findByIdAndUpdate(userId
            ,{profilePic:uploadResponse.secure_url},{new:true})
        res.status(200).json({updateUser})
    } catch (error) {
        console.log("error in updateProfile controller",error.message)
        res.status(500).json({ message: "Internal Server Error" });
    }
}
export const checkAuth= (req,res)=>{
try {
    res.status(200).json({user:req.user})
} catch (error) {
    console.log("error in checkAuth controller",error.message)
    res.status(500).json({ message: "Internal Server Error" });
}
}