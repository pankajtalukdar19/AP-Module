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
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    calculatedInvoiceAmount: {
      type: Number, 
    },
    invoiceCopy: {
      type: String,
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
      default: null, // Allows null if not provided
    },
    partialRatio2: {
      type: Number,
      default: null, // Allows null if not provided
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
