const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.route");
const userRoutes = require("./user.route");
const applicationsRoutes = require("./applications.route");
const paymentRoutes = require("./payment.route");
const settingsRoutes = require("./settings.route");
const interestRoutes = require("./interest.route");
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/applications", applicationsRoutes);
router.use("/payments", paymentRoutes);
router.use("/settings", settingsRoutes);
router.use("/interest", interestRoutes);
module.exports = router;
