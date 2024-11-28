const mongoose = require("mongoose");
const application = mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
    },
    invoiceAmount: {
      type: Number,
      required: true,
    },
    invoiceDate: {
      type: Date,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    paymentDate: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
      match: /.+\@.+\..+/,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    calculatedInvoiceAmount: {
      type: Number,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    paymentCondition: {
      type: String,
      required: true,
      enum: ["Full Payment", "Partial Payment"],
    },
    partialRatio1: {
      type: Number,
    },
    partialRatio2: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Application = mongoose.model("application", application);
module.exports = Application;
