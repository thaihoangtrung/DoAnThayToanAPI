let productModel = require('../schemas/products');
let categoryModel = require('../schemas/category');
let slug = require('slugify');
const csv = require('fast-csv');

module.exports = {
    GetAllProducts: async function () {
        return await productModel.find({ isDeleted: false }).populate("category");
    },
    CreateProduct: async function (name, price, quantity, category, imageUrl) { // Accept imageUrl
        let newProduct = new productModel({
            name,
            price,
            quantity,
            category,
            slug: slug(name, { lower: true }),
            imageUrl // Save imageUrl
        });
        return await newProduct.save();
    },
    UpdateProduct: async function (id, body) {
        return await productModel.findByIdAndUpdate(id, body, { new: true });
    },
    DeleteProduct: async function (id) {
        return await productModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    },
    SearchProducts: async function(searchTerm) {
        return await productModel.find({
            name: { $regex: searchTerm, $options: 'i' },
            isDeleted: false
        });
    },
    ExportProductsToCsv: async function (res) {
        const products = await this.GetAllProducts();

        const filename = `products_export_${Date.now()}.csv`;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        const csvStream = csv.format({ headers: true });
        csvStream.pipe(res);

        products.forEach(product => {
            csvStream.write({
                ID: product._id,
                Name: product.name,
                Price: product.price,
                Quantity: product.quantity,
                Category: product.category ? product.category.name : 'N/A',
                ImageUrl: product.imageUrl,
                Slug: product.slug,
                AverageRating: product.averageRating,
                ReviewCount: product.reviewCount,
                CreatedAt: product.createdAt,
                UpdatedAt: product.updatedAt
            });
        });

        csvStream.end();
    }
}; 