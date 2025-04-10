var express = require('express');
var router = express.Router();
var cartController = require('../controllers/cart');
let { CreateSuccessRes, CreateErrorRes } = require('../utils/responseHandler');
let { check_authentication } = require('../utils/check_auth');

router.get('/', check_authentication, async function (req, res, next) {
    try {
        console.log("req.user",req.user);   
        let cart = await cartController.GetCart(req.user._id);
        CreateSuccessRes(res, cart, 200);
    } catch (error) {
        next(error);
    }
});

router.post('/', check_authentication, async function (req, res, next) {
    try {
        let { productId, quantity } = req.body;
        let cart = await cartController.AddToCart(req.user._id, productId, quantity);
        CreateSuccessRes(res, cart, 200);
    } catch (error) {
        next(error);
    }
});

router.delete('/remove', check_authentication, async function (req, res, next) {
    try {
        let { itemId } = req.body;
        if (!itemId) {
            return CreateErrorRes(res, 'Thông tin không hợp lệ', 400);
        }
        
        let cart = await cartController.RemoveCartItem(req.user._id, itemId);
        CreateSuccessRes(res, cart, 200);
    } catch (error) {
        next(error);
    }
});

router.put('/update', check_authentication, async function (req, res, next) {
    try {
        let { itemId, quantity } = req.body;
        if (!itemId || !quantity || quantity < 1) {
            return CreateErrorRes(res, 'Thông tin không hợp lệ', 400);
        }
        
        let cart = await cartController.UpdateItemQuantity(req.user._id, itemId, quantity);
        CreateSuccessRes(res, cart, 200);
    } catch (error) {
        next(error);
    }
});

module.exports = router; 