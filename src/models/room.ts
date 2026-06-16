import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    roomNumber:{
        type:Number,
        required:true,
        unique:true,
        min:1
    },
    roomCapacity:{
       type:Number,
       required:true, 
       min:1
    },
    roomStatus:{
        type:String,
        enum:['available' ,"partiallyOccupied", 'fullyOccupied' , 'underMaintenance'],
        default:'available'
    }
},{timestamps:true})

const Room = mongoose.model("Room" , roomSchema);
export default Room