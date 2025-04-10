let couponModel = require('../schemas/coupon');

module.exports = {
    CreateCoupon: async function(couponData) {
        let newCoupon = new couponModel(couponData);
        return await newCoupon.save();
    },

    GetAllCoupons: async function() {
        return await couponModel.find();
    },

    ValidateCoupon: async function(code) {
        let coupon = await couponModel.findOne({ code: code });

        if (!coupon) throw new Error('Invalid coupon');

        return coupon;
    },

    CalculateDiscount: async function(code) {
        let coupon = await this.ValidateCoupon(code);
        let discount = coupon.value;

        return { discount, coupon };
    },

    UpdateCouponValue: async function(code, newValue) {
        let coupon = await this.ValidateCoupon(code); // Reuse validation
        coupon.value = newValue;
        return await coupon.save();
    },
  
}; 