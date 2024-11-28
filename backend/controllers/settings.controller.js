const Settings = require("../models/settings.model");

module.exports = {
  getSettings: async (req, res) => {
    try {
      let settings = await Settings.findOne();

      // Create default settings if none exist
      if (!settings) {
        settings = await Settings.create({
          intrestRate: 0.001,
          SMTP_HOST: "smtp.example.com",
          SMTP_PORT: 587,
          SMTP_USER: "user@example.com",
          SMTP_PASSWORD: "password",
          SMTP_FROM: "noreply@example.com",
        });
      }

      res.json({
        success: true,
        data: settings,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching settings",
        error: error.message,
      });
    }
  },

  updateSettings: async (req, res) => {
    try {
      const updates = req.body;

      let settings = await Settings.findOne();
      if (!settings) {
        settings = new Settings();
      }

      // Update only provided fields
      Object.keys(updates).forEach((key) => {
        if (updates[key] !== undefined) {
          settings[key] = updates[key];
        }
      });

      await settings.save();

      res.json({
        success: true,
        message: "Settings updated successfully",
        data: settings,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating settings",
        error: error.message,
      });
    }
  },
};
