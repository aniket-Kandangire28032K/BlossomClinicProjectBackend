import mrModel from "../models/mr.model.js";
import DailyStock from "../models/dailyStocks.model.js";
import transactionModel from "../models/transaction.model.js";
import medicineModel from "../models/medicine.model.js";
// get all Mr's
export const getAllMr = async (req, res) => {
  try {
    const mr = await mrModel.find();
    return res.status(200).json(mr);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Error in Server for getting mr list" + " ",
    });
  }
};
// get single Mr's
export const getOneMr = async (req, res) => {
  try {
    const { mr } = req.query;
    const singleMr = await mrModel.findOne({ mrname: mr });

    if (!singleMr) {
      return res.status(404).json({
        success: false,
        message: "MR not found",
      });
    }

    return res.status(200).json(singleMr);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error " + error,
    });
  }
};

// Get MR list by Name
export const getMrByName = async (req, res) => {
  try {
    const { mrname, date } = req.body;
    const query = {};
    if (!mrname && !date) {
      return res
        .status(400)
        .json({ success: false, message: "Pleaser Provide Data" });
    }
    if (mrname) {
      query.mrname = mrname;
    }
    if (date) {
      query.date = date;
    }
    const mrList = await mrModel.find(query);

    if (!mrList || mrList.length === 0) {
      return res.status(200).json({
        message: "MR not found",
      });
    }
    return res.status(200).json({ mrList, message: "Found MR" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error ",
      error: error,
    });
  }
};

//  add Mr's to
export const postMr = async (req, res) => {
  try {
    const { productlist, companyname, mrname } = req.body;

    // 1️⃣ Save MR first
    const newMr = await mrModel.create(req.body);

    // 2️⃣ Loop products
    for (const item of productlist) {
      const medName = item.medicinename?.trim();
      if (!medName) {
        throw new Error("Medicine Name is missing");
      }

      let med = await medicineModel.findOne({
        medicinename: medName,
      });
      if (!med) {
        // create new medicine
        med = await medicineModel.create({
          medicinename: medName,
          companyname: companyname,
          mrname: mrname,
          stock: Number(item.qty),
          unitprice: Number(item.unitprice),
          totalprice: Number(item.qty) * Number(item.unitprice),
        });
      } else {
        // update existing stock
        med = await medicineModel.findByIdAndUpdate(
          med._id,
          { $inc: { stock: item.qty } },
          { $set: { totalprice: Number(item.qty) * Number(item.unitprice) } },
          { new: true },
        );
      }

      // 👉 AFTER THIS: add transaction + daily stock (as told before)
    }

    return res.status(201).json({
      success: true,
      message: "MR + stock updated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
// update MR dueamount
export const updateMr = async (req, res) => {
  try {
    const {
      _id,
      paidamount,
      dueamount,
      lastpaymentdate,
      lastpayment,
      nextpaydate,
    } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "ID is required" });
    }
    const MR = await mrModel.findById(_id);
    const updated = await mrModel.findByIdAndUpdate(
      _id,
      {
        $push: {
          paymentHistory: {
            paymentDate: lastpaymentdate,
            paymentAmount: Number(paidamount),
          },
        },
        $set: {
          nextpaydate: nextpaydate,
          lastpaymentdate: lastpaymentdate,
          dueamount: dueamount,
          paidamount: paidamount,
          lastpayment: Number(lastpayment),
        },
      },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "MR not Found" });
    }

    return res.json({
      message: "Payment Updated Successfully",
      updatedData: updated,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const updateDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.body;
    const updates = await mrModel.findByIdAndUpdate(id, {
      $set: { nextpaydate: date },
    });
    return res.status(200).json(updates);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
