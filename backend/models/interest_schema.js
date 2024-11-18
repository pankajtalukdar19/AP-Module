const mongoose = require('mongoose');
const interest_Schema = mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vendor",
        required: true
    },
    invoiceAmount:Number,
    interestRate:Number,
    perdayInterestRate:Number,
    interestAmount:Number

}, { timestamps: true });
const Interest_Schema = mongoose.model('interest', interest_Schema);
module.exports = Interest_Schema;