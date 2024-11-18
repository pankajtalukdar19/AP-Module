const express = require('express');
const route = express.Router();
const paymentController = require('../controllers/payment.controller')

route.post('/', paymentController.payment);
route.get('/:id', paymentController.getPaymentDataByVendorId);

module.exports = route;