let mongoose = require('mongoose');

let cartSchema = mongoose.Schema({
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
    }]
}, {
    timestamps: true,
});

module.exports = mongoose.model('cart', cartSchema); 