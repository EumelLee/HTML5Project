var MyError = require('../errors');

function requireLogin(req, res, next){
  if(req.session.user){
    next();
  }else{
    //xhr로 대체가능
    if(req.xhr){
      res.json(MyError.LOGIN_NEED);
      // res.json({errors: {message: '로그인이 필요한 서비스입니다.'}});
    }else{
      req.session.backurl = req.originalUrl;
      res.redirect('/users/login');
    }
  }
}
module.exports = requireLogin;