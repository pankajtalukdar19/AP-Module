const express = require("express");
const route = express.Router();
const { auth } = require("../middleware/auth.middleware");
const applicationController = require("../controllers/applications.controller");

route.get("/", auth, applicationController.getApplication);
route.get("/by-vendor/:vendorId", auth, applicationController.getAllByVendorId);
route.get("/:id", auth, applicationController.getDataById);
route.post("/", auth, applicationController.uploadImage.single("invoiceCopy"),applicationController.createApplication);
route.put('/:id' , applicationController.updateApplication);
module.exports = route;
