
(function(){
var FunctionH=QW.FunctionH;
//JK begin-----
describe('FunctionH', {
	'FunctionH Members': function() {
		value_of('≤‚ ‘FunctionH”µ”–µƒ Ù–‘').log();
	},

	'bind': function() {
		var test=function(){
			return this.length;
		};
		value_of(FunctionH.bind(test,'hello')()).should_be(5);
	},	
	'methodize': function() {
		var setName=function(el,name){
			el.name=name;
		};
		var el={};
		el.setName=FunctionH.methodize(setName);
		el.setName('JK');
		value_of(el.name).should_be('JK');
	},	
	'unmethodize': function(){
		var setName=FunctionH.unmethodize(
			function(name){
				this.name=name;
			}
		);
		var el={};
		setName(el,'JK');
		value_of(el.name).should_be('JK');
	},
	'mul': function(){
		var setName=function(el,name){
			el.name=name;
		};
		var setElsName=FunctionH.mul(setName);
		var els=[{},{}];
		setElsName(els,'JK');
		value_of(els[0].name).should_be('JK');
		value_of(els[1].name).should_be('JK');
	},
	'rwrap': function(){
		function Wrap(core){this.core=core};
		var setName = function(el,name){
			el.name=name;
		}
		var setNameRWrap=FunctionH.rwrap(setName,Wrap,0);
		var el={};
		var elw=setNameRWrap(el,'JK');
		value_of(elw.core).should_be(el);	
		value_of(el.name).should_be('JK');	
	},
	'lazyApply': function(){
		value_of(typeof FunctionH.lazyApply).should_be('function');
	},
	'currying': function(){
		String.prototype.splitBySpace = FunctionH.curry(String.prototype.split,[' ']);

		value_of("a b c".splitBySpace()).log();

		var f = FunctionH.curry(function(a,b,c,d){
			return [a,b,c,d];
		},[1,,3]);

		value_of(f(2,4)).log();
	},

	'overload': function(){
		var f = FunctionH.overload(
			function(){return "..."},
			{
				"number" : function(a){
					return "number";
				},
				"string,..." : function(a){
					return "string,...";
				},
				"string" : function(a){
					return "string";
				},
				"*,string" : function(a,b){
					return ",string";
				},
				"...,string" : function(a,b){
					return "...,string";
				},
				"number,number,?...": function(a,b){
					return "number, number, ?...";
				}
			}
		);
		value_of(f(10)).log();
		value_of(f("a")).log();
		value_of(f(10,"a")).log();
		value_of(f(10,10,"a")).log();
		value_of(f("a",10)).log();
		value_of(f(10,10)).log();
		value_of(f(10,10,"string",10)).log();
		
		var g = FunctionH.overload(
			function(){
				return "...";
			},
			{
				"b is number" : function(a,b,c){
					return "b is number";
				},
				"b is string" : function(a,b,c){
					return "b is string";
				}
			},			
			function(args){ //dispatcher
				return "b is "+QW.ObjectH.getType(args[1]);
			}
		);
		value_of(g(1,2,3)).log();
		value_of(g(1,"2",3)).log();
	}
});

})();