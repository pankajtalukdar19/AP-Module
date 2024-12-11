const express = require("express");
const route = express.Router();
const paymentController = require("../controllers/payment.controller");
const { auth } = require("../middleware/auth.middleware");

route.post("/", auth, paymentController.createPayment);
route.get("/", auth, paymentController.getAllPayments);
route.get("/vendor", auth, paymentController.getVendorPayments);
route.put("/:id/status", auth, paymentController.updatePaymentStatus);

module.exports = route;
