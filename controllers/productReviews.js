// Import product model ở đầu file
const productModel = require('../schemas/products');
const productReviewModel = require('../schemas/productReview'); // Giữ lại import này

module.exports = {
    createReview: async (userId, productId, rating, comment) => {
        // 1. Tạo và lưu review mới
        const newReview = new productReviewModel({
            user: userId,
            product: productId,
            rating,
            comment,
            // isVerified: true // Có thể xem xét logic này, có thể mặc định là false?
        });
        const savedReview = await newReview.save(); // Lưu review và lấy document đã lưu

        // 2. Cập nhật sản phẩm tương ứng
        try {
            // Sử dụng findByIdAndUpdate để tìm và cập nhật sản phẩm
            // $push: thêm ID của review mới vào mảng 'reviews'
            // $inc: tăng 'reviewCount' lên 1
            // (Tính toán averageRating phức tạp hơn, có thể làm sau hoặc dùng aggregate)
            await productModel.findByIdAndUpdate(
                productId,
                {
                    $push: { reviews: savedReview._id }, // Thêm ID review vào mảng
                    $inc: { reviewCount: 1 }           // Tăng số lượng review lên 1
                    // TODO: Cập nhật averageRating nếu cần
                },
                { new: true } 
            );

           
            const product = await productModel.findById(productId).populate('reviews');
            if (product && product.reviews.length > 0) {
                const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
                product.averageRating = totalRating / product.reviews.length;
                await product.save();
            }


        } catch (error) {
            console.error("Error updating product with new review:", error);
        }

        return savedReview;
    }
};

  // Kiểm tra user đã mua sản phẩm
        // const hasPurchased = await orderModel.exists({
        //     user: userId,
        //     status: "Success",
        //     "items.product": productId
        // });

        // if (!hasPurchased) {
        //     throw new Error('User chưa mua sản phẩm này');
        // }