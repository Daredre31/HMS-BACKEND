import {Request , Response , NextFunction} from 'express'

export interface authres extends Request{
    user?:any
}

const roleauth = ( ...role:string[]) => {

    return (req:authres,res:Response , next:NextFunction) =>{
       if (!role.includes(req.user.role)){
        return res.status(403).json({
            message:"invalid user"
        })
    }
      next()
    }
  
}

export default roleauth