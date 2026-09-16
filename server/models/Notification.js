const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        message: {
            type: String,
            required: true,
            trim: true,
        },

        type: {
            type: String,
            enum: ["Document Upload", "General"],
            default: "General",
        },

        documentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Repository",
            default: null,
        },

        recipientRole: {
            type: String,
            enum: ["admin", "faculty"],
            required: true,
        },

        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Notification", notificationSchema);