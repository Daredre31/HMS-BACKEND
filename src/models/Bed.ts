import mongoose from "mongoose";

const bedSchema = new mongoose.Schema({
    bedNumber:{
        type:String,
        required:true,
        unique:true
    },

    room: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Room",
        required:true
    },

    isOccupied: {
        type:Boolean,
        default:false
    },

    
}, {timestamps:true})

const Bed = mongoose.model("Bed" , bedSchema)
export default Bed