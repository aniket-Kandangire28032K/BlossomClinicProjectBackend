import mongoose from "mongoose";

const productSchema= new mongoose.Schema({
  medicinename:String,
  qty:Number,
  unitprice:Number,
  totalprice:Number
},{_id:false})
const hisotrySchema = new mongoose.Schema({
  paymentDate:String,
  paymentAmount:Number
},{
  _id:false
})
const mrSchema = new mongoose.Schema({
  companyname: {
    type: String,
    trim: true,
    required:true
  },
  mrname: {
    type: String,
    trim: true,
    lowercase: true,
    required:true
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
    required:true
  },
  dueamount: {
    type: Number,

  },
  totalamount: {
    type: Number,
    required:true
  },
  date:{
    type:String,
    trim:true
  },
  nextpaydate:{
    type:String,
    trim:true
  },paymentMethod:{
      type:String,
    trim:true,
    required:true
  },
  lastpaymentdate:{
    type:String,trim:true
  },
  lastpayment:{
    type:Number
  },
  paymentHistory:{
    type:[hisotrySchema],
    default:[]
  }
},{
  createdAt:true
});

const mrModel= new mongoose.model('mrmodel',mrSchema,'MRList');
export default mrModel;
