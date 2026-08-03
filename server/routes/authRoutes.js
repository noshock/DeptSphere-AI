const express = require("express");
const router = express.Router();

const {
    registerFaculty,
    loginFaculty,
} = require("../controllers/authController");

router.post("/register", registerFaculty);
router.post("/login", loginFaculty);

module.exports = router;