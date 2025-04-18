var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
let cors = require('cors')
let {CreateErrorRes} = require('./utils/responseHandler')

var app = express();
app.use(cors({
  origin:'*'
}))

mongoose.connect("mongodb://localhost:27017/S5");
mongoose.connection.on('connected',()=>{
  console.log("connected mongoDb");
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("NNPTUD"));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/blog_images', express.static(path.join(__dirname, 'blog_images')));
app.use('/avatar', express.static(path.join(__dirname, 'avatar')));
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/roles', require('./routes/roles'));
app.use('/blogcategorys', require('./routes/blogCategorys'));
app.use('/menus', require('./routes/menus'));
app.use('/auth', require('./routes/auth'));
app.use('/products', require('./routes/products'));
app.use('/categories', require('./routes/categories'));
app.use('/blogs', require('./routes/blogs'));
app.use('/coupon', require('./routes/coupon'));
app.use('/cart', require('./routes/cart'));
app.use('/orders', require('./routes/orders'));
app.use('/contacts', require('./routes/contact'));
app.use('/reviews', require('./routes/productReviews'));
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  CreateErrorRes(res,err.message,err.status||500);
});

module.exports = app;
