import {Request , Response} from 'express'
import Bed from '../models/Bed'
import { sendRes } from '../utils/response'
import studentid from '../models/studentId'
import {id} from '../utils/ID'
import Room from '../models/room'
import jwt from 'jsonwebtoken'
import { sendStudentIdEmail } from '../utils/SendEmail'



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
        return sendRes(res , 400 , false , "bed doesnt  exist")
      };

      if(bedCheck.isOccupied){
        return sendRes(res , 400 , false , "bed not available , already ocuppied")
      };

      const checkEmail = await studentid.findOne({email}) 

      if(checkEmail){
        return sendRes(res , 409 , false , "email already exist")
      }

       const studentProfile = await studentid.create({
        tokenId:tokenId ,name , email , bed:bedId   , paymentStatus,
        currentSession , expiryDate
  })

  if(!studentProfile){
   return sendRes(res ,400 , false , "error while creating student profile")
  }

    bedCheck.isOccupied = true
    await bedCheck.save()


    const room = await Room.findById(bedCheck.room)
  
      if(!room) {
        return sendRes(res , 400 , false , "room not found")
      }

      const countBed = await Bed.countDocuments({
      room:bedCheck.room, isOccupied:true
    })

        if(countBed >= room.roomCapacity){
          room.roomStatus = "fullyOccupied"
        } else if (countBed > 0) {
          room.roomStatus = "partiallyOccupied"
        }

        else{
          room.roomStatus = "available"
        }
      

      await room.save()

     await sendStudentIdEmail(name , email , tokenId)

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
      const student = await studentid.findById(id) 

      if(!student) {
        return sendRes(res , 404 , false , "error cannot find student")

      }

      const findStudentBed = await Bed.findById(student.bed) 

      if(findStudentBed) {
        findStudentBed.isOccupied = false

        await findStudentBed.save()

        const findStudentroom = await Room.findById(findStudentBed.room)

        if(findStudentroom) {
          const countBed = await Bed.countDocuments({
            room:findStudentroom._id, isOccupied:true
          })

          if(countBed === 0){
            findStudentroom.roomStatus = "available"
          } else if(countBed < findStudentroom.roomCapacity){
            findStudentroom.roomStatus = "partiallyOccupied"
          }

          await findStudentroom.save()
        }
      }

      await studentid.findByIdAndDelete(id)

      sendRes(res, 200 , true , "student deleted successfuly")
    } catch (error:any) {
      res.status(500).json({
        error:error.message
      })
    }
   }

   updateStudentByid = async (req:Request , res:Response) => {
      const {id} = req.params
      const {
        name, email , currentSession , paymentStatus , role
      } = req.body

      if(!id) {
        return sendRes(res , 400 , false , "could not find id")
      }

      try {
        const updateStudent = await studentid.findByIdAndUpdate(id, {name , email , currentSession , paymentStatus , role} , {new:true})

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

//   assignHohRole = async(req: Request, res: Response) => {
//   const { role } = req.body
//   const { id } = req.params

//   try {
//     const student = await studentid.findByIdAndUpdate(
//       id,
//       { role },
//       { new: true }  
//     )

//     if (!student) {
//       return sendRes(res, 404, false, "student not found")
//     }

//     sendRes(res, 200, true, "role updated successfully", student)
//   } catch (error) {
//     sendRes(res, 500, false, "error updating role")
//   }
// } // this endpoint is nit needed yet i will update it later 

   getStudentById = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const student = await studentid.findById(id).populate({
      path: "bed",
      populate: {
        path: "room"
      }
    })

    if (!student) {
      return sendRes(res, 404, false, "student not found")
    }

    sendRes(res, 200, true, "student fetched successfully", student)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
}

  

export default new admincontrol()