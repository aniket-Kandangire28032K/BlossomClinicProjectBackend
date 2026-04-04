import Prescription from "../models/prescriptions.model.js";
import DailyStock from "../models/dailyStocks.model.js";
import medicineModel from "../models/medicine.model.js";
export const addPrescription = async (req, res) => {
  try {
    const newPrescription = new Prescription(req.body);
    

    const Products = req.body.products;
    const today = new Date()
      .toISOString()
      .split("T")[0]
      .split("-")
      .reverse()
      .join("/");

    let dailyStock = await DailyStock.findOne({ date: today });

    // 🆕 create if not exists
    if (!dailyStock) {
      dailyStock = new DailyStock({
        date: today,
        products: []
      });
    }

    // 🔥 MAIN LOGIC
    for (const item of Products) {
      const medicine = await medicineModel.findOne({medicinename: item.name});

      if (!medicine) {
        return res.status(400).json({
          success: false,
          message: `${item.name} not found in Medicine DB`
        });
      }

      // ❌ prevent overselling
      if (medicine.stock < item.qty) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${item.name}`
        });
      }

      const openingStock = medicine.stock;

      // 🔽 reduce real stock
      medicine.stock -= item.qty;
      await medicine.save();

      // 🔍 check in daily stock
      let product = dailyStock.products.find(
        (p) =>
          p.productname.toLowerCase() === item.name.toLowerCase()
      );

      if (product) {
        // update existing
        product.sold += item.qty;
        product.closingstock -= item.qty;

      } else {
        // add new product
        dailyStock.products.push({
          productname: item.name,
          companyName: medicine.companyname || "",
          openingstock: openingStock,
          closingstock: openingStock - item.qty,
          sold: item.qty
        });
      }
    }

    await dailyStock.save();
    await newPrescription.save();

    res.status(201).json({
      success: true,
      message: "Prescription saved & stock updated",
      data: newPrescription
    });

  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

export const getPrescriptions = async (req, res) => {
  // Get Request
  try {
    const prescriptions = await Prescription.find().sort({date:-1});
    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

export const getAPrescription = async (req,res) => {
  try {
    const {patientname} = req.query;
    const PrescriptionData = await Prescription.find({ 
      $or:[
                {patientname:new RegExp(patientname,"i")},
                {opdno:patientname }
            ]
    }).sort({createdAt: -1});

   if (!PrescriptionData){
            return res.status(404).json({
                success:false,
                message:'Prescription not found'
            })
        }
        return res.status(200).json({
            success:true,
            details:PrescriptionData
          })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Internal Server Error'+ error
        })
    }
}

export const UpdatePrescription= async (req,res) => {
  try {
    const {id} = req.params;
    const {nextAppointmentDate} = req.body;
    const prescription = await Prescription.findByIdAndUpdate(
      id,
      {$set:{ nextAppointmentDate:nextAppointmentDate}},
      {new:false}
    )

    if (!prescription){
      return res.status(404).json({
        message:"Patient Not Found",
        success:false
      })
    }
    return res.status(200).json({
      message:`Appointment Rescheduled to ${nextAppointmentDate}`,
      success:true
    })
  } catch (error) {
      res.status(500).json({
        message:"Internal Server Error",
        success:false
      })
  }
}