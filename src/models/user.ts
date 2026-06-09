import mongoose from "mongoose";

const allUserSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        minlength: 3 ,

    },

    email : {
        type:String,
        required:true,

    },

    password:{
        type:String,
        required:true
    
} ,

 role: {
    type:String,
    enum:["admin" , "hoh"],
    required:true
 },
 }  ,{timestamps:true})

 const users = mongoose.model('user' , allUserSchema);

 export default users