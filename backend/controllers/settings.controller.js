const settings = require("../models/settings.model");
const mongoose = require("mongoose");

module.exports = {
  create: async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { email, intrestRate } = req.body;

      if (!email || !intrestRate) {
        return res.status(400).json({
          success: false,
          msg: "Required fields missing",
        });
      }

      if (email && email.trim() !== "") {
        if (!/^\S+@\S+\.\S+$/.test(email)) {
          return res.status(400).json({
            success: false,
            msg: "Invalid email format.",
          });
        }
      }

      // Check if user already exists
      const existingSettings = await settings.findOne({ email });
      if (existingSettings) {
        return res.status(400).json({
          success: false,
          msg:
            existingSettings.email === email
              ? "Settings with this email already exists"
              : "Settings with this phone number already exists",
        });
      }

      const settingsData = {
        email,
        intrestRate,
      };

      // Create and save the user
      const newSettings = new settings(settingsData);
      const savedSettings = await newSettings.save({ session });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return res.status(201).json({
        success: true,
        msg: "Settings details saved successfully",
        data: savedSettings,
      });
    } catch (err) {
      // Rollback transaction on error
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json({
        success: false,
        msg: "An error occurred while creating the settings.",
        error: err.message,
      });
    }
  },
  getAll: async (req, res) => {
    try {
      const data = await settings.findOne();

      if (!data) {
        return res
          .status(404)
          .json({ success: false, msg: "No settings found" });
      }
      return res.status(200).json({
        success: true,
        msg: "settings data fetched successfully",
        data,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        msg: "Something went wrong",
        error: err.message,
      });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { email, intrestRate } = req.body;

      if (!email || !intrestRate) {
        return res.status(400).json({
          success: false,
          msg: "Required fields missing",
        });
      }

      if (email && email.trim() !== "") {
        if (!/^\S+@\S+\.\S+$/.test(email)) {
          return res.status(400).json({
            success: false,
            msg: "Invalid email format.",
          });
        }
      }

      const updatedSettings = await settings.findByIdAndUpdate(id, {
        email,
        intrestRate,
      });

      return res.status(200).json({
        success: true,
        msg: "Settings details updated successfully",
        data: updatedSettings,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        msg: "Something went wrong",
        error: err.message,
      });
    }
  },
};
