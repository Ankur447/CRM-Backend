const express = require("express");
const { registerUser, loginUser,addDoctorController } = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser); // For registration
router.post("/login", loginUser); // For login
router.post("/add-doctor", addDoctorController ) //add new Doctor only admin can do it.


module.exports = router;
