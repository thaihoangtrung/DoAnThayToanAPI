let mongoose = require('mongoose');

let orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    items: [{
        product: {
            type: mongoose.Types.ObjectId,
            ref: 'product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        default: 'Pending',
    },
    coupon: {
        code: String,
        discount: Number
    },
    shippingInfo: {
        fullName: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        }
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('order', orderSchema);