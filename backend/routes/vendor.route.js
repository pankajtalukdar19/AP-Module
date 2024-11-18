const express = require('express');
const route = express.Router();
const vendorController = require('../controllers/vendor.controller')

route.post('/', vendorController.create);
route.get("/", vendorController.get);

module.exports = route;