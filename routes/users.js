const { request } = require('express');
var express = require('express');
var router = express.Router();
var model = require('../model/mulpangDao');
var MyUtil = require('../utils/myutil');
var checkLogin = require('../middleware/checklogin');
var MyError = require('../errors');

// 회원 가입 화면
router.get('/new', function(req, res, next) {
  res.render('join', {title: '회원 가입', js: 'join.js'});
});
// 프로필 이미지 업로드
var path = require('path');
var tmp = path.join(__dirname, '..', 'public', 'tmp');
var multer = require('multer');

router.post('/profileUpload', multer({dest: tmp}).single('profile'), function(req, res, next) {
  console.log(req.file);
  res.end(req.file.filename);   // 임시 파일명 응답
});

var bcrypt = require('bcryptjs');

// 회원 가입 요청
router.post('/new', function(req, res, next) {
  req.body.password = bcrypt.hashSync(req.body.password, 8); //8번변환시켜 salt값을 가져온다 (암호화)
  model.registMember(req.body, function(err, result){
    if(err){
      next(err);
      // res.json({errors: err});
    }else{
      res.end('success');
    }
  });
});
// 간편 로그인

router.post('/simpleLogin', function(req, res, next) {
  //해시값이랑 입력값이랑 비교해서 맞는지 아닌지 확인하는 작업 ..
  model.getUser(req.body._id, function(err, user){
    if(err){
      next(err);
    }else{
      if(bcrypt.compare(req.body.password, user.password)){
        req.session.user = user;
        delete user.password;
        res.json(user);
       }else{
         next(MyError.LOGIN_FAIL);
       }
    }
  });
  // model.login(req.body, function(err, user){
  //   if(err){
  //     next(err);
  //     // res.json({errors: err});
  //   }else{
  //     req.session.user = user;
  //     res.json(user);
  //   }
  // });
});
// 로그아웃
router.get('/logout', function(req, res, next) {
  req.session.destroy();

  res.redirect('/');
});
// 로그인 화면
router.get('/login', function(req, res, next) {
  res.render('login', {title: '로그인'});
});
// 로그인
router.post('/login', function(req, res, next) {
  model.login(req.body, function(err, user){
    if(err){
      res.render('login', {title:'로그인', errors: err});
    }else{
      req.session.user = user;
      res.redirect(req.session.backurl || '/');
    }
  });
});
// 마이 페이지
router.get('/', checkLogin, function(req, res, next) {
  var userid = req.session.user._id;
  model.getMember(userid, function(data){
    res.render('mypage', {title: '마이페이지', css: 'mypage.css', js: 'mypage.js', purchase: data, toStar: MyUtil.toStar});
  });
});
// 회원 정보 수정
router.put('/', checkLogin, function(req, res, next) {
  var userid = req.session.user._id;
  model.updateMember(userid, req.body, function(err, result){
    if(err){
      next(err);
      // res.json({errors: err});
    }else{
      res.end('success');
    }
  });
});
// 구매 후기 등록
router.post('/epilogue', checkLogin, function(req, res, next) {
  var userid = req.session.user._id;
  model.insertEpilogue(userid, req.body, function(err, result){
    if(err){
      next(err);
      // res.json({errors: err});
    }else{
      res.end('success');
    }
  });
});

module.exports = router;
