/**
 * @class	Suggest.UI.ListView	这是UI中view部分的一个实现，也是最常用的类型，列表
 * @namespace	Suggest
 * @author	Remember2015(wangzilong@baidu.com)
 */

/**
 * @constructor		
 * @param	{object}		oConfig	构造函数参数，详细参照类的配置
 * @example	
new Suggest.UI.ListView({
	uiTemplate: "<p>{display}</p><q>{value}</q>"
})
 * @return	{boolean}	返回是否构造成功
 */
Suggest.UI.ListView = function(oConfig) {
	Suggest._argValid(oConfig, 'object', arguments.callee);
	/**
	 * @property	_config		ListView实例的私有变量集合，里面是构造实例需要的配置参数
	 * @type			object
	 */
	this._config = {
		/**
		 * @cfg		{string}		uiTemplate(Optional)		数据渲染模板，如设置，则使用此模板格式化数据，优先级低于uiRender
		 * @exapmle		
if (data == {valueA: '1', valueB: '2'}) 
	uiTemplate = {
		uiTemplate: "<b>{valueA} + {valueB}</b>"
	};
		 */
		uiTemplate: "",
		uiListContainer: null,
		/**
		 * @cfg			{function}		uiRender(Optional)		数据渲染函数，接收参数为data对象，返回为Dom节点(经过wrap)
		 * @example
var render = function(oData) {
	return QW.$$(QW.Dom.create('<span onclick="alert(document.location)">' + oData.val.resultNumber + '<span>')); 
}
		 */
		uiRender: null,
		/**
		 * @cfg			{function}		uiHighlighter(Optional)		显示提示项时如需要特殊处理关键字高亮或其他需求时使用
		 * @exapmle		
var uiHighlighter = function(oEl) {
	var elKeyEl = QW.$$(oEl).query('.key').core[0];
	var sHtml = elKeyEl.innerHTML;
	elKeyEl.innerHTML = sHtml.replace(sug.getKeyword(), '<em style="color:#d06000;font-weight:bold">' + sug.getKeyword() + '</em>')
};
		 */
		uiHighlighter: Suggest.O,
		/**
		 * @cfg		{integer}		uiItemNumber(Optional)		列表项的最大容量，如data有20项，uiItemNumber设置为10，则只显示10项，但是可以通过上下键滚动
		 */
		uiItemNumber: -1,
		/**
		 * @cfg			{object}		uiStyle		样式集合，包括containerClass，selectedClass，focusClass等，提供默认值
		 * @example		
var uiStyle = {
	containerClass: 'panel-suggest',
	selectClass: 'selected',
	focusClass: 'selected'
}
		 */
		uiStyle:{
			containerClass: '',
			selectClass: '',
			focusClass: ''
		}
	};
	/**
	 * @property		_prop		ListView实例的属性集合，里面是实例运行的各种内部变量
	 * @type				object
	 */
	this._prop = {
		/**
		 * @property		container		Suggest列表项的HTML元素容器
		 * @type				NodeW
		 */
		container: null,
		/**
		 * @property		items		各个列表项对应HTML元素的集合
		 * @type				array[NodeW]
		 */
		items: [],
		/**
		 * @property		start		ListView实例显示在container里面的项目的启示index
		 * @type				integer
		 */
		start: 0
	};
	QW.ObjectH.mix(this._config, oConfig, true);
	return this._init();
};
/**
 * @static
 * @property	_EVENT	用于构造CustEvent的事件列表
 * @type			array
 */
Suggest.UI.ListView._EVENT = [
	/**
	 * @event	itemfocus	Suggest项目被focus时触发，UI层的事件
	 * @param	mouseenter
	 */
	'itemfocus', 
	/**
	 * @event	itemblur		Suggest项目blur时触发，UI层的事件
	 * @param	mouseout
	 */
	'itemblur', 
	/**
	 * @event	itemselect	Suggest项目被点击时触发，UI层的事件
	 * @param	mousedown
	 */
	'itemselect'
];

