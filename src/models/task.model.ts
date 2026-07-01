import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },

    description:{
        type:String,
        minlength:5
    },
    assignTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"student",
        required:true,
        index:true
    },
    dueDate:{
        type:Date,
        required:true
    },
    isComplete:{
        type:Boolean,
        default:false
    },
    completedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'student'
    }
}, {timestamps:true})

const taskmodel = mongoose.model('task' , taskSchema);
export default taskmodel