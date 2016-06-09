// This is a test harness for your module
// You should do something interesting in this harness
// to test out the module and to provide instructions
// to users on how to use it by example.


// open a single window
var win = Ti.UI.createWindow({
	backgroundColor:'white'
});
var label = Ti.UI.createLabel({
	color: 'black'
});
win.add(label);
win.open();

// TODO: write your module tests here
var intent_parseuri = require('ti.intent.parseuri');
Ti.API.info("module is => " + intent_parseuri);

console.log('---------');
var resultStrig = (JSON.stringify(intent_parseuri.parseUri('intent://pay?srCode=0000000#Intent;scheme=shinhan-sr-ansimclick;package=com.shcard.smartpay;end;')));
console.log(resultStrig);
label.text = resultStrig;
