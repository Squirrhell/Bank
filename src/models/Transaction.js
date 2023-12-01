const mongoose = require('mongoose');

const Transaction = new mongoose.Schema({
    type: {
        type: String,
        enum: ['add', 'give', 'take'],
        required: true,
    },
    user_from: {
        type: [mongoose.Schema.Types.ObjectId, null],
        ref: 'User',
        required: true,
    },
    user_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Transaciton', Transaction);