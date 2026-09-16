const mongoose = require("mongoose");

const referenceCounterSchema = new mongoose.Schema(
  {
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    sequence: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

referenceCounterSchema.index(
  { faculty: 1, year: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "ReferenceCounter",
  referenceCounterSchema
);