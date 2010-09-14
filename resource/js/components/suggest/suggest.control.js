/**
 * @class		Suggest				用于处理Suggest的数据来源。可以为脚本CallBack(涉及跨域)，脚本数据(即返回json文本)
 * @namespace	Suggest
 * @author		Remember2015(wangzilong@baidu.com)
 */
/**
 * @constructor		
 * @param	{object}		oConfig	构造函数参数，详细参照类的配置
 * @example	
var sug = new QW.Suggest({
	textbox: '#searchTextbox',
	dataUrl: "http://youa.baidu.com/suggest/se/s?cmd=suggest&type=kwd&charset=utf-8&category=0",
	uiHighlighter: function(oEl) {
		var elKeyEl = QW.$$(oEl).query('.key').core[0];
		var sHtml = elKeyEl.innerHTML;
		elKeyEl.innerHTML = sHtml.replace(sug.getKeyword(), '<em style="color:#d06000;font-weight:bold">' + sug.getKeyword() + '</em>')
	},
	uiItemNumber: 10,
	uiReferEl: '#sug-rel'
});
 * @return	{boolean}	返回是否构造成功
 */
Suggest = function(oConfig) {
	Suggest._argValid(oConfig, 'object', arguments.callee);
	/**
	 * @property	_config		Suggest实例的变量集合，里面是构造实例需要的配置参数
	 * @type			object
	 */
	this._config = {
		/**
		 * @cfg		{boolean}		autoFocusFirstItem		是否自动focus第一项
		 */
		autoFocusFirstItem: true,
		/**
		 * @cfg		{boolean}		autoSelectToEnter		是否在选中某一项时出发enter事件
		 */
		autoSelectToEnter: false,
		/**
		 * @cfg		{integer}		cacheCapacity		Cache的容量，Data实例构建时使用
		 */
		cacheCapacity: -1,
		/**
		 * @cfg		{boolean}		cacheAutoScale		Cache是否自动控制大小，Data实例构建时使用
		 */
		cacheAutoScale: true,
		/**
		 * @cfg		{Suggest.Data}		data		data实例，如传入次参数，则忽略其他data参数
		 */
		data: null,
		/**
		 * @cfg		{string}		dataUrl		data实例所需参数，参照data文档
		 */
		dataUrl: "",
		/**
		 * @cfg		{string}		dataType		data实例所需参数，参照data文档
		 */
		dataType: "ScriptCallBack",
		/**
		 * @cfg		{function}		dataCallback		data实例所需参数，参照data文档
		 */
		dataCallback: Suggest.O,
		/**
		 * @cfg		{function}		dataHandler		data实例所需参数，参照data文档
		 */
		dataHandler: function(sKey, oData, oThis) {
			if (oData.err == 'mcphp.ok') {
				oThis._read(oData.data.res.object)
				//oThis._read(oArg.r.concat(oArg.r.slice(0)));
				oThis._prop.cache.pushCache(sKey, oData.data.res.object);
			}
		},
		/**
		 * @cfg		{string}		dataCapacity		data实例所需参数，参照data文档
		 */
		dataCapacity: 10,
		/**
		 * @cfg		{object}		ui		ui实例，如传入次参数，则忽略其他UI参数
		 */
		ui: null,
		/**
		 * @cfg		{string|NodeW}		textbox		ui实例所需参数，参照ui文档
		 */
		textbox: '',
		/**
		 * @cfg		{string}		uiTemplate		ui实例所需参数，参照ui文档
		 */
		uiTemplate: '<div><span class="key">{display}</span><span class="val">{val}</span></div>',
		/**
		 * @cfg		{function}		uiRender		ui实例所需参数，参照ui文档
		 */
		uiRender: Suggest.O,
		/**
		 * @cfg		{function}		uiHighlighter		ui实例所需参数，参照ui文档
		 */
		uiHighlighter: Suggest.O,
		/**
		 * @cfg		{object}		uiBaseLayerConfig		ui实例所需参数，参照ui文档
		 */
		uiBaseLayerConfig: {
			autoPosition: false
		},
		/**
		 * @cfg		{integer}		uiItemNumber		ui实例所需参数，参照ui文档
		 */
		uiItemNumber: -1,
		/**
		 * @cfg		{object}		uiContainer		ui实例所需参数，参照ui文档
		 */
		uiContainer: null,
		/**
		 * @cfg		{object}		uiStyle		ui实例所需参数，参照ui文档
		 */
		uiStyle: {
			itemClass: 'item',
			containerClass: 'panel-suggest',
			selectClass: 'selected',
			focusClass: 'selected'
		},
		/**
		 * @cfg		{object}		uiView	ui实例所需参数，参照ui文档
		 */
		uiView: null,
		uiSelectFilter: function(d){return true}
	};

	/**
	 * @property		_prop		Suggest实例的属性集合，里面是实例运行的各种内部变量
	 * @type				object
	 */
	this._prop = {
		/**
		 * @property		index		当前关注项的值
		 * @type				integer
		 */
		index: -1,
		/**
		 * @property		isShown		是否显示
		 * @type				boolean
		 */
		isShown: false,
		/**
		 * @property		data		data实例
		 * @type				object
		 */
		data: null,
		/**
		 * @property		ui		ui实例
		 * @type				object
		 */
		ui: null
	};

	/**
	 * @property		_filter		Suggest实例的点击过滤器，预留，用于检测是否可以select或者可以focus
	 * @type				object
	 */
	this._filter = {};

	QW.ObjectH.mix(this._config, oConfig, true);
	this._init();
};

