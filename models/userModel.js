import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  password:{
    type:String,
    required:true,
    trim:true
  },
  email:{
    type:String,
    trim:true
  },
  contact:{
    type:String,
    trim:true,
  },
  role:{
    type:String,
    trim:true,
    required:true,
    lowercase:true
  }
  
});

export const User = mongoose.model('User',userSchema,'users');
