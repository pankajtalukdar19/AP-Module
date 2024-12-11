const Interest = require("../models/interest.model");
const Application = require("../models/applications.model");
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

      //Get the application
      const application = await Application.findOne({
        userID,
        status: "approved",
      });

      res.json({
        success: true,
        data: {
          calculatedInvoiceAmount: application?.calculatedInvoiceAmount || 0,
          principalAmount: application?.invoiceAmount || 0,
          totalInterest:
            application?.calculatedInvoiceAmount - application?.invoiceAmount ||
            0,
          interestRate: application?.interestRate || 0,
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
