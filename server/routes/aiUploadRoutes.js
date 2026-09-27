const express = require("express");
const multer = require("multer");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
    analyzeUploadedDocument,
} = require("../services/geminiService");

const upload = multer({
    dest: "uploads/ai/",
});

router.post(
    "/document",
    authMiddleware,
    upload.single("document"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    message: "Document is required",
                });
            }

            const { prompt } = req.body;

            const reply = await analyzeUploadedDocument(
                req.file.path,
                req.file.mimetype,
                prompt || ""
            );

            res.json({
                reply,
            });
        } catch (error) {
            console.error("AI document analysis error:", error);

            res.status(500).json({
                message: "Failed to analyze document",
            });
        }
    }
);

module.exports = router;