import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String , lowercase:true },
  remark:{type:String,lowercase:true},
  price:Number,
  qty:Number
},{_id:false}
);
const treatmentSchema = new mongoose.Schema({
  name: { type: String , lowercase:true },
  price:Number
},{_id:false}
);

const PrescriptionSchema = new mongoose.Schema(
  {
    patientname: { type: String },
    date: { type: String },
    opdno:{type:String},
    nextAppointmentDate: { type: String, default:'No Appointment'},
    
    productCost:{type:Number},
    treatmentCost:{type:Number,default:0},
    totalCost:{type:Number},
    consultFee:{type:Number},

    products:{type: [productSchema],default:[]},
    treatments:{type: [treatmentSchema],default:[]},
    remark:String
  }
);

const Prescription = mongoose.model("Prescription", PrescriptionSchema, "Prescriptions");
export default Prescription;