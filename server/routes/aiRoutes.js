const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { chatWithDashboardAI } = require("../services/geminiService");

router.post("/chat", authMiddleware, async (req, res) => {
    try {
        const { message, context } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                message: "Message is required",
            });
        }

        const reply = await chatWithDashboardAI(
            message,
            context || ""
        );

        res.json({
            reply,
        });
    } catch (error) {
        console.error("Dashboard AI error:", error);

        res.status(500).json({
            message: "Failed to get AI response",
        });
    }
});

module.exports = router;