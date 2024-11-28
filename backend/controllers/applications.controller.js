const nodemailer = require("nodemailer");
const application = require("../models/applications.model");
const moment = require("moment");
const template = require("../service/template");
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

  createApplication: async (req, res) => {
    try {
      const {
        date,
        invoiceDate,
        paymentDate,
        department,
        dueDate,
        invoiceAmount,
        invoiceNumber,
        paymentCondition,
        partialRatio1,
        partialRatio2,
        userEmail,
        vendorName,
      } = req.body;

      const keys = await key.find()

      const vendorDetails = await vendor.findOne({ _id: vendorName });

      const newMailerEntry = new application({ ...req.body, calculatedInvoiceAmount: invoiceAmount });
      const savedEntry = await newMailerEntry.save();

      if (savedEntry) {
        res.status(200).json({ success: true, msg: "Application saved", savedEntry });

        let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: keys[0]?.username,
            pass: keys[0]?.key,
          }
        });

        let mailContent = template(department, invoiceNumber, invoiceDate, paymentDate, dueDate, vendorDetails, invoiceAmount, paymentCondition, partialRatio1, partialRatio2, savedEntry.calculatedInvoiceAmount);

        const emailContent = template({
          department,
          invoiceNumber,
          invoiceDate,
          paymentDate,
          dueDate,
          vendorDetails,
          paymentCondition,
          partialRatio1,
          partialRatio2,
          invoiceAmount,
        });
        const mailOptions = {
          from: keys[0]?.username,
          to: userEmail,
          subject: 'Invoice Details',
          html: emailContent
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ success: false, msg: "Error sending email", error: error.message });
          } else {
            console.log('Message sent: %s', info.messageId);
            return res.status(200).json({ success: true, msg: "Email sent", info: info });
          }
        });
      }
    } catch (err) {
      console.error('Error occurred:', err);
      return res.status(500).json({ success: false, msg: "There was an error", error: err.message });
    }
  },
};
