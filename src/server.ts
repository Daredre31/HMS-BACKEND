import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import helmet from 'helmet';
import route from './routes/S_and_L'
import { dbconnection } from './configs/db.connection';
import morgan from 'morgan'


const app = express();


app.use(helmet())
app.use(morgan('dev'))
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
     exposedHeaders: [
        'RateLimit-Limit',
        'RateLimit-Remaining', 
        'RateLimit-Reset',
        'Retry-After'
    ]
  })
);
app.use(express.json());
app.use('/server' , route)

app.get("/", (req, res) => {
  res.send("Backend is working");
});

const port = process.env.PORT_NUM || 5000

const startServer = async () => {
  try {
    await dbconnection()

    app.listen(port , ()=> {
    console.log("server is running")
})

  } catch (error) {
    console.log(error)
  }
}

startServer()