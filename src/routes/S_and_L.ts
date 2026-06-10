import express from 'express'
import  roomObject from "../controllers/roomcontrol"
import Bedobject from '../controllers/bedcontrol'
import adminControl from '../controllers/adminControl'
import authcontrol from '../controllers/authcontrol'
import protect from "../middlewares/authwware"
import roleauth from '../middlewares/roleauthware'

const route = express.Router()

// route for room and bed crud operation

route.post('/room' ,roomObject.createRoom )
route.get('/allroom' ,roomObject.getallroom )
route.get('/room/:id', roomObject.getRoomById)
route.post('/bed' , Bedobject.createBed)
route.get('/allbed' , Bedobject.getallBeds)


// route for admin control crud operation

route.post('/createStudent',protect, roleauth('admin'), adminControl.createstudent);
route.get('/getStudents' ,protect , roleauth('admin'), adminControl.getallStudent);


// route for signups and signing function

route.post('/loginStudent' , authcontrol.studentLogin)
route.post('/createAdmin' , authcontrol.AdminSignup)
route.post('/loginAdmin' , authcontrol.adminLogin)
export default route