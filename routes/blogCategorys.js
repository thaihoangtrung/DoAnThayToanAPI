var express = require('express');
var router = express.Router();
var blogcategoryController = require('../controllers/blogCategory')
let {CreateErrorRes,CreateSuccessRes} = require('../utils/responseHandler')

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let blogcategorys = await blogcategoryController.GetAllBlogCategorys();
  CreateSuccessRes(res,blogcategorys,200);
});

router.post('/', async function(req, res, next) {
 try {
    let newblogCategorys = await blogcategoryController.CreateABlogCategory(req.body.name);
    CreateSuccessRes(res,newblogCategorys,200);
 } catch (error) {
    next(error)
 }
});

// Update Blog Category
router.put('/:id', async function(req, res, next) {
    try {
        const { id } = req.params;
        const updateData = req.body; // Contains name and/or description

        // Basic validation: Check if updateData is provided and not empty
        if (!updateData || Object.keys(updateData).length === 0) {
             // Use CreateErrorRes for sending client-side errors
             return CreateErrorRes(res, "Update data (name or description) is required", 400);
        }

        let updatedCategory = await blogcategoryController.UpdateBlogCategory(id, updateData);
        CreateSuccessRes(res, updatedCategory, 200);
    } catch (error) {
        // Pass controller/database errors to the central error handler
        next(error);
    }
});

module.exports = router;
