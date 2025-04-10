let mongoose = require('mongoose');

let contactSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'processed'],
        default: 'pending'
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('contact', contactSchema); 