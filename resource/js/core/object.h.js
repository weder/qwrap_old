/*
	author: wuliang
	author: JK
*/


/**
 * @class ObjectH ���Ķ���Object�ľ�̬��չ
 * @singleton
 * @namespace QW
 * @helper
 */

(function(){

var encode4Js=QW.StringH.encode4Js;
var ObjectH = {
	/**
	* �õ�һ������������ַ���
	* @method getType
	* @static
	* @param {any} o Ŀ������ֵ
	* @returns {string} �ö��������
	* @example
		getType(null); //null
		getType(undefined); //undefined
		getType(""); //string
		getType([]); //array
		getType(true); //boolean
		getType({}); //object
		getType(new Date()); //date
		getType(/a/); //regexp
		getType({}.constructor); //function
		getType(window); //window
		getType(document); //document
		getType(document.body); //BODY
	*/
	getType: function(o){
		var type = typeof o;
		if(type == 'object'){
			if(o==null) type='null';
			else if("__type__" in o) type=o.__type__;
			else if("core" in o) type='wrap';
			else if(o.window==o) type='window'; //window
			else if(o.nodeName) type=(o.nodeName+'').replace('#',''); //document/element
			else if(!o.constructor) type='unknown object';
			else type=Object.prototype.toString.call(o).slice(8,-1).toLowerCase();
		}
		return type;
	},

	/** 
	* ��Դ��������Բ��뵽Ŀ�����
	* @method mix
	* @static
	* @param {Object} des Ŀ�����
	* @param {Object|Array} src Դ������������飬�����β���
	* @param {boolean} override (Optional) �Ƿ񸲸���������
	* @returns {Object} des
	*/
	mix: function(des, src, override){
		if("array" == ObjectH.getType(src)){
			for(var i = 0, len = src.length; i<len; i++){
				ObjectH.mix(des, src[i], override);
			}
			return des;
		}
		for(var i in src){
			if(override || !(i in des)){
				des[i] = src[i];
			}
		}
		return des;
	},

	/**
	* ��һ��������ĳЩ���Ը��Ƴ���������һ��������Щ����ֵ����ͨ����
	* @method dump
	* @static
	* @param {Object} obj �������Ķ���
	* @param {Array} props ����Ҫ�����Ƶ��������Ƶ�����
	* @param {Object} toObj ���Ŀ�꣬���Ϊ�գ������һ���µ�Json
	* @param {boolean} override �Ƿ񸲸�ԭ�����ԡ�
	* @return {Object} toObj ���ذ�����������б��������ԵĶ���
	*/
	dump: function(obj, props, toObj,override){
		var ret = toObj || {};
		for(var i = 0; i<props.length;i++){
			var key = props[i];
			if(key in obj){
				if(override || !ret[key]) ret[key] = obj[key];
			}
		}
		return ret;
	},

	/**
	* �õ�һ�����������п��Ա�ö�ٳ������Ե��б�
	* @method keys
	* @static
	* @param {Object} obj �������Ķ���
	* @return {Array} ���ذ�������������������Ե�����
	*/
	keys : function(obj){
		var ret = [];
		for(var key in obj){
			ret.push(key);
		}
		return ret;
	},
	/**
	* �õ�һ�����������п��Ա�ö�ٳ�������ֵ���б�
	* @method values
	* @static
	* @param {Object} obj �������Ķ���
	* @return {Array} ���ذ��������������������ֵ������
	*/
	values : function(obj){
		var ret = [];
		for(var key in obj){
			ret.push(obj[key]);
		}
		return ret;
	},
	/** 
	* ���л�һ������(ֻ���л�String,Number,Boolean,Date,Array,Json�������toJSON�����Ķ���,�����Ķ��󶼻ᱻ���л���null)
	* @method stringify
	* @static
	* @param {Object} obj ��Ҫ���л���Json��Array�������������
	* @returns {String} : �������л����
	* @example 
		var card={cardNo:"bbbb1234",history:[{date:"2008-09-16",count:120.0,isOut:true},1]};
		alert(stringify(card));
	*/
	stringify:function (obj){
		if(obj==null) return null;
		if(obj.toJSON) {
			obj= obj.toJSON();
		}
		var type=ObjectH.getType(obj);
		switch(type){
			case 'string': return '"'+encode4Js(obj)+'"';
			case 'number': 
			case 'boolean': return obj+'';
			case 'date': return 'new Date(' + obj.getTime() + ')';
			case 'array' :
				var ar=[];
				for(var i=0;i<obj.length;i++) ar[i]=ObjectH.stringify(obj[i]);
				return '['+ar.join(',')+']';
			case 'object' :
				ar=[];
				for(i in obj){
					ar.push('"'+encode4Js(i+'')+'":'+ObjectH.stringify(obj[i]));
				}
				return '{'+ar.join(',')+'}';
		}
		return null;//�޷����л��ģ�����null;
	},

	/** 
	* Ϊһ��������������
	* @method set
	* @static
	* @param {Object} obj Ŀ�����
	* @param {string} prop ������
	* @param {any} value ����ֵ
	* @returns {void} 
	*/
	set:function (obj,prop,value){
		obj[prop]=value;
	},

	/** 
	* ��ȡһ�����������ֵ:
	* @method set
	* @static
	* @param {Object} obj Ŀ�����
	* @param {string} prop ������
	* @returns {any} 
	*/
	get:function (obj,prop){
		return obj[prop];
	},

	/** 
	* Ϊһ�������������ԣ�֧���������ֵ��÷�ʽ:
		setEx(obj, prop, value)
		setEx(obj, propJson)
		setEx(obj, props, values)
		---�ر�˵��propName����ĵ㣬�ᱻ�������ԵĲ��
	* @method setEx
	* @static
	* @param {Object} obj Ŀ�����
	* @param {string|Json|Array} prop �����string,��������(�������������������ַ���,��"style.display")�������Json����prop/value�ԡ���������飬��prop���飬�ڶ���������Ӧ��Ҳ��value����
	* @param {any | Array} value ����ֵ
	* @returns {Object} obj 
	* @example 
		var el={style:{},firstChild:{}};
		setEx(el,"id","aaaa");
		setEx(el,{className:"cn1", 
			"style.display":"block",
			"style.width":"8px"
		});
	*/
	setEx:function (obj,prop,value){
		var propType=ObjectH.getType(prop);
		if(propType == 'array') {
			//setEx(obj, props, values)
			for(var i=0;i<prop.length;i++){
				ObjectH.setEx(obj,prop[i],value[i]);
			}
		}
		else if(propType == 'object') {
			//setEx(obj, propJson)
			for(var i in prop)
				ObjectH.setEx(obj,i,prop[i]);
		}
		else {
			//setEx(obj, prop, value);
			var keys=(prop+"").split(".");
			for(var i=0, obj2=obj, len=keys.length-1;i<len;i++){
				obj2=obj2[keys[i]];
			}
			obj2[keys[i]]=value;
		}
		return obj;
	},

	/** 
	* �õ�һ�������������ԣ�֧���������ֵ��÷�ʽ:
		getEx(obj, prop) -> obj[prop]
		getEx(obj, props) -> propValues
		getEx(obj, propJson) -> propJson
	* @method getEx
	* @static
	* @param {Object} obj Ŀ�����
	* @param {string | Array} prop �����string,��������(�������������������ַ���,��"style.display")��
		�����Array����props����
	* @param {boolean} returnJson �Ƿ���Ҫ����Json����
	* @returns {any|Array|Json} ��������ֵ
	* @example 
		getEx(obj,"style"); //����obj["style"];
		getEx(obj,"style.color"); //���� obj.style.color;
		getEx(obj,"style.color",true); //���� {"style.color":obj.style.color};
		getEx(obj,["id","style.color"]); //���� [obj.id, obj.style.color];
		getEx(obj,["id","style.color"],true); //���� {id:obj.id, "style.color":obj.style.color};
	*/
	getEx:function (obj,prop,returnJson){
		var ret,propType=ObjectH.getType(prop);
		if(propType == 'array'){
			if(returnJson){
				ret={};
				for(var i =0; i<prop.length;i++){
					ret[prop[i]]=ObjectH.getEx(obj,prop[i]);
				}
			}
			else{
				//getEx(obj, props)
				ret=[];
				for(var i =0; i<prop.length;i++){
					ret[i]=ObjectH.getEx(obj,prop[i]);
				}
			}
		}
		else {
			//getEx(obj, prop)
			var keys=(prop+"").split(".");
			ret=obj;
			for(var i=0;i<keys.length;i++){
				ret=ret[keys[i]];
			}
			if(returnJson) {
				var json={};
				json[prop]=ret;
				return json;
			}
		}
		return ret;
	}

};

QW.ObjectH=ObjectH;
})()
