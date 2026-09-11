const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    type: {
      type: String,
      enum: [
        "Document",
        "Repository",
        "Student Forum",
        "Deadline",
        "Custom",
      ],
      default: "Custom",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    dueDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Reminder", reminderSchema);