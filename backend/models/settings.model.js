const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    interestRate: {
      type: Number,
      required: true,
      default: 0.001,
    },
    loanLimit: {
      type: Number,
      required: true,
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
    SMTP_TO: {
      type: String,
      required: true,
    },
    SMTP_KEY: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Settings", settingsSchema);
