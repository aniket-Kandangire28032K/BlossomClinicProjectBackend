import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv/config'
import mongoose from 'mongoose'

import userRouters from './routes/user.routes.js'
import patientRouter from './routes/patient.routes.js'
import prescription from './routes/prescription.routes.js'
import Medicine from './routes/medicine.route.js'
import Mr from './routes/mr.route.js'
const app = express();
app.use(express.json());
app.use(cors());

// .env imports
const PORT=process.env.PORT
const DBURL=process.env.DB_URL

// routes
app.use('/api',userRouters)
app.use('/api',patientRouter)
app.use('/api',prescription)
app.use('/api',Medicine)
app.use('/api',Mr)

// DB Connection
const ConnectDB = async () => {
  try {
   await mongoose.connect(DBURL);
   console.log('DB connected ')
  } catch (error) {
    console.log(error)
  }
}
ConnectDB();

// server code
app.listen(PORT,()=>{
  console.log('Server is Running on Port:',PORT)
})