import { createExpense,getExpense,getAllExpenses } from "../controllers/expenses.controller.js";
import e from "express";

const router = e.Router();

router.get("/expenses",getAllExpenses);
router.post("/expenses",createExpense);

export default router;
