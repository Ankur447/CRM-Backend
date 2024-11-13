const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser); // For registration
router.post("/login", loginUser); // For login

module.exports = router;