/**
 * @static
 * @property	_EVENT	用于构造CustEvent的事件列表
 * @type			array
 */
Suggest._EVENT = [
	/**
	 * @event		backspace		退格键触发
	 */
	'backspace', 
	/**
	 * @event		input		有数据输入的时候
	 */
	'input', 
	/**
	 * @event		enter		回车键按下触发
	 */
	'enter', 
	/**
	 * @event		esc		esc键按下触发
	 */
	'esc', 
	/**
	 * @event		focus		文本框focus的时候触发
	 */
	'focus', 
	/**
	 * @event		blur		文本框blur时触发
	 */
	'blur', 
	/**
	 * @event		itemfocus		提示项focus时触发
	 */
	'itemfocus', 
	/**
	 * @event		itemblur		提示项blur时触发
	 */
	'itemblur', 
	/**
	 * @event		itemselect		提示项选中时触发
	 */
	'itemselect'
];

Suggest.prototype = {
	/**
	 * 事件派发
	 * @method		_dispatch
	 * @param		{string}		sType		事件类型，为Suggest.Data._EVENT数组中的项
	 */
	_dispatch: function(sType) {
		if (!QW.ArrayH.contains(Suggest._EVENT, sType)) {
			Suggest._debug('arg', 'event type "' + sType.toString() + '" not exist when dispatching', arguments.callee);
			return false;
		}
		var oItem = this.getItem(this._prop.index);
		var eEvent = new QW.CustEvent(oItem, sType);
		eEvent.suggest = oItem;
		this.fire(eEvent);
	},
	/**
	 * 实例初始化函数，构造时调用
	 * @method		_init
	 * @return		{boolean}	返回是否初始化成功
	 */
	_init: function() {
		if (!this._initData()) {
			Suggest._debug("arg", "init data error", this);
			return false;
		}
		if (!this._initUI()) {
			Suggest._debug("arg", "init ui error", this);
			return false;
		}
		if (!this._initEvent()) {
			Suggest._debug("arg", "init event error", this);
			return false;
		}
	},
	/**
	 * data属性初始化，用Suggest.Data类构建
	 * @method		_initData
	 * @return		{boolean}	返回是否初始化成功
	 */
	_initData: function() {
		if (null === this.get('data')) {
			var oSugData = new Suggest.Data(this._config);
			this._prop.data = this.set('data', oSugData);
		} else {
			this._prop.data = this.get('data');
		}
		return true;
	},
	/**
	 * ui属性初始化，用Suggest.UI类构建
	 * @method		_initData
	 * @return		{boolean}	返回是否初始化成功
	 */
	_initUI: function() {
		if (null === this.get('ui')) {
			var oSugUI = new Suggest.UI(this._config);
			this._prop.ui = this.set('ui', oSugUI);
		} else {
			this._prop.ui = this.get('ui');
		}
		return true;
	},
	/**
	 * 事件初始化，包括侦听Data和UI的事件，以及初始化自己的事件
	 * @method		_initEvent
	 * @return		{boolean}	返回是否初始化成功
	 */
	_initEvent: function() {
		QW.CustEvent.createEvents(this, Suggest._EVENT);
		var o = this._prop.ui;
		var oThis = this;
		var d = this._prop.data;
		o.on('up', function() {
			if (oThis.isShown())
				oThis.previous();
		});
		o.on('down', function() {
			if (oThis.isShown())
				oThis.next();
			else {
				oThis.suggest(this.getTextboxValue());
			}
		});
		o.on('change', function(eEvent) {
			oThis.suggest(this.getTextboxValue());
			oThis._dispatch('input');
		});
		o.on('esc', function() {
			if (oThis.isShown())
				oThis.hide();
		});
		o.on('backspace', function() {
			oThis._dispatch('backspace');
		});
		o.on('enter', function() {
			var nIndex = oThis._prop.index;
			if (nIndex >= 0) {
				o.setKeyword(d.getItem(oThis._prop.index).key);
				o.setTextboxValue(d.getItem(oThis._prop.index).key);
			}
			oThis.hide();
			oThis._dispatch('enter');
		});
		o.on('blur', function() {
			oThis._dispatch('blur');
			oThis.hide();
		});
		o.on('focus', function() {
			oThis.suggest(this.getTextboxValue());
			oThis._dispatch('focus');
		});
		o.on('itemblur', function(eEvent) {
			oThis.blur(eEvent.itemIndex);
		});
		o.on('itemfocus', function(eEvent) {
			oThis.focus(eEvent.itemIndex);
		});
		o.on('itemselect', function(eEvent) {
			oThis.select(eEvent.itemIndex);
		});
		d.on('datachange', function() {
			if (d.getLength() > 0) {
				oThis.show();
				o.render(this.getData());
				if (oThis.isShown() && oThis.get('autoFocusFirstItem')) {
					oThis._prop.index = 0;
					while( !oThis.get('uiSelectFilter')(oThis.getItem(oThis._prop.index).data)) {
						oThis._prop.index++;
					}
					oThis.focus(oThis._prop.index);
				}
			} else {
				oThis.hide();
			}
		});
		d.on('indexchange', function() {
			if (d.getLength() <= 0) {
				return;
			};
			var nIndex = this.getIndex();
			if (nIndex >= 0) {
				o.setTextboxValue(d.getItem(this.getIndex()).key);
			} else {
				o.setTextboxValue(o.getKeyword());
			}
		});
		return true;
	},
	/**
	 * 设置参数
	 * @method		set
	 * @param		{string}		sKey			属性名
	 * @param		{object}		oValue		属性值
	 * @return		{object}		返回设置的oValue，默认设置成功
	 * @example		
this.set('dataType', 'ScriptCallback')
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
	 * 设置过滤器
	 * @method		setFilter
	 * @param		{string}		sKey			属性名
	 * @param		{object}		oValue		属性值
	 * @return		{object}		返回设置的oValue，默认设置成功
	 */
	setFilter: function(sKey, oValue) {
		this._filter[sKey] = oValue;
		return oValue;
	},
	/**
	 * 返回Data属性
	 * @method		getData
	 * @return		{object}		隶属于Suggest的data实例
	 */
	getData: function() {
		return this._prop.data;
	},
	/**
	 * 返回关键字，注意是和Textbox的Value不一样的值
	 * @method		getKeyword
	 * @return		{string}		关键字
	 */
	getKeyword: function() {
		return this._prop.ui.getKeyword();
	},
	/**
	 * 设置关键字，注意是和Textbox的Value不一样的值
	 * @method		setKeyword
	 * @param		{string}		sKey			关键字
	 * @return		{boolean}		是否修改成功
	 */
	setKeyword: function(skey) {
		return this._prop.ui.setTextboxValue(skey);
	},
	/**
	 * 返回第n项提示项目
	 * @method		getItem
	 * @param		{integer}		nIndex		第n项，从0计数
	 * @return		{object}			第n项数据，格式为{index:x,data:x,ui:x}
	 */
	getItem: function(nIndex) {
		//返回对象格式如下所示
		return {
			index: nIndex,
			data: this._prop.data.getItem(nIndex),
			ui: this._prop.ui.getItem(nIndex)
		}
	},
	/**
	 * 返回Suggest是否显示
	 * @method		isShown
	 * @return		{boolean}
	 */
	isShown: function() {
		return this._prop.isShown;
	},
	/**
	 * 显示UI部分
	 * @method		show
	 * @return		{boolean}		是否显示成功
	 */
	show: function() {
		var bIsShown = true;
		if (!this.isShown()) {
			bIsShown = this._prop.ui.show();
			this._prop.isShown = bIsShown;
		}
		return bIsShown;
	},
	/**
	 * 隐藏UI部分
	 * @method		hide
	 * @return		{boolean}		是否隐藏成功
	 */
	hide: function() {
		var bIsHidden = false;
		if (this.isShown()) {
			bIsHidden = this._prop.ui.hide();
			this._prop.isShown = !bIsHidden;
		}
		this._prop.index = -1;
		this._prop.data.setCurrent(-1);
		return bIsHidden;
	},
	/**
	 * 根据关键字进行提示
	 * @method		suggest
	 * @return		{boolean}
	 */
	suggest: function(sKeyword) {
		this.set('keyword', sKeyword);
		if (sKeyword != "") {
			var oThis = this;
			this._prop.data.query(sKeyword);
		} else this.hide();
		return true;
	},
	/**
	 * select列表项的第n项
	 * @method		select
	 * @param		{integer}	nIndex		第几项
	 * @return		{boolean}	返回是否select成功
	 */
	select: function(nIndex) {
		if (!Suggest._argValid(nIndex, "number", arguments.callee))
			return false;
		this._prop.index = nIndex;
		this._prop.ui.setKeyword(this._prop.data.getItem(nIndex).key);
		this._prop.data.setCurrent(nIndex);
		this._dispatch('itemselect');
		if (this.get('autoSelectToEnter'))
			this._dispatch('enter');
		this.hide();
		return true;
	},
	/**
	 * focus列表项的第n项
	 * @method		focus
	 * @param		{integer}	nIndex		第几项
	 * @return		{boolean}	返回是否focus成功
	 */
	focus: function(nIndex) {
		if (this._prop.index != -1) 
			this.blur(this._prop.index);
		if (!Suggest._argValid(nIndex, "number", arguments.callee))
			return false;
		this._prop.index = nIndex;
		this._prop.ui.focusItem(nIndex);
		this._dispatch('itemfocus');
		return true;
	},
	/**
	 * blur列表项的第n项
	 * @method		blur
	 * @param		{integer}	nIndex		第几项
	 * @return		{boolean}	返回是否blur成功
	 */
	blur: function(nIndex) {
		if (!Suggest._argValid(nIndex, "number", arguments.callee))
			return false;
		if (this._prop.index != -1) 
			this._prop.ui.blurItem(this._prop.index);
		this._dispatch('itemblur');
		this._prop.index = -1;
		this._prop.ui.blurItem(nIndex);
		return true;
	},
	/**
	 * 方便使用，blur前一项，focus后一项
	 * @method		exchange
	 * @param		{integer}	nBlurIndex		第几项
	 * @param		{integer}	nFocusIndex		第几项
	 * @return		{boolean}	返回是否exchange成功
	 */
	exchange: function(nBlurIndex, nFocusIndex) {
		if (!Suggest._argValid(nBlurIndex, "number", arguments.callee) || !Suggest._argValid(nFocusIndex, "number", arguments.callee))
			return false;
		return this.blur(nBlurIndex) && this.focus(nFocusIndex);
	},
	/**
	 * 跳到前一项
	 * @method		previous
	 */
	previous: function() {
		this.show();
		var nOriginalIndex = this._prop.index;
		this._prop.index = nOriginalIndex > 0 ? nOriginalIndex - 1 : this._prop.data.getLength() - 1;
		this._prop.data.setCurrent(this._prop.index);
		this.exchange(nOriginalIndex, this._prop.index);
		if (!this.get('uiSelectFilter')(this.getItem(this._prop.index).data)) {
			this.previous();
		}
	},
	/**
	 * 跳到后一项
	 * @method		next
	 */
	next: function() {
		this.show();
		var nOriginalIndex = this._prop.index;
		if (nOriginalIndex < this._prop.data.getLength() - 1) {
			this._prop.data.setCurrent(nOriginalIndex + 1);
			this.exchange(nOriginalIndex, nOriginalIndex + 1);
		}
		else {
			var oThis = this;
			if (this._prop.data.get('capacity') == -1 || this._prop.data.get('capacity') > this._prop.data.getLength()) {
				this._prop.data.increase(this._prop.data.getLength(), function() {
					oThis._prop.data.setCurrent(nOriginalIndex + 1);
					oThis.exchange(nOriginalIndex, nOriginalIndex + 1);
				});
			} else {
				this.exchange(nOriginalIndex, -1);
				this._prop.index = -1;
				this._prop.data.setCurrent(-1);
			}
		}
		if (this._prop.index != -1 && !this.get('uiSelectFilter')(this.getItem(this._prop.index).data)) {
			this.next();
		}
	}
};
/**
 * 基本调试函数，内部调试使用
 * @method				_debug
 * @static
 */
Suggest._debug = function(sType, sMsg, fFunc) {
	var sTypeStr = "";
	switch (sType) {
		case "arg":
			sTypeStr = "参数错误";
			break;
		case "ret":
			sTypeStr = "返回错误";
			break;
		case "net":
			sTypeStr = "网络异常";
			break;
		default:;
	}
	try{
		//console.log(sTypeStr + ":\t" + sMsg, fFunc);
	} catch (ex) {
		alert(sTypeStr + ":\t" + sMsg + "\n" + fFunc.toString());
	}
};
/**
 * 参数检测函数，内部调试使用
 * @method				_argValid
 * @static
 */
Suggest._argValid = function(oArg, sType, fFunc) {
	if (typeof oArg != sType) {
		Suggest._debug('arg', 'The type of ' + oArg == window.undefined ? oArg.toString() : 'null' + ' is not ' + sType + ', please check again', fFunc);
		return false;
	}
	return true;
};
/**
 * 空函数，作为默认回调函数
 * @static
 * @method				O
 */
Suggest.O = function() {};

QW.provide("Suggest", Suggest);