const mongoose = require("mongoose");
const facultySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
     email: {
     type: String,
     required: true,
     unique: true,
     lowercase: true,
     trim: true,
    },
      password: {
      type: String,
      required: true,
      minlength: 6,
    },
     department: {
     type: String,
     required: true,
    },

      designation: {
      type: String,
      required: true,
    },

     employeeId: {
     type: String,
     required: true,
     unique: true,
    },

     role: {
     type: String,
     enum: ["faculty", "admin"],
     default: "faculty",
    },

     isActive: {
     type: Boolean,
     default: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Faculty", facultySchema);
