import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
    companyName:{
        type:String,
        trim:true,
        required:true
    },
    productname:{
        type:String,
        trim:true,
        required:true
    },
    Openingstock:{
        type:Number
    },
    closingstock:{
        type:Number
    }
},{_id:false})
const stockSchema = new mongoose.Schema({
    date:{
        type:String,
        required:true
    },
    products:{
        type:[productsSchema],
        default:[]
    }
});

const stockModel = new mongoose.model("stockModel",stockSchema,"stockDB");

export default stockModel;