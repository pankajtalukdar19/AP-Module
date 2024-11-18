const mongoose = require('mongoose');
const keys_schema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    },


}, { timestamps: true });
const Keys_schema = mongoose.model('keys', keys_schema);
module.exports = Keys_schema;