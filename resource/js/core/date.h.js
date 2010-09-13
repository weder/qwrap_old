/*
	Copyright (c) 2010, Baidu Inc.  http://www.youa.com; http://www.qwrap.com
	author: JK
*/

/**
 * @class DateH ���Ķ���Date����չ
 * @singleton 
 * @namespace QW
 * @helper
 */

(function(){

var DateH = {
	/** 
	* ��ʽ������
	* @method format
	* @static
	* @param {Date} d ���ڶ���
	* @param {string} pattern ���ڸ�ʽ(y��M��d��hʱm��s��)��Ĭ��Ϊ"yyyy-MM-dd"
	* @return {string}  ����format����ַ���
	* @example
		var d=new Date();
		alert(format(d," yyyy��M��d��\n yyyy-MM-dd\n MM-dd-yy\n yyyy-MM-dd hh:mm:ss"));
	*/
	format:function(d,pattern)
	{
		pattern=pattern||"yyyy-MM-dd";
		var y=d.getFullYear();
		var o = {
			"M" : d.getMonth()+1, //month
			"d" : d.getDate(),    //day
			"h" : d.getHours(),   //hour
			"m" : d.getMinutes(), //minute
			"s" : d.getSeconds() //second
		}
		pattern=pattern.replace(/(y+)/ig,function(a,b){var len=Math.min(4,b.length);return (y+"").substr(4-len);});
		for(var i in o){
			pattern=pattern.replace(new RegExp("("+i+"+)","g"),function(a,b){return (o[i]<10 && b.length>1 )? "0"+o[i] : o[i]});
		}
		return pattern;
	}
};

QW.DateH = DateH;

})();