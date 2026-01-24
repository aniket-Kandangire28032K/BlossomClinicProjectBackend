import e from "express";
import { getAllMr,getOneMr,postMr,getMrByName,updateMr } from "../controllers/mr.controller.js";

const router=e.Router();

router.get('/mrlist',getAllMr);
router.post('/mr-payment',getMrByName);
router.patch('/mr-payment',updateMr);
router.get('/mr',getOneMr);
router.post('/mr',postMr)

export default router;