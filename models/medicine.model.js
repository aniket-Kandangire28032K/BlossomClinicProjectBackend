import mongoose from "mongoose";

const medicineSchema= new mongoose.Schema({
    companyname:{
        type:String,trim:true
    },
    medicinename:{
        type:String,
        trim:true,
        require:true
    },
    mrname:{
        type:String,
        trim:true,
        require:true
    },
    batchno:{
        type:String,
        trim:true
    },
    expiredate:{
        type:String,
    },
    stock:{
        type:Number,require:true
    },
    unitprice:{
        type:Number,require:true
    },
    totalprice:{
        type:Number,require:true
    },
    stockindate:{
        type:String
    },
    stockoutdate:{
        type:String
    },
    stockin:Number,
    stockout:Number
})

const medicineModel = new mongoose.model('medicineModel',medicineSchema,'inventory');
export default medicineModel