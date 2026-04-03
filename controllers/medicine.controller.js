import medicineModel from "../models/medicine.model.js";
import DailyStock from "../models/dailyStocks.model.js" 

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
    const { medicinename, stock, unitprice, type } = req.body;

    if (!medicinename || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "Medicine name & stock required",
      });
    }

    const medicine = await medicineModel.findOne({ medicinename });

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    const today = new Date().toLocaleDateString("en-GB");

    let daily = await DailyStock.findOne({ date: today });

    if (!daily) {
      daily = new DailyStock({
        date: today,
        products: [],
      });
    }

    let existing = daily.products.find(
      (p) => p.productname === medicinename
    );

    const opening = medicine.stock;

    let change = 0;

    // 🔥 STOCK TYPE LOGIC
    switch (type) {
      case "SALE":
        change = -Math.abs(stock);
        break;

      case "RETURN":
        change = Math.abs(stock);
        break;

      case "PURCHASE":
        change = Math.abs(stock);
        break;

      case "ADJUST":
        change = Number(stock);
        break;

      default:
        change = Number(stock);
    }

    const newStock = opening + change;

    // ❌ Prevent negative stock
    if (newStock < 0) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    // ✅ Update main medicine stock
    await medicineModel.findOneAndUpdate(
      { medicinename },
      {
        $inc: { stock: change },
        $set: { unitprice },
      }
    );

    // ✅ Update daily stock
    if (existing) {
      if (type === "SALE") {
        existing.sold += Math.abs(stock);
      }

      if (type === "RETURN") {
        existing.sold -= Math.abs(stock);
      }

      existing.closingstock = newStock;
    } else {
      daily.products.push({
        productname: medicinename,
        companyName: medicine.companyname,
        openingstock: opening,
        sold: type === "SALE" ? Math.abs(stock) : 0,
        closingstock: newStock,
      });
    }

    await daily.save();

    return res.status(200).json({
      success: true,
      message: "Stock updated successfully",
    });
  } catch (error) {
    console.log("Stock Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
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