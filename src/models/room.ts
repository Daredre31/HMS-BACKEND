import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    roomNumber:{
        type:Number,
        required:true,
        unique:true,
    },
    roomCapacity:{
       type:Number,
       required:true, 
    },
    roomStatus:{
        type:String,
        enum:['available' ,"partiallyOccupied", 'fullyOccupied' , 'under_Maintenance'],
        default:'available'
    }
},{timestamps:true})

const Room = mongoose.model("Room" , roomSchema);
export default Room