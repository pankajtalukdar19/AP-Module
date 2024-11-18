const express = require('express');
const route = express.Router();
const keyController = require('../controllers/keys.controller')

route.post('/', keyController.create);
route.get('/', keyController.getKeys);
route.put('/:id', keyController.getKeysById);

module.exports = route;