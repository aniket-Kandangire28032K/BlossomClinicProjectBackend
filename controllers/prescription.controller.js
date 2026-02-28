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
    const prescriptions = await Prescription.find().sort({date:-1});
    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

export const getAPrescription = async (req,res) => {
  try {
    const {patientname} = req.query;
    const PrescriptionData = await Prescription.findOne({ 
      $or:[
                {patientname:new RegExp(patientname,"i")},
                {opdno:patientname }
            ]
    }).sort({date:-1});

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