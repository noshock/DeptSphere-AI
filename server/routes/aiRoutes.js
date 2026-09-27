const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { chatWithDashboardAI, generateAIImage,  } = require("../services/geminiService");

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

router.post("/generate-image", authMiddleware, async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || !prompt.trim()) {
            return res.status(400).json({
                message: "Image prompt is required",
            });
        }

        const image = await generateAIImage(prompt);

        res.json({
            image,
        });
    } catch (error) {
        console.error("AI image generation error:", error);

        res.status(500).json({
            message: "Failed to generate image",
        });
    }
});

module.exports = router;