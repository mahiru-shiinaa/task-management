const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");

router.post("/register", userController.register); 
router.post("/login", userController.login); 
router.post("/password/forgot", userController.forgotPassword); 
router.post("/password/otp", userController.otpPassword); 


module.exports = router;
