const nodemailer = require("nodemailer");
const application = require("../models/applications.model");
 const user = require("../models/user.model");
const template = require("../service/template");
const settings = require("../models/settings.model");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const imageDir = path.join(__dirname, "../uploads/images");
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only image files are allowed."), false);
  }
};

module.exports = {
   uploadImage : multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Max size: 5 MB
  }),
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
        userID,
        invoiceCopy,
      } = req.body;
  
      const createdData = {
        invoiceNumber,
        invoiceAmount,
        invoiceDate,
        date,
        paymentDate,
        dueDate,
        userID,
        invoiceCopy,
        department,
        paymentCondition,
        partialRatio1: partialRatio1 == "null" ? 0 : Number(partialRatio1),
        partialRatio2: partialRatio2 == "null" ? 0 : Number(partialRatio2),
      };
  
      const vendorDetails = await user.findOne({ _id: userID });
      const keys = await settings.findOne();
      const savedEntry = await application.create(createdData);
  
      if (!savedEntry) {
        return res.status(500).json({ success: false, msg: "Failed to save application" });
      }
  
      // Send response after saving the application
      res.status(200).json({ success: true, msg: "Application saved", savedEntry });
  
      // Email logic
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: keys.SMTP_FROM,
          pass: keys.SMTP_KEY,
        },
      });
  
      const emailContent = template({ ...createdData, savedEntry, vendorDetails });
      const mailOptions = {
        from: keys.SMTP_FROM,
        to: keys.SMTP_TO,
        subject: "Invoice Details",
        html: emailContent,
      }; 

      try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
      } catch (emailError) {
        console.error("Error sending email:", emailError);
      }
    } catch (err) {
      console.error("Error occurred:", err);
      return res.status(500).json({ success: false, msg: "There was an error", error: err.message });
    }
  } , 
  updateApplication: async (req, res) => {
    try {
      // Check the current status of the application
      const existingApplication = await application.findById(req.params.id);
  
      if (!existingApplication) {
        return res.status(404).json({ success: false, msg: "Application not found" });
      }
  
      if (existingApplication.status === "approved") {
        return res.status(200).json({ success: false, msg: "Application is already approved you can't update" });
      }

      console.log('existingApplication', existingApplication);
      
  
      // Update the application if not already approved
      const updatedApplication = await application.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      );
      console.log('updatedApplication', updatedApplication);
      
  
      res.json({ success: true, msg: "Application is approved", data: updatedApplication });
    } catch (err) {
      return res.status(500).json({ success: false, msg: "Something went wrong", error: err.message });
    }
  },
};
