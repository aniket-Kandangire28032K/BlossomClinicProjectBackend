import { User } from "../models/userModel.js";
import  jwt  from "jsonwebtoken";
// login route
export const login=async (req,res) => {
    const {name,password} = req.body;
    const user= await User.findOne({name});
    if(!user) return res.json({success:false,message:'User not found or Wrong User'});

    if(password!=user.password) return res.json({success:false,message:'Wrong Password'});

    const token=jwt.sign({
        id:user._id,role:user.role
    },process.env.SECRATE_KEY)
    res.json({success:true,token,role:user.role,message:'Login Successfull'})
}

// Get all Users
export const getAllUsers =async(req,res)=>{
    try {
        const users= await User.find();
        return res.status(200).json({
            success:true,
            users
        })
    } catch (error) {
        console.log(error)
        return res.status(404).json({
            success:false,
            message:'internal server error'
        })       
    }
}

//  Create a user 
export const createUser=async (req,res) => {
    try {
        const {name,password,role,...rest}=req.body;
        // valid required fields
        if(!name || !password || !role){
            return res.status(400).json({
                success:false,
                message:'Enter All field'
            });
        }
        // create user 
        const newUser= await User.create({name,password,role,...rest})

        return res.status(201).json({
            success:true,
            message:'User Created Successfully',
            user:newUser
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:'Internal Server error'
        });
        
    }
}
// delete a User

export const deleteUser=async (req,res) => {
    try {
        const {email}=req.params;
        const deletedUser=await User.findOneAndDelete({email});

        if(!deletedUser){
            return res.status(404).json({
                success:false,
                message:'user Not found'
            })
        }

        return res.status(200).json({
            success:true,
            message:'User Deleted'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'internal server error'
        });
    }
};

export const patchUser = async (req,res) => {
    try {
        
  
    const {email, newpassword } = req.body;
    if(!email || !newpassword){
        return res.status(400).json({
            message:"Email and New password are required"
        })
    }
    const user = await User.findOne({email});
    if(!user){
        return res.status(404).json({
            message:"User not found"
        })
    }
    user.password = newpassword;
    await user.save();
    return res.status(200).json({
        message:"Password Updated Successfully"
    });
      } catch (error) {
     return res.status(500).json({
        message:"Internal Server error"
     })   
    }
};