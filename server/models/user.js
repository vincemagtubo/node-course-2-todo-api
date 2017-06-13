const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true, 
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email motherfucker nigguh.'
        }
    }, 
    password: {
        type: String,
        required: true,
        minlength: 6    
    }, 
    tokens: [{
        access: {
            type: String,
            required: true
        }, 
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObj = user.toObject();

    return _.pick(userObj, ['_id', 'email'])
};

UserSchema.methods.generateAuthToken = function () {
    var user = this; //instance call
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access: access}, '_').toString();

    user.tokens.push({
        access,
        token
    });
    
    return user.save().then(() => {
        return token;
    });
};

UserSchema.statics.findByToken = function (token) {
    var User = this; //model call
    var decoded;

    try {
        decoded = jwt.verify(token, '_')
    } catch (err) {
        // return new Promise((resolve, reject) => {
        //     reject();
        // });
        return Promise.reject('Rejected');
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });

};


var User = mongoose.model('User', UserSchema);

module.exports = {
    User
};