import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import {id} from './utils/ID'
dotenv.config()
import cors from 'cors'

import route from './routes/S_and_L'
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use('/server' , route)

app.get("/", (req, res) => {
  res.send("Backend is working");
});


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