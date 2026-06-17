
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
    return sendRes(res , 400, false , "the bed capacity of this room  has been reached")
  }

    const checkBedAvail = await Bed.findOne({bedNumber})
   if(checkBedAvail){
       return sendRes(res , 400 , false , "bed is not available")
   }
  
    const createNewBed = await Bed.create({
       bedNumber , room
    })

    
    if(!createNewBed) {
      return sendRes(res , 400 , false , "error while creating the bed")
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
    if(getBeds.length === 0){
      sendRes(res , 400 , false , "could not fetch all bed data")
    }

    sendRes(res , 200 , true , "all bed data found" , getBeds)
   } catch (error:any) {
    res.status(500).json({
      message:error.message
    })
   }
};

  deleteBedbyId = async(req:Request , res:Response) => {
    const {id} = req.params

    try {
      const deletebed = await Bed.findByIdAndDelete(id)

      if(!deletebed){
       return sendRes(res , 400 , false , "cant delete bed ") 
      }

      if(deletebed.isOccupied) {
        return sendRes(res, 400 , false , 'cant delete ocupied bed')
      }

      sendRes(res , 200 , true , "bed deleted successfully")
    } catch (error) {
      return sendRes(res, 500 , false , "internal server error")
    }
  }
}


export default new Bedobject()

       