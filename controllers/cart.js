let cartModel = require('../schemas/cart');

module.exports = {
    GetCart: async function (userId) {
        console.log("userId",userId);   
        return await cartModel.findOne({ user: userId }).populate('items.product');
    },
    AddToCart: async function (userId, productId, quantity) {
        let cart = await cartModel.findOneAndUpdate(
            { user: userId },
            { 
                $setOnInsert: { user: userId },
                $addToSet: { items: { product: productId, quantity } } 
            },
            { new: true, upsert: true }
        ).populate('items.product');
        return cart;
    },
    RemoveCartItem: async function (userId, itemId) {
        return await cartModel.findOneAndUpdate(
            { user: userId },
            { $pull: { items: { _id: itemId } } },
            { new: true }
        ).populate('items.product');
    },
    UpdateItemQuantity: async function (userId, itemId, quantity) {
        return await cartModel.findOneAndUpdate(
            { user: userId, "items._id": itemId },
            { $set: { "items.$.quantity": quantity } },
            { new: true }
        ).populate('items.product');
    }
}; 