import medicineModel from "../models/medicine.model.js";

//  get all medicine
export const getAllMedicine = async (req, res) => {
  try {
    const medicines = await medicineModel.find();
    return res.status(200).json(medicines);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error in server${error}`,
    });
  }
};

// post medicine
export const postMedicine = async (req, res) => {
  try {
    const newMedicine = await medicineModel.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Medicine Added",
      med: newMedicine,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error in server${error}`,
    });
  }
};

export const postBulkMedicine = async (req,res) => {
  try {
    const newMedicine = await medicineModel.insertMany(req.body)
    return res.status(201).json({
      success:true,
      message:"Medicine Added",
      newMedicine
    })

  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"Internal Server Error"
    })
  }
}
//  get single Medicine
export const getMedicine = async (req, res) => {
  try {
    const { med } = req.query;
    const medicine = await medicineModel.findOne({medicinename: med});
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }
    return res.status(200).json(medicine);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error" + error,
    });
  }
};

// put med in DB
export const updatemed=async (req,res) => {
    try {
        const {medicinename,stock}=req.body;
        if (!medicinename || stock ===undefined){
            return res.status(400).json({
                success:false,
                message:'Both medicine Name and stock are required'
            });
        }
        const updatedMedicine =await medicineModel.findOneAndUpdate(
            {medicinename:medicinename},
            {$set:{stock}},
            {new:true},
            {stockin:stock},
            
        )
         if (!updatedMedicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }
     return res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      medicine: updatedMedicine,
    });
    } catch (error) {
         return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
    }
}

export const updateMedicineStock = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({
        success: false,
        message: 'Products array is required'
      });
    }

    for (const item of products) {
      const qty = Number(item.qty);

      if (!item.name || isNaN(qty)) continue;

      // 1️⃣ Check current stock
      const medicine = await medicineModel.findOne({
        medicinename: item.name
      });

      if (!medicine) {
        return res.status(404).json({
          success: false,
          message: `Medicine not found: ${item.name}`
        });
      }

      // 2️⃣ Prevent negative stock
      if (medicine.stock < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.name}`
        });
      }

      // 3️⃣ Subtract stock
      await medicineModel.findOneAndUpdate(
        { medicinename: item.name },
        { $inc: { stock: -qty } },
        {$inc:{stockout: +qty}}
      );
    }

    res.status(200).json({
      success: true,
      message: 'Medicine stock updated successfully'
    });

  } catch (error) {
    console.error('Stock update error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};