/**
 * @class		Suggest.UI			管理Suggest涉及的界面部分
 * @namespace	Suggest
 * @author	Remember2015(wangzilong@baidu.com)
 */
/**
 * @constructor		
 * @param	{object}		oConfig	构造函数参数，详细参照类的配置
 * @example	
new Suggest.UI({
	textbox: "#sug-textbox",
	uiReferEl: '#sug-wrap'
})
 * @return	{boolean}	返回是否构造成功
 */
Suggest.UI = function(oConfig) {
	Suggest._argValid(oConfig, 'object', arguments.callee);
		/**
	 * @property	_config		UI实例的私有变量集合，里面是构造实例需要的配置参数
	 * @type			object
	 */
	this._config = {
		/**
		 * @cfg		{xpatch|HTMLElement|NodeW}		textbox		需要启动Suggest的文本框
		 */
		textbox: "",
		/**
		 * @cfg		{UI.View}		uiCaption		提示层的头部
		 */
		uiCaption: null,
		/**
		 * @cfg		{object}		uiView		view的实例，用于扩展，内容与接口参照UI.ListView
		 */
		uiView: null,
		/**
		 * @cfg		{object}		uiBaseLayerConfig		popup的参数，默认没有，详细参照@link[QW.Panel]
		 */
		uiBaseLayerConfig: {
			autoPosition: false
		},
		/**
		 * @cfg		{object}		uiContainer		提示层的容器
		 */
		uiContainer: null,
		/**
		 * @cfg		{xpatch|HTMLElement|NodeW}		uiReferEl		Suggest容器的相对定位容器，默认为文本框
		 */
		uiReferEl: null,
		/**
		 * @cfg		{integer}		_interval		私有变量，检测文本变化的计时器间隔，可以调节
		 */
		_interval: 50
	};
	/**
	 * @property		_prop		UI实例的属性集合，里面是实例运行的各种内部变量
	 * @type				object
	 */
	this._prop = {
		/**
		 * @property		_textChangeTimer		检测内容变化的计时器
		 * @type				window.interval
		 */
		_textChangeTimer: null,
		/**
		 * @property		textbox			文本框
		 * @type				NodeW
		 */
		textbox: null,
		/**
		 * @property		keyword			当前的关键字，进行了特殊处理
		 * @type				string
		 */
		keyword: "",
		/**
		 * @property		baseLayer		Suggest弹出层的HTML元素容器
		 * @type				LayerPopup
		 */
		baseLayer: null,
		/**
		 * @property		view				view实例，比如UI.ListView的实例
		 * @type				UI.View
		 */
		view: null,
		/**
		 * @property		_isTimerOn		是否开启计时器
		 * @type				boolean
		 */
		_isTimerOn: null
	};
	QW.ObjectH.mix(this._config, oConfig, true);
	return this._init();
};

/**
 * @static
 * @property	_EVENT	用于构造CustEvent的事件列表
 * @type			array
 */
Suggest.UI._EVENT = [
	/**
	 * @event	backspace	退格键按下触发
	 * @param	KEY.BackSpace
	 */
	'backspace', 
	/**
	 * @event	up				向上键按下触发
	 * @param	KEY.UP
	 */
	'up', 
	/**
	 * @event	down			向下键按下触发
	 * @param	KEY.DOWN
	 */
	'down', 
	/**
	 * @event	change		文本内容改变被处罚，单纯输入空格无效
	 * @param	KEY.CHARACTER
	 */
	'change', 
	/**
	 * @event	esc			esc键按下触发
	 * @param	KEY.ESC		
	 */
	'esc', 
	/**
	 * @event	enter			回车键按下触发
	 * @param	KEY.ENTER
	 */
	'enter', 
	/**
	 * @event	focus			文本框聚焦时出发
	 * @param	TAB_OR_CLICK
	 */
	'focus', 
	/**
	 * @event	blur			文本框失去焦点触发
	 * @param	TAB_OR_ESC
	 */
	'blur', 
	/**
	 * @event	itemfocus	Suggest项目被focus时触发，来源UI.ListView的事件冒泡
	 */
	'itemfocus', 
	/**
	 * @event	itemblur		Suggest项目被blur时触发，来源UI.ListView的事件冒泡
	 */
	'itemblur', 
	/**
	 * @event	itemselect	Suggest项目被select时触发，来源UI.ListView的事件冒泡
	 */
	'itemselect'
];

