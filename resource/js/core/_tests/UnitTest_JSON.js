
(function(){
var type_of=function(v){
	return value_of(QW.ObjectH.getType(v));
};

describe('JSON', {
	'����-�����ݶ���': function() {
		var objString = '{}';
		var obj = JSON.parse(objString);
		type_of(obj).should_be('object');
	},
	'����-��������': function() {
		var objString = '{"key1":1}';
		var obj = JSON.parse(objString);
		value_of(obj.key1).should_be(1);
	},
	'����-����ֵ����': function() {
		var objString = '{"key1":true}';
		var obj = JSON.parse(objString);
		value_of(obj.key1).should_be(true);
	},
	'����-�ַ�������': function() {
		var objString = '{"key1":"hello world"}';
		var obj = JSON.parse(objString);
		value_of(obj.key1).should_be('hello world');
	},
	'����-��������': function() {
		var objString = '{"key1":[1,2,3,4,5]}';
		var obj = JSON.parse(objString);
		value_of(obj.key1[0]).should_be(1);
	},
	'����-���Ƕ��-1': function() {
		var objString = '{"key1":{"key11":"hello world"}}';
		var obj = JSON.parse(objString);
		value_of(obj.key1.key11).should_be('hello world');
	},
	'����-���Ƕ��-2': function() {
		var objString = '{"key1":{"key11":[1,2,3,4]}}';
		var obj = JSON.parse(objString);
		value_of(obj.key1.key11[3]).should_be(4);
	},
	'����-���Ƕ��-3': function() {
		var objString = '{"key1":{"key11":[1,2,3,4,{"key111":"hello world"}]}}';
		var obj = JSON.parse(objString);
		value_of(obj.key1.key11[4].key111).should_be('hello world');
	},
	'����-������': function() {
		var objString = '[1,true,"hello world"]';
		var obj = JSON.parse(objString);
		value_of(obj[2]).should_be('hello world');
	},
	'����ֵ-true': function() {
		var objString = 'true';
		var obj = JSON.parse(objString);
		value_of(obj).should_be(true);
	},
	'����ֵ-false': function() {
		var objString = 'false';
		var obj = JSON.parse(objString);
		value_of(obj).should_be(false);
	},
	'����': function() {
		var objString = '20090901';
		var obj = JSON.parse(objString);
		value_of(obj).should_be(20090901);
	},
	'�ն���': function() {
		var objString = 'null';
		var obj = JSON.parse(objString);
		value_of(obj).should_be(null);
	},
	'������': function() {
		var objString = '{"key1":1231321312321321313213213213213213132132131232132132112313213123213213132132132132132131321321312321321321123132131232132131321321321321321313213213123213213211231321312321321313213213213213213132132131232132132112313213123213213132132132132132131321321312321321321123132131232132131321321321321321313213213123213213211231321312321321313213213213213213132132131232132132112313213123213213132132132132132131321321312321321321123132131232132131321321321321321313213213123213213211231321312321321313213213213213213132132131232132132112313213123213213132132132132132131321321312321321321}';
		var obj = JSON.parse(objString);
		value_of(obj.key1).should_be(Infinity);
	},
	'�Ƿ�JSON�ַ���1': function() {
		var objString = '{';
		var ex = false;
		try{
			var obj = JSON.parse(objString);
		}
		catch(e){
			ex = true;
		}
		/*���δ�׳��쳣���������δͨ��*/
		if( !ex ){
			value_of(this).should_fail('���ڷǷ���JSON��ʽδ�׳��쳣����������δͨ����');
		}
		else{
			value_of('�Ƿ���JSON��ʽ').log('���ڷǷ���JSON�ַ�������ʱ�׳����쳣����������ͨ����');
		}
	},
	'�Ƿ�JSON�ַ���2': function() {
		var objString = '';
		var ex = false;
		try{
			var obj = JSON.parse(objString);
		}
		catch(e){
			ex = true;
		}
		/*���δ�׳��쳣���������δͨ��*/
		if( !ex ){
			value_of(obj).log();
			value_of(this).should_fail('���ڷǷ���JSON��ʽδ�׳��쳣����������δͨ����');
		}
		else{
			value_of('�Ƿ���JSON��ʽ').log('���ڷǷ���JSON�ַ�������ʱ�׳����쳣����������ͨ����');
		}
	},
	'�Ƿ�JSON�ַ���3': function() {
		var objString = 'aaaaa';
		var ex = false;
		try{
			var obj = JSON.parse(objString);
		}
		catch(e){
			ex = true;
		}
		/*���δ�׳��쳣���������δͨ��*/
		if( !ex ){
			value_of(this).should_fail('���ڷǷ���JSON��ʽδ�׳��쳣����������δͨ����');
		}
		else{
			value_of('�Ƿ���JSON��ʽ').log('���ڷǷ���JSON�ַ�������ʱ�׳����쳣����������ͨ����');
		}
	},
	'�Ƿ�JSON�ַ���4': function() {
		var objString = 'undefined';
		var ex = false;
		try{
			var obj = JSON.parse(objString);
		}
		catch(e){
			ex = true;
		}
		/*���δ�׳��쳣���������δͨ��*/
		if( !ex ){
			value_of(this).should_fail('���ڷǷ���JSON��ʽδ�׳��쳣����������δͨ����');
		}
		else{
			value_of('�Ƿ���JSON��ʽ').log('���ڷǷ���JSON�ַ�������ʱ�׳����쳣����������ͨ����');
		}
	},
	'�Ƿ�JSON�ַ���5': function() {
		var objString = 'NaN';
		var ex = false;
		try{
			var obj = JSON.parse(objString);
		}
		catch(e){
			ex = true;
		}
		/*���δ�׳��쳣���������δͨ��*/
		if( !ex ){
			value_of(this).should_fail('���ڷǷ���JSON��ʽδ�׳��쳣����������δͨ����');
		}
		else{
			value_of('�Ƿ���JSON��ʽ').log('���ڷǷ���JSON�ַ�������ʱ�׳����쳣����������ͨ����');
		}
	},
	'�Ƿ�JSON�ַ���6': function() {
		var objString = '{"key1":undefined}';
		var ex = false;
		try{
			var obj = JSON.parse(objString);
		}
		catch(e){
			ex = true;
		}
		/*���δ�׳��쳣���������δͨ��*/
		if( !ex ){
			value_of(this).should_fail('���ڷǷ���JSON��ʽδ�׳��쳣����������δͨ����');
		}
		else{
			value_of('�Ƿ���JSON��ʽ').log('���ڷǷ���JSON�ַ�������ʱ�׳����쳣����������ͨ����');
		}
	},
	'�Ƿ�JSON�ַ���7': function() {
		var objString = '{"key1":NaN}';
		var ex = false;
		try{
			var obj = JSON.parse(objString);
		}
		catch(e){
			ex = true;
		}
		/*���δ�׳��쳣���������δͨ��*/
		if( !ex ){
			value_of(this).should_fail('���ڷǷ���JSON��ʽδ�׳��쳣����������δͨ����');
		}
		else{
			value_of('�Ƿ���JSON��ʽ').log('���ڷǷ���JSON�ַ�������ʱ�׳����쳣����������ͨ����');
		}
	},
	'���ʽ': function() {
		/*��������Firefox3.5��IE8�����쳣����Chrome�°��ձ��ʽ���м���*/
		var objString = '(59+1)*2 / 2 - 1';
		var ex = false;
		try{
			var obj = JSON.parse(objString);
		}
		catch(e){
			ex = true;
		}
		/*����׳��쳣���������δͨ��*/
		if( !ex ){
			value_of(this).should_fail('����JSON��ʽ���󣬵����׳��쳣��');
		}
		else{
			value_of(objString).log('�Ƿ���JSON��ʽ');
		}
	},
	'����-reviver1': function() {
		var str = '{"key1":1,"key2":{"key21":2}}';
		var obj = JSON.parse(str,function(k,v){
			if( k == 'key21' ) return 'hello world';
			return v;
		});
		value_of(obj.key2.key21).should_be('hello world');
	},
	'����-reviver2': function() {
		var str = '{"key1":1,"key2":{"key21":2}}';
		var obj = JSON.parse(str,function(k,v){
			if( k == 'key21' ) return null;
			return v;
		});
		value_of(obj.key2.key21).should_be(null);
	},
	'����-reviver3': function() {
		var str = '{"key1":1,"key2":{"key21":2}}';
		var obj = JSON.parse(str,function(k,v){
			if( k == 'key21' ) return NaN;
			return v;
		});
		if( !isNaN(obj.key2.key21) )
			value_of(this).should_fail('obj��ֵӦ����NaN');
	},
	'����-reviver4': function() {
		var str = '{"key1":1,"key2":{"key21":2}}';
		var obj = JSON.parse(str,function(k,v){
			if( k == 'key21' ) return [1,2,3,4];
			return v;
		});
		value_of(obj.key2.key21[3]).should_be(4);
	},
	'����-reviver5': function() {
		var str = '{"key1":1,"key2":{"key21":2}}';
		var obj = JSON.parse(str,function(k,v){
			if( k == 'key21' ) return {testkey:'hello world'};
			return v;
		});
		value_of(obj.key2.key21.testkey).should_be('hello world');
	},
	'����-reviver6': function() {
		var str = '{"key1":1,"key2":{"key21":2}}';
		var obj = JSON.parse(str,function(k,v){
			if( k == 'key21' ) return 2009;
			return v;
		});
		value_of(obj.key2.key21).should_be(2009);
	},
	'����-reviver7': function() {
		var str = '{"key1":1,"key2":{"key21":2}}';
		var obj = JSON.parse(str,function(k,v){
			if( k == 'key21' ) return '';
			return v;
		});
		value_of(obj.key2.key21).should_be('');
	},
	'����-reviver8': function() {
		var str = '{"key1":1,"key2":{"key21":2}}';
		var obj = JSON.parse(str,function(k,v){
			if( k == '' ) return 2009;
			return v;
		});
		value_of(obj).should_be(2009);
	},
	'����-reviver9': function() {
		var str = '{"key1":1,"key2":{"key21":2}}';
		var obj = JSON.parse(str,function(k,v){
			return '';
		});
		value_of(obj).should_be('');
	},
	'����-reviver10': function() {
		var str = '{"key1":1,"key2":{"key21":2}}';
		var obj = JSON.parse(str,function(k,v){
			if( k == 'key21' ) return true;
			return v;
		});
		value_of(obj.key2.key21).should_be(true);
	},
	'����-reviver11': function() {
		var str = '{"key1":1,"key2":{"key21":2}}';
		var obj = JSON.parse(str,function(k,v){
			if( k == 'key21' ) return false;
			return v;
		});
		value_of(obj.key2.key21).should_be(false);
	},
	'����-reviver12': function() {
		var str = '{"key1":1,"key2":{"key21":2}}';
		var obj = JSON.parse(str,function(k,v){
			if( k == 'key2' ) return null;
			return v;
		});
		value_of(obj.key2).should_be(null);
	},
	'����-reviver13': function() {
		var str = '{"key1":1,"key2":{"key21":2}}';
		var obj = JSON.parse(str,function(k,v){
			if( k == 'key21' ) return undefined;
			return v;
		});
		value_of(obj.hasOwnProperty()).should_be(false);
	}
})
describe('JSON.stringify', {
	'before': function() {
		
	},
	'����-������': function() {
		var obj = {};
		var objString = JSON.stringify(obj);
		value_of(objString).should_be('{}');
	},
	'����-��������': function() {
		var obj = {key1:2009};
		var objString = JSON.stringify(obj);
		value_of(objString).should_be('{"key1":2009}');
	},
	'����-����ֵ����1': function() {
		var obj = {key1:true};
		var objString = JSON.stringify(obj);
		value_of(objString).should_be('{"key1":true}');
	},
	'����-����ֵ����2': function() {
		var obj = {key1:false};
		var objString = JSON.stringify(obj);
		value_of(objString).should_be('{"key1":false}');
	},
	'����-�ַ�������': function() {
		var obj = {key1:'hello world'};
		var objString = JSON.stringify(obj);
		value_of(objString).should_be('{"key1":"hello world"}');
	},
	'����-NULL����': function(){
		var obj = {key1:null};
		var objString = JSON.stringify(obj);
		value_of(objString).should_be('{"key1":null}');
	},
	'����-UNDEFINED����': function() {
		var obj = {key1:undefined};
		var objString = JSON.stringify(obj);
		value_of(objString).should_be('{}');
	},
	'����-NaN����': function() {
		var obj = {key1:NaN};
		var objString = JSON.stringify(obj);
		value_of(objString).should_be('{"key1":null}');
	},
	'����-��������': function() {
		var obj = {key1:[1,2,3,4]};
		var objString = JSON.stringify(obj);
		value_of(objString).should_be('{"key1":[1,2,3,4]}');
	},
	'����-����Ƕ�׶�������': function() {
		var obj = {key1:[1,2,3,{key11:[1,2,3,{key111:'hello world'}]}]};
		var objString = JSON.stringify(obj);
		value_of(objString).should_be('{"key1":[1,2,3,{"key11":[1,2,3,{"key111":"hello world"}]}]}');
	},
	'����-��������': function() {
		var obj = {key1:{key11:'hello world'}};
		var objString = JSON.stringify(obj);
		value_of(objString).should_be('{"key1":{"key11":"hello world"}}');
	},
	'����-����Ƕ����������': function() {
		var obj = {key1:{key11:[1,2,3,4]}};
		var objString = JSON.stringify(obj);
		value_of(objString).should_be('{"key1":{"key11":[1,2,3,4]}}');
	},
	'����-�ն���': function() {
		var obj = null;
		var objString = JSON.stringify(obj);
		value_of(objString).should_be('null');
	},
	'����': function() {
		var obj = [1,true,false,'hello world',null,undefined,NaN,{key:'hello world'}];
		var objString = JSON.stringify(obj);
		value_of(objString).should_be('[1,true,false,"hello world",null,null,null,{"key":"hello world"}]');
	},
	'ת���ַ�': function() {
		var obj = ['	"'];
		var objString = JSON.stringify(obj);
		value_of(objString).should_be('["\\t\\""]');
	},
	'����': function() {
		/*��������Firefox3.5�л�������ֵ�����Ϊ"2009-12-31T15:59:59000Z"����IE8��Chrome��Ϊ"2009-12-31T15:59:59Z"*/
		var obj = new Date("December 31, 2009 23:59:59");
		var objString = JSON.stringify(obj);
		value_of(objString).should_be('"2009-12-31T15:59:59Z"');
	},
	'�ַ���': function() {
		var obj = 'hello world';
		var objString = JSON.stringify(obj);
		value_of(objString).should_be('"hello world"');
	},
	'NULL': function() {
		var obj = null;
		var objString = JSON.stringify(obj);
		value_of(objString).should_be('null');
	},
	'UNDEFINED': function() {
		/*��������IE�з��ص����ַ���"undefined"����Firefox��Chrome�з��ص���undefined*/
		var obj = undefined;
		var objString = JSON.stringify(obj);
		value_of(objString).should_be(undefined);
	},
	'����������': function() {
		var obj = {key1:'hello world',key2:function(){}};
		var objString = JSON.stringify(obj);
		value_of(objString).should_be('{"key1":"hello world"}');
	},
	'ѭ������': function() {
		var obj = {};
		obj.key1 = obj;
		var ex = false;
		try{
			var objString = JSON.stringify(obj);
		}
		catch(e){
			ex = true;
		}
		if( !ex ){
			value_of(this).should_fail('����ѭ������ȴδ�׳��쳣����������δͨ����');
		}
		else{
			value_of('').log('ѭ�����õ��¶�ջ���');
		}
	},
	'�Զ���toJSON����1': function() {
		var _d_toJSON = Date.prototype.toJSON;
		var _n_toJSON = Number.prototype.toJSON;
		var _b_toJSON = Boolean.prototype.toJSON;
		var _s_toJSON = String.prototype.toJSON;
		
		Date.prototype.toJSON = function(){
			return 'test date';
		};
		
		var d = new Date();
		var obj = {date:d};
		var objString = JSON.stringify(obj);
		value_of(objString).should_be('{"date":"test date"}');

		Date.prototype.toJSON = _d_toJSON;
		Number.prototype.toJSON = _n_toJSON;
		Boolean.prototype.toJSON = _b_toJSON;
		String.prototype.toJSON = _s_toJSON;
	},
	'�Զ���toJSON����2': function() {
		var _d_toJSON = Date.prototype.toJSON;
		var _n_toJSON = Number.prototype.toJSON;
		var _b_toJSON = Boolean.prototype.toJSON;
		var _s_toJSON = String.prototype.toJSON;
		
		Date.prototype.toJSON = function(){
			return {key:'test'};
		};
		
		var d = new Date();
		var obj = {date:d};
		var objString = JSON.stringify(obj);
		value_of(objString).should_be('{"date":{"key":"test"}}');

		Date.prototype.toJSON = _d_toJSON;
		Number.prototype.toJSON = _n_toJSON;
		Boolean.prototype.toJSON = _b_toJSON;
		String.prototype.toJSON = _s_toJSON;
	},
	'����-function replacer1': function() {
		/*��������IE8��Chrome�в���ͨ������Firefox3.5�в���ʧ��*/
		var obj = {key1:[1,2,3,{key11:[1,2,3,{key111:'hello world'}]}]};
		var objString = JSON.stringify(obj,function(k,v){
			if( k == 'key111' )
				return 'new value';
			return v;
		});
		value_of(objString).should_be('{"key1":[1,2,3,{"key11":[1,2,3,{"key111":"new value"}]}]}');
	},
	'����-function replacer2': function() {
		/*��������IE8��Chrome�в���ͨ������Firefox3.5�в���ʧ��*/
		var obj = {key1:[1,2,3,{key11:[1,2,3,{key111:'hello world'}]}]};
		var objString = JSON.stringify(obj,function(k,v){
			if( k == 'key111' )
				return null;
			return v;
		});
		value_of(objString).should_be('{"key1":[1,2,3,{"key11":[1,2,3,{"key111":null}]}]}');
	},
	'����-function replacer3': function() {
		var obj = {key1:[1,2,3,{key11:[1,2,3,{key111:'hello world'}]}]};
		var objString = JSON.stringify(obj,function(k,v){
			if( k == 'key111' )
				return undefined;
			return v;
		});
		value_of(objString).should_be('{"key1":[1,2,3,{"key11":[1,2,3,{}]}]}');
	},
	'����-function replacer4': function() {
		var obj = {key1:[1,2,3,{key11:[1,2,3,{key111:'hello world'}]}]};
		var objString = JSON.stringify(obj,function(k,v){
			if( k == '' )
				return {};
			return v;
		});
		value_of(objString).should_be('{}');
	},
	'����-function replacer5': function() {
		/*��������IE8��Chrome�в���ͨ������Firefox3.5�в���ʧ��*/
		var obj = {key1:[1,2,3,{key11:[1,2,3,{key111:'hello world'}]}]};
		var objString = JSON.stringify(obj,function(k,v){
			if( k == 'key111' )
				return NaN;
			return v;
		});
		value_of(objString).should_be('{"key1":[1,2,3,{"key11":[1,2,3,{"key111":null}]}]}');
	},
	'����-function replacer6': function() {
		/*��������IE8��Chrome�в���ͨ������Firefox3.5�в���ʧ��*/
		var obj = {key1:[1,2,3,{key11:[1,2,3,{key111:'hello world'}]}]};
		var objString = JSON.stringify(obj,function(k,v){
			if( k == 'key111' )
				return function(){};
			return v;
		});
		value_of(objString).should_be('{"key1":[1,2,3,{"key11":[1,2,3,{}]}]}');
	},
	'����-array replacer1': function() {
		var obj = {key1:[1,2,3,{key11:[1,2,3,{key111:'hello world'}]}],key2:1,key3:1};
		var objString = JSON.stringify(obj,['key2','key3']);
		value_of(objString).should_be('{"key2":1,"key3":1}');
	},
	'����-array replacer2': function() {
		var obj = {key1:[1,2,3,{key11:[1,2,3,{key111:'hello world'}]}],key2:1,key3:1};
		var objString = JSON.stringify(obj,['key11']);
		value_of(objString).should_be('{}');
	},
	'����-array replacer3': function() {
		var obj = {key1:[1,2,3,{key11:[1,2,3,{key111:'hello world'}]}],key2:1,key3:1};
		var objString = JSON.stringify(obj,['key1','key11']);
		value_of(objString).should_be('{"key1":[1,2,3,{"key11":[1,2,3,{}]}]}');
	},
	'����-array replacer4': function() {
		var obj = {key1:['key2','key3']};
		var objString = JSON.stringify(obj,['key1']);
		value_of(objString).should_be('{"key1":["key2","key3"]}');
	},
	'����-array replacer5': function() {
		var obj = {key1:[1,2,3,{key11:[1,2,3,{key111:'hello world'}]}]};
		var objString = JSON.stringify(obj,[undefined,null,true,false,NaN,function(){},{}]);
		value_of(objString).should_be('{}');
	},
	'����-array replacer1': function() {
		var obj = [1,2,3,4,5,6];
		var objString = JSON.stringify(obj,[1,2,3]);
		value_of(objString).should_be('[1,2,3,4,5,6]');
	},
	'����-function replacer1': function() {
		var obj = [1,2,3,4,5,6];
		var objString = JSON.stringify(obj,function(k,v){			
			return 'a';
		});
		value_of(objString).should_be('"a"');
	},
	'����-function replacer2': function() {
		var obj = [1,2,3,4,5,6];
		var objString = JSON.stringify(obj,function(k,v){			
			if( k == 1 )
				return 'test';
			return v;
		});
		value_of(objString).should_be('[1,"test",3,4,5,6]');
	},
	'����-function replacer3': function() {
		var obj = [1,2,3,4,5,6];
		var objString = JSON.stringify(obj,function(k,v){			
			if( k == 1 )
				return {a:1,b:{c:1}};
			return v;
		});
		value_of(objString).should_be('[1,{"a":1,"b":{"c":1}},3,4,5,6]');
	},
	/*�������ᵼ�¹���ĵݹ�������ջ�����ԭ����JSON��Ҳ���
	'����-function replacer4': function() {
		var obj = [1,2,3,4,5,6];
		var objString = JSON.stringify(obj,function(k,v){			
			if( k == 1 )
				return {a:1,b:{c:[1,2,'hello world',{d:'ok'}]}};
			return v;
		});
		value_of(objString).should_be('[1,{"a":1,"b":{"c":1}},3,4,5,6]');
	},
	*/
	'����-function replacer5': function() {
		var obj = [1,2,3,4,5,6];
		var objString = JSON.stringify(obj,function(k,v){			
			if( k == 1 )
				return function(){};
			return v;
		});
		value_of(objString).should_be('[1,null,3,4,5,6]');
	}

});

})();