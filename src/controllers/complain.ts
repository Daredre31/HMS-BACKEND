import studentComplains from '../models/complaint.model'
import {Request , Response} from 'express'
import { sendRes } from '../utils/response'
import { Authreqest } from '../middlewares/authwware'

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
                return sendRes(res , 400 , false , "could write complains")
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
            .sort({createAt:-1})

            if(!getallcomplains) {
              return  sendRes(res , 400 , false , "could fetch complains")
            }

            sendRes(res , 200 , true ,"complains successfully fetched", getallcomplains )
        } catch (error) {
            
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
        }).populate('student')

        if(!updateComplains){
            return sendRes(res, 400 , false , "response is bad")
        }

        sendRes(res , 200 , true , "complains updated successfully" , updateComplains)
      } catch (error:any) {
        res.status(500).json({
            error:error.message
        })
      }
    };

    viewmyComplains = async(req:Authreqest , res:Response) => {

        try {
            const findMycomplains = await studentComplains.find({student:req.user.id})
            .sort({createdAt:-1})
            if(!findMycomplains){
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