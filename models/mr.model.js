import mongoose from "mongoose";

const productSchema= new mongoose.Schema({
  medicinename:String,
  stock:Number,
  unitprice:Number,
  totalprice:Number
},{_id:false})

const mrSchema = new mongoose.Schema({
  companyname: {
    type: String,
    trim: true,
  },
  mrname: {
    type: String,
    trim: true,
    lowercase: true,
  },
  contact: { type: String, trim: true, lowercase: true },
  email: {
    type: String,
    trim: true,
  },
  invoiceno: {
    type: String,
    trim: true,
  },
  productlist:{
    type:[productSchema],
    default:[]
  },
  paidamount: {
    type: Number,
  },
  dueamount: {
    type: Number,
  },
  totalamount: {
    type: Number,
  },
  date:{
    type:String,
    trim:true
  },
  nextpaydate:{
    type:String,
    trim:true
  }
});

const mrModel= new mongoose.model('mrmodel',mrSchema,'MRList');
export default mrModel;
