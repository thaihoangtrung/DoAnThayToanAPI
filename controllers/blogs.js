let blogModel = require('../schemas/blog');
let slugify = require('slugify');

module.exports = {
    GetAllBlogs: async function () {
        return await blogModel.find().populate('category');
    },
    CreateBlog: async function (title, content, category, imageUrl) {
        const slug = slugify(title, { lower: true });
        let newBlog = new blogModel({ 
            title, 
            slug, 
            content, 
            category, 
            imageUrl 
        });
        
        return await newBlog.save();
    },
    UpdateBlog: async function (id, body) {
        if (body.title) {
            body.slug = slugify(body.title, { lower: true });
        }
        return await blogModel.findByIdAndUpdate(id, body, { new: true });
    },
    DeleteBlog: async function (id) {
        return await blogModel.findByIdAndDelete(id);
    },
    GetBlogBySlug: async function (slug) {
        return await blogModel.findOne({ slug }).populate('category');
    }
}; 