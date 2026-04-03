import medicineModel from "../models/medicine.model.js";
import DailyStock from "../models/dailyStocks.model.js" 
import mrModel from "../models/mr.model.js";

// ✅ Get all medicines
export const getAllMedicine = async (req, res) => {
  try {
    const medicines = await medicineModel.find().sort({ companyname: 1 });
    return res.status(200).json(medicines);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Add single medicine
export const postMedicine = async (req, res) => {
  try {
    const med = await medicineModel.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Medicine Added",
      med,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Bulk add (MR form)
export const postBulkMedicine = async (req, res) => {
  try {
    const meds = await medicineModel.insertMany(req.body);

    return res.status(201).json({
      success: true,
      message: "Bulk Medicines Added",
      meds,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get single medicine
export const getMedicine = async (req, res) => {
  try {
    const { med } = req.query;

    const medicine = await medicineModel.findOne({
      medicinename: med,
    });

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
      message: error.message,
    });
  }
};

// 🔥 MAIN STOCK ENGINE (SALE / RETURN / PURCHASE / ADJUST)
export const updatemed = async (req, res) => {
  try {
    const { medicinename, stock, unitprice, companyname } = req.body;

    if (!medicinename || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "Medicine name and stock required",
      });
    }

    // ✅ 1. Update medicine stock
    const updatedMedicine = await medicineModel.findOneAndUpdate(
      { medicinename },
      {
        $inc: { stock: stock },
        $set: {
          unitprice: unitprice,
          stockin: stock > 0 ? stock : 0,
          stockout: stock < 0 ? Math.abs(stock) : 0,
        },
      },
      { new: true }
    );

    if (!updatedMedicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    // ✅ 2. Find LAST MR entry for this company
    const lastMR = await mrModel.findOne({ companyname })
      .sort({ createdAt: -1 });

    if (lastMR) {
      let totalChange = stock * (unitprice || 0);

      // 👉 If stock added → increase MR total
      if (stock > 0) {
        lastMR.totalamount += totalChange;
        lastMR.dueamount += totalChange;
      }

      // 👉 If stock returned → decrease MR total
      if (stock < 0) {
        lastMR.totalamount -= Math.abs(totalChange);
        lastMR.dueamount -= Math.abs(totalChange);
      }

      await lastMR.save();
    }

    return res.status(200).json({
      success: true,
      message: "Stock + MR updated successfully",
      medicine: updatedMedicine,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// 🔥 Used in Dashboard (SALE)
export const updateMedicineStock = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({
        success: false,
        message: "Products array required",
      });
    }

    for (const item of products) {
      const qty = Number(item.qty);

      if (!item.name || isNaN(qty)) continue;

      await updatemed({
        body: {
          medicinename: item.name,
          stock: qty,
          unitprice: 0,
          type: "SALE",
        },
      }, { status: () => ({ json: () => {} }) });
    }

    res.status(200).json({
      success: true,
      message: "Medicine stock updated (SALE)",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};