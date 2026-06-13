import mongoose from "mongoose";


const complaintSchema = new mongoose.Schema({

    student:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Idmodel",
      required:true
    },
    title:{
        type:String,
        required:true,
        minlength:2,
    },
    category:{
        type:String,
        required:true,

    },
    description:{
        type:String,
    },
    priority:{
        type:String,
        enum:['low' , 'medium' , 'high']
    },
    image:{
        url:{
            type:String,
            default:null
        }
    },
    status:{
        type:String,
        enum:['pending' , 'in-progress' , 'resolve' , 'rejected'],
        default:'pending'

    },
    adminResponse:{
        type:String,
        default:null,

    },

    responseBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        dafault:null
    }
})

const complaintModel = mongoose.model('complains' , complaintSchema)

export default complaintModel