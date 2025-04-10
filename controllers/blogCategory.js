var blogcategoryModel = require('../schemas/blogCategory')
module.exports = {
    GetAllBlogCategorys: async function(){
        return await blogcategoryModel.find()
    },
    CreateABlogCategory:async function(name){
       try {
        let newblogCategory = new blogcategoryModel({
            name:name
        })
        return await newblogCategory.save()
       } catch (error) {
        throw new Error(error.message)
       }
    },
    UpdateBlogCategory: async function(id, data) {
        try {
            let category = await blogcategoryModel.findById(id);
            if (!category) {
                throw new Error("Blog category not found");
            }

            // Update name field if provided
            if (data.name !== undefined) {
                category.name = data.name;
            }

            return await category.save();
        } catch (error) {
            // Handle potential duplicate name error if name is unique
            if (error.code === 11000 && error.keyPattern?.name) {
                 throw new Error("A blog category with this name already exists.");
            }
            throw new Error(error.message);
        }
    }
}