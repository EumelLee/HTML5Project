const { request } = require('express');
var express = require('express');
var router = express.Router();

var model = require('../model/mulpangDao');

var MyUtil = require('../utils/myutil');
var checkLogin = require('../middleware/checklogin');

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: '멀팡' });
  res.redirect('/today');
});

//오늘 메뉴 
router.get('/today', function(req, res, next) {
  //주소창에 쿼리스트링으로 페이지가 넘어오면 int값으로 바궈주고 없으면 디폴트ㅡ페이지로..
  if(req.query.page){
    req.query.page = parseInt(req.query.page);
  }else{
    req.query.page = 1;
    if(req.query.date){ req.url += '&page=1'; }else{ req.url += '?page=1';}
  }

  model.couponList(req.query,function(list){
    list.page = {};
     if(req.query.page > 1){
       list.page.pre = req.url.replace(`page=${req.query.page}`, `page=${req.query.page-1}`);
     }
     if(req.query.page < list.totalPage){
       list.page.next = req.url.replace(`page=${req.query.page}`, `page=${req.query.page+1}`);
     }


    
    res.render('today', { title: '오늘의 쿠폰', list, css: 'today.css', query: req.query , options: MyUtil.generateOptions});

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
router.get('/purchase/:_id', checkLogin, function(req, res, next) {
  var _id = req.params._id;
  model.buyCouponForm(_id, function(coupon){
    //ejs맞춰서 적어줌 'buy'
    res.render('buy', { title: coupon.couponName, coupon,  css:'detail.css', js: 'buy.js' });

  });
});

//쿠폰 구매 d
router.post('/purchase',checkLogin,  function(req, res, next) {
  req.body.userid = req.session.user._id;
  model.buyCoupon(req.body, function(err, result){ //post방식이라 req.body
    if(err){
      // res.json({errors: err});
      next(err); //모든 미들웨어 건너뛰고 에러 처리하는 미들웨어가 호출된다
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
    res.render('all', { title: '모든 쿠폰', list, css: 'all.css', query: req.query , options: MyUtil.generateOptions});
  });
});
// 쿠폰 남은 수량 조회
router.get('/couponQuantity', function(req, res, next){
  model.couponQuantity(req.query.couponIdList.split(','), function(list){
   //Server-Sent Events 형식의 응답
    res.contentType('text/event-stream');
    //res.write('data');
    res.write('data:' + JSON.stringify(list)+'\n');
    res.write('retry:10000\n');
    res.end('\n');
  });
});


//restful 방식으로 다 등록해줘서 더이상 필요 없음
// router.get('/*.html', function(req, res, next) {

//   // /todya.html - > today 로 바꿔줌
//   //today.ejs찾아서 브라우저에게 응답해라
//   var url = req.url.substring(1,req.url.indexOf('.html'));
//   res.render(url, { title: '오늘은 뭘파니?' });
// });

module.exports = router;
