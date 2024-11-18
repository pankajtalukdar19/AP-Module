
const mongoose = require('mongoose');
const vendor_schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
  

}, { timestamps: true });
const Vendor_schema = mongoose.model('vendor', vendor_schema);
module.exports = Vendor_schema;