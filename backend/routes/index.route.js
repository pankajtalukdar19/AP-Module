const route = require('express').Router();
const mailRoute = require('./mail.route');
const interestRoute = require('./interest.route');
const vendorRoute = require('./vendor.route')
const paymentRoute = require('./payment.route')
const userRoute = require('./user.route');
const keyRoute = require('./key.route');

route.use('/' , userRoute);
route.use('/mail', mailRoute)
route.use('/interest', interestRoute)
route.use('/vendor', vendorRoute)
route.use('/payment', paymentRoute)
route.use('/key', keyRoute)

module.exports = route;