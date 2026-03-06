import { closeStock,getStock } from "../controllers/stock.controller.js";
import e from "express";

const route = e.Router();

route.post("/stock",closeStock)
route.get("/stock",getStock)

export default route;