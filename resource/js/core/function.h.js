/*
	author: wuliang
	author: JK
*/

/**
 * @class FunctionH 核心对象Function的扩展
 * @singleton 
 * @namespace QW
 * @helper
 */
(function(){
var QW=window.QW,
	getType=QW.ObjectH.getType,
	map=QW.ArrayH.map;

var FunctionH = {
	/**
	 * 函数包装器 curry
	 * <p>将一个方法的任意参数柯里化，传递给它一组参数，这组参数中不为undefined的值被接收，返回柯里化结果的方法</p>
	 * @method curry
	 * @static
	 * @param {function} func 被包装的函数
	 * @param {curryArgs} 柯里化参数
	 * @return {function} 被curry的方法
	 */
	curry : function(func, curryArgs){
		curryArgs = curryArgs || [];
		return function(){
			var args = [];
			var newArgs = [].slice.call(arguments);

			for(var i = 0, len = curryArgs.length; i < len; i++){
				if(i in curryArgs){
					args.push(curryArgs[i]);
				}else{
					if(newArgs.length){
						args.push(newArgs.shift());
					}
				}
			}

			args = args.concat(newArgs);
			return func.apply(this, args);
		}
	},

	/**
	 * 函数包装器 methodize，对函数进行methodize化，使其的第一个参数为this，或this[attr]。
	 * @method methodize
	 * @static
	 * @param {func} 要方法化的函数
	 * @optional {string} attr 属性
	 * @return {function} 已方法化的函数
	 */
	methodize: function(func,attr){
		if(attr) return function(){
			return func.apply(null,[this[attr]].concat([].slice.call(arguments)));
		};
		return function(){
			return func.apply(null,[this].concat([].slice.call(arguments)));
		};
	},
	/**
	 * 函数参数重载方法 overload，对函数参数进行模式匹配。默认的dispatcher支持*和...以及?，"*"表示一个任意类型的参数，"..."表示多个任意类型的参数，"?"一般用在",?..."表示0个或任意多个参数
	 * @method overload
	 * @static
	 * @param {func} 如果匹配不成功，默认执行的方法
	 * @param {func_maps} 根据匹配接受调用的函数列表
	 * @optional {dispatcher} 用来匹配参数负责派发的函数
	 * @return {function} 已重载化的函数
	 */
	overload: function(func, func_maps, dispatcher){
		if(!dispatcher){
			dispatcher = function(args){
				return map(args, function(o){return getType(o)}).join();
			}
		}

		return function(){
			var key = dispatcher.call(this, [].slice.apply(arguments));
			for(var i in func_maps){
				var pattern = new RegExp("^"+i.replace("*","[^,]*").replace("...",".*")+"$");
				if(pattern.test(key)){
					return func_maps[i].apply(this, arguments);
				}
			}
			return func.apply(this, arguments);
		};
	},
	/**
	 * methodize的反向操作
	 * @method unmethodize
	 * @static
	 * @param {func} 要反方法化的函数
	 * @optional {string} attr 属性
	 * @return {function} 已反方法化的函数
	 */
	unmethodize: function(func, attr){
		if(attr) return function(owner){
			return func.apply(owner[attr],[].slice.call(arguments, 1));
		};
		return function(owner){
			return func.apply(owner,[].slice.call(arguments, 1));
		};
	},
   /**
	* 对函数进行集化，使其在第一个参数为array时，结果也返回一个数组
	* @method mul
	* @static
	* @param {func} 
	* @return {Object} 已集化的函数
	*/
	mul: function(func, recursive){
		var newFunc = function(){
			var list = arguments[0], fn = recursive ? newFunc : func;

			if(list instanceof Array){
				var ret = [];
				var moreArgs = [].slice.call(arguments,0);
				for(var i = 0, len = list.length; i < len; i++){
					moreArgs[0]=list[i];
					var r = fn.apply(this, moreArgs);
					ret.push(r); 	
				}
				return ret;
			}else{
				return func.apply(this, arguments);
			}
		}
		return newFunc;
	},
	/**
	 * 函数返回值重定向变换
	 * @method rwrap
	 * @static
	 * @param {func} 
	 * @return {Function}
	 */	
	rdir: function(func,idx){
		idx = idx | 0;
		return function(){ 
			var ret = func.apply(this,arguments); 
			if(idx >= 0)
				return arguments[idx];
			return ret;
		}
	},
	/**
	 * 函数包装变换
	 * @method rwrap
	 * @static
	 * @param {func} 
	 * @return {Function}
	 */
	rwrap: function(func,wrapper,idx){
		var fn = FunctionH.rdir(func, idx);

		return function(){
			var ret = fn.apply(this, arguments);
			if(null != ret)
				return new wrapper(ret);
			return ret;
		}
	},
	/**
	 * 绑定
	 * @method bind
	 * @static
	 * @param {func} 
	 * @return {Function}
	 */
	bind: function(func, thisObj){
		return function(){
			return func.apply(thisObj, arguments);
		}
	},
	/** 
	* 懒惰执行某函数：一直到不得不执行的时候才执行。
	* @method lazyApply
	* @static
	* @param {Function} fun  调用函数
	* @param {Object} thisObj  相当于apply方法的thisObj参数
	* @param {Array} argArray  相当于apply方法的argArray参数
	* @param {int} ims  interval毫秒数，即window.setInterval的第二个参数.
	* @param {Function} checker  定期运行的判断函数，传给它的参数为：checker.call(thisObj,argArray,ims,checker)。<br/>
		对于不同的返回值，得到不同的结果：<br/>
			返回true或1，表示需要立即执行<br/>
			返回-1，表示成功偷懒，不用再执行<br/>
			返回其它值，表示暂时不执行<br/>
	@return {int}  返回interval的timerId
	*/
	lazyApply:function(fun,thisObj,argArray,ims,checker){
		var timer=function(){
			var verdict=checker.call(thisObj,argArray,ims,timerId);
			if(verdict==1){
				fun.apply(thisObj,argArray||[]);
			}
			if(verdict==1 || verdict==-1){
				clearInterval(timerId);
			}
		};
		var timerId=setInterval(timer,ims);
		return timerId;
	}
};

QW.FunctionH=FunctionH;

})();