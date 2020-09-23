const { request } = require('express');
var express = require('express');
var router = express.Router();

var model = require('../model/mulpangDao');

var MyUtil = require('../utils/myutil');

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: '멀팡' });
  res.redirect('/today');
});

//오늘 메뉴 
router.get('/today', function(req, res, next) {
  model.couponList(req.query,function(list){
    res.render('today', { title: '오늘의 쿠폰', list, css: 'today.css' });

  });
});

//쿠폰 상세 조회  값 : 콜론으로 
router.get('/coupons/:_id', function(req, res, next) {
  var _id = req.params._id;
  //쿠폰디테일에서 첫번째 인자값 소켓 io로 바꿔줌
  model.couponDetail(req.app.get('io'), _id, function(coupon){
    //coupon : coupon 같으면 생략이 가능하다 
    res.render('detail', { title: coupon.couponName, coupon , toStar: MyUtil.toStar, css:'detail.css', js: 'detail.js' });

  });
});

//쿠폰 구매 화면
router.get('/purchase/:_id', function(req, res, next) {
  var _id = req.params._id;
  model.buyCouponForm(_id, function(coupon){
    //ejs맞춰서 적어줌 'buy'
    res.render('buy', { title: coupon.couponName, coupon,  css:'detail.css', js: 'buy.js' });

  });
});

//쿠폰 구매 화면
router.post('/purchase', function(req, res, next) {
  model.buyCoupon(req.body, function(err, result){ //post방식이라 req.body
    if(err){
      res.json({errors: err});
    }else{
      res.end('success');
    }
  });
});

// 근처 메뉴
router.get('/location', function(req, res, next){
  model.couponList(null, function(list){
    res.render('location', {title: '근처 쿠폰', css: 'location.css', js: 'location.js', list});
  });

 
});
// 추천 메뉴
router.get('/best', function(req, res, next){
  res.render('best', {title: '추천 쿠폰', css: 'best.css', js: 'best.js'});
});
// top5 쿠폰 조회
router.get('/topCoupon', function(req, res, next){
  //get : req.query, 나머지 body
  model.topCoupon(req.query.condition, function(list){
    res.json(list); //문자열로 바꾸고 다시 배열로 바꾸는 작업 필요없음 .. 
  });
});
// 모두 메뉴
router.get('/all', function(req, res, next){
  model.couponList(req.query,function(list){
    res.render('all', { title: '모든 쿠폰', list, css: 'all.css' });
  });
});
// 쿠폰 남은 수량 조회
router.get('/couponQuantity', function(req, res, next){
  res.end('success');
});


//restful 방식으로 다 등록해줘서 더이상 필요 없음
// router.get('/*.html', function(req, res, next) {

//   // /todya.html - > today 로 바꿔줌
//   //today.ejs찾아서 브라우저에게 응답해라
//   var url = req.url.substring(1,req.url.indexOf('.html'));
//   res.render(url, { title: '오늘은 뭘파니?' });
// });

module.exports = router;
