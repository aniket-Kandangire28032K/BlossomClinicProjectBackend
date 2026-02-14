import {getAllMedicine,getMedicine,postMedicine,updatemed,updateMedicineStock,postBulkMedicine  }from'../controllers/medicine.controller.js'
import e from 'express'
const router=e.Router();

router.get('/medicine',getAllMedicine);
router.post('/medicine',postMedicine);
router.post('/medicine-bulk',postBulkMedicine);
router.get('/medicine/search',getMedicine);
router.put('/medicine/stock',updatemed);
router.put('/medicine/stock-update',updateMedicineStock);


export default router;
