var express = require('express');
var router = express.Router();
let productModel = require('../schemas/products')
let categoryModel = require('../schemas/category')
let {CreateErrorRes,
  CreateSuccessRes} = require('../utils/responseHandler')
  let slug = require('slugify')
  let multer = require('multer');
  let path = require('path');
let productController = require('../controllers/products');

let productImageDir = path.join(__dirname, '../blog_images');

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, productImageDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

let upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/image/)) {
            cb(new Error("Only image files are allowed."));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB limit
    }
});

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let products = await productModel.find({
    isDeleted:false
  }).populate("category")
  CreateSuccessRes(res,products,200);
});

router.get('/details/search', async function(req, res, next) {
  try {
    const searchTerm = req.query.q;
    if (!searchTerm) {
      return CreateErrorRes(res, 'Vui lòng nhập từ khóa tìm kiếm', 400);
    }

    const products = await productController.SearchProducts(searchTerm);
    return CreateSuccessRes(res, products || [], 200);
  } catch (error) {
    next(error);
  }
});


router.get('/details/:slug', async function(req, res, next) {
  try {
    const product = await productModel.findOne({ slug: req.params.slug })
      .populate('category')
      .populate('reviews');

    if (!product) {
      return CreateErrorRes(res, 'Product not found', 404);
    }

    CreateSuccessRes(res, product, 200);
  } catch (error) {
    next(error);
  }
});


router.get('/:id', async function(req, res, next) {
  try {
    let product = await productModel.findOne({
      _id:req.params.id, isDeleted:false
    }
    )
    CreateSuccessRes(res,product,200);
  } catch (error) {
    next(error)
  }
});

router.post('/', upload.single('image'), async function (req, res, next) {
    try {
        let body = req.body;
        let category = await categoryModel.findOne({
            _id: body.category
        });
        if (category) {
            let imageUrl = req.file ? `/blog_images/${req.file.filename}` : ""; 
            let newProduct = new productModel({
                name: body.name,
                price: body.price,
                quantity: body.quantity,
                category: category._id,
                slug: slug(body.name, { lower: true }),
                imageUrl: imageUrl 
            });
            await newProduct.save();
            CreateSuccessRes(res, newProduct, 200);
        } else {
            throw new Error("Category does not exist");
        }
    } catch (error) {
        next(error);
    }
});
router.put('/:id', async function(req, res, next) {
  let id = req.params.id;
  try {
    let body = req.body
    let updatedInfo = {};
    if(body.name){
      updatedInfo.name = body.name;
    }
    if(body.price){
      updatedInfo.price = body.price;
    }
    if(body.description){
      updatedInfo.description = body.description;
    }
    if(body.quantity){
      updatedInfo.quantity = body.quantity;
    }
    if(body.category){
      updatedInfo.category = body.category;
    }
    if(body.imageUrl){
      updatedInfo.imageUrl = body.imageUrl;
    }
    let updateProduct = await productModel.findByIdAndUpdate(
      id,updatedInfo,{new:true}
    )
    CreateSuccessRes(res,updateProduct,200);
  } catch (error) {
    next(error)
  }
});
router.delete('/:id', async function(req, res, next) {
  let id = req.params.id;
  try {
    let body = req.body
    let updateProduct = await productModel.findByIdAndUpdate(
      id,{
        isDeleted:true
      },{new:true}
    )
    CreateSuccessRes(res,updateProduct,200);
  } catch (error) {
    next(error)
  }
});

router.get('/export/csv', async function(req, res, next) {
  try {
    // Call the controller function to handle CSV export
    await productController.ExportProductsToCsv(res);
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
});

module.exports = router;