Suggest.UI.prototype = {
	/**
	 * 事件派发
	 * @method		_dispatch
	 * @param		{string}		sType		事件类型，为Suggest.UI._EVENT数组中的项
	 * @param		{event}		eEvent(Optional)	event对象
	 */
	_dispatch: function(sType, eEvent) {
		if (!QW.ArrayH.contains(Suggest.UI._EVENT, sType)) {
			Suggest._debug('arg', 'event type "' + sType.toString() + '" not exist when dispatching Suggest.UI instance ', this);
			return false;
		}
		if (eEvent) {
			this.fire(eEvent);
		} else {
			var eEventThis = new QW.CustEvent(this, sType);
			eEventThis.suggestUI = this;
			this.fire(eEventThis);
		}
	},
	/**
	 * 实例初始化函数，构造时调用
	 * @method		_init
	 * @return		{boolean}	返回是否初始化成功
	 */
	_init: function() {
		return this._initTextbox() && this._initView() && this._initBaseLayer() && this._initEvent();
	},
	/**
	 * 文本框初始化
	 * @method		_initTextbox
	 * @return		{boolean}	返回是否初始化成功
	 */
	_initTextbox: function() {
		var oCore = QW.NodeW(this.get('textbox')).core;
		oCore = oCore.length ? oCore[0] : oCore;
		var oTextbox = QW.NodeW(oCore);
		this.set('textbox', oTextbox);
		this._prop.textbox  = oTextbox;
		var oThis = this;
		oTextbox.setAttr('autocomplete', 'off')
			.on('keydown', function(eEvent){
				oThis._keyEventHandler(eEvent);
			})
			.on('focus', function(eEvent){
				oThis._dispatch('focus');
				oThis._addTextChangeTimer();
			})
			.on('blur', function(event){
				oThis._dispatch('blur');
				oThis._removeTextChangeTimer();
			});
		return true;
	},
	/**
	 * View初始化
	 * @method		_initView
	 * @return		{boolean}	返回是否初始化成功
	 */
	_initView: function() {
		var oView = this.get('uiView');
		if (oView === null) {
			oView = new Suggest.UI.ListView(this._config);
		}
		this.set('uiView', oView);
		this._prop.view = oView;
		var oThis = this;
		oView.on('itemfocus', function(eEvent) {
			oThis._dispatch('itemfocus', eEvent);
		});
		oView.on('itemblur', function(eEvent) {
			oThis._dispatch('itemblur', eEvent);
		});
		oView.on('itemselect', function(eEvent) {
			oThis._removeTextChangeTimer();
			oThis._dispatch('itemselect', eEvent);
		});
		return true;
	},
	/**
	 * 弹出层初始化
	 * @method		_initBaseLayer
	 * @return		{boolean}	返回是否初始化成功
	 */
	_initBaseLayer: function() {
		var m = this.get('uiBaseLayerConfig');
		if (this.get('uiContainer') && QW.Dom.isElement(this.get('uiContainer'))) {
			this._prop.baselayer = new QW.LayerPopup(this.get('uiContainer'), m);
		} else {
			m.INNER_CLASS = 'panel-content ' + this.get('uiStyle').containerClass;
			this._prop.baselayer = new QW.LayerPopup(m);
		}
		if (this.get('uiCaption') !== null && this.get('uiCaption') !== '') {
			this._prop.baselayer.setCaption(this.get('uiCaption'));
		}
		this._prop.baselayer.setContent(QW.$(this._prop.view.getContainer()));
		if (this.get('uiReferEl') !== null) {
			var oCore = QW.NodeW(this.get('uiReferEl')).core;
			oCore = oCore.length ? oCore[0] : oCore;
			var oE = QW.NodeW(oCore);
			this.set('uiReferEl', oE);
		} else {
			this.set('uiReferEl', this.get('textbox'));
		}
		return true;
	},
	/**
	 * 事件初始化
	 * @method		_initEvent
	 * @return		{boolean}	返回是否初始化成功
	 */
	_initEvent: function() {
		QW.CustEvent.createEvents(this, Suggest.UI._EVENT);
		return true;
	},
	/**
	 * 检测是否开启文本变化计时器
	 * @method		_hasTextChangeTimer
	 * @return		{boolean}	返回是否启用
	 */
	_hasTextChangeTimer: function() {
		return this._prop._isTimerOn;
	},
	/**
	 * 关闭文本变化计时器
	 * @method		_removeTextChangeTimer
	 * @return		{boolean}	返回是否成功关闭
	 */
	_removeTextChangeTimer: function() {
		if (this._prop._isTimerOn) {
			clearInterval(this._prop._textChangeTimer);
			this._prop._isTimerOn = false;
			return true;
		}
		return true;
	},
	/**
	 * 开启文本变化计时器
	 * @method		_addTextChangeTimer
	 * @return		{boolean}	返回是否成功开启
	 */
	_addTextChangeTimer: function() {
		if (!this._prop._isTimerOn) {
			var oThis = this;
			oThis._prop._textChangeTimer = window.setInterval(function () {
				var value = oThis.getTextboxValue();
				/*
				 * change自定义事件的触发条件
				 * 文本框值有改变
				 */
				if (oThis.getKeyword() != value) {
					oThis._prop.keyword = value;
					oThis._dispatch('change');
				}
			}, oThis.get('_interval'));
			this._prop._isTimerOn = true;
			return true;
		}
		return true;
	},
	/**
	 * 键盘按键管理器，包含了up,down,backspace,esc,enter等按键的KeyCode，同时记载了一些无效按键
	 * @property		_keyManager
	 * @type			object
	 */
	_keyManager: {
		DOWN  : 40,
		UP    : 38,
		ESC   : 27,
		ENTER : 13,
		BACKSPACE: 8,
		_invalidKeyCode: [40, 39, 38, 37, 27, 13, 17, 16]
	},
	/**
	 * 检测KeyCode是否有效
	 * @method		_isKeyValid
	 * @param		{integer}	nKeyCode
	 * @return		{boolean}	返回按键是否有效
	 */
	_isKeyValid: function(nKeyCode) {
		var aInvalidCode = this._keyManager._invalidKeyCode;
		for (var i = 0, len = aInvalidCode.length; i < len; i++) {
			if (aInvalidCode[i] == nKeyCode) return false;
		}
		return true;
	},
	/**
	 * 键盘按键处理函数
	 * @method		_keyEventHandler
	 * @param		{event}		eEvent
	 */
	_keyEventHandler: function(eEvent) {
		var sEventType = "";
		switch(eEvent.keyCode) {
			case this._keyManager.UP:
				sEventType = "up";
				this._removeTextChangeTimer();
				break;
			case this._keyManager.DOWN:
				sEventType = "down";
				this._removeTextChangeTimer();
				break;
			case this._keyManager.ESC:
				sEventType = "esc";
				this._removeTextChangeTimer();
				break;
			case this._keyManager.BACKSPACE:
				sEventType = "backspace";
				this._addTextChangeTimer();
				break;
			case this._keyManager.ENTER:
				sEventType = "enter";
				eEvent.preventDefault();
				this._removeTextChangeTimer();
				break;
			default:
				if (this._isKeyValid(eEvent.keyCode)) {
					this._addTextChangeTimer();
				};
		};
		if (sEventType != '') 
			this._dispatch(sEventType);
	},
	/**
	 * 设置参数
	 * @method		set
	 * @param		{string}		sKey			属性名
	 * @param		{object}		oValue		属性值
	 * @return		{object}		返回设置的oValue，默认设置成功
	 * @example		
this.set('textbox', '#id')
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
	 * 渲染所有列表项
	 * @method		render
	 * @param		{array[JSON Object]}			aData			数据数组
	 */
	render: function(aData) {
		return this._prop.view.render(aData);
	},
	/**
	 * 设置文本框内容
	 * @method		setTextboxValue
	 * @param		{string}			sValue			要设定的文本值
	 * @param		{boolean}		是否设定成功
	 */
	setTextboxValue: function(sValue){
		this._prop.textbox.core.value = sValue;
//		this._prop.keyword = sValue;
		return true;
	},
	/**
	 * 获取文本框内容
	 * @method		getTextboxValue
	 * @return		{string}		返回文本框的值，已经处理trim的
	 */
	getTextboxValue: function(){
		return QW.StringH.trim(this._prop.textbox.core.value);
	},
	/**
	 * 显示Suggest的弹出层
	 * @method		show
	 * @return		{boolean}		返回是否弹出成功
	 */
	show: function() {
		this._prop.baselayer.showPopup(null, this.get('uiReferEl').get('offsetHeight'), null, null, this.get('uiReferEl').core);
		return true;
	},
	/**
	 * 隐藏Suggest的弹出层
	 * @method		hide
	 * @return		{boolean}		返回是否隐藏成功
	 */
	hide: function(){
		this._prop.baselayer.hide();
		return true;
	},
	/**
	 * 设置关键字，注意关键字并不意味着文本框的值，有时人工设置文本框的值，但是Suggest实例的关键字是没有变化的
	 * @method		setKeyword
	 * @param		{string}		sKey		关键字
	 */
	setKeyword: function(sKey){
		this._prop.keyword = sKey;
	},
	/**
	 * 获取关键字，注意关键字并不意味着文本框的值，有时人工设置文本框的值，但是Suggest实例的关键字是没有变化的
	 * @method		getKeyword
	 * @return		{string}		返回关键字
	 */
	getKeyword: function(){
		return QW.StringH.trim(this._prop.keyword);
	},
	/**
	 * 获取第n提示项，调用View的方法进行处理，本身没有操作
	 * @method		getItem
	 * @param		{integer}	nIndex		第几项
	 * @return		{NodeW}
	 */
	getItem: function(nIndex) {
		return this._prop.view.getItem(nIndex);
	},
	/**
	 * 选中列表项的第n项
	 * @method		selectItem
	 * @param		{integer}	nIndex		第几项
	 * @return		{boolean}	返回是否select成功
	 */
	selectItem: function(nIndex){
		this._prop.view.focusItem(nIndex);
		return true;
	},
	/**
	 * focus列表项的第n项
	 * @method		focusItem
	 * @param		{integer}	nIndex		第几项
	 * @return		{boolean}	返回是否focus成功
	 */
	focusItem: function(nIndex){
		this._prop.view.focusItem(nIndex);
		return true;
	},
	/**
	 * blur列表项的第n项
	 * @method		blurItem
	 * @param		{integer}	nIndex		第几项
	 * @return		{boolean}	返回是否blur成功
	 */
	blurItem: function(nIndex){
		this._prop.view.blurItem(nIndex);
		return true;
	}
};
