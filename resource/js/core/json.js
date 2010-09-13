/*
	Copyright (c) 2009, Baidu Inc. All rights reserved.
	http://www.youa.com
	version: $version$ $release$ released
	author: chenminliang@baidu.com
*/


/**
 * @class JSON ��JSON���л��뷴���л������ķ�װ��
 * @singleton
 * @remarks
 * <a href='$baseurl$/core/_tests/json.test.html' target="_blank">��Ԫ����</a>
 */

(function(){
	window.JSON = {
		/**
		 * ��JSON�ַ��������ɶ���������飬����ַ������ǺϷ���JSON��ʽ����׳��쳣��
		 * @static
		 * @method parse
		 * @param {String} text ��Ҫ���з����л����ַ���
		 * @param {Function} reviver (Optional) ����ʱʹ�õĹ�����
		 * @return {Object} ���ط����л���Ķ��������
		 * @throw {SyntaxError} ���text����������Ч��JSON�ַ���������쳣
		 * @example 
var str = '{"key1":1,"key2":{"key21":2}}';
var obj = JSON.parse(str,function(k,v){
	if( k == 'key21' ) return 'hello world';
	return v;
});
alert(obj.key2.key21) //hello world
		 */
		parse: (function(){			
			/*
			 * ƥ�������ַ���������ʽ�������text�г�����Щ�ַ����ᱻ�滻��Unicode������ַ���
			 */
			var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

			var rev;

			/*
			 * ��text�����л��ɶ�������ͨ���÷��������б�����������reviver���й��˺͵���
			 * ���ص��ǵ�ǰkey�µ����ݵ���reviver��Ľ��
			 */
			function traver(key, obj) {
				var value = obj[key];
				if( value && typeof value === 'object' ){
					for( var k in value ){
						var v = traver(k, value);
						if( v !== undefined ){
							value[k] = v;
						}
						else{
							delete value[k];
						}
					}
				}
				return rev.call(obj, key, value);
            }
			return function( text, reviver ){
				/*�滻�����ַ�Ϊ��Ӧ��Unicode�ַ���*/
				cx.lastIndex = 0;
				if (cx.test(text)) {
					text = text.replace(cx, function (a) {
						return '\\u' +
							('0000' + a.charCodeAt(0).toString(16)).slice(-4);
					});
				}
				/*���JSON�ַ�������Ч��*/
				if ( text && /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
					/*����ʹ����JK�ṩ������eval�ķ�������Ϊֱ��ʹ��eval��Ӱ��ѹ��*/
					var obj = new Function( 'return ' + text )();
					rev = reviver;
					return typeof reviver === 'function' ? traver('', { '': obj }) : obj;
				}
				
				/*��Ч��JSON��ʽ*/
				throw new SyntaxError('Invalid JSON format in executing JSON.parse');
			};
		})(),
		/**
		 * ����������������л���JSON��ʽ���ַ�����
		 * @static
		 * @method stringify
		 * @param {Object} value ��Ҫ�������л��Ķ����������
		 * @param {Function} replace (Optional) ���л�������ʹ�õĹ�����������������������ÿ����Ա���������ַ�������ʾvalue����Щ��������Ҫ���л���
		 * @param {String} spacer (Optional) ���ڸ�ʽ����������������������ʾ�����Ŀո������������ַ������ʾ�������������ַ���
		 * @return {String} �������л��������
		 * @throw {Error} ���replacer�ǿղ��ҼȲ�������Ҳ���Ǻ���ʱ���׳��쳣
		 * @example 
//1.���÷�
var obj = {key1:{key11:[1,2,3,4]}};
var objString = JSON.stringify(obj);//'{"key1":{"key11":[1,2,3,4]}}'
//2.�Զ���toJSON��֧��Date��String��Number��Boolean���ͣ�
Date.prototype.toJSON = function(){
	return 'test date';
};			
var d = new Date();
var obj = {date:d};
var objString = JSON.stringify(obj);//'{"date":"test date"}'
//3.Function Replacer
var obj = {key1:[1,2,3,{key11:[1,2,3,{key111:'hello world'}]}]};
var objString = JSON.stringify(obj,function(k,v){
	if( k == 'key111' )
		return 'new value';
	return v;
});//'{"key1":[1,2,3,{"key11":[1,2,3,{"key111":"new value"}]}]}'
//4.Array Replacer
var obj = {key1:[1,2,3,{key11:[1,2,3,{key111:'hello world'}]}],key2:1,key3:1};
var objString = JSON.stringify(obj,['key2','key3']);//'{"key2":1,"key3":1}'
		 */
		stringify: (function(){
			/*����2λ*/
			function fill_zero(n) {
				return n < 10 ? '0' + n : n;
			}
			/*����Date��String��Number��Boolean��toJSON����*/
			Date.prototype.toJSON = function (key) {
				return isFinite(this.valueOf()) ?
					   this.getUTCFullYear()   + '-' +
					 fill_zero(this.getUTCMonth() + 1) + '-' +
					 fill_zero(this.getUTCDate())      + 'T' +
					 fill_zero(this.getUTCHours())     + ':' +
					 fill_zero(this.getUTCMinutes())   + ':' +
					 fill_zero(this.getUTCSeconds())   + 'Z' : null;
			};
			String.prototype.toJSON =
			Number.prototype.toJSON =
			Boolean.prototype.toJSON = function (key) {
				return this.valueOf();
			};

			/*���ڸ�ʽ������������ַ���*/
			var indent;
			/*������ÿһ��ʱʵ������ĸ�ʽ���ַ���*/
			var gap;
			/*������*/
			var rep;
			/*��Ҫ����ת����ַ�����ƥ����ʽ*/
			var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
			/*��Ҫת�ƵĿɼ��ַ����ձ�*/
			var escapeMap = {
				'\b': '\\b',
				'\t': '\\t',
				'\n': '\\n',
				'\f': '\\f',
				'\r': '\\r',
				'"' : '\\"',
				'\\': '\\\\'
			};
			
			/*����ַ����в��������š�ת���ַ�����б�������ֱ��������ţ�������Ҫ�����滻�����ſ���������š�*/
			function addQuote( str ){
				escapable.lastIndex = 0;
				return escapable.test(str) ?
					'"' + str.replace(escapable, function (a) {
						var c = escapeMap[a];
						/*�������escapeMap�е��ַ���ת����Unicode�ַ���*/
						return typeof c === 'string' ? c :
							'\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
					}) + '"' :
					'"' + str + '"';
			}
			/*��ȡ������ָ�����Ե�json�ַ���*/
			function getString(key, obj){
				/*��һ��ĸ�ʽ���ַ���*/
				var lastGap = gap;
				var v = obj[key];
				if( v && typeof v.toJSON == 'function' ){
					v = v.toJSON(key);
				}
				if( typeof rep == 'function' ){
					v = rep.call(obj,key,v);
				}
				if( v === null ){
					return String( v );
				}
				else if( typeof v == 'undefined' )
					return v;
				switch( v.constructor ){
					case String:
						return addQuote( v );
					case Number:
						return isFinite( v ) ? String( v ) : 'null';
					case Boolean:
						return String( v );
					case Array:
						/*������������л�ʱ�����replacer*/
						gap += indent;
						var res = [];
						for( var i = 0, len = v.length; i < len ; i++){
							res[i] = getString( i , v ) || 'null';
						}
						
						var r = res.length == 0 ? '[]' : 
								gap ? '[\n' + 
								gap + res.join(',\n' + gap) + '\n' +
                                lastGap + ']' :
									'[' + res.join(',') + ']';
						gap = lastGap;
						return r;
					case Object:
						gap += indent;
						var res = [];
						/*���replacer��һ�����������л�������ָ��������*/
						if( rep && rep.constructor == Array ){
							for( var i = 0, len = rep.length; i < len ; i++){
								var k = rep[i];
								if( typeof k == 'string' ){
									var nv = getString( k, v );
									if( nv ){
										res.push( addQuote( k ) + ( gap ? ': ' : ':' ) + nv);
									}
								}
							}
						}
						else{
							for( var k in v ){
									var nv = getString( k, v );
									if( nv ){
										res.push( addQuote( k ) + ( gap ? ': ' : ':' ) + nv);
									}
							}
						}
						var r = res.length == 0 ? '{}' : 
								gap ? '{\n' + 
								gap + res.join(',\n' + gap) + '\n' +
                                lastGap + '}' :
									'{' + res.join(',') + '}';
						gap = lastGap;
						return r;
				}
			}
			return function(value, replacer, spacer){
				/*�ж�replacer����Ч�ԣ�ֻ�����ǿջ����Ǻ���������*/
				if( replacer != null && replacer.constructor != Array && replacer.constructor != Function ){
					throw new Error('Invalid type of 2nd argument in JSON.stringify, only Array and Function allowed');
				}

				gap = indent = '';

				if( spacer && spacer.constructor == Number ){
					indent = Array(spacer + 1).join(' ');
				}
				else if( spacer && spacer.constructor == String ){
					indent = spacer;
				}

				rep = replacer;

				return getString('', {'': value});
			}
		})()
	};
})();