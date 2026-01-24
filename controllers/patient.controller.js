import { Patient } from "../models/patient.model.js";

// Get all Patient
export const getAllPatients = async (req,res) => {
    try {
        const Patients =await Patient.find();
        return res.status(200).json({
            success:true,
            Patients
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            messafe:'internal server error'
        })
    }
}

export const getAllPatientsToday = async (req,res) => {
    try {
        let now = new Date();
        let day= String(now.getDate()).padStart(2,"0");
        let month = String(now.getMonth()+1).padStart(2,"0");
        let year = now.getFullYear();

        const today = `${day}/${month}/${year}`;
        const Patients = await Patient.find({date:today});
         
        res.status(200).json({
            success:true,
            count:Patients.length,
            Patients
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Server error",
            error:error.message
        });
    }
}
// get single Patient
export const getPatient=async (req,res) => {
    try {
        const {name}=req.query;
        const singlePatient=await Patient.findOne({
            $or:[
                {name:new RegExp(name,"i")},
                {opdno:name }
            ]
        });
        if (!singlePatient){
            return res.status(404).json({
                success:false,
                message:'Patient not found'
            })
        } 
        return res.status(200).json({
            success:true,
            card:singlePatient})
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Internal Server Error'+ error
        })
    }
}

//  Add a Patient 
export const addPatient=async (req,res) => {
    try {
        const patientData=req.body;
        // create user 
        const newPatient= await Patient.create(patientData)

        return res.status(201).json({
            success:true,
            message:'Patient Added Successfully',
            patientData:newPatient
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:'Internal server error'
        });
        
    }
}