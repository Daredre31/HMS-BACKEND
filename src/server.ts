import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import {id} from './utils/ID'
dotenv.config()

import route from './routes/S_and_L'

const app = express();

app.use(express.json());
app.use('/server' , route)

mongoose.connect(process.env.MONGO_URI as string) 
.then(()=> {
    console.log("mongo is connected")
})
.catch(()=> {
    console.log("mongo is not working")
})

id()

const port = process.env.PORT_NUM || 5000

app.listen(port , ()=> {
    console.log("server is running")
})