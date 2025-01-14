const express = require("express");
const route = express.Router();
const interestController = require("../controllers/interest.controller");
const { auth } = require("../middleware/auth.middleware");
const InterestService = require("../services/interest.service");

route.get("/vendor", auth, interestController.getVendorInterest);
route.get("/all", auth, interestController.getAllInterest);
route.get("/summary", auth, interestController.getInterestSummary);
route.get("/admin-summary", auth, interestController.getInterestAdminSummary);
route.get("/call-daily-int", auth,  interestController.calculateDailyInterest);
route.get("/call-monthly-int", auth,  interestController.calculateMonthlyInterest);

module.exports = route;
