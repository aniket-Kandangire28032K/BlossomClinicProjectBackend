import e from "express";
import { getDailyStocks } from "../controllers/dailysales.controller.js";

const router = e.Router();

router.get('/',getDailyStocks);

export default router