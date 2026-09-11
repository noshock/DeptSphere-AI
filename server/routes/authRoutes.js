const express = require("express");
const router = express.Router();

const {
    registerFaculty,
    loginFaculty,
    forgotPassword,
    verifyOtp,
    resetPassword,
} = require("../controllers/authController");

router.post("/register", registerFaculty);
router.post("/login", loginFaculty);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

module.exports = router;