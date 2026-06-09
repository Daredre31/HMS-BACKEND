import users from '../models/user'
import {Request , Response} from 'express'
import bcrypt from 'bcrypt'
import  Jwt  from 'jsonwebtoken'
import studentId from '../models/studentId'
import { sendRes } from '../utils/response'


class Authcontrol {

    // STUDENT LOGIN WITH THE TOKEN

studentLogin = async (req:Request , res:Response) => {
    const {tokenId} = req.body

    if(!tokenId) {
        return res.status(400).json({
            message:"no token provided"
        })
    }

    try {
        const loginStudent = await studentId.findOne({tokenId}).populate(
            {
                path:"bed",
                populate:{
                    path:"room"
                }
            }
        )

        if(!loginStudent){
            return res.status(404).json({
                message:"tokenId  not found"
            })
        }
   

        if(loginStudent.expiryDate < new Date()) {
            return res.status(400).json({
                message:"tokenId has expire"
            })
        }


        loginStudent.isTaken=true
        await loginStudent.save()

        const secret = process.env.JWT_SECRET as string

        const token = Jwt.sign({id:loginStudent._id , tokenId:loginStudent.tokenId} , secret , {expiresIn:"7d"})

        res.status(200).json({
            message:"login successfully",
            loginStudent,
            token:token
        })

    } catch (error:any) {
        res.status(500).json({
            message:"server error try again"
        })
    }
}

// CREATION OF ADMIN/ ADMIN SIGNUP

  AdminSignup = async(req:Request , res:Response)=> {
      
      try {
        const {name , email , password} = req.body
      
      if(!name || !email || !password) {
        return sendRes(res , 400 , false , "all field are required")
      }

      const hash = await bcrypt.hash(password , 10)

      if(!hash) {
         return sendRes(res, 400 , false , "hashing of password failed")
      };


        const adminCreate = await users.create({
            name , email , password:hash , role:'admin'
        })

        if(!adminCreate){
            return sendRes(res , 400 , false , "couldnot create admin")
        }

        res.status(201).json({
            success:true, message:"admin created successfully",
            name:adminCreate.name,
            email:adminCreate.email,
            role:adminCreate.role
        })
      } catch (error:any) {
        res.status(500).json({
            message:error.message
        })
      }

  }

  // ADMIN LOGIN WITH ROLE ATTACHED

  adminLogin = async(req:Request , res:Response)=> {
    const {email , password} = req.body

    if(!email || !password){
        return sendRes(res , 400 , false , "all fileds are required")
    }

    try {
        const checkEmail = await users.findOne({
            email
        })

        if(!checkEmail){
            return sendRes(res , 400 , false , "email not found")
        }

        const checkPassword =  bcrypt.compare(password , checkEmail.password)

        if(!checkPassword){
            return sendRes(res , 400 , false , "password not march")
        }

        const secret = process.env.JWT_SECRET as string

        const token = Jwt.sign({id:checkEmail._id , role:checkEmail.role} , secret , {expiresIn:"7d"})

        res.status(200).json({
            success:true , 
            message:"login successfuly",
            data:checkEmail,
            token:token,
        })

    } catch (error:any) {
        res.status(500).json({
            message:error.message
        })
    }
  }

}

export default new Authcontrol()

