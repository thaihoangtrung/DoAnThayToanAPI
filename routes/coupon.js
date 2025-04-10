var express = require('express');
var router = express.Router();
var couponController = require('../controllers/coupon');
let { CreateSuccessRes } = require('../utils/responseHandler');
let { check_authentication, check_authorization } = require('../utils/check_auth');
let constants = require('../utils/constants');

// Create coupon (Admin only)
router.post('/', 
    async function(req, res, next) {
        try {
            let newCoupon = await couponController.CreateCoupon(req.body);
            CreateSuccessRes(res, newCoupon, 201);
        } catch (error) {
            next(error);
        }
    }
);

// Validate and calculate discount
router.post('/validate', async function(req, res, next) {
    try {
        let { code } = req.body;
        let result = await couponController.CalculateDiscount(code);
        CreateSuccessRes(res, result, 200);
    } catch (error) {
        next(error);
    }
});

// Add a new route to get all coupons
router.get('/', async function(req, res, next) {
  try {
    let coupons = await couponController.GetAllCoupons();
    CreateSuccessRes(res, coupons, 200);
  } catch (error) {
    next(error);
  }
});

// Update coupon value (Admin only)
router.put('/update/:code',
    async function(req, res, next) {
        try {
            const { code } = req.params;
            const { value } = req.body;
            if (value === undefined) {
                throw new Error('New value is required');
            }
            let updatedCoupon = await couponController.UpdateCouponValue(code, value);
            CreateSuccessRes(res, updatedCoupon, 200);
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router; 