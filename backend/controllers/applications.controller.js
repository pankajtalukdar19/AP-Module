const nodemailer = require("nodemailer");
const application = require("../models/applications.model");
const moment = require("moment");

module.exports = {
  getDataById: async (req, res) => {
    try {
      const data = await application.findOne({ _id: req.params.id });
      return res.json({ success: true, msg: "get success", data });
    } catch (err) {
      return res.status(500).json({
        success: false,
        msg: "Something_Went_Wrong",
        error: err.message,
      });
    }
  },

  getApplication: async (req, res) => {
    try {
      const data = await application.find().populate("userID");

      console.log(data);

      if (data.length === 0) {
        return res
          .status(404)
          .json({ success: false, msg: "No applications found" });
      }

      return res.status(200).json({
        success: true,
        msg: "Applications fetched successfully",
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

  getAllByVendorId: async (req, res) => {
    try {
      const { vendorId } = req.params;

      const data = await application
        .find({ userID: vendorId })
        .populate("userID");

      if (data.length === 0) {
        console.log("No data found", vendorId);
        return res.status(500).json({
          success: false,
          msg: "No data found for the given Vendor ID." + vendorId,
        });
      }

      return res
        .status(200)
        .json({ success: true, msg: "Data retrieved successfully", data });
    } catch (err) {
      console.error("Error fetching data by Vendor ID:", err.message);
      return res.status(500).json({
        success: false,
        msg: "Something went wrong",
        error: err.message,
      });
    }
  },
};
