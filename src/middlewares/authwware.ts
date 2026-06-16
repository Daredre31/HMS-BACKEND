import {Request , Response , NextFunction} from 'express'
import jwt from 'jsonwebtoken'

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

      const verifiedToken =  jwt.verify(bearerSplit , process.env.JWT_SECRET as string );
      
      req.user = verifiedToken

      next()
        
    } catch (error:any) {
       return res.status(401).json({
        message:error.message
       })   
    }
     
}

export default  protects