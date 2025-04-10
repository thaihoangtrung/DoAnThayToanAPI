let mongoose = require('mongoose');

let blogCategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('blogCategory', blogCategorySchema); 