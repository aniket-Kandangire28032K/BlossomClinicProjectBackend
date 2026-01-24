import mongoose from "mongoose";

const mrSchema = new mongoose.Schema({
  companyname: {
    type: String,
    trim: true,
    lowercase: true,
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
  productlist: {
    type: String,
    trim: true,
    lowercase: true,
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
  }
});

const mrModel= new mongoose.model('mrmodel',mrSchema,'MRList');
export default mrModel;
