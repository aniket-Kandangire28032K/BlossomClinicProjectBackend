import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
    fullname:{
        type:String,
        lowercase:true,
        trim:true,
        required:true
    },
    dob:String,
    gender:{
        type:String,
        lowercase:true,
        trim:true,
        required:true
    },
    contact:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        trim:true
    },
    address:{
        type:String,
        lowercase:true,
        trim:true,
        required:true
    }
})

const staffmodel = new mongoose.model("staff",staffSchema,"staffDB");

export default staffmodel