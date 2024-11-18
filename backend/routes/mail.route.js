const express = require('express');
const route = express.Router();
const mailController = require('../controllers/mail.controller')

route.post('/', mailController.send);
route.put('/:id' , mailController.update);
route.get("/:id", mailController.getDataById);
route.post("/reject", mailController.reject);
route.get("/", mailController.getApplication);
route.put("/", mailController.updateCalculatedAmount);
route.get('/by-vendor/:vendorId', mailController.getAllByVendorId);
route.get('/vendor', mailController.getOnlyVendorName);

module.exports = route;