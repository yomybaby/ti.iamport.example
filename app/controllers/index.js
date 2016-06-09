
/*
여기 "가맹점 식별코드"는 iamport에서 제공하는 demo 가맹점 입니다.
이 예제는 inicis에 대한 데모입니다.
관련된 자세한 사용법은 http://www.iamport.kr/manual 을 참고하세요.

예제 코드를 그대로 실행하여 결제를 진행하더라도 당일내로 취소가 됩니다.
 */

var requestArgs = {
  pg : 'inicis', // version 1.1.0부터 지원.
  /*
      'kakao':카카오페이,
      'inicis':이니시스, 'html5_inicis':이니시스(웹표준결제),
      'nice':나이스,
      'jtnet':jtnet,
      'uplus':LG유플러스
  */
  pay_method : 'card', // 'card' : 신용카드 | 'trans' : 실시간계좌이체 | 'vbank' : 가상계좌 | 'phone' : 휴대폰소액결제
  merchant_uid : 'merchant_' + new Date().getTime(),
  name : '주문명:결제테스트',
  amount : 1000,
  buyer_email : 'iamport@siot.do',
  buyer_name : '구매자이름',
  buyer_tel : '010-1234-5678',
  buyer_addr : '서울특별시 강남구 삼성동',
  buyer_postcode : '123-456',
  app_scheme : 'iamporttest', //tiapp.xml에 지정해야함,
  // m_redirect_url : 'DO NOT SET THIS' //위젯애서 성공 실패를 판단하기 위해 이 url을 사용하므로 따로 지정하더라도 적용되지 않습니다.
};

$.IMP.init('imp20685811');

$.getView().addEventListener('open', function (e) {
  $.IMP.request_pay(requestArgs);
});

$.IMP.on('cancel',function (e) {
  var dialog = Ti.UI.createAlertDialog({
    title : '취소 혹은 에러',
    message: '확인을 누르면 새로운 결제를 시작합니다.\n\n받은 데이터 : '+JSON.stringify(e),
    buttonNames : ['확인']
  });
  dialog.addEventListener('click', function(e){
    $.IMP.request_pay(requestArgs);
  });
  dialog.show();
});

$.IMP.on('success',function (e) {
  var dialog = Ti.UI.createAlertDialog({
    title : '성공',
    message: '확인을 누르면 새로운 결제를 시작합니다.\n\n받은 데이터 : '+JSON.stringify(e),
    buttonNames : ['확인']
  });
  dialog.addEventListener('click', function(e){
    $.IMP.request_pay(requestArgs);
  });
  dialog.show();
});

$.index.open();
