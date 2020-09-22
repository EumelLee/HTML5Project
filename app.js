var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //정적인 컨텐츠를 어디에 둘건가 다들 퍼블릭 아래에 .. 


//app.use(logger('combined')); //좀 더 디테일한 로그가 보고 싶을 때 ..
app.use(logger('dev'));
app.use('/', indexRouter); //이제 라우터가 받는다 .. 인덱스와 유저 ....
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404, req.url + 'Not Found!'));
});

// error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
