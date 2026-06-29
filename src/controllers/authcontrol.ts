import users from '../models/user'
import {Request , Response} from 'express'
import bcrypt from 'bcrypt'
import  Jwt, { JwtPayload }  from 'jsonwebtoken'
import studentId from '../models/studentId'  
import { sendRes } from '../utils/response'
import redis from '../configs/redisConnect'
import { nanoid } from 'nanoid'


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

        const sessionId = nanoid();

        const sessionData = {
            userId : loginStudent._id,
            role:loginStudent.role,
            ip : req.ip
        }


        await redis.set(sessionId ,JSON.stringify(sessionData) , 'EX' , 604800)

        const secret = process.env.JWT_SECRET as string
        const refresh=process.env.JWT_REFRESH as string

        const accesstoken = Jwt.sign({id:loginStudent._id , tokenId:loginStudent.tokenId , role:loginStudent.role} , secret , {expiresIn:"15m"})
         const refreshToken = Jwt.sign({sessionId} , refresh , {expiresIn:'7d'})

         res.cookie('refreshToken' , refreshToken , {
            httpOnly:true,
            secure:process.env.NODE_ENV == "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" :"lax",
            maxAge:7*24*60*60*1000
         })

        res.status(200).json({
            message:"login successfully",
            loginStudent,
            token:accesstoken
        })

    } catch (error:any) {
        res.status(500).json({
            message:"server error try again",
            stack:error.stack
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

      const existingAdmin = await users.findOne({email})

      if(existingAdmin) {
        return sendRes(res , 400 , false , "admin already exist")
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
            return sendRes(res , 401 , false , "email not found")
        }

        const checkPassword = await bcrypt.compare(password , checkEmail.password)

        if(!checkPassword){
            return sendRes(res , 401 , false , "password does not  match")
        }

        const sessionId = nanoid();

        const sessionData = {
            userId : checkEmail._id,
            role:checkEmail.role,
            ip : req.ip
        }


        await redis.set(sessionId ,JSON.stringify(sessionData) , 'EX' , 604800)


        const secret = process.env.JWT_SECRET as string
         const refresh=process.env.JWT_REFRESH as string

        const Accesstoken = Jwt.sign({id:checkEmail._id , role:checkEmail.role } , secret , {expiresIn:"15m"})
        const refreshToken = Jwt.sign({sessionId} , refresh , {expiresIn:'7d'})

         res.cookie('refreshToken' , refreshToken , {
            httpOnly:true,
            secure:process.env.NODE_ENV == "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" :"lax",
            maxAge:7*24*60*60*1000
         })
        res.status(200).json({
            success:true , 
            message:"login successfuly",
            token:Accesstoken,
            role:checkEmail.role,
            name:checkEmail.name,
             email:checkEmail.email
        })

    } catch (error:any) {
        return sendRes(res , 500 , false ,"internal server error")
    }
  }

  refreshAcessToken = async(req:Request , res:Response) => {
   const refreshToken = req.cookies.refreshToken

   try {

    const verifyRefresh = Jwt.verify(refreshToken , process.env.JWT_REFRESH as string) as JwtPayload
    const sessionKey = verifyRefresh.sessionId

    const session = await redis.get(sessionKey)

    if(!session) {
        return sendRes(res , 401 ,false , "session expired")
    }

    const sessionData = JSON.parse(session);

    await redis.del(sessionKey);

    const newSessionId = nanoid()

    await redis.set(newSessionId , JSON.stringify(sessionData) ,"EX" , 604800)

    const accessToken = Jwt.sign({id:sessionData.userId , role:sessionData.role} , process.env.JWT_SECRET as string , {expiresIn:'15m'})
    const newRefresh = Jwt.sign({newSessionId} , process.env.JWT_REFRESH as string , {expiresIn:'7d'})

      res.cookie('refreshToken' , newRefresh , {
            httpOnly:true,
            secure:process.env.NODE_ENV == "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" :"lax",
            maxAge:7*24*60*60*1000
         })

         sendRes(res , 200 , true, 'new acces token generated successfuly', accessToken)
   } catch (error) {
    return  sendRes(res , 500 , false , "internal server error")
   }
  } 

  logout = async (req:Request , res:Response) => {
    const refresh = req.cookies.refreshToken

    try {

        if(refresh) {
          const verifyRefresh = Jwt.verify(refresh , process.env.JWT_REFRESH as string) as JwtPayload
         const sessionKey = verifyRefresh.sessionId

         await redis.del(sessionKey)
        }
         res.clearCookie('refreshToken')

         sendRes(res , 200 , true , 'logout successfully')
    } catch (error) {
      return  sendRes(res, 500 , false , 'internal server error')
    }
  }

}

export default new Authcontrol()

