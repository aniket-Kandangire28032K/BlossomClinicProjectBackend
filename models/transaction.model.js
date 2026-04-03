import mongoose from "mongoose";
const transactionSchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  type: {
    type: String,
    enum: ["purchase", "sale"],
    required: true
  },
  qty: Number,
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Transaction", transactionSchema);