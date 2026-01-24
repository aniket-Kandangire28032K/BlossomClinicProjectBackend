import mongoose from "mongoose";

const medicineSchema= new mongoose.Schema({
    medicinename:{
        type:String,
        trim:true
    },
    mrname:{
        type:String,
        trim:true
    },
    batchno:{
        type:String,
        trim:true
    },
    expiredate:{
        type:String,
    },
    stock:Number,
    unitprice:Number,
    totalprice:Number
})

const medicineModel = new mongoose.model('medicineModel',medicineSchema,'inventory');
export default medicineModel