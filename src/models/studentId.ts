import mongoose from "mongoose";

const idSchema = new mongoose.Schema({
    tokenId : {
        type:String,
        required:true,
        unique:true,
    },

     name:{
           type:String,
           required:true,
           trim:true
       },
   
       email:{
           type:String,
           required:true,
           unique:true,  
           lowercase: true,
           trim: true
       },
        currentSession:{
           type:String,
           required:true,
       },
        bed:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Bed",
        required:true,
        index:true
    },
     paymentStatus: {
      type: String,
      enum: ["paid", "pending"],
      default: "pending",
    },

    isTaken : {
        type:Boolean,
        required:true,
        default:false
    },

    expiryDate:{
       type:Date,
       required:true
    },

} , {timestamps:true})

const idmodel = mongoose.model('idmodel' , idSchema)

export default idmodel