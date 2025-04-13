let orderModel = require('../schemas/order');
let mongoose = require('mongoose');
let couponController = require('./coupon');
let cartModel = require('../schemas/cart');

module.exports = {
    CreateOrder: async function (userId, items, totalAmount, couponCode, shippingInfo) {
        try {
            let newOrder = new orderModel({
                user: userId,
                items,
                status: "Success",
                totalAmount: totalAmount,
                coupon: couponCode,
                shippingInfo: {
                    fullName: shippingInfo.fullName,
                    phoneNumber: shippingInfo.phoneNumber,
                    address: shippingInfo.address
                }
            });
            await newOrder.save();

            await cartModel.findOneAndDelete({ user: userId });

            return newOrder;
        } catch (error) {
            throw error;
        }
    },
    GetOrderDetails: async function (orderId) {
        return await orderModel.findById(orderId)
                               .populate('items.product', 'name price imageUrl')
                               .populate('user', 'username email');
    },
    GetAllOrders: async function () {
        return await orderModel.find({})
                               .populate('items.product', 'name price imageUrl')
                               .populate('user', 'username email')
                               .sort({ createdAt: -1 });
    }
};