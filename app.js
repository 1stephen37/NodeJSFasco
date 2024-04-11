const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const vouchersRouter = require('./routes/vouchers')
const ordersRouter = require('./routes/orders');
const order_detailsRouter = require('./routes/order_detail');
const deliveryRouter = require('./routes/delivery');


// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/images/products');
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   }
// });

// const upload = multer({ storage });

const mongoose = require('mongoose');
require('./models/categoryModel');
require('./models/productModel');

mongoose.connect('mongodb://localhost:27017/fasco')
    .then(() => console.log('>>>>>>>>>> DB Connected!!!!!!'))
    .catch(err => console.log('>>>>>>>>> DB Error: ', err));

const app = express();



app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/vouchers', vouchersRouter);
app.use('/orders', ordersRouter);
app.use('/order_details', order_detailsRouter);
app.use('/deliveries', deliveryRouter);

const { upload} = require('./libaries/uploadMiddleware.js')

app.get('/form', (req, res, next) => {
    res.render('form');
})

app.post('/form', upload.any(), (req, res, next) => {
    return res.send(`
        post successfully
    `)
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
