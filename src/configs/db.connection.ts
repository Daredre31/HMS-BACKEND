import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()

 export const dbconnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
       console.log('db connected successfully')
    } catch (error) {
        console.log(error)
    }
}