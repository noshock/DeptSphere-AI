const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const Reminder = require("../models/Reminder");

// Create reminder
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, type, priority, dueDate } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({
        message: "Title and due date are required",
      });
    }

    const reminder = await Reminder.create({
      title,
      description,
      type,
      priority,
      dueDate,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      reminder,
    });
} catch (error) {
  console.error("REMINDER CREATE ERROR:", error);

  res.status(500).json({
    message: error.message,
    error: error
  });
}
});

// Get reminders
router.get("/", authMiddleware, async (req, res) => {
  try {
    const reminders = await Reminder.find({
      createdBy: req.user.id,
    }).sort({ dueDate: 1 });

    res.json({
      success: true,
      reminders,
    });
  } catch (error) {
    console.error("Get Reminder Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Mark reminder as read
router.put("/:id/read", authMiddleware, async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user.id,
      },
      {
        isRead: true,
      },
      {
        new: true,
      }
    );

    if (!reminder) {
      return res.status(404).json({
        message: "Reminder not found",
      });
    }

    res.json({
      success: true,
      reminder,
    });
  } catch (error) {
    console.error("Mark Read Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Complete reminder
router.put("/:id/complete", authMiddleware, async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user.id,
      },
      {
        status: "Completed",
      },
      {
        new: true,
      }
    );

    if (!reminder) {
      return res.status(404).json({
        message: "Reminder not found",
      });
    }

    res.json({
      success: true,
      reminder,
    });
  } catch (error) {
    console.error("Complete Reminder Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete reminder
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!reminder) {
      return res.status(404).json({
        message: "Reminder not found",
      });
    }

    res.json({
      success: true,
      message: "Reminder deleted successfully",
    });
  } catch (error) {
    console.error("Delete Reminder Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;