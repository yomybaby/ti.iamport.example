var XCallbackURL = require(WPATH('XCallbackURL'));

var memberId;

// interface
$.init = init;
$.request_pay = request_pay;
$.reload = reload;
$.cancel = cancel;

// 주의 : 버그로 반드시 tss가 아닌 js에서 지정해야 함 https://jira.appcelerator.org/browse/ALOY-1503
$.webView.blacklistedURLs = (OS_IOS)?['ispmobile://','yostudioiamport://']:['intent://','ispmobile://','market://','yostudioiamport://'];
//functions
function init(id) {
	memberId = id;
}

function request_pay(args){
	// m_redirect_url 덮어쓰기
	args.m_redirect_url = 'yostudioiamport://info'
	var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, WPATH('/index.html'));
	var htmlText = file.read().text;
	htmlText = htmlText.replace('{__memberId__}',memberId);
	htmlText = htmlText.replace('{__payArgs__}',JSON.stringify(args));
	$.webView.html=htmlText;
	console.log(htmlText);
	$.aIndicator.show();
}

function reload(){
	$.webView.reload();
}

function cancel(data) {
	$.trigger('cancel',data);
}

function _success(data){
	$.trigger('success',data);
}

// webview handlers
function onBeforeload(e){
	console.log('beforeload', e.url);
}

$.webView.addEventListener('load',function (e) {
	setTimeout(function () {
		try {
			$.aIndicator.hide();
		} catch (e) {
		}
	}, 1000);
});



function onBlack(e){
	console.log('WEBVIEW stopBlackListedURLs : ', e.url);
	
	// 성공 혹은 실패에 따른 redirect를 잡아서 widget의 이벤트로 처리
	if(e.url.indexOf('yostudioiamport://') == 0){
		var URL = XCallbackURL.parse(decodeURIComponent(e.url));
		var resultObj = URL.params();
		if(resultObj.imp_success){
			_success(resultObj);
		}else{
			$.cancel(resultObj);
		}
		Ti.API.debug(JSON.stringify(URL.params()));
		return;
	}
	
	if(OS_IOS){
		if(e.url.indexOf('ispmobile')==0){
			if(!Ti.Platform.canOpenURL(e.url)){
				Ti.UI.setBackgroundColor('white');
				
				var dialog = Ti.UI.createAlertDialog({
			    message: '모바일 ISP가 설치되어 있지 않아\nApp Store로 이동합니다. 설치 후 다시 시도해주세요.'
			  });
				dialog.addEventListener('click', function (e) {
					Ti.Platform.openURL("https://itunes.apple.com/app/mobail-gyeolje-isp/id369125087?mt=8");
					$.cancel(); // 처음 부터 다시 시도해야하므로 닫음
				});
			  dialog.show();
			}else{
				Ti.Platform.openURL(e.url);
			}
		}
	}
		
	/*
	Android 절차
	- startActivity 로 인텐트 실행해보고
	- 에러나면
		- ispmobile:// 이면 alert 보여주고 (설치로보내는)
		- intent:// 이면 해당 App의 마켓 검색 결과로 보냄 (market 실행도 activity로..)
	 */
	if (OS_ANDROID) {
		var parsedUri = require('ti.intent.parseuri').parseUri(e.url);
    try {
      Ti.API.info('Trying to Launch via Intent');
      var intent = Ti.Android.createIntent({
          action: Ti.Android.ACTION_VIEW,
          data: parsedUri.data
      });
      Ti.Android.currentActivity.startActivity(intent);
    } catch (tryError) {
      Ti.API.info('Caught Error launching intent: ' + tryError);
			
			if(e.url.indexOf('ispmobile://')==0){ //ISP 일경우
				console.log('URL starts with ispmobile://, but fail with itent'); 
				var dialog = Ti.UI.createAlertDialog({
					message: '모바일 ISP어플리케이션이 설치되어있지 않습니다. \n설치를 눌러 진행해주십시요.\n취소를 누르면 결제가 취소됩니다.',
					buttonNames: ['취소', '확인'],
					cancel : 0
				});
				dialog.addEventListener('click', function (e) {
					if(e.cancel){
						$.cancel();
					}else{
						Ti.Platform.openURL("http://mobile.vpay.co.kr/jsp/MISP/andown.jsp");
					}
				});
				dialog.show();
			}else if(e.url.indexOf('intent://')==0){ //  ISPMOBILE:// 가 아니면서 설치가 안된 경우
				console.log('Trying to open market that packageName');
				console.log(e.url);
				console.log('PackageName is : ',parsedUri.packageName);
				
				var marketURL = "market://details?id="+ parsedUri.packageName; 
				var excepIntent = Ti.Android.createIntent({
	          action: Ti.Android.ACTION_VIEW,
	          data: marketURL
	      });
	      Ti.Android.currentActivity.startActivity(excepIntent);
			}
    }
	}
}

var q = function queryString(url, key)
{
    var results = new RegExp('[\\?&]' + key + '=([^&#]*)').exec(url);
    if (!results) return 0;
    return results[1] || null;
};
