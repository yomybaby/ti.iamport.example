# Titanium 결제 Alloy Widget (iamport를 이용한 PG사 연동)

> 더 상세히 사용법을 추가하도록 하겠습니다.

## iamport란?
- 복잡한 PG사 연동 문제를 쉽게 풀어주는 개발자를 위한 무료 결제연동 서비스
- http://iamport.kr

## 사용법
### 설치
설치는 타이타늄 패키지 매니저에 해당하는 [gitt.io](http://gitt.io)를 이용하면 편리합니다. gitt.io가 처음이라면 `npm install -g gittio`로 `gittio` cli를 설치하세요.
- `/app/widgets/kr.yostudio.iamport` 위젯 설치
 
    ```
    $ gittio install kr.yostudio.iamport
    ```
- [yomybaby/ti.intent.parseuri](https://github.com/yomybaby/ti.intent.parseuri/tree/master/android/dist) 모듈 설치

    ```
    $ gittio install ti.intent.parseuri
    ```
- WebView에 추가 예정인 `blacklistedURLs` 속성을 사용해야합니다. 5.4.0 버전에 추가 예정이며 현재는 별도로 수정된 sdk를 사용해야합니다.

    ```
    ti sdk install https://github.com/yomybaby/ti.iamport.example/raw/master/tisdk/mobilesdk-5.2.2.GA_webview_blacklist-osx.zip
    ```
- iOS의 경우 iOS9 부터 url Scheme에 대한 보안정책 변경으로 `tiapp.xml`의 plist 부준에 'ispmobile'을 추가해줘야합니다. isp관련해서 특징이 있어 iOS에서는 `ispmobile://` 주소만 따로 처리합니다. ( [tiapp.xml](https://github.com/yomybaby/ti.iamport.example/blob/master/tiapp.xml#L40) 참고)
    
### 사용 예
```javascript
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
```


### 주의 사항
- 여기 "가맹점 식별코드"는 iamport에서 제공하는 demo 가맹점 입니다.
- 이 예제는 inicis에 대한 데모입니다.
- 관련된 자세한 사용법은 http://www.iamport.kr/manual 을 참고하세요.
- 예제 코드를 그대로 실행하여 결제를 진행하더라도 당일내로 취소가 됩니다.
