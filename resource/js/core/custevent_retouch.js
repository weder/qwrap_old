/*
	author: wuliang
*/

(function(){
var QW=window.QW,
	mix=QW.ObjectH.mix;

var CustEventTarget=QW.CustEventTarget=function(){
	this.__custListeners={};
};

var config = {
	on:1,
	un:1,
	createEvents:1
}

QW.HelperH.wrap(QW.CustEventTargetH).rwrap(null,config)  //֧����ʽ����
	.methodizeTo(CustEventTarget.prototype);

QW.CustEvent.createEvents = CustEventTarget.createEvents = function(target,types){
	QW.CustEventTargetH.createEvents(target, types);
	return mix(target,CustEventTarget.prototype);//���ض������on��
};
})();