import Prescription from "../models/prescriptions.model.js";


export const addPrescription = async (req, res) => {
  // Post Request
  try {
    const newPrescription = new Prescription(req.body);
    await newPrescription.save();

    res.status(201).json({
      success: true,
      message: "Prescription saved",
      data: newPrescription
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

export const getPrescriptions = async (req, res) => {
  // Get Request
  try {
    const prescriptions = await Prescription.find().sort({ createdAt: 1 });
    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

export const getAPrescription = async (req,res) => {
  try {
    const {patientname} = req.query;
    const PrescriptionData = await Prescription.findOne({patientname})

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
