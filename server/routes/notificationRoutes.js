const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const Notification = require("../models/Notification");

router.get("/", authMiddleware, async (req, res) => {
    try {
        const notifications = await Notification.find({
            recipientRole: req.user.role,
        }).sort({ createdAt: -1 });

        res.status(200).json({
            notifications,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

router.put("/:id/read", authMiddleware, async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            {
                _id: req.params.id,
                recipientRole: req.user.role,
            },
            {
                isRead: true,
            },
            {
                new: true,
            }
        );

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found.",
            });
        }

        res.status(200).json({
            message: "Notification marked as read.",
            notification,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

module.exports = router;