import e from "express";
import { getPrescriptions, addPrescription,getAPrescription,UpdatePrescription } from "../controllers/prescription.controller.js";

const router = e.Router();

router.get("/prescription", getPrescriptions);
router.get("/getprescription", getAPrescription);
router.post("/prescription", addPrescription);
router.patch("/prescription/:id",UpdatePrescription)

export default router;

