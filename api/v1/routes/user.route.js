const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");

const authMiddlewares = require("../middlewares/auth.middleware");

router.get("/list", authMiddlewares.requireAuth, userController.list); 
router.post("/register", userController.register); 
router.post("/login", userController.login); 
router.post("/password/forgot", userController.forgotPassword); 
router.post("/password/otp", userController.otpPassword); 
router.post("/password/reset", userController.resetPassword); 
router.get("/detail", authMiddlewares.requireAuth, userController.detail); 


module.exports = router;
