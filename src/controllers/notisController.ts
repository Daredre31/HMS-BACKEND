import notismodel from "../models/notification.model";
import { Authreqest } from "../middlewares/authwware";
import { Response } from "express";
import { sendRes } from "../utils/response";

class NotisOperation {
    getallNotification = async(req:Authreqest , res:Response) => {
        try {
          const findallnotis =  await notismodel.find({
                recipient:req.user.id
            }).sort({createdAt:-1})

            if(!findallnotis){
                return sendRes(res, 400, false , "could not fetch notifications ")
            }
            sendRes(res , 200 , true , 'fetch all notification successfully' , findallnotis)
        } catch (error:any) {
           res.status(500).json({
            error:error.message
           })
        }
    };

    getUnreads = async(req:Authreqest , res:Response) => {
        try {
            const findUnreads = await notismodel.countDocuments(
                {
                    recipient:req.user.id,
                    isRead:false
                }
            )
            if(!findUnreads){
                return sendRes(res , 400 , false , 'could not fimd unread message')
            }
            sendRes(res , 200 , true , "find unread notis successfully" , findUnreads)
        } catch (error:any) {
            res.status(500).json({
                error:error.message
            })
        }
    };

  markasread = async(req:Authreqest , res:Response) => {

    const {id} = req.params

    try {
        const mark = await notismodel.findByIdAndUpdate(id , {isRead:true} , {new:true})
        if(!mark){
            return sendRes(res, 400 , false , 'unable to mark as read')
        }

        sendRes(res, 200 , true , "mark as read" , )
    } catch (error:any) {
        res.status(500).json({
            error:error.message
        })
    }

  };

  markAllasread = async(req:Authreqest, res:Response) => {
    try {
        const markall = await notismodel.updateMany({
            recipient:req.user.id , isRead:false
        }, {isRead:true})

        if(!markall) {
            return sendRes(res , 400 , false , "could not mark all")
        }
        sendRes(res, 200 , true , "maek all as read successfully" )
    } catch (error:any) {
     res.status(500).json({
       error:error.message
     })
    }
  }
}


export default new NotisOperation()


//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhM…DYyfQ.81yBMcD38187Bm2am0meSLUiSS5G_MtCWhulmh7dQ9Q

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMjY5ODAzMGEwN2Q3NmY2MTgxMDZjMCIsInRva2VuSWQiOiJJRC1FUF9MUVhaS0dZIiwiaWF0IjoxNzgxNDcxMTQ4LCJleHAiOjE3ODIwNzU5NDh9.dKoUxpz6gqXj4MQTH7TKqBtwACOU9i4bDetj0fXoqU8