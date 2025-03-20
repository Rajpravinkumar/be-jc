import catchAsyncError from '../middleware/catchAsyncError.js';
import { User } from '../models/userSchema.js';
import { sendToken } from '../utils/jwtToken.js';

export const register = catchAsyncError(async (req, res, next) => {
    const { name, email, password,role } = req.body;

    // Check if all required fields are present
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Please provide name, email, and password." });
    }

    // Check for duplicate email
    const isEmail = await User.findOne({ email });
    if (isEmail) {
        return res.status(409).json({ error: "Email is already registered." });
    }

    // Create a new user
    const user = await User.create({ name, email, password,role }); 

    sendToken(user,201,res,"User Register Successfully   #JWT")
    
});

export const login=catchAsyncError(async(req,res,next)=>{
    const {email,password,role}=req.body;

    if(!email||!password || !role)
        return res.status(400).json({message:"Login Error"})
    
    const user=await User.findOne({email}).select("+password")
    if(!user)
    {
        return next(res.status(400).json({message:"user not find Error"}))
    }
    const isMatch=await user.comparePassword(password)
    if(!isMatch)
        {
            return next(res.status(400).json({message:"user not find Error"}))
        }

        if(user.role!==role)
        {
            return next(res.status(400).json({message:"user Role not find Error"}))
        }

    sendToken(user,201,res,"Login Successfull")
})

export const logout=catchAsyncError(async(req,res,next)=>{
res.status(201).cookie("token","",{
    httpOnly:true,
    expiresIn:Date(Date.now()- 1000),
}).json({
    success:true,
    message:"User LogOut Done"
})
})


export const getuser=catchAsyncError((req,res,next)=>{
    const user=req.user;
    res.status(200).json({
        success: true,
        message: "Get user Successfully ",
        user,
    });
})