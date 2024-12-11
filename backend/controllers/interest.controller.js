const Interest = require("../models/interest.model");
const Application = require("../models/applications.model");
const settings = require("../models/settings.model");

module.exports = {
  // Get vendor's interest details
  getVendorInterest: async (req, res) => {
    try {
      const interest = await Interest.find({
        userID: req.user._id,
      }).populate("applicationId");

      if (!interest) {
        return res.status(404).json({
          success: false,
          message: "No interest record found",
        });
      }

      res.json({
        success: true,
        message: "Interest details fetched successfully",
        data: interest,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching interest details",
        error: error.message,
      });
    }
  },

  // Get all vendors' interest (admin only)
  getAllInterest: async (req, res) => {
    try {
      const interests = await Interest.find()
        .populate("userID", "name email businessName")
        .populate("applicationId");

      res.json({
        success: true,
        message: "Interest details fetched successfully",
        data: interests,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching interest details",
        error: error.message,
      });
    }
  },

  // Get interest summary for dashboard
  getInterestSummary: async (req, res) => {
    try {
      const userID = req.user._id;
      const interest = await Interest.find({
        userID,
        accumulatedInterest: false,
      });

      const currentMonthInterest = interest.reduce((acc, item) => {
        return acc + item.dailyInterest;
      }, 0);
      //Get the application
      const application = await Application.findOne({
        userID,
        status: "approved",
      });

      const onlyInterest =
        application?.calculatedInvoiceAmount - application?.invoiceAmount;

      res.json({
        success: true,
        data: {
          calculatedInvoiceAmount: application?.calculatedInvoiceAmount || 0,
          principalAmount: application?.invoiceAmount || 0,
          totalInterest: onlyInterest + currentMonthInterest || 0,
          interestRate: application?.interestRate || 0,
          currentMonthInterest: currentMonthInterest || 0,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching interest summary",
        error: error.message,
      });
    }
  },
  getInterestAdminSummary: async (req, res) => {
    try { 
      const interest = await Interest.find({
        accumulatedInterest: false,
      });

      const currentMonthInterest = interest.reduce((acc, item) => {
        return acc + item.dailyInterest;
      }, 0);

      //Get the application
      const application = await Application.find({
        status: "approved",
      });

      const totalInvoiceAmount = application.reduce((acc, item) => {
        return acc + item.invoiceAmount;
      }, 0);

      const onlyInterest = application.reduce((acc, item) => {
        return acc + item.calculatedInvoiceAmount - item.invoiceAmount;
      }, 0);

      const totalCalculatedInterest = application.reduce((acc, item) => {
        return acc +  item.calculatedInvoiceAmount;
      }, 0);
       
      const keys = await settings.findOne();

      res.json({
        success: true,
        data: {
          totalInvoiceAmount:totalInvoiceAmount,
          totalPrincipleAmount: totalCalculatedInterest || 0,
          totalInterest: onlyInterest || 0,
          currentMonthInterest: currentMonthInterest || 0, 
          limitLeft: (keys.loanLimit - totalCalculatedInterest) || 0,
          applicationCount: application.length || 0
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching interest summary",
        error: error.message,
      });
    }
  },
};
