const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      required: false,
      type: String,
      trim: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["vendor", "admin"],
      default: "vendor",
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    businessName: {
      type: String,
      trim: true,
    },
    businessType: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    refreshToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
