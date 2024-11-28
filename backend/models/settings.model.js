const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    email: {
      required: false,
      type: String,
      trim: true,
    },
    intrestRate: {
      type: Number,
      required: true,
      default: 0.001,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Settings", settingsSchema);
