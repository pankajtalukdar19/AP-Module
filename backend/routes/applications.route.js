const express = require("express");
const route = express.Router();
const { auth } = require("../middleware/auth.middleware");
const applicationController = require("../controllers/applications.controller");

route.get("/", auth, applicationController.getApplication);
route.get("/:id", auth, applicationController.getDataById);
route.get("/by-vendor/:vendorId", auth, applicationController.getAllByVendorId);
module.exports = route;
