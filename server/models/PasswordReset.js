const mongoose = require("mongoose");

const passwordResetSchema = new mongoose.Schema(
    {
        employeeId: {
            type: String,
            required: true,
            index: true,
        },

        email: {
            type: String,
            required: true,
        },

        otpHash: {
            type: String,
            required: true,
        },

        expiresAt: {
            type: Date,
            required: true,
        },

        attempts: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "PasswordReset",
    passwordResetSchema
);