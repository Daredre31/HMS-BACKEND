import express from 'express'
import  roomObject from "../controllers/roomcontrol"
import Bedobject from '../controllers/bedcontrol'
import adminControl from '../controllers/adminControl'
import authcontrol from '../controllers/authcontrol'
import protect from "../middlewares/authwware"
import roleauth from '../middlewares/roleauthware'
import { loginLimit } from '../middlewares/rateLimit'
import complain from '../controllers/complain'
import notisController from '../controllers/notisController'
import Dashboard from '../controllers/Dashboard'

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
route.delete('/deleteStudent/:id' , protect , roleauth('admin') , adminControl.deletestudentById)
route.patch('/updateStudent/:id' , protect , roleauth('admin') , adminControl.updateStudentByid)


// route for signups and signing function

route.post('/loginStudent',loginLimit , authcontrol.studentLogin)
route.post('/createAdmin',loginLimit , authcontrol.AdminSignup)
route.post('/loginAdmin',loginLimit , authcontrol.adminLogin);


// route for student complains 

route.post('/createcomplain', protect , complain.createcomplain)
route.put('/replycomplain/:id' , protect , complain.respondTocomplains)
route.get('/viewallcomplains', protect  , complain.viewallcomplains)
route.get('/viewmycomplain' , protect , complain.viewmyComplains)

// route for notifications
route.get('/allnotis' , protect , notisController.getallNotification)
route.get('/unreadnotis' , protect , notisController.getUnreads)
route.patch('/marknotis/:id' , protect , notisController.markasread)
route.patch('/markallasread' , protect , notisController.markAllasread);

// dashboard statistics

route.get('/dashboardstats',protect, roleauth('admin') , Dashboard.countStudent)

export default route