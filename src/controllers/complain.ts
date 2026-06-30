import studentComplains from '../models/complaint.model'
import {Request , Response} from 'express'
import { sendRes } from '../utils/response'
import { Authreqest } from '../middlewares/authwware'
import notismodel from '../models/notification.model'
import users from '../models/user'

class complains {
    createcomplain = async(req:Authreqest , res:Response)=> {
        const {title , category , description , priority} = req.body

        if(!title || !category || !description ) {
            return sendRes(res , 400 , false , "title , description and category are required")
        }

        try {
            const writecomplains = await studentComplains.create({
              student:req.user.id,  title , category , description , priority 
            })

            if(!writecomplains) {
                return sendRes(res , 400 , false , "couldnt write complains")
            }

           const admin = await users.findOne({role:'admin'})

           if(admin) {
             await notismodel.create({
                recipient:admin._id,
                recipientRole:"admin",
                title:"new notification",
                message:"student submitted a complain"

             }
             )
           } 

            sendRes(res , 201 , true , "complain submitted successfully" , writecomplains)
        } catch (error:any) {
            res.status(500).json({
                error:error.message
            })
        }
    };
    viewallcomplains = async(req:Request , res:Response) => {
        try {
            const getallcomplains = await studentComplains.find()
            .populate('student')
            .sort({createdAt:-1})

            if(getallcomplains.length == 0) {
              return  sendRes(res , 400 , false , "could fetch complains")
            }

            sendRes(res , 200 , true ,"complains successfully fetched", getallcomplains )
        } catch (error:any) {
            return sendRes(res, 500 , false , "internal server error")
        }
    };

    respondTocomplains = async(req:Authreqest , res:Response) => {
      const {id} = req.params
      const {response , status} = req.body

      if(!id){
        return sendRes(res , 400 , false, "id not recognised")
      }

      try {
        const updateComplains = await studentComplains.findByIdAndUpdate(id , {
            adminResponse:response , status:status , responseBy:req.user?.id
        }, {new:true}).populate('student')

        if(!updateComplains){
            return sendRes(res, 400 , false , "response is bad")
        }

        if(updateComplains.student){
           await notismodel.create({
            recipient:(updateComplains.student as any)._id,
            recipientRole:"student",
            title:"new notification",
            message:"view admin response"
          })
        }
         

        sendRes(res , 200 , true , "complains updated successfully" , updateComplains)
      } catch (error:any) {
        res.status(500).json({
            error:error.message,
        })
      }
    };

    viewmyComplains = async(req:Authreqest , res:Response) => {

        try {
            const findMycomplains = await studentComplains.find({student:req.user.id})
            .sort({createdAt:-1})
            if(findMycomplains.length ===0){
               return sendRes(res, 400 , false , "cant fetch complains")
            }

            sendRes(res, 200 , true, "fetch successfuly" , findMycomplains)
        } catch (error:any) {
          res.status(500).json(
           { error:error.message}
          ) 
        }
    }
}

export default new complains()