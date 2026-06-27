import redis from "../configs/redisConnect";
import { Request, Response } from "express";

export const testing = async(req:Request , res:Response) =>{
    try {
        await redis.set("name" ,"dre")
        const getItem = await redis.get("name");

        res.json({
            success:true , 
            getItem
        })

    } catch (error) {
        res.json({
            message:"issue with connection"
        })
    }
}
