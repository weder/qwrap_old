/*
	Copyright (c) 2010, Baidu Inc.  http://www.youa.com; http://www.qwrap.com
	author: JK,wuliang
*/

(function(){
/**
 * @class Browser js的运行环境，浏览器以及版本信息
 * @singleton 
 * @namespace QW 
 */
var Browser=b=function(){
	var na=window.navigator,ua = na.userAgent.toLowerCase();
	// 判断浏览器的代码,部分来自JQuery,致谢!
	var b= {
		platform: na.platform,
		//mozilla: /mozilla/.test( ua ) && !/(compatible|webkit|firefox)/.test( ua ),//废弃
		msie: /msie/.test( ua ) && !/opera/.test( ua ),
		opera: /opera/.test( ua ),
		//gecko: /gecko/.test( ua ) && /khtml/.test( ua ),//废弃
		safari: /webkit/.test( ua ) && !/chrome/.test( ua ),
		firefox: /firefox/.test( ua ) ,
		chrome: /chrome/.test( ua )
	};
	var vMark="";
	for(var i in b){
		if(b[i]) vMark=i;
	}
	if(b.safari) vMark="version";
	b.version=(ua.match( new RegExp("(?:"+vMark+")[\\/: ]([\\d.]+)") ) || [])[1];
	b.ie=b.msie;
	b.ie6=b.msie && parseInt(b.version)==6;
	b.ie7=b.msie && parseInt(b.version)==7;
	b.ie8=b.msie && parseInt(b.version)==8;
	try{b.maxthon=b.msie && !!external.max_version;} catch(ex){}
	return b;
}();

//浏览器嗅探 - 不推荐
/*var curry = QW.FunctionH.curry;
var overload = QW.FunctionH.overload;

Browser.detect = curry(overload,
	[function(){},,
	 function(args){
		if(b.ie6) return "@ie6";
		if(b.ie7) return "@ie7";
		if(b.ie8) return "@ie8";
		if(b.ie) return "@ie";
		if(b.opera) return "@opera";
		if(b.safari) return "@safari";
		if(b.firefox) return "@firefox";
		if(b.chrome) return "@chrome";
		return "@unknown"; 
	 }]
);*/

QW.Browser = Browser;
})();