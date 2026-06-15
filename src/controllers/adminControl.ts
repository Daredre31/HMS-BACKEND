import {Request , Response} from 'express'
import Bed from '../models/Bed'
import { sendRes } from '../utils/response'
import studentid from '../models/studentId'
import {id} from '../utils/ID'
import Room from '../models/room'



class admincontrol {
  createstudent = async(req:Request , res:Response ) => {
   try {
     const {name , email , bedId , paymentStatus , currentSession , expiryDate } = req.body
     const tokenId = id()

     if(!name || !email || !bedId || !paymentStatus || !currentSession || !expiryDate){
      return  sendRes(res , 400 ,  false , "bad request")
     }

      const bedCheck = await Bed.findById(bedId)

      if(!bedCheck){
        return sendRes(res , 400 , false , "bed alaredy exist")
      };

      if(bedCheck.isOccupied){
        return sendRes(res , 400 , false , "bed not available , already ocuppied")
      };

      const checkEmail = await studentid.findOne({email}) 

      if(checkEmail){
        return sendRes(res , 400 , false , "email already exist")
      }

       const studentProfile = await studentid.create({
        tokenId:tokenId ,name , email , bed:bedId   , paymentStatus:'pending',
        currentSession , expiryDate
  })

  if(!studentProfile){
   return sendRes(res ,400 , false , "error while creating student profile")
  }

    bedCheck.isOccupied = true
    await bedCheck.save()


    const room = await Room.findById(bedCheck.room)
    const countBed = await Bed.countDocuments({
      room:bedCheck.room, isOccupied:true
    })

      if(room) {
        if(countBed >= room.roomCapacity){
          room.roomStatus = "fullyOccupied"
        } else if (countBed > 0) {
          room.roomStatus = "partiallyOccupied"
        }

        else{
          room.roomStatus = "available"
        }
      }
  sendRes(res , 201 , true , "student profile created successfully" ,
    studentProfile
  )
   } catch (error:any) {
      res.status(500).json({
        message:error.message
      })
   }

  }
   getallStudent = async(req:Request , res:Response) => {
     try {
         const getall = await studentid.find().populate(
          {
            path:"bed",
            populate:{
              path:"room"
            }

          }

         )
         if(!getall){
          return sendRes(res , 400 , false , "could not feetch all students")
         }

         sendRes(res , 200 , true , "all student fetch successfully" , getall)
     } catch (error:any) {
      res.status(500).json({
        error:error.message,
        stack:error.stack
      })
     }
   }

   deletestudentById = async(req:Request , res:Response) => {
    const {id} = req.params

    try {
      const delstudent = await studentid.findByIdAndDelete(id) 
      if(!delstudent) {
        return sendRes(res , 400 , false , "error cannnot delete student")

      }

      sendRes(res, 200 , true , "student deleted successfuly")
    } catch (error:any) {
      res.status(500).json({
        error:error.message
      })
    }
   }

   updateStudentByid = async (req:Request , res:Response) => {
      const {id} = req.params
      const update = req.body

      if(!id) {
        return sendRes(res , 400 , false , "could not find id")
      }

      try {
        const updateStudent = await studentid.findByIdAndUpdate(id, update , {new:true})

          if(!updateStudent){
            return sendRes(res , 400 , false , "could not update student")
          }

          sendRes(res , 200 , true , "student updated succeessfully" , updateStudent)
      } catch (error:any) {
         res.status(500).json({
           error:error.message
         })
      }
   }
}

  

export default new admincontrol()