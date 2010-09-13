/*
	author: JK
*/


/**
 * @class StringH ���Ķ���String����չ
 * @singleton
 * @namespace QW
 * @helper
 */

(function(){

var StringH = {
	/** 
	* ��ȥ�ַ������ߵĿհ��ַ�
	* @method trim
	* @static
	* @param {String} s ��Ҫ������ַ���
	* @return {String}  ��ȥ���˿հ��ַ�����ַ���
	* @remark ����ַ����м��кܶ�����tab,����������Ч������,��Ӧ�����������һ�仰�����.
		return s.replace(/^[\s\xa0\u3000]+/g,"").replace(/([^\u3000\xa0\s])[\u3000\xa0\s]+$/g,"$1");
	*/
	trim:function(s){
		return s.replace(/^[\s\xa0\u3000]+|[\u3000\xa0\s]+$/g, "");
	},
	/** 
	* ��һ���ַ������ж��replace
	* @method mulReplace
	* @static
	* @param {String} s  ��Ҫ������ַ���
	* @param {array} arr  ���飬ÿһ��Ԫ�ض�����replace����������ɵ�����
	* @return {String} ���ش������ַ���
	* @example alert(mulReplace("I like aa and bb. JK likes aa.",[[/aa/g,"ɽ"],[/bb/g,"ˮ"]]));
	*/
	mulReplace:function (s,arr){
		for(var i=0;i<arr.length;i++) s=s.replace(arr[i][0],arr[i][1]);
		return s;
	},
	/** 
	* �ַ�������ģ��
	* @method format
	* @static
	* @param {String} s �ַ���ģ�壬���б�����{0} {1}��ʾ
	* @param {String} arg0 (Optional) �滻�Ĳ���
	* @return {String}  ģ��������滻����ַ���
	* @example alert(tmpl("{0} love {1}.",'I','You'))
	*/
	format:function(s,arg0){
		var args=arguments;
		return s.replace(/\{(\d+)\}/ig,function(a,b){return args[b*1+1]||''});
	},

	/** 
	* �ַ�������ģ��
	* @method tmpl
	* @static
	* @param {String} sTmpl �ַ���ģ�壬���б����ԣ�$aaa����ʾ
	* @param {Object} opts ģ�����
	* @return {String}  ģ��������滻����ַ���
	* @example alert(tmpl("{$a} love {$b}.",{a:"I",b:"you"}))
	*/
	tmpl:function(sTmpl,opts){
		return sTmpl.replace(/\{\$(\w+)\}/g,function(a,b){return opts[b]});
	},

	/** 
	* �ж�һ���ַ����Ƿ������һ���ַ���
	* @method contains
	* @static
	* @param {String} s �ַ���
	* @param {String} opts ���ַ���
	* @return {String} ģ��������滻����ַ���
	* @example alert(contains("aaabbbccc","ab"))
	*/
	contains:function(s,subStr){
		return s.indexOf(subStr)>-1;
	},

	/** 
	* ȫ���ַ�ת����ַ�
		ȫ�ǿո�Ϊ12288��ת����" "��
		ȫ�Ǿ��Ϊ12290��ת����"."��
		�����ַ����(33-126)��ȫ��(65281-65374)�Ķ�Ӧ��ϵ�ǣ������65248 
	* @method dbc2sbc
	* @static
	* @param {String} s ��Ҫ������ַ���
	* @return {String}  ����ת������ַ���
	* @example 
		var s="��Ʊ���ǣ££ã���������������Ʊ����ǣ���.����Ԫ";
		alert(dbc2sbc(s));
	*/
	dbc2sbc:function(s)
	{
		return StringH.mulReplace(s,[
			[/[\uff01-\uff5e]/g,function(a){return String.fromCharCode(a.charCodeAt(0)-65248);}],
			[/\u3000/g,' '],
			[/\u3002/g,'.']
		]);
	},

	/** 
	* �õ��ֽڳ���
	* @method byteLen
	* @static
	* @param {String} s �ַ���
	* @return {number}  �����ֽڳ���
	*/
	byteLen:function(s)
	{
		return s.replace(/[^\x00-\xff]/g,"--").length;
	},

	/** 
	* �õ�ָ���ֽڳ��ȵ����ַ���
	* @method subByte
	* @static
	* @param {String} s �ַ���
	* @param {number} len �ֽڳ���
	* @optional {string} tail ��β�ַ���
	* @return {string}  ����ָ���ֽڳ��ȵ����ַ���
	*/
	subByte:function(s, len, tail)
	{
		if(StringH.byteLen(s)<=len) return s;
		tail = tail||'';
		len -= StringH.byteLen(tail);
		return s=s.substr(0,len).replace(/([^\x00-\xff])/g,"$1 ")//˫�ֽ��ַ��滻������
			.substr(0,len)//��ȡ����
			.replace(/[^\x00-\xff]$/,"")//ȥ���ٽ�˫�ֽ��ַ�
			.replace(/([^\x00-\xff]) /g,"$1") + tail;//��ԭ
	},

	/** 
	* �շ廯�ַ���������ab-cd��ת��Ϊ��abCd��
	* @method camelize
	* @static
	* @param {String} s �ַ���
	* @return {String}  ����ת������ַ���
	*/
	camelize:function(s) {
		return s.replace(/\-(\w)/ig,function(a,b){return b.toUpperCase();});
	},

	/** 
	* ���շ廯�ַ���������abCd��ת��Ϊ��ab-cd����
	* @method decamelize
	* @static
	* @param {String} s �ַ���
	* @return {String} ����ת������ַ���
	*/
	decamelize:function(s) {
		return s.replace(/[A-Z]/g,function(a){return "-"+a.toLowerCase();});
	},

	/** 
	* �ַ���Ϊjavascriptת��
	* @method encode4Js
	* @static
	* @param {String} s �ַ���
	* @return {String} ����ת������ַ���
	* @example 
		var s="my name is \"JK\",\nnot 'Jack'.";
		window.setTimeout("alert('"+encode4Js(s)+"')",10);
	*/
	encode4Js:function(s){
		return StringH.mulReplace(s,[
			[/\\/g,"\\u005C"],
			[/"/g,"\\u0022"],
			[/'/g,"\\u0027"],
			[/\//g,"\\u002F"],
			[/\r/g,"\\u000A"],
			[/\n/g,"\\u000D"],
			[/\t/g,"\\u0009"]
		]);
	},

	/** 
	* Ϊhttp�Ĳ��ɼ��ַ�������ȫ�ַ��������ַ���ת��
	* @method encode4Http
	* @static
	* @param {String} s �ַ���
	* @return {String} ���ش������ַ���
	*/
	encode4Http:function(s){
		return s.replace(/[\u0000-\u0020\u0080-\u00ff\s"'#\/\|\\%<>\[\]\{\}\^~;\?\:@=&]/,function(a){return encodeURIComponent(a)});
	},

	/** 
	* �ַ���ΪHtmlת��
	* @method encode4Html
	* @static
	* @param {String} s �ַ���
	* @return {String} ���ش������ַ���
	* @example 
		var s="<div>dd";
		alert(encode4Html(s));
	*/
	encode4Html:function(s){
		var el = document.createElement('pre');//����Ҫ��pre����div��ʱ�ᶪʧ���У����磺'a\r\n\r\nb'
		var text = document.createTextNode(s);
		el.appendChild(text);
		return el.innerHTML;
	},

	/** 
	* �ַ���ΪHtml��valueֵת��
	* @method encode4HtmlValue
	* @static
	* @param {String} s �ַ���
	* @return {String} ���ش������ַ���
	* @example:
		var s="<div>\"\'ddd";
		alert("<input value='"+encode4HtmlValue(s)+"'>");
	*/
	encode4HtmlValue:function(s){
		return StringH.encode4Html(s).replace(/"/g,"&quot;").replace(/'/g,"&#039;");
	},

	/** 
	* ��encode4Html�����෴�����з�����
	* @method decode4Html
	* @static
	* @param {String} s �ַ���
	* @return {String} ���ش������ַ���
	*/
	decode4Html:function(s){
		var div = document.createElement('div');
		div.innerHTML = s.stripTags();
		return div.childNodes[0] ? div.childNodes[0].nodeValue+'' : '';
	},
	/** 
	* ������tag��ǩ��������ȥ��<tag>���Լ�</tag>
	* @method stripTags
	* @static
	* @param {String} s �ַ���
	* @return {String} ���ش������ַ���
	*/
	stripTags:function(s) {
		return s.replace(/<[^>]*>/gi, '');
	},
	/** 
	* evalĳ�ַ����������"eval"����������Ҫ�����ţ����ܲ�Ӱ��YUIѹ�������������ط�����Ҳ�������⣬���Ը���evalJs��
	* @method evalJs
	* @static
	* @param {String} s �ַ���
	* @param {any} opts ����ʱ��Ҫ�Ĳ�����
	* @return {any} �����ַ�������з��ء�
	*/
	evalJs:function(s,opts) { //�����eval����������Ҫ�����ţ����ܲ�Ӱ��YUIѹ�������������ط�����Ҳ�������⣬���Ըĳ�evalJs��
		return new Function("opts",s)(opts);
	},
	/** 
	* evalĳ�ַ���������ַ�����һ��js���ʽ�������ر��ʽ���еĽ��
	* @method evalExp
	* @static
	* @param {String} s �ַ���
	* @param {any} opts evalʱ��Ҫ�Ĳ�����
	* @return {any} �����ַ�������з��ء�
	*/
	evalExp:function(s,opts) {
		return new Function("opts","return "+s+";")(opts);
	}
};

QW.StringH=StringH;

})();