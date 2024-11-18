const mongoose = require('mongoose');
require('dotenv').config();

let uri = process.env.DATABASE_CONNECTION
mongoose.set('strictQuery', false)
const options = {  };

// mongoose.set('debug', true);
mongoose.connect(uri, options).then(
    (res) => {
        console.log('db connected');
    },
    (err) => {
        console.log('db failed', err);
    }
);