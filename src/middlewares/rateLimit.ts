import rateLimit from "express-rate-limit";

export const loginLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // this signifies 15 minutes and limit is hit
    max:5,
    message:{
        success:false , message:"too many login attempt try again after some time"
    },
    standardHeaders:true,
    legacyHeaders:false
})