Suggest.UI.ListView.prototype = {
	/**
	 * 实例初始化函数，构造时调用
	 * @method		_init
	 * @return		{boolean}	返回是否初始化成功
	 */
	_init: function() {
		this._prop.container = this.get('uiListContainer') || QW.NodeW(document.createElement('div'));
//		this._prop.container.addClass(this.get('uiStyle').containerClass);
		this._initEvent();
		return true;
	},
	/**
	 * 事件初始化
	 * @method		_initEvent
	 * @return		{boolean}	返回是否初始化成功
	 */
	_initEvent: function() {
		QW.CustEvent.createEvents(this, Suggest.UI.ListView._EVENT);
		return true;
	},
	/**
	 * 事件派发
	 * @method		_dispatch
	 * @param		{string}		sType		事件类型，为Suggest.UI.ListView._EVENT数组中的项
	 * @param		{integer}	nIndex	事件触发的项目的index
	 */
	_dispatch: function(sType, nIndex) {
		if (!QW.ArrayH.contains(Suggest.UI.ListView._EVENT, sType)) {
			Suggest._debug('arg', 'event type "' + sType.toString() + '" not exist', this);
			return false;
		}
		var eEvent = new QW.CustEvent(this._prop.items[nIndex], sType);
		eEvent.itemIndex = nIndex;
		this.fire(eEvent);
	},
	/**
	 * 设置参数
	 * @method		set
	 * @param		{string}		sKey			属性名
	 * @param		{object}		oValue		属性值
	 * @return		{object}		返回设置的oValue，默认设置成功
	 * @example		
this.set('uiItemNumber', 10)
	 */
	set: function(sKey, oValue) {
		this._config[sKey] = oValue;
		return oValue;
	},
	/**
	 * 返回参数值
	 * @method		get
	 * @param		{string}		sKey			属性名
	 * @return		{object}
	 */
	get: function(sKey) {
		return this._config[sKey];
	},
	/**
	 * 返回列表项的容器
	 * @method		getContainer
	 * @return		{NodeW}
	 */
	getContainer: function() {
		return this._prop.container;
	},
	/**
	 * 渲染所有列表项
	 * @method		render
	 * @param		{array[JSON Object]}			aData			数据数组
	 */
	render: function(aData) {
		for (var i = 0; i < this._prop.items.length; i++) {
			this._prop.items[i].un();
		}
		this._prop.items.length = 0;
		this._prop.start = 0;
		this._prop.container.set('innerHTML', '');

		for (var i = 0, len = aData.length; i < len; i++) {
			this._prop.items[i] = this.renderItem(aData[i], i);
			this.highlight(i);
			this._prop.container.appendChild(this._prop.items[i]);
		}
		var limit = this.get('uiItemNumber') == -1 ? this._prop.items.length : this.get('uiItemNumber');
		for (var i = limit; i < this._prop.items.length; i++) {
			this._prop.container.removeChild(this._prop.items[i]);
		}
	},
	/**
	 * 渲染单个列表项
	 * @method		renderItem
	 * @param		{object}		oData			数据项
	 * @param		{integer}	nIndex		第几项
	 * @return		{NodeW}		渲染完毕的列表项
	 */
	renderItem: function(oData, nIndex) {
		var sTPL = this.get('uiTemplate');
		var fRender = this.get('uiRender');
		var oEl = null;
		if (fRender != QW.Suggest.O) {
			oEl = QW.$$(fRender.apply(this, [oData]));
		} else if (sTPL != '') {
			var sHTML = sTPL.replace(/\{([^\}]+)\}/gi, function(a, b) {
				return oData[b] || ('{' + b + ' }');
			});
			oEl = QW.$$(QW.Dom.create(sHTML));
			oEl.addClass('item');
		} 
		this._bindEventToItem(oEl, nIndex, oData);
		return oEl;
	},
	/**
	 * 为列表项绑定事件
	 * @method		_bindEventToItem
	 * @param		{NodeW}		oEl			绑定对象
	 * @param		{integer}	nIndex		第几项
	 */
	_bindEventToItem: function(oEl, nIndex, oData) {
		var oThis = this;
		if (this.get('uiSelectFilter')(oData)) {
			oEl.on('mouseover', function(eEvent) {
				oThis._dispatch('itemfocus', nIndex);
			});
			oEl.on('mouseout', function(eEvent) {
				oThis._dispatch('itemblur', nIndex);
			});
			oEl.on('mousedown', function(eEvent) {
				oThis._dispatch('itemselect', nIndex);
			});
		} else {
			oEl.on('mousedown', function(eEvent) {
				eEvent.preventDefault();
			});
		}
	},	
	/**
	 * 向下滚动一项
	 * @method		scrollDown
	 */
	scrollDown: function() {
		if (this._prop.start === 0) 
			return;
		this._prop.items[this._prop.start].insertSiblingBefore(this._prop.items[this._prop.start-1]);
		this._prop.container.removeChild(this._prop.items[this._prop.start + this.get('uiItemNumber') - 1]);
		this._prop.start--;
	},
	/**
	 * 向上滚动一项
	 * @method		scrollUp
	 */
	scrollUp: function() {
		this._prop.container.removeChild(this._prop.items[this._prop.start]);
		this._prop.items[this._prop.start + this.get('uiItemNumber') - 1].insertSiblingAfter(this._prop.items[this._prop.start + this.get('uiItemNumber')]);
		this._prop.start++;
	},
	/**
	 * 列表项滚动到n项
	 * @method		scrollTo
	 * @param		{integer}	nIndex		第几项
	 */
	scrollTo: function(nIndex) {		
		while (nIndex < this._prop.start || nIndex > this._prop.start + this.get('uiItemNumber') - 1) {
			if (this._prop.start > nIndex) 
				this.scrollDown();
			if (this._prop.start + this.get('uiItemNumber') - 1 < nIndex) 
				this.scrollUp();
		}
	},
	/**
	 * 返回列表项的第n项
	 * @method		getItem
	 * @param		{integer}	nIndex		第几项
	 * @return		{NodeW}
	 */
	getItem: function(nIndex) {
		return this._prop.items[nIndex];
	},
	/**
	 * 选中列表项的第n项
	 * @method		selectItem
	 * @param		{integer}	nIndex		第几项
	 * @return		{boolean}	返回是否select成功
	 */
	selectItem: function(nIndex) {
		this._prop.items[nIndex].addClass(this.get('uiStyle').selectClass);
		return true;
	},
	/**
	 * focus列表项的第n项
	 * @method		focusItem
	 * @param		{integer}	nIndex		第几项
	 * @return		{boolean}	返回是否focus成功
	 */
	focusItem: function(nIndex) {
		nIndex = parseInt(nIndex, 10);
		if (nIndex < 0) 
			return false;
		this.scrollTo(nIndex);
		this._prop.items[nIndex].addClass(this.get('uiStyle').focusClass);
		return true;
	},
	/**
	 * 高亮第n项
	 * @method		highlight
	 * @param		{integer}	nIndex		第几项
	 * @return		{boolean}	返回是否focus成功
	 */
	highlight: function(nIndex) {
		nIndex = parseInt(nIndex, 10);
		if (nIndex < 0) 
			return false;
		var fHglter = this.get('uiHighlighter');
		fHglter(this._prop.items[nIndex]);
		return true;
	},
	/**
	 * blur列表项的第n项
	 * @method		blurItem
	 * @param		{integer}	nIndex		第几项
	 * @return		{boolean}	返回是否blur成功
	 */
	blurItem: function(nIndex) {
		nIndex = parseInt(nIndex, 10);
		if (nIndex < 0) 
			return false;
		this._prop.items[nIndex].removeClass(this.get('uiStyle').focusClass);
		return true;
	}
};