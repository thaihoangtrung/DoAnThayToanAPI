let mongoose = require('mongoose');

let blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    content: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'blogCategory',
        required: true,
    },
    imageUrl: {
        type: String,
        default: "",
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('blog', blogSchema); 