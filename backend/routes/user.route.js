const express = require('express');
const userController = require('../controllers/user.controller');
const route = express.Router();

route.post('/login', userController.login);
route.post('/signup' , userController.signup);
route.patch('/userupdate' , userController.userUpdate);
route.get('/user' , userController.getUser);



module.exports = route;