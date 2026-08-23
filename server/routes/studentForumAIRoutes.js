const express = require("express");
const router = express.Router();

const {
    generateDocument,
} = require("../controllers/studentForumAIController");

const authMiddleware = require("../middleware/authMiddleware");

router.post(
    "/generate",
    authMiddleware,
    generateDocument
);

module.exports = router;