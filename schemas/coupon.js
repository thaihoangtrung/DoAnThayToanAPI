let mongoose = require('mongoose');

let couponSchema = mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('coupon', couponSchema); 