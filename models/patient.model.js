import mongoose from "mongoose";

const patientSchema= new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        lowercase:true
    },
    opdno:{
        type:String,
        // unique:true,
    },
    history:{
        type:String,
        trim:true,
        lowercase:true
    },
    reference:{
        type:String,
        trim:true,
        lowercase:true
    },
    gender:{
        type:String,
        trim:true,
        lowercase:true
    },
    DOB:{
        type:String,
        trim:true
    },
    date:{
        type:String,
        trim:true
    },
    age:{
        type:Number
    },
    bloodgroup:{
        type:String,
        trim:true,
    },
    materialstatus:{
        type:String,
        trim:true,
        lowercase:true
    },
    contact:{
        type:Number
    },
    email:{
        type:String,
        trim:true,
    },
    address:{
        type:String,
        trim:true
    }
});

export const Patient=mongoose.model('Patient',patientSchema,'PatientDB');