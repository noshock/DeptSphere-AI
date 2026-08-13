const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
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
router.get("/all", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const faculty = await Faculty.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json(faculty);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});
router.put("/:id/status", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { isActive } = req.body;

        const faculty = await Faculty.findById(req.params.id);

        if (!faculty) {
            return res.status(404).json({
                message: "Faculty not found",
            });
        }

        faculty.isActive = isActive;
        await faculty.save();

        res.status(200).json({
            message: "Faculty status updated successfully",
            faculty,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        if (req.params.id === req.user.id) {
            return res.status(400).json({
                message: "You cannot delete your own admin account.",
            });
        }

        const faculty = await Faculty.findById(req.params.id);

        if (!faculty) {
            return res.status(404).json({
                message: "Faculty not found",
            });
        }

        await faculty.deleteOne();

        res.status(200).json({
            message: "Faculty deleted successfully",
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

module.exports = router;