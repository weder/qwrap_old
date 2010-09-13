/*
	author: JK
*/

(function(){
/**
* @singleton 
* @class QW QW��ܵĸ������ռ�
*/

var QW = {
	/**
	* ��ǰ��ܰ汾
	* @porperty CORE_VERSION
	* @type string
	*/
	CORE_VERSION: "0.0.1",
	/**
	* coreĿ¼����·������������һ��"/"
	* @property JSPATH
	* @type string
	*/
	JSPATH: function(){
		var els=document.getElementsByTagName('script');
		for (var i = 0; i < els.length; i++) {
			var src = els[i].src.split(/(apps|core)[\\\/]/g);
			if (src[1]) {
				return src[0];
			}
		}
		return '';}(),
	/**
	 * ��QW��������ռ��������
	 * @method provide
	 * @static
	 * @param {string|Json} key �������Ϊstring����Ϊkey������ΪJson����ʾ����Json���ֵdump��QW�����ռ�
	 * @param {any} value (Optional)ֵ
	 * @return {void} 
	 */		
	provide: function(key, value){
		if(arguments.length==1 && typeof key=='object'){
			for(var i in key){
				QW.provide(i,key[i]);
			}
			return;
		}
		var domains=QW.provideDomains;
		for(var i=0;i<domains.length;i++){
			if(!domains[i][key]) domains[i][key]=value;
		}
	},
	/**
	* �첽���ؽű�
	* @method getScript
	* @static
	* @param { String } url Javascript�ļ�·��
	* @param { Function } onsuccess (Optional) Javascript���غ�Ļص�����
	* @param { Json } options (Optional) ����ѡ�����charset
	*/
	getScript: function(url,onsuccess,options){
		options = options || {};
		var head = document.getElementsByTagName('head')[0],
			script = document.createElement('script'),
			done = false;
		script.src = url;
		if( options.charset )
			script.charset = options.charset;
		script.onerror = script.onload = script.onreadystatechange = function(){
			if ( !done && (!this.readyState ||
					this.readyState == "loaded" || this.readyState == "complete") ) {
				done = true;
				onsuccess && onsuccess();
				script.onerror = script.onload = script.onreadystatechange = null;
				head.removeChild( script );
			}
		};
		head.appendChild(script);

	},
	/**
	 * �׳��쳣
	 * @method error
	 * @static
	 * @param { obj } �쳣����
	 * @param { type } Error (Optional) �������ͣ�Ĭ��ΪError
	 */
	error: function(obj, type){
		type = type || Error;
		throw new type(obj);
	}
};
/**
 * @property {Array} provideDomains provide������Ե������ռ�
 * @type string
 */
QW.provideDomains=[QW];

window.QW=QW;
})();