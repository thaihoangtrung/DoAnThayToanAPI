var express = require('express');
var router = express.Router();
var blogcategoryController = require('../controllers/blogCategory')
let {CreateErrorRes,CreateSuccessRes} = require('../utils/responseHandler')

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

router.put('/:id', async function(req, res, next) {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!updateData || Object.keys(updateData).length === 0) {
             return CreateErrorRes(res, "Update data (name or description) is required", 400);
        }

        let updatedCategory = await blogcategoryController.UpdateBlogCategory(id, updateData);
        CreateSuccessRes(res, updatedCategory, 200);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
