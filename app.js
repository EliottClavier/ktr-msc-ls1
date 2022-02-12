var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var profileRouter = require('./routes/profile');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var libraryRouter = require('./routes/library');
const fs = require("fs");

const DATA_PATH = "./data/";
const USERS_PATH = DATA_PATH + "users/";
const BUSINESS_CARDS_PATH = DATA_PATH + "business-cards/";

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/profile', profileRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/library', libraryRouter);

// Create folders for persisting datas
if (!fs.existsSync(DATA_PATH)){
  fs.mkdirSync(DATA_PATH);
}
if (!fs.existsSync(USERS_PATH)){
  fs.mkdirSync(USERS_PATH);
}
if (!fs.existsSync(BUSINESS_CARDS_PATH)){
  fs.mkdirSync(BUSINESS_CARDS_PATH);
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
