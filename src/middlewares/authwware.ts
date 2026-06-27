import {Request , Response , NextFunction} from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import redis from '../configs/redisConnect'
import { sendRes } from '../utils/response'

export interface Authreqest extends Request {
    user?:any
}


const protects = async (req:Authreqest , res:Response , next:NextFunction) => {

    try {

         const bearerToken =  req.headers.authorization

      if(!bearerToken || !bearerToken.startsWith("Bearer ")) {
        return res.status(401).json({
            success:false,
            message:"invalid token provided"
        })
      }

      const bearerSplit =  bearerToken.split(' ')[1];

      if(!bearerSplit) {
        return res.status(400).json(
            {message:"invalid token"}
        )
      }

      const verifiedToken =  jwt.verify(bearerSplit , process.env.JWT_SECRET as string ) as JwtPayload;

     const session = await redis.get(verifiedToken.sessionId)

     if(!session) {
        return sendRes(res , 401 , false , "session expired")
     }
      
      req.user = verifiedToken

      next()
        
    } catch (error:any) {
       return res.status(401).json({
        message:error.message
       })   
    }
     
}

export default  protects