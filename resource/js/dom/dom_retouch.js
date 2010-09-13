//test
void function () {
	var QW = window.QW
		, ObjectH = QW.ObjectH
		, mix = ObjectH.mix
		, getType = ObjectH.getType
		, push = Array.prototype.push
		, HH = QW.HelperH
		, applyTo = HH.applyTo
		, methodizeTo = HH.methodizeTo
		, NodeH = QW.NodeH
		, $ = NodeH.$
		, query = NodeH.query
		, contains = NodeH.contains
		, EventTargetH = QW.EventTargetH
		, EventW = QW.EventW
		, NodeC = QW.NodeC;


	/*
	 * EventTarget Helper onfire 方法扩展
	 * @class EventTargetH
	 * usehelper QW.EventTargetH
	*/

	EventTargetH.fireHandler = function (element, e, handler, name) {
		var we = new EventW(e);
		return handler.call(element, we);
	};

	/*
	 * Node Helper 扩展
	 * @class NodeH
	 * @usehelper QW.NodeH
	 */
	mix(NodeH,EventTargetH);
	HH.gsetter(NodeH,NodeC.gsetterMethods);//生成gsetters


	var NodeH2 = HH.mul(QW.NodeH, true);
	HH.gsetter(NodeH2,NodeC.gsetterMethods);//生成gsetters

	/**
	* @class Dom 将QW.DomU与QW.NodeH合并到QW.Dom里，以跟旧的代码保持一致
	* @singleton 
	* @namespace QW
	*/
	var Dom = QW.Dom = {};
	mix(Dom, [QW.DomU, NodeH2]);




	/**
	*@class NodeW Element包装器。
	* <p>NodeW除了集成NodeH的方法之外，也可以根据实际需要集成更多的方法。支持以下两种调用方式</p>
	* <p>构造方式：var w=new NodeW(core);</p>
	* <p>函数方式：var w=NodeW(sSelector,refEl);</p>
	*@namespace QW
	*/

	/** 
	* 获得element对象的outerHTML属性
	* @method	outerHTML
	* @param	{object}				doc		(Optional)document 默认为 当前document
	* @return	{string}				如果是多个element的包装则返回结果数组
	*/

	/** 
	* 判断element是否包含某个className
	* @method	hasClass
	* @param	{string}				className	样式名
	* @return	{boolean}				如果是多个element的包装则返回结果数组
	*/

	/** 
	* 给element添加className
	* @method	addClass
	* @param	{string}				className	样式名
	* @return	{NodeW}					自己
	*/

	/** 
	* 移除element某个className
	* @method	removeClass
	* @param	{string}				className	样式名
	* @return	{NodeW}					自己
	*/

	/** 
	* 替换element的className
	* @method	replaceClass
	* @param	{string}				oldClassName	目标样式名
	* @param	{string}				newClassName	新样式名
	* @return	{NodeW}					自己
	*/

	/** 
	* element的className1和className2切换
	* @method	toggleClass
	* @param	{string}				className1		样式名1
	* @param	{string}				className2		(Optional)样式名2
	* @return	{NodeW}					自己
	*/

	/** 
	* 显示element对象
	* @method	show
	* @param	{string}				value		(Optional)display的值 默认为空
	* @return	{NodeW}					自己
	*/

	/** 
	* 隐藏element对象
	* @method	hide
	* @return	{NodeW}					自己
	*/

	/** 
	* 隐藏/显示element对象
	* @method	toggle
	* @param	{string}				value		(Optional)显示时display的值 默认为空
	* @return	{NodeW}					自己
	*/

	/** 
	* 判断element对象是否可见
	* @method	isVisible
	* @return	{boolean}				如果是多个element的包装则返回结果数组
	*/

	/** 
	* 获取element对象距离doc的xy坐标
	* @method	getXY
	* @return	{array}					x, y	如果是多个element的包装则返回结果数组
	*/

	/** 
	* 设置element对象的xy坐标
	* @method	setXY
	* @param	{int}					x			(Optional)x坐标 默认不设置
	* @param	{int}					y			(Optional)y坐标 默认不设置
	* @return	{NodeW}					自己
	*/

	/** 
	* 设置element对象的offset宽高
	* @method	setSize
	* @param	{int}					w			(Optional)宽 默认不设置
	* @param	{int}					h			(Optional)高 默认不设置
	* @return	{NodeW}					自己
	*/

	/** 
	* 设置element对象的宽高
	* @method	setInnerSize
	* @param	{int}					w			(Optional)宽 默认不设置
	* @param	{int}					h			(Optional)高 默认不设置
	* @return	{NodeW}					自己
	*/

	/** 
	* 设置element对象的offset宽高和xy坐标
	* @method	setRect
	* @param	{int}					x			(Optional)x坐标 默认不设置
	* @param	{int}					y			(Optional)y坐标 默认不设置
	* @param	{int}					w			(Optional)宽 默认不设置
	* @param	{int}					h			(Optional)高 默认不设置
	* @return	{NodeW}					自己
	*/

	/** 
	* 设置element对象的宽高和xy坐标
	* @method	setRect
	* @param	{int}					x			(Optional)x坐标 默认不设置
	* @param	{int}					y			(Optional)y坐标 默认不设置
	* @param	{int}					w			(Optional)宽 默认不设置
	* @param	{int}					h			(Optional)高 默认不设置
	* @return	{NodeW}					自己
	*/

	/** 
	* 获取element对象的宽高
	* @method	getSize
	* @return	{object}				width,height	如果是多个element的包装则返回结果数组
	*/

	/** 
	* 获取element对象的宽高和xy坐标
	* @method	setRect
	* @return	{object}				width,height,left,top,bottom,right	如果是多个element的包装则返回结果数组
	*/

	/** 
	* 向后获取element对象复合条件的兄弟节点
	* @method	nextSibling
	* @param	{string}				selector	(Optional)简单选择器 默认为空即最近的兄弟节点
	* @return	{NodW}					找到的node或null	如果是多个element的包装则返回结果数组
	*/

	/** 
	* 向前获取element对象复合条件的兄弟节点
	* @method	previousSibling
	* @param	{string}				selector	(Optional)简单选择器 默认为空即最近的兄弟节点
	* @return	{NodW}					找到的node或null	如果是多个element的包装则返回结果数组
	*/

	/** 
	* 向上获取element对象复合条件的兄弟节点
	* @method	previousSibling
	* @param	{string}				selector	(Optional)简单选择器 默认为空即最近的兄弟节点
	* @return	{NodW}					找到的node或null	如果是多个element的包装则返回结果数组
	*/

	/** 
	* 向上获取element对象复合条件的兄弟节点
	* @method	previousSibling
	* @param	{string}				selector	(Optional)简单选择器 默认为空即最近的兄弟节点
	* @return	{NodeW}					找到的node或null	如果是多个element的包装则返回结果数组
	*/

	/** 
	* 向上获取element对象复合条件的兄弟节点
	* @method	parentNode
	* @param	{string}				selector	(Optional)简单选择器 默认为空即最近的兄弟节点
	* @return	{NodeW}					找到的node或null	如果是多个element的包装则返回结果数组
	*/

	/** 
	* 从element对象内起始位置获取复合条件的节点
	* @method	firstChild
	* @param	{string}				selector	(Optional)简单选择器 默认为空即最近的兄弟节点
	* @return	{NodeW}					找到的node或null	如果是多个element的包装则返回结果数组
	*/

	/** 
	* 从element对象内结束位置获取复合条件的节点
	* @method	lastChild
	* @param	{string}				selector	(Optional)简单选择器 默认为空即最近的兄弟节点
	* @return	{NodeW}					找到的node或null	如果是多个element的包装则返回结果数组
	*/

	/** 
	* 判断目标是否是element对象的子孙节点
	* @method	contains
	* @param	{element|string|wrap}	target		目标 id,Element实例或wrap
	* @return	{boolean}				判断结果	如果是多个element的包装则返回结果数组
	*/

	/** 
	* 向element对象前/后，内起始，内结尾插入html
	* @method	insertAdjacentHTML
	* @param	{string}				type		位置类型
	* @param	{element|string|wrap}	html		插入的html
	* @return	{NodeW}					自己
	*/

	/** 
	* 向element对象前/后，内起始，内结尾插入element对象
	* @method	insertAdjacentElement
	* @param	{string}				type		位置类型
	* @param	{element|string|wrap}	target		目标id,Element实例或wrap
	* @return	{NodeW}					目标element对象	如果是多个element的包装则返回结果数组
	*/

	/** 
	* 向element对象内追加element对象
	* @method	firstChild
	* @param	{element|string|wrap}	target		目标id,Element实例或wrap
	* @return	{NodeW}					目标element对象	如果是多个element的包装则返回结果数组
	*/

	/** 
	* 向element对象前插入element对象
	* @method	insertSiblingBefore
	* @param	{element|string|wrap}	nelement	目标id,Element实例或wrap
	* @return	{NodeW}					目标element对象	如果是多个element的包装则返回结果数组
	*/

	/** 
	* 向element对象后插入element对象
	* @method	insertSiblingAfter
	* @param	{element|string|wrap}	nelement	目标id,Element实例或wrap
	* @return	{NodeW}					目标element对象	如果是多个element的包装则返回结果数组
	*/

	/** 
	* 向element对象内部的某元素前插入element对象
	* @method	insertBefore
	* @param	{element|string|wrap}	nelement	目标id,Element实例或wrap
	* @param	{element|string|wrap}	relement	插入到id,Element实例或wrap前
	* @return	{NodeW}					目标element对象	如果是多个element的包装则返回结果数组
	*/

	/** 
	* 向element对象内部的某元素后插入element对象
	* @method	insertAfter
	* @param	{element|string|wrap}	nelement	目标id,Element实例或wrap
	* @param	{element|string|wrap}	nelement	插入到id,Element实例或wrap后
	* @return	{NodeW}					目标element对象	如果是多个element的包装则返回结果数组
	*/

	/** 
	* 把自己和目标替换
	* @method	replaceNode
	* @param	{element|string|wrap}	target		目标id,Element实例或wrap
	* @return	{NodeW}					如替换成功，此方法可返回被替换的节点，如替换失败，则返回 NULL	如果是多个element的包装则返回结果数组
	*/

	/** 
	* 从element里把relement替换成nelement
	* @method	replaceChild
	* @param	{element|string|wrap}	nelement	新节点id,Element实例或wrap
	* @param	{element|string|wrap}	relement	被替换的id,Element实例或wrap后
	* @return	{NodeW}					如替换成功，此方法可返回被替换的节点，如替换失败，则返回 NULL	如果是多个element的包装则返回结果数组
	*/

	/** 
	* 把element移除掉
	* @method	removeNode
	* @return	{NodeW}					如删除成功，此方法可返回被删除的节点，如失败，则返回 NULL。	如果是多个element的包装则返回结果数组
	*/

	/** 
	* 从element里把target移除掉
	* @method	removeChild
	* @param	{element|string|wrap}	target		目标id,Element实例或wrap后
	* @return	{NodeW}					如删除成功，此方法可返回被删除的节点，如失败，则返回 NULL。	如果是多个element的包装则返回结果数组
	*/

	/** 
	* 对元素调用ObjectH.get
	* @method	get
	* @param	{string}				property	成员名称
	* @return	{object}				成员引用	如果是多个element的包装则返回结果数组
	* @see ObjectH.getEx
	*/

	/** 
	* 对元素调用ObjectH.set
	* @method	set
	* @param	{string}				property	成员名称
	* @param	{object}				value		成员引用/内容
	* @return	{NodeW}					自己
	* @see ObjectH.setEx
	*/
	
	/** 
	* 获取element对象的属性
	* @method	getAttr
	* @param	{string}				attribute	属性名称
	* @param	{int}					iFlags		(Optional)ieonly 获取属性值的返回类型 可设值0,1,2,4 
	* @return	{string}				属性值 ie里有可能不是object		如果是多个element的包装则返回结果数组
	*/

	/** 
	* 设置element对象的属性
	* @method	setAttr
	* @param	{string}				attribute	属性名称
	* @param	{string}				value		属性的值
	* @param	{int}					iCaseSensitive	(Optional)
	* @return	{NodeW}					自己
	*/

	/** 
	* 删除element对象的属性
	* @method	removeAttr
	* @param	{string}				attribute	属性名称
	* @param	{int}					iCaseSensitive	(Optional)
	* @return	{NodeW}					自己
	*/

	/** 
	* 根据条件查找element内元素
	* @method	query
	* @param	{string}				selector	条件
	* @return	{array}					element元素数组		如果是多个element的包装则返回结果数组
	*/

	/** 
	* 查找element内所有包含className的集合
	* @method	getElementsByClass
	* @param	{string}				className	样式名
	* @return	{array}					element元素数组		如果是多个element的包装则返回结果数组
	*/

	/** 
	* 获取element的value
	* @method	getValue
	* @return	{string}				元素value		如果是多个element的包装则返回结果数组
	*/

	/** 
	* 设置element的value
	* @method	setValue
	* @param	{string}				value		内容
	* @return	{NodeW}					自己
	*/

	/** 
	* 获取element的innerHTML
	* @method	getHTML
	* @return	{string}				如果是多个element的包装则返回结果数组
	*/

	/** 
	* 设置element的innerHTML
	* @method	setHtml
	* @param	{string}				value		内容
	* @return	{NodeW}					自己
	*/

	/** 
	* 获得form的所有elements并把value转换成由'&'连接的键值字符串
	* @method	encodeURIForm
	* @param	{string}	filter	(Optional)	过滤函数,会被循环调用传递给item作参数要求返回布尔值判断是否过滤
	* @return	{string}					由'&'连接的键值字符串		如果是多个element的包装则返回结果数组
	*/

	/** 
	* 判断form的内容是否有改变
	* @method	isFormChanged
	* @param	{string}	filter	(Optional)	过滤函数,会被循环调用传递给item作参数要求返回布尔值判断是否过滤
	* @return	{bool}					是否改变		如果是多个element的包装则返回结果数组
	*/

	/** 
	* 获得element对象的样式
	* @method	getStyle
	* @param	{string}				attribute	样式名
	* @return	{string}				如果是多个element的包装则返回结果数组
	*/

	/** 
	* 获得element对象当前的样式
	* @method	getCurrentStyle
	* @param	{string}				attribute	样式名
	* @return	{string}				如果是多个element的包装则返回结果数组
	*/

	/** 
	* 设置element对象的样式
	* @method	setStyle
	* @param	{string}				attribute	样式名
	* @param	{string}				value		值
	* @return	{NodeW}					自己
	*/

	/** 
	* 获取element对象的border宽度
	* @method	borderWidth
	* @return	{array}					topWidth, rightWidth, bottomWidth, leftWidth	如果是多个element的包装则返回结果数组
	*/

	/** 
	* 获取element对象的padding宽度
	* @method	paddingWidth
	* @return	{array}					topWidth, rightWidth, bottomWidth, leftWidth	如果是多个element的包装则返回结果数组
	*/

	/** 
	* 获取element对象的margin宽度
	* @method	marginWidth
	* @return	{array}					topWidth, rightWidth, bottomWidth, leftWidth	如果是多个element的包装则返回结果数组
	*/

	/** 
	* 获取或者设置对象的value属性		传一个参数是setValue,不传参数是getValue
	* @method	val
	* @return	{NodeW|string}			设置时返返回自己 获取时返回字符		如果是多个element的包装则返回结果数组
	*/

	/** 
	* 获取或者设置对象的innerHTML属性	传一个参数是setHTML,不传参数是getHTML
	* @method	html
	* @return	{NodeW|string}			设置时返返回自己 获取时返回字符		如果是多个element的包装则返回结果数组
	*/

	/** 
	* 获取或者设置对象的Attribute属性	传两个参数是setAttr,一个参数是getAttr
	* @method	attr
	* @return	{NodeW|string}			设置时返返回自己 获取时返回字符		如果是多个element的包装则返回结果数组
	*/

	/** 
	* 获取或者设置对象当前的style属性	传两个参数是setStyle,一个参数是getCurrentStyle
	* @method	css
	* @return	{NodeW|string}			设置时返返回自己 获取时返回字符		如果是多个element的包装则返回结果数组
	*/

	/** 
	* 获取或者设置对象当前的大小属性	传一个或两个参数是setSize,不传参数是getSize
	* @method	size
	* @return	{NodeW|object}			设置时返返回自己 获取时返回{width:...,height:...}		如果是多个element的包装则返回结果数组
	*/

	/** 
	* 获取或者设置对象当前的大小属性	传一个或两个参数是setXY,不传参数是getXY
	* @method	xy
	* @return	{NodeW|array}			设置时返返回自己 获取时返回[x,y]		如果是多个element的包装则返回结果数组
	*/

	/** 
	* 添加对指定事件的监听
	* @method	on
	* @param	{string}	oldname		事件名称
	* @param	{function}	handler		事件处理程序
	* @return	{NodeW}					自己
	*/

	/** 
	* 移除对指定事件的监听
	* @method	un
	* @param	{string}	oldname		(Optional)事件名称
	* @param	{function}	handler		(Optional)事件处理程序
	* @return	{NodeW}					自己
	*/

	/** 
	* 添加事件委托
	* @method	delegate
	* @param	{string}	selector	委托的目标
	* @param	{string}	oldname		事件名称
	* @param	{function}	handler		事件处理程序
	* @return	{NodeW}					自己
	*/

	/** 
	* 移除事件委托
	* @method	undelegate
	* @param	{string}	selector	(Optional)委托的目标
	* @param	{string}	oldname		(Optional)事件名称
	* @param	{function}	handler		(Optional)事件处理程序
	* @return	{NodeW}					自己
	*/

	/** 
	* 触发对象的指定事件
	* @method	fire
	* @param	{string}	oldname	事件名称
	* @return	{NodeW}		自己
	*/

	/** 
	* 绑定对象的click事件或者执行click方法
	* @method	click
	* @param	{function}	handler	(Optional)事件委托
	* @return	{NodeW}		自己
	*/

	/** 
	* 绑定对象的submit事件或者执行submit方法
	* @method	submit
	* @param	{function}	handler	(Optional)事件委托
	* @return	{NodeW}		自己
	*/

	/** 
	* 绑定对象的focus事件或者执行focus方法
	* @method	focus
	* @param	{element}	element	要触发事件的对象
	* @param	{function}	handler	(Optional)事件委托
	* @return	{NodeW}		自己
	*/

	/** 
	* 绑定对象的blur事件或者执行blur方法
	* @method	blur
	* @param	{element}	element	要触发事件的对象
	* @param	{function}	handler	(Optional)事件委托
	* @return	{NodeW}		自己
	*/

	/** 
	* 克隆元素
	* @method	cloneNode
	* @param	{bool}		bCloneChildren	(Optional) 是否深度克隆 默认值false
	* @return	{element}					克隆后的元素
	*/


	var NodeW=function(core) {
		if(!core) return null;
		var arg1=arguments[1];
		if(getType(core)=='string'){
			if(this instanceof NodeW){
				core=$(core,arg1);
				if(!core) return null;
				this[0]=this.core=$(core,arg1);
				this.length=1;
			}
			else return new NodeW(query(arg1,core));
		}
		else {
			core=$(core,arg1);
			if(this instanceof NodeW){
				this.core=core;
				if(getType(core)=='array'){
					this.length=0;
					push.apply( this, core );
				}
				else{
					this.length=1;
					this[0]=core;
				}
			}
			else return new NodeW(core);
		}
	};
	//NodeW.prototype = new QW.Wrap();
	var NodeA = {};
	mix(NodeA, HH.rwrap(NodeH2, NodeW, NodeC.wrapMethods));
	HH.gsetter(NodeA,NodeC.gsetterMethods)
	applyTo(NodeA, NodeW);							//NodeW的静态方法
	methodizeTo(NodeA, NodeW.prototype, 'core');	//NodeW的原型方法
	NodeA=ObjectH.dump(QW.ArrayH,NodeC.arrayMethods);
	NodeA=HH.rwrap(NodeA, NodeW, NodeC.wrapMethods)
	applyTo(NodeA, NodeW);							//NodeW的静态方法
	methodizeTo(NodeA, NodeW.prototype);	//NodeW的原型方法


	mix(NodeW.prototype,{
		/** 
		* 返回NodeW的第0个元素的包装
		* @method	first
		* @return	{NodeW}	
		*/
		first:function(){
			return NodeW(this[0]);
		},
		/** 
		* 返回NodeW的最后一个元素的包装
		* @method	last
		* @return	{NodeW}	
		*/
		last:function(){
			return NodeW(this[this.length-1]);
		},
		/** 
		* 返回NodeW的第i个元素的包装
		* @method	last
		* @param {int}	i 第i个元素
		* @return	{NodeW}	
		*/
		item:function(i){
			return NodeW(this[i]);
		}
	});


QW.$=QW.g=Dom.$;
QW.$$=QW.gg=NodeW.$;
QW.NodeW=QW.W=NodeW;
}();

