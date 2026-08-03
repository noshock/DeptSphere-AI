const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const Faculty = require("../models/Faculty");

router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const faculty = await Faculty.findById(req.user.id).select("-password");

        if (!faculty) {
            return res.status(404).json({
                message: "Faculty not found",
            });
        }

        res.status(200).json(faculty);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

module.exports = router;