import medicineModel from "../models/medicine.model.js";
import DailyStock from "../models/dailyStocks.model.js";
import mrModel from "../models/mr.model.js";

const today = new Date()
  .toISOString()
  .split("T")[0].split('-').reverse().join('/')
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
      { new: true },
    );

    if (!updatedMedicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    // ✅ 2. Find LAST MR entry for this company
    const lastMR = await mrModel
      .findOne({ companyname })
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

export const updateSingleMedicineStock = async (req, res) => {
  try {
    const { medicinename, stock, unitprice } = req.body;

    if (!medicinename) {
      return res
        .status(400)
        .json({ success: false, message: "Medicine name is required" });
    }
    const med = await medicineModel.findOne({ medicinename });
    if (!med) {
      return res
        .status(404)
        .json({ success: false, message: "Medicine not found" });
    }
    // 1️⃣ Calculate new stock
    const newStock = med.stock + Number(stock || 0);
    // 2️⃣ Determine new unit price
    const newUnitPrice =
      unitprice !== undefined ? Number(unitprice) : med.unitprice;
    // 3️⃣ Calculate total price using new values
    const newTotalPrice = parseFloat((newStock * newUnitPrice).toFixed(2));

    med.stock = newStock;
    med.unitprice = newUnitPrice;
    med.totalprice = newTotalPrice;

    await med.save();
    const dailyStock = await DailyStock.findOne({
      date: today,
    });
    if(!dailyStock){
      console.log("dailyStock Not found")
    }
    const product = dailyStock.products.find(p => p.productname === med.medicinename);
    if(!product){
      return res.status(404).json({ message: "Product not found in daily stock" });
    }
    product.closingstock = Number(product.closingstock) + Number(stock); 
    
    if (product.closingstock < 0) product.closingstock = 0;
    await dailyStock.save();
    
    return res.status(200).json({
      success: true,
      message: "Medicine updated successfully",
      medicine: newTotalPrice,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
