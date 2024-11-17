const express = require("express");
const { registerUser, loginUser,addDoctorController } = require("../controllers/userController");
const {bookAppointmentController} = require("../controllers/appoinmentController")

const router = express.Router();

router.post("/register", registerUser); // For registration
router.post("/login", loginUser); // For login
router.post("/add-doctor", addDoctorController ) //add new Doctor only admin can do it.
router.post("/book-appointment", bookAppointmentController);


module.exports = router;
