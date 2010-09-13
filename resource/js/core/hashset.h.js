/*
	author: wuliang
*/


/**
 * @class HashsetH HashsetH�ǶԲ������ظ�Ԫ�ص�������в�����Helper
 * @singleton 
 * @namespace QW
 * @helper 
 */

(function(){
var contains = QW.ArrayH.contains;

var HashsetH = {
   /** 
	* �ϲ������Ѿ�uniquelize�������飬�൱����������concat��������uniquelize������Ч�ʸ���
	* @method union
	* @static
	* @param {Array} arr �����������.
	* @param {Array} arr2 �����������.
	* @return {Array} ����һ��������
	* @example 
		var arr=["a","b"];
		var arr2=["b","c"];
		alert(union(arr,arr2));
	*/
	union:function(arr,arr2){
		var ra = [];
		for(var i = 0, len = arr2.length; i < len; i ++){
			if(!contains(arr, arr2[i])) {
				ra.push(arr2[i]);
			}
		}
		return arr.concat(ra);
	},
   /** 
	* �������Ѿ�uniquelize��������Ľ���
	* @method intersect
	* @static
	* @param {Array} arr �����������.
	* @param {Array} arr2 �����������.
	* @return {Array} ����һ��������
	* @example 
		var arr=["a","b"];
		var arr2=["b","c"];
		alert(intersect(arr,arr2));
	*/
	intersect:function(arr, arr2){
		var ra = [];
		for(var i = 0, len = arr2.length; i < len; i ++){
			if(contains(arr, arr2[i])) {
				ra.push(arr2[i]);
			}
		}
		return ra;		
	},
   /** 
	* �������Ѿ�uniquelize��������Ĳ
	* @method minus
	* @static
	* @param {Array} arr �����������.
	* @param {Array} arr2 �����������.
	* @return {Array} ����һ��������
	* @example 
		var arr=["a","b"];
		var arr2=["b","c"];
		alert(minus(arr,arr2));
	*/
	minus:function(arr, arr2){
		var ra = [];
		for(var i = 0, len = arr2.length; i < len; i ++){
			if(!contains(arr, arr2[i])) {
				ra.push(arr2[i]);
			}
		}
		return ra;		
	},
   /** 
	* �������Ѿ�uniquelize��������Ĳ���
	* @method complement
	* @static
	* @param {Array} arr �����������.
	* @param {Array} arr2 �����������.
	* @return {Array} ����һ��������
	* @example 
		var arr=["a","b"];
		var arr2=["b","c"];
		alert(complement(arr,arr2));
	*/
	complement:function(arr, arr2){
		return HashsetH.minus(arr, arr2).concat(HashsetH.minus(arr2, arr));		
	}
};

QW.HashSetH=HashsetH;

})();