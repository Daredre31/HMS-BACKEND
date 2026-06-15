
import Bed from "../models/Bed"
import { Request , Response } from "express";
import { sendRes } from "../utils/response";
import Room from "../models/room";



class Bedobject {
   createBed = async (req:Request , res:Response) => {
  const {bedNumber , room } =  req.body

  try {

     const roomExist = await Room.findById(room);

     if(!roomExist){
      return sendRes(res, 400 , false , "room does not exist")
     }

  const countBedInThisroom = await Bed.countDocuments({
    room:room
  })

  if(countBedInThisroom >= roomExist.roomCapacity) {
    return sendRes(res , 400, false , "room fully occupied no more bed can be created ")
  }

    const checkBedAvail = await Bed.findOne({bedNumber})
   if(checkBedAvail){
        sendRes(res , 400 , false , "bed is not available")
   }
  
    const createNewBed = await Bed.create({
       bedNumber , room
    })

    if(countBedInThisroom === roomExist.roomCapacity){
        roomExist.roomStatus ="fullyOccupied"
        await roomExist.save()
    }
    

    if(!createNewBed) {
       sendRes(res , 400 , false , "error while creating the bed")
    }

    sendRes(res , 201 , true , "bed created successfully", createNewBed)
  } catch (error:any) {
    res.status(500).json({
        message:error.message
    })
  }
};

getallBeds = async(req:Request , res:Response) => {
   try {
    const getBeds = await Bed.find().populate('room')
    if(!getBeds){
      sendRes(res , 400 , false , "could not fetch all bed data")
    }

    sendRes(res , 200 , true , "all bed data found" , getBeds)
   } catch (error:any) {
    res.status(500).json({
      message:error.message
    })
   }
};

  getBedsByRoom = async(req:Request , res:Response) => {
    try {
      const findByBedByRoom = await Bed.find()
    } catch (error) {
      
    }
  }
}


export default new Bedobject()

       