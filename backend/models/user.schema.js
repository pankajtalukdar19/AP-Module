const mongoose = require("mongoose");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const secret = require("../config/secret");

const user = mongoose.Schema({
    email : {
        type  : String,
        match : [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        required : true,
        unique : true
    },
    firstname : {
        type : String,
        required : false
    },
    lastname : {
        type : String,
        required : false
    },
    password : {
        type : String,
        required : true
    },
    salt : {
        type : String,
        required : false
    },
    is_admin : {
        type : Boolean,
        default : false
    },
} , {timestamps : true});

user.pre('save', function (next) {
    const user = this;
    this.isDeleted = false;
    if(user.email){
        user.email = user.email.toLowerCase();
    }
    if (!user.password) {
        next();
    } else {
        user.salt = crypto.randomBytes(16).toString('hex');
        user.password = crypto.pbkdf2Sync(user.password, this.salt, 1000, 64, 'sha512').toString('hex');
        next();
    }
});

user.pre('findOneAndUpdate', function (next) {
    const user = this.getUpdate().$set;
    if (!user.password) {
        next();
    } else {
        user.salt = crypto.randomBytes(16).toString('hex');
        user.password = crypto.pbkdf2Sync(user.password, user.salt, 1000, 64, 'sha512').toString('hex');
        next();
    }
});

user.methods.validPassword = function(password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.password === hash;
};


user.methods.generateJwt = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        role: this.role
    }, secret.secretKey, {
        expiresIn: '20h'
    });
};

user.methods.verifyToken = function (token, callback) {
    if(!token){
        return callback(false);
    }
    token = token.split(' ')[1]
    jwt.verify(token, secret.secretKey, function (err, dcode) {
        if (err) {
            return callback(false);
        } else {
            return callback(dcode);
        }
    })
}

const User = mongoose.model('user' , user);
module.exports = User;