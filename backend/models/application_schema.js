const mongoose = require('mongoose');
const mailer = mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    invoiceDate: {
        type: Date,
        required: true
    },
    paymentDate: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    userEmail: {
        type: String,
        required: true,
        match: /.+\@.+\..+/
    },
    vendorName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vendor",
        required: true
    },
    invoiceAmount: {
        type: Number,
        required: true
    },
    calculatedInvoiceAmount: {
        type: Number,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    paymentCondition: {
        type: String,
        required: true,
        enum: ['Full Payment', 'Partial Payment'],
    },
    partialRatio1: {
        type: Number,
    },
    partialRatio2: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'  
    },
 

}, { timestamps: true });
const Mailer = mongoose.model('mailer', mailer);
module.exports = Mailer;