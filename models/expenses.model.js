import mongoose from "mongoose";

// Staff sub-schema
const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    salary: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

// Other Expenses sub-schema
const otherExpenseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

// Main Expense schema
const expenseSchema = new mongoose.Schema(
  {
    date:{ 
      type: String,
      default: () => {
        const today = new Date();
        return today.toLocaleDateString("en-GB"); // DD/MM/YYYY
      }
    },
    rent: { type: Number, required: true, min: 0 },
    electricity: { type: Number, required: true, min: 0 },
    staff: { type: [staffSchema], default: [] },
    otherExpenses: { type: [otherExpenseSchema], default: [] },
    total: { type: Number, default: 0 }, // stored as-is
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema,"Expenses");
