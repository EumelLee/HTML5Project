$(function(){
	setCancelEvent();
	setBuyEvent();
	setPriceEvent();	
});

// 취소 버튼 클릭
function setCancelEvent(){
  $('form button[type = reset]').on('click', function(){
    window.history.back();
  });
}

// 구매 버튼 클릭
function setBuyEvent(){
	$('.detail form').on('submit', function(){
    //form 내부 모든 입력요소 query string으로 반환
    var body = $(this).serialize();
    $.ajax('/purchase', {
      method : 'post', //새로운컨텐츠 등록 post, 보는게 목적이면 get, 통체로 교체 update , 일부는 patch
      data: body,
      success : function(result){
        if(result.errors){
          alert(result.errors.message);
        }else{
          alert('쿠폰 구매가 완료되었습니다.');
          location.href = '/';  // main페이지로 이동
        }
      }
    });

    return false; // 이벤트를 취소 form 의 submit동작 취소
  });
}

// 구매수량 수정시 결제가격 계산
function setPriceEvent(){
  $('input[name=quantity]').on('change', function(){
    $('ouput[name=totalPrice]').text($(this).val()*$('form input[name=unitPrice]').val());
  });
	
}