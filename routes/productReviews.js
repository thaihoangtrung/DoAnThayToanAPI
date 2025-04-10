const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/productReviews');
const { check_authentication } = require('../utils/check_auth');
const { CreateSuccessRes } = require('../utils/responseHandler');

router.post('/', check_authentication, async (req, res, next) => {
    try {
        const { productId, rating, comment } = req.body;
        const review = await reviewController.createReview(
            req.user._id,
            productId,
            rating,
            comment
        );
        CreateSuccessRes(res, review, 201);
    } catch (error) {
        next(error);
    }
});

module.exports = router; 