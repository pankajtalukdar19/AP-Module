const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
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
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["bank_transfer", "cash", "cheque"],
      required: true,
    },
    referenceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    invoiceUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
