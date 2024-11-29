// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');

const userController = require('../Controller/UserController');
const LoginController = require('../Controller/LoginController');
const DataController = require('../Controller/DataController')
const FileController = require('../Controller/FileController')
const AppointmentController = require('../Controller/AppointmentsController')
const DoctorController = require('../Controller/DoctorController')
// Call the registerUser function with req and res
router.post('/register',  userController.registerUser);
router.post('/login',  LoginController.Login);
router.get('/data',  DataController.Getdata);
const upload = multer({ storage: multer.memoryStorage() }); // Stores files in memory as a Buffer

router.post('/upload', upload.single('file_data'), FileController.UploadFile);
router.get('/download/:id',FileController.downloadFile)
router.put('/update',  userController.UpdateUser);
router.post('/appointments',AppointmentController.GetAppointments);
router.get('/getappointments',AppointmentController.GetallAppointments);
router.post('/toggledoctor/:id',DoctorController.ToggledoctorStatus);
router.get('/getdoctors/:id',DoctorController.GetDoctorInfo)
module.exports = router;