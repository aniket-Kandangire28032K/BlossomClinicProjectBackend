import e from "express";
import { getAllPatients,addPatient,getPatient,getAllPatientsToday,updatePatient } from "../controllers/patient.controller.js";

const router=e.Router();

router.get('/patient',getAllPatients);
router.get('/singlepatient',getPatient);
router.get('/patient-count',getAllPatientsToday);
router.post('/patient',addPatient);
router.patch('/patient',updatePatient);

export default router;