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
import taskObj from '../controllers/TaskControl'

const route = express.Router()

// route for room and bed crud operation

route.post('/room' ,roomObject.createRoom )
route.get('/allroom' ,roomObject.getallroom )
route.get('/room/:id', roomObject.getRoomById)
route.post('/bed' , Bedobject.createBed)
route.get('/allbed' , Bedobject.getallBeds)


// route for admin control crud operation

route.post('/createStudent',protect, roleauth('admin'), adminControl.createstudent);
route.get('/getStudents' ,protect , roleauth('admin','hoh'), adminControl.getallStudent);
route.get('/student/:id', protect , roleauth('admin') , adminControl.getStudentById)
route.delete('/deleteStudent/:id' , protect , roleauth('admin') , adminControl.deletestudentById)
route.patch('/updateStudent/:id' , protect , roleauth('admin') , adminControl.updateStudentByid)
route.delete('/bed/:id' , protect , roleauth('admin'), Bedobject.deleteBedbyId)

// route for signups and signing function

route.post('/loginStudent',loginLimit , authcontrol.studentLogin)
route.post('/createAdmin',loginLimit , authcontrol.AdminSignup)
route.post('/loginAdmin',loginLimit , authcontrol.adminLogin);
route.post('/logout' , authcontrol.logout)
route.post('/refresh', authcontrol.refreshAcessToken)


// route for student complains 

route.post('/createcomplain', protect ,roleauth('student' , 'hoh') ,complain.createcomplain)
route.put('/replycomplain/:id' , protect ,roleauth('admin') ,complain.respondTocomplains)
route.get('/viewallcomplains', protect  ,roleauth('admin'), complain.viewallcomplains)
route.get('/viewmycomplain' , protect , roleauth('student' , 'hoh'),complain.viewmyComplains)

// route for notifications
route.get('/allnotis' , protect , notisController.getallNotification)
route.get('/unreadnotis' , protect , notisController.getUnreads)
route.patch('/marknotis/:id' , protect , notisController.markasread)
route.patch('/markallasread' , protect , notisController.markAllasread);

// dashboard statistics

route.get('/dashboardstats',protect, roleauth('admin') , Dashboard.countStudent)

// hoh and student task operation route

route.get('/alltasks' , protect , roleauth('hoh'), taskObj.viewAllTask)
route.post('/assigntask' , protect , roleauth('hoh'), taskObj.createTask)
route.get('/mytask', protect , roleauth('student'), taskObj.viewMytask)
route.patch('/completetask/:id' , protect, roleauth('student') , taskObj.completeTask)

export default route

//"title":"testing task",
//  "description":"wash toilet",
//  "name":"Omotayo Olaniyi",
//  "dueDate":"2026-05-13"
//6a440eb91e1f01c2d94490dd
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNDQwZTNiMWUxZjAxYzJkOTQ0OTBkYyIsInRva2VuSWQiOiJJRC0tT0JSVTFTWlZBIiwicm9sZSI6ImhvaCIsImlhdCI6MTc4Mjg5NjczOSwiZXhwIjoxNzgyOTgzMTM5fQ.ao3jm36ctjURQ7H27hkjMAG6TMbsQp4gKwiydrnEvrc

