const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.route");
const userRoutes = require("./user.route");
const applicationsRoutes = require("./applications.route");

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/applications", applicationsRoutes);
module.exports = router;
