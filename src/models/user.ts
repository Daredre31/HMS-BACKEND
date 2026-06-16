import mongoose from "mongoose";

const allUserSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        minlength: 3 ,
        trim:true

    },

    email : {
        type:String,
        required:true,
        unique:true ,
        lowercase:true,
        index:true

    },

    password:{
        type:String,
        required:true,
        minlength:6,
    
} ,

 role: {
    type:String,
    enum:["admin" , "hoh"],
    required:true
 },
 }  ,{timestamps:true})

 const users = mongoose.model('user' , allUserSchema);

 export default users