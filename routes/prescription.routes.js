import e from "express";
import { getPrescriptions, addPrescription,getAPrescription } from "../controllers/prescription.controller.js";

const router = e.Router();

router.get("/prescription", getPrescriptions);
router.get("/getprescription", getAPrescription);
router.post("/prescription", addPrescription);

export default router;

