const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    intrestRate: {
      type: Number,
      required: true,
      default: 0.001,
    },
    SMTP_HOST: {
      type: String,
      required: true,
    },
    SMTP_PORT: {
      type: Number,
      required: true,
    },
    SMTP_USER: {
      type: String,
      required: true,
    },
    SMTP_PASSWORD: {
      type: String,
      required: true,
    },
    SMTP_FROM: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Settings", settingsSchema);
