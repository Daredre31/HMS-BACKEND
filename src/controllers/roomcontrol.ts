import room from '../models/room';
import {Request , Response} from 'express'
import { sendRes } from '../utils/response';


class roomClassObject {
   createRoom = async (req:Request , res:Response) => {
  const {roomNumber , roomCapacity , roomStatus} = req.body
  try {
    const checkroom = await room.findOne({roomNumber});
     if(checkroom) {
        return res.status(404).json({
            message:"room not found"
        })
     }

     const createNewRoom = await room.create({
        roomNumber , roomCapacity , roomStatus:"available"
     })

     if(!createNewRoom) {
        return res.status(400).json({
            message:"error while creating room"
        })
     }

     res.status(201).json({
        message:"room created successfully",
        data:createNewRoom,
        roomid:createNewRoom._id
     })
  } catch (error:any) {
    res.status(500).json({
        message:error.message
    })
  }
}

getallroom = async(req:Request , res:Response) => {
     try {
      const getrooms = await room.find()

        if(!getrooms){
         sendRes(res , 400 , true , "couldnot fetch all room")
        }

        sendRes(res , 200 , true , "all room fetch succesfully" , getrooms)
     } catch (error:any) {
        res.status(500).json({
         message:error.message
        })
     }
}
}
 

export default new roomClassObject()