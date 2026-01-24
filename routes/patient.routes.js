import e from "express";
import { getAllPatients,addPatient,getPatient,getAllPatientsToday } from "../controllers/patient.controller.js";

const router=e.Router();

router.get('/patient',getAllPatients);
router.get('/singlepatient',getPatient);
router.get('/patient-count',getAllPatientsToday);
router.post('/patient',addPatient);

export default router