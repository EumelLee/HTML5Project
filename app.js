var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//미들웨어
/**
 * express의 미들웨어를 만드는 방법
 * 1. (err),req, res, next 인자로 전달받는 함수 작성해서 app.use()에 등록
 * 2. 미들웨어가 할 기능 구현
 * 3. 다음 둘중 하나의 작업으로 끝나야 한다.
 * - res로 클라이언트에 응답 전송
 * - 등록된 다음 미들웨어를 호출한다.(next())
 * 
 */

app.use('/test', function(req,res,next){
  console.log('body', req.body);
  console.log('cookies', req.cookies);
  console.log('session', req.session);
  next(); // 등록된 다음 미들웨어가 이어서 호출된다 
});



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //정적인 컨텐츠를 어디에 둘건가 다들 퍼블릭 아래에 .. 



//app.use(logger('combined')); //좀 더 디테일한 로그가 보고 싶을 때 ..
app.use(logger('dev'));

//static과 라우터 사이에 세션을 둔다

// "/couponQuantity"로 시작하지 않는 url에 세션 사용 , 쿠폰퀀티티로 시작하지 않는 url일 경우 .. 
app.use(/^((?!\/couponQuantity).)*$/, session({
  cookie: {maxAge: 1000*60*30},// 30분
  secret: 'some seed text',
  rolling: true,  // 매 요청마다 세션 갱신
  resave: false,   // 세션이 수정되지 않으면 서버에 다시 저장하지 않음
  saveUninitialized: false  // 세션에 아무 값도 지정되지 않으면 클라이언트에 전송안함
}), function(req, res, next){
  // ejs 렌더링에 사용할 변수 지정
  res.locals.user = req.session.user;
  next();
});


app.use('/test', function(req,res,next){
  console.log('body', req.body);
  console.log('cookies', req.cookies);
  console.log('session', req.session);
  next(); // 등록된 다음 미들웨어가 이어서 호출된다 
});


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
