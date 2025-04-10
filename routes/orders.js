var express = require('express');
var router = express.Router();
var orderController = require('../controllers/orders');
let { CreateSuccessRes, CreateErrorRes } = require('../utils/responseHandler');
let { check_authentication, check_authorization } = require('../utils/check_auth');
let constants = require('../utils/constants');

router.post('/', check_authentication, async function (req, res, next) {
    try {
        let { items, totalAmount, couponCode, shippingInfo } = req.body;
        
        let newOrder = await orderController.CreateOrder(
            req.user._id, 
            items, 
            totalAmount, 
            couponCode,
            shippingInfo
        );
        CreateSuccessRes(res, newOrder, 201);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', check_authentication, async function (req, res, next) {
    try {
        let order = await orderController.GetOrderDetails(req.params.id);
        CreateSuccessRes(res, order, 200);
    } catch (error) {
        next(error);
    }
});

router.get('/', 
    check_authentication, 
    check_authorization(constants.ADMIN_PERMISSION), 
    async function (req, res, next) {
    try {
        let orders = await orderController.GetAllOrders();
        CreateSuccessRes(res, orders, 200);
    } catch (error) {
        next(error);
    }
});

module.exports = router;