const Interest = require("../models/interest.model");
const Settings = require("../models/settings.model");

module.exports = {
  // Get vendor's interest details
  getVendorInterest: async (req, res) => {
    try {
      const { month, year } = req.query;
      const userID = req.user._id;

      const interest = await Interest.find({
        userID,
       createdAt: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) }
      }).populate("applicationId")  .populate("userID", "name email businessName phoneNumber businessType")

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
      const { month, year } = req.query;

      const interests = await Interest.find( {
        createdAt: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) }
      })
        .populate("userID", "name email businessName phoneNumber businessType")
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
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      const interest = await Interest.findOne({
        userID,
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
