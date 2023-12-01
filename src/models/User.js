const mongoose = require('mongoose');

const User = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    encryptedPassword: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
    },
    money: {
        type: Number,
        required: true,
        default: 0,
    },
    isShop: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', User);