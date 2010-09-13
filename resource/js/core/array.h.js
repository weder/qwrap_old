/*
	author: wuliang
	author: JK
*/

/**
 * @class ArrayH ���Ķ���Array����չ
 * @singleton 
 * @namespace QW
 * @helper
 */
(function(){

var ArrayH = {
	/** 
	* �������е�ÿ����������һ������������ȫ�������Ϊ���鷵�ء�
	* @method map
	* @static
	* @param {Array} arr �����������.
	* @param {Function} callback ��Ҫִ�еĺ���.
	* @param {Object} pThis (Optional) ָ��callback��this����.
	* @return {Array} �����������������Ԫ����ɵ������� 
	* @example 
		var arr=["aa","ab","bc"];
		var arr2=map(arr,function(a,b){return a.substr(0,1)=="a"});
		alert(arr2);
	*/
	map:function(arr,callback,pThis){
		var len=arr.length;
		var rlt=new Array(len);
		for (var i =0;i<len;i++) {
			if (i in arr) rlt[i]=callback.call(pThis,arr[i],i,arr);
		}
		return rlt;
	},

	/** 
	* ��Array��ÿһ��Ԫ������һ��������
	* @method forEach
	* @static
	* @param {Array} arr �����������.
	* @param {Function} callback ��Ҫִ�еĺ���.
	* @optional {Object} pThis (Optional) ָ��callback��this����.
	* @return {void}  
	* @example 
		var arr=["a","b","c"];
		var dblArr=[];
		forEach(arr,function(a,b){dblArr.push(b+":"+a+a);});
		alert(dblArr);
	*/
	forEach:function(arr,callback,pThis){
		for (var i =0,len=arr.length;i<len;i++){
			if (i in arr) callback.call(pThis,arr[i],i,arr);
		}
	},

	/** 
	* �������е�ÿ����������һ����������������������ֵ������Ϊ���鷵�ء�
	* @method filter
	* @static
	* @param {Array} arr �����������.
	* @param {Function} callback ��Ҫִ�еĺ���.
	* @optional {Object} pThis (Optional) ָ��callback��this����.
	* @return {Array} �����������������Ԫ����ɵ������� 
	* @example 
		var arr=["aa","ab","bc"];
		var arr2=filter(arr,function(a,b){return a.substr(0,1)=="a"});
		alert(arr2);
	*/
	filter:function(arr,callback,pThis){
		var rlt=[];
		for (var i =0,len=arr.length;i<len;i++) {
			if((i in arr) && callback.call(pThis,arr[i],i,arr)) rlt.push(arr[i]);
		}
		return rlt;
	},

	/** 
	* �ж��������Ƿ���Ԫ������������
	* @method some
	* @static
	* @param {Array} arr �����������.
	* @param {Function} callback ��Ҫִ�еĺ���.
	* @optional {Object} pThis (Optional) ָ��callback��this����.
	* @return {boolean} �������Ԫ�������������򷵻�true. 
	* @example 
		var arr=["aa","ab","bc"];
		var arr2=filter(arr,function(a,b){return a.substr(0,1)=="a"});
		alert(arr2);
	*/
	some:function(arr,callback,pThis){
		for (var i =0,len=arr.length;i<len;i++) {
			if(i in arr && callback.call(pThis,arr[i],i,arr)) return true;
		}
		return false;
	},

	/** 
	* �ж�����������Ԫ�ض�����������
	* @method every
	* @static
	* @param {Array} arr �����������.
	* @param {Function} callback ��Ҫִ�еĺ���.
	* @optional {Object} pThis (Optional) ָ��callback��this����.
	* @return {boolean} ����Ԫ�������������򷵻�true. 
	* @example 
		var arr=["aa","ab","bc"];
		var arr2=filter(arr,function(a,b){return a.substr(0,1)=="a"});
		alert(arr2);
	*/
	every:function(arr,callback,pThis){
		for (var i =0,len=arr.length;i<len;i++) {
			if(i in arr && !callback.call(pThis,arr[i],i,arr)) return false;
		}
		return true;
	},

	/** 
	* ����һ��Ԫ���������е�λ�ã���ǰ�����ң������������û�и�Ԫ�أ��򷵻�-1
	* @method indexOf
	* @static
	* @param {Array} arr �����������.
	* @param {Object} obj Ԫ�أ��������κ�����
	* @optional {int} fromIdx (Optional) ���ĸ�λ�ÿ�ʼ�������Ϊ�������ʾ��length+startIdx��ʼ��
	* @return {int} �򷵻ظ�Ԫ���������е�λ��.
	* @example 
		var arr=["a","b","c"];
		alert(indexOf(arr,"c"));
	*/
	indexOf:function(arr,obj,fromIdx){
		var len=arr.length;
		fromIdx=fromIdx|0;//ȡ��
		if(fromIdx<0) fromIdx+=len;
		if(fromIdx<0) fromIdx=0;
		for(; fromIdx < len; fromIdx ++){
			if(fromIdx in arr && arr[fromIdx] === obj) return fromIdx;
		}
		return -1;
	},

	/** 
	* ����һ��Ԫ���������е�λ�ã��Ӻ���ǰ�ң������������û�и�Ԫ�أ��򷵻�-1
	* @method lastIndexOf
	* @static
	* @param {Array} arr �����������.
	* @param {Object} obj Ԫ�أ��������κ�����
	* @optional {int} fromIdx (Optional) ���ĸ�λ�ÿ�ʼ�������Ϊ�������ʾ��length+startIdx��ʼ��
	* @return {int} �򷵻ظ�Ԫ���������е�λ��.
	* @example 
		var arr=["a","b","a"];
		alert(lastIndexOf(arr,"a"));
	*/
	lastIndexOf:function(arr,obj,fromIdx){
		var len=arr.length;
		fromIdx=fromIdx|0;//ȡ��
		if(!fromIdx || fromIdx>=len) fromIdx=len-1;
		if(fromIdx<0) fromIdx+=len;
		for(; fromIdx >-1; fromIdx --){
			if(fromIdx in arr && arr[fromIdx] === obj) return fromIdx;
		}
		return -1;
	},

	/** 
	* �ж������Ƿ����ĳԪ��
	* @method contains
	* @static
	* @param {Array} arr �����������.
	* @param {Object} obj Ԫ�أ��������κ�����
	* @return {boolean} ���Ԫ�ش��������飬�򷵻�true�����򷵻�false
	* @example 
		var arr=["a","b","c"];
		alert(contains(arr,"c"));
	*/
	contains:function(arr,obj) {
		return (ArrayH.indexOf(arr,obj) >= 0);
	},

	/** 
	* ���һ������
	* @method clear
	* @static
	* @param {Array} arr �����������.
	* @return {void} 
	*/
	clear:function(arr){
		arr.length = 0;
	},

	/** 
	* ���������ĳ(Щ)Ԫ���Ƴ���
	* @method remove
	* @static
	* @param {Array} arr �����������.
	* @param {Object} obj0 ���Ƴ�Ԫ��
	* @param {Object} obj1 �� ���Ƴ�Ԫ��
	* @return {number} ���ص�һ�α��Ƴ���λ�á����û���κ�Ԫ�ر��Ƴ����򷵻�-1.
	* @example 
		var arr=["a","b","c"];
		remove(arr,"a","c");
		alert(arr);
	*/
	remove:function(arr,obj){
		var idx=-1;
		for(var i=1;i<arguments.length;i++){
			var oI=arguments[i];
			for(var j=0;j<arr.length;j++){
				if(oI === arr[j]) {
					if(idx<0) idx=j;
					arr.splice(j--,1);
				}
			}
		}
		return idx;
	},

	/** 
	* ����Ԫ�س��أ��õ�������
	* @method unique
	* @static
	* @param {Array} arr �����������.
	* @return {void} ����Ԫ�س��أ��õ�������
	* @example 
		var arr=["a","b","a"];
		alert(unique(arr));
	*/
	unique:function(arr){
		var rlt = [];
		var oI=null;
		for(var i = 0; i < arr.length; i ++){
			if(ArrayH.indexOf(rlt,oI=arr[i])<0){
				rlt.push(oI);
			}
		}
		return rlt;
	},

	/** 
	* Ϊ����Ԫ�ؽ��е��Ʋ�����
	* @method reduce
	* @static
	* @param {Array} arr �����������.
	* @param {Function} callback ��Ҫִ�еĺ�����
	* @param {any} initial (Optional) ��ʼֵ�����û�����ʼ����ӵ�һ����ЧԪ�ؿ�ʼ��û�г�ʼֵ������û����ЧԪ�أ������쳣
	* @return {any} ���ص��ƽ��. 
	* @example 
		var arr=[1,2,3];
		alert(reduce(arr,function(a,b){return Math.max(a,b);}));
	*/
	reduce:function(arr,callback,initial){
		var len=arr.length;
		var i=0;
		if(arguments.length<3){//�ҵ���һ����ЧԪ�ص�����ʼֵ
			var hasV=0;
			for(;i<len;i++){
				if(i in arr) {initial=arr[i++];hasV=1;break;}
			}
			if(!hasV) throw new Error("No component to reduce");
		}
		for(;i<len;i++){
			if(i in arr) initial=callback(initial,arr[i],i,arr);
		}
		return initial;
	},

	/** 
	* Ϊ����Ԫ�ؽ���������Ʋ�����
	* @method reduceRight
	* @static
	* @param {Array} arr �����������.
	* @param {Function} callback ��Ҫִ�еĺ�����
	* @param {any} initial (Optional) ��ʼֵ�����û�����ʼ����ӵ�һ����ЧԪ�ؿ�ʼ��û�г�ʼֵ������û����ЧԪ�أ������쳣
	* @return {any} ���ص��ƽ��. 
	* @example 
		var arr=[1,2,3];
		alert(reduceRight(arr,function(a,b){return Math.max(a,b);}));
	*/
	reduceRight:function(arr,callback,initial){
		var len=arr.length;
		var i=len-1;
		if(arguments.length<3){//�����ҵ���һ����ЧԪ�ص�����ʼֵ
			var hasV=0;
			for(;i>-1;i--){
				if(i in arr) {initial=arr[i--];hasV=1;break;}
			}
			if(!hasV) throw new Error("No component to reduceRight");
		}
		for(;i>-1;i--){
			if(i in arr) initial=callback(initial,arr[i],i,arr);
		}
		return initial;
	},

	/**
	* ��һ�������ƽ��
	* @method expand
	* @static
	* @param {Array} arrҪ��ƽ��������
	* @return {Array} ��ƽ���������
	*/	
	expand:function(arr){
		return [].concat.apply([], arr);
	},

	/** 
	* ��һ����Arrayת����һ��Array����
	* @method toArray
	* @static
	* @param {Array} arr �������Array�ķ��Ͷ���.
	* @return {Array}  
	*/
	toArray:function(arr){
		var ret=[];
		for(var i=0;i<arr.length;i++){
			ret[i]=arr[i];
		}
		return ret;
	}
};

QW.ArrayH=ArrayH;

})();