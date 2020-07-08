const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');

const flash = require('connect-flash');
const passport = require('passport');
const methodOverride = require('method-override');

require('dotenv').config();

const Category = require('./routes/admin/categories/models/Category');
const getAllCategories = require('./routes/admin/categories/middleware/getAllCategories');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users/usersRoutes');
const adminRouter = require('./routes/admin/adminRoutes');
const productRouter = require('./routes/admin/products/productRoutes');

const app = express();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(`MongoDB Error: ${err}`));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   Category.find({}, (err, categories) => {
//     if (err) return next(err);
//     res.locals.categories = categories;
//     next();
//   });
// });
app.use(getAllCategories);

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
      url: process.env.MONGODB_URI,
      mongooseConnection: mongoose.connection,
      autoReconnect: true
    }),
    cookie: { maxAge: 60 * 60 * 1000 }
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.errors = req.flash('errors');
  res.locals.perrors = req.flash('perrors');
  res.locals.messages = req.flash('messages');
  res.locals.success = req.flash('success');
  next();
});

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/admin', adminRouter);
app.use('/api/products', productRouter);

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
