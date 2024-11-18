const express = require('express');
const route = express.Router();
const interestController = require('../controllers/interest.controller')

route.post('/', interestController.interest);
route.get('/', interestController.getDataByDate);

module.exports = route;