var express = require('express');
var router = express.Router();
var blogController = require('../controllers/blogs');
let { CreateSuccessRes, CreateErrorRes } = require('../utils/responseHandler');
let multer = require('multer');
let path = require('path');
let slugify = require('slugify');

let blogImageDir = path.join(__dirname, '../blog_images');

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, blogImageDir),
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

router.get('/', async function (req, res, next) {
    try {
        let blogs = await blogController.GetAllBlogs();
        CreateSuccessRes(res, blogs, 200);
    } catch (error) {
        next(error);
    }
});

router.get('/slug/:slug', async function (req, res, next) {
    try {
        let blog = await blogController.GetBlogBySlug(req.params.slug);
        if (!blog) {
            return CreateErrorRes(res, 'Blog not found', 404);
        }
        CreateSuccessRes(res, blog, 200);
    } catch (error) {
        next(error);
    }
});

router.post('/', upload.single('image'), async function (req, res, next) {
    try {
        let { title, content, category } = req.body;
        let imageUrl = req.file ? `/blog_images/${req.file.filename}` : ""; // Get image URL
        let newBlog = await blogController.CreateBlog(title, content, category, imageUrl);
        CreateSuccessRes(res, newBlog, 201);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', async function (req, res, next) {
    try {
        let updatedBlog = await blogController.UpdateBlog(req.params.id, req.body);
        CreateSuccessRes(res, updatedBlog, 200);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async function (req, res, next) {
    try {
        await blogController.DeleteBlog(req.params.id);
        CreateSuccessRes(res, { message: 'Blog deleted' }, 200);
    } catch (error) {
        next(error);
    }
});


module.exports = router; 