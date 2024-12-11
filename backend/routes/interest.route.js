const express = require("express");
const route = express.Router();
const interestController = require("../controllers/interest.controller");
const { auth } = require("../middleware/auth.middleware");

route.get("/vendor", auth, interestController.getVendorInterest);
route.get("/all", auth, interestController.getAllInterest);
route.get("/summary", auth, interestController.getInterestSummary);

module.exports = route;
