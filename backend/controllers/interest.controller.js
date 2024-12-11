const Interest = require("../models/interest.model");

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
      const vendorId = req.user._id;
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      const interest = await Interest.findOne({
        vendorId,
        month: currentMonth,
        year: currentYear,
      });

      res.json({
        success: true,
        data: {
          principalAmount: interest?.principalAmount || 0,
          totalInterest: interest?.totalInterest || 0,
          dailyInterest: interest?.dailyInterest || 0,
          lastCalculated: interest?.lastCalculatedDate,
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
