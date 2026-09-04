const mongoose = require("mongoose");

const repositorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    session: {
      type: String,
      required: true,
      trim: true,
    },
    
    term: {
      type: String,
      enum: ["Even", "Odd"],
      required: true,
    },
    category: {
    type: String,
     required: true,
   },

    fileName: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Repository", repositorySchema);