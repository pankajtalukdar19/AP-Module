const mongoose = require("mongoose");

const interestSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    principalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    interestRate: {
      type: Number,
      required: true,
    },
    dailyInterest: {
      type: Number,
      required: true,
      default: 0,
    },
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    lastCalculatedDate: {
      type: Date,
      required: true,
    },
    accumulatedInterest: {
      type: Boolean,
      required: true,
      default: false,
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "application",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interest", interestSchema);
