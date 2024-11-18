
const mongoose = require('mongoose');
const payment_Schema = mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vendor",
        required: true
    },
    paidAmount:Number,

}, { timestamps: true });
const Payment_Schema = mongoose.model('payment', payment_Schema);
module.exports = Payment_Schema;