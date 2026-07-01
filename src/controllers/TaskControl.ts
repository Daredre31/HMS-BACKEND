import { Request , Response } from "express";
import taskmodel from "../models/task.model";
import { sendRes } from "../utils/response";
import idmodel from "../models/studentId";
import { Authreqest } from "../middlewares/authwware";



class taskObj {
    createTask = async(req:Request , res:Response)=> {
      const {title , description , assignTo , dueDate} = req.body
      if(!title || !description || !assignTo || !dueDate){
        return sendRes(res , 400 , false , "all field asre required")
      }

      try {
        const findName = await idmodel.findOne({name:assignTo})
        if(!findName){
            return sendRes(res, 400 , false , "no student with this name ")
        }

      const createTask = await taskmodel.create({
          title , description , assignTo:findName._id , dueDate
      })

      if(!createTask) {
        return sendRes(res , 400 , false , "error while creating a task")
      }
        
      sendRes(res , 201 , true , "task created and sent successfully" , createTask)
      } catch (error) {
        sendRes(res , 500 , false , "error while creatring task ")
      }
    }

    viewMytask = async(req:Authreqest , res:Response) => {
        try {
            const viewTask = await taskmodel.find({assignTo:req.user.id}).sort({
                createdAt:-1
            })
            if(viewTask.length === 0){
                return sendRes(res , 400 , false , "no task available")
            }

            sendRes(res , 200 , true , "ftech my task successfully" , viewTask)
        } catch (error) {
           sendRes(res , 500 , false , 'internal server error') 
        }
    }

    completeTask = async (req: Authreqest, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return sendRes(res, 400, false, "id isnt recognised");
  }

  try {
    const completeTask = await taskmodel.findOneAndUpdate(
      { _id: id, assignTo: req.user.id },
      { isComplete: true, completedBy: req.user.id },
      { new: true }
    );

    if (!completeTask) {
      return sendRes(res, 400, false, "unable to complete task");
    }

    sendRes(res, 200, true, "task marked as complete", completeTask);
  } catch (error) {
    sendRes(res, 500, false, "internal server error");
  }
};

  viewAllTask = async (req: Authreqest, res: Response) => {
  try {
    const allTasks = await taskmodel
      .find()
      .populate("assignTo", "name")
      .populate("completedBy", "name")
      .sort({ createdAt: -1 });

    if (allTasks.length === 0) {
      return sendRes(res, 404, false, "no tasks available");
    }

    sendRes(res, 200, true, "all tasks fetched successfully", allTasks);
  } catch (error) {
    sendRes(res, 500, false, "internal server error");
  }
};
}

export default new taskObj()