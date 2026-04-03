import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productname: String,
  companyName: String,
  openingstock: Number,
  closingstock: Number,
  sold: Number,
});

const dailyStockSchema = new mongoose.Schema({
  date: String,
  products: [productSchema],
});

const DailyStock = mongoose.model("DailyStock", dailyStockSchema);

export default DailyStock;