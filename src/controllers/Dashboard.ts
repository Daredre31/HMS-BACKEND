import { Request , Response} from "express";
import idmodel from "../models/studentId";
import Room from "../models/room";
import Bed from "../models/Bed";
import complain from "../models/complaint.model"
import { sendRes } from "../utils/response";

class DashboardStats{
    countStudent = async(req:Request , res:Response) => {
       try {
        const countStudent = await idmodel.countDocuments()
       if(!countStudent) {
        return sendRes(res , 400 , false , "couldnot count students")
       }

       const countRoom = await Room.countDocuments();
       const countBed = await Bed.countDocuments();
       const isOccupiedBed = await Bed.countDocuments({isOccupied:true});
       const countComplains = await complain.countDocuments()

       sendRes(res , 200 , true , "student counted successfully" , {
        student:countStudent , room:countRoom , bed:countBed , occpiedBed:isOccupiedBed , complain:countComplains
    })
       } catch (error:any) {
        return sendRes(res , 500 , false, "internal server error")
       }
   }
}

export default new DashboardStats();