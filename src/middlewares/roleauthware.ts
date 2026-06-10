import {Request , Response , NextFunction} from 'express'

export interface authres extends Request{
    user?:any
}

const roleauth = ( ...role:string[]) => {


    return (req:authres,res:Response , next:NextFunction) =>{

        console.log("Allowed:", role);
    console.log("User:", req.user);

    
       if (!role.includes(req.user.role)){
        return res.status(403).json({
            message:"invalid user"
        })
    }
      next()
    }
  
}

export default roleauth