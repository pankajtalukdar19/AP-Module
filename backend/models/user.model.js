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
    phoneNumber: {
      type: String,
      required: false,
      trim: true,
      match: [/^\d+$/, "Phone number must contain only digits"],
    },
    role: {
      type: String,
      enum: ["vendor", "admin"],
      default: "vendor",
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);