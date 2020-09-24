var common = {
  //카트관련
  cart: {},
  //로그인관련
  login: {}
};

$(function(){
	common.cart.showCart();
});

// 관심쿠폰을 보여준다.
common.cart.showCart = function(){
  var cartList = $('#cart > ul').empty();
  var cart = localStorage.getItem('cart');

  if(cart){
    cart = JSON.parse(cart);
    //객체가 갖고있는 모든 속성만큼 반복하고 싶을때 for-in
    for(var couponId in cart){
      if(couponId != 'length'){
        var coupon = cart[couponId];
        var cartElement = '<li data-couponid="' + couponId + '"><a href="/coupons/' + couponId + '"><img src="' + coupon.img + '" alt="' + coupon.name + '"></a><button class="cart_close">관심쿠폰 삭제</button></li>';      
        cartList.append(cartElement);
      }
    }
    //쿠폰 개수 보여주고 .. 
    $('.interest_cnt').text(cart.length);
    common.cart.setRemoveCartEvent();
    
    if(window.Notification.permission == 'granted'){
      common.cart.requestQuantity();
    }
    // common.cart.requestQuantity();
  }
};

// 관심쿠폰 삭제 이벤트
common.cart.setRemoveCartEvent = function(){
	$('#cart .cart_close').click(function(){
		var cart = JSON.parse(localStorage.getItem('cart'));
		var couponId = $(this).parent().data('couponid');
		delete cart[couponId];
		cart.length--;
		localStorage.setItem('cart', JSON.stringify(cart));
		common.cart.showCart();
	});
};

// 관심쿠폰의 남은 수량을 받아서 10개 미만일 경우 알림 메세지를 보여준다.
common.cart.es = null;
//서버의 폴링작업 시작..
common.cart.requestQuantity = function(){
  if(common.cart.es) common.cart.es.close();
  var cart = localStorage.getItem('cart');
  if(cart){
    cart = JSON.parse(cart);
    if(cart.length == 0) return;
    
    var couponIdList = [];
    for(var couponId in cart){
      if(couponId != 'length'){
        couponIdList.push(couponId);
      }
    };
    
    // SSE 요청 시작
    common.cart.es = new EventSource('/couponQuantity?couponIdList=' + couponIdList);
    common.cart.es.onmessage = function(me){
      var data = JSON.parse(me.data);
      data.forEach(function(coupon){
        var cartCoupon = cart[coupon._id];
        var count = coupon.quantity - coupon.buyQuantity;
        if(count < cartCoupon.noti && count > 0){
          var msg = cartCoupon.name + ' 수량이 ' + count + '개 밖에 남지 않았습니다.';
          common.cart.showNoti({
            //count추가해주면 계속 알림 뜨게 할수있음 다 다른 태그로 인식해서 /tag가 메세지 식별하는 id역할을 함 
            tag: coupon._id+count,
            icon: cartCoupon.img,
            body: msg
          });
          cartCoupon.noti = count;
          localStorage.setItem('cart', JSON.stringify(cart));
        }
      });
    };
  }
};

// 바탕화면 알림 서비스를 보여준다.
common.cart.showNoti = function(noti){	
  // console.log(noti);
  var notify = new Notification('마감임박!!!', noti);
  notify.onclick = function(){
    notify.close();
    window.open('/coupons/' + noti.tag, '_black');
  };
};



$(function(){
	common.login.setLoginEvent();
});

// 로그인 이벤트 등록
common.login.setLoginEvent = function(){
  $('#simple_login').submit(function(){
    $.ajax({
      url: '/users/simpleLogin',
      method: 'post',
      data: $(this).serialize(),
      success: function(result){
        if(result.errors){
          alert(result.errors.message);
        }else{
          alert('로그인 되었습니다.');
          location.reload();
        }
      }
    });
    return false;
  });
  
};
