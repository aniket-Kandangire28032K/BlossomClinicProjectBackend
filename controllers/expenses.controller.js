import Expenses from "../models/expenses.model.js";

export const createExpense = async (req, res) => {
  try {
    const expense = await Expenses.create(req.body);
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Example: fetch one expense
export const getExpense = async (req, res) => {
  try {
    const expense = await Expenses.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Not found" });
    res.json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expenses.find();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};