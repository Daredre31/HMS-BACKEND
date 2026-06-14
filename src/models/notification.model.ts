import mongoose from 'mongoose'
import { title } from 'node:process'

const notisSchema = new mongoose.Schema({
    recipient:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    recipientRole:{
        type:String,
        enum:['student' , 'hoh' , 'admin']
    },
    title:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    isRead:{
        type:Boolean,
        default:false
    }

},{timestamps:true})

const notismodel = mongoose.model('notis' , notisSchema)

export default notismodel