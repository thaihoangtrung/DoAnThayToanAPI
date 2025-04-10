let mongoose = require('mongoose');
let productSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    quantity:{
        type:Number,
        default:0,
        required:true,
        min:0
    },
    description:{
        type:String,
        default:"",
    },
    urlImg:{
        type:String,
        default:"",
    },
    category:{
        type:mongoose.Types.ObjectId,
        ref:'category',
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    slug:String,
    reviews: [{
        type: mongoose.Types.ObjectId,
        ref: 'productReview'
      }],
    imageUrl: {
        type: String,
        default: "",
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    }
},{
    timestamps:true
})
module.exports = mongoose.model('product',productSchema)
// products