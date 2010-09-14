/**
 * @class		Suggest.UI			����Suggest�漰�Ľ��沿��
 * @namespace	Suggest
 * @author	Remember2015(wangzilong@baidu.com)
 */
/**
 * @constructor		
 * @param	{object}		oConfig	���캯����������ϸ�����������
 * @example	
new Suggest.UI({
	textbox: "#sug-textbox",
	uiReferEl: '#sug-wrap'
})
 * @return	{boolean}	�����Ƿ���ɹ�
 */
Suggest.UI = function(oConfig) {
	Suggest._argValid(oConfig, 'object', arguments.callee);
		/**
	 * @property	_config		UIʵ����˽�б������ϣ������ǹ���ʵ����Ҫ�����ò���
	 * @type			object
	 */
	this._config = {
		/**
		 * @cfg		{xpatch|HTMLElement|NodeW}		textbox		��Ҫ����Suggest���ı���
		 */
		textbox: "",
		/**
		 * @cfg		{UI.View}		uiCaption		��ʾ���ͷ��
		 */
		uiCaption: null,
		/**
		 * @cfg		{object}		uiView		view��ʵ����������չ��������ӿڲ���UI.ListView
		 */
		uiView: null,
		/**
		 * @cfg		{object}		uiBaseLayerConfig		popup�Ĳ�����Ĭ��û�У���ϸ����@link[QW.Panel]
		 */
		uiBaseLayerConfig: {
			autoPosition: false
		},
		/**
		 * @cfg		{object}		uiContainer		��ʾ�������
		 */
		uiContainer: null,
		/**
		 * @cfg		{xpatch|HTMLElement|NodeW}		uiReferEl		Suggest��������Զ�λ������Ĭ��Ϊ�ı���
		 */
		uiReferEl: null,
		/**
		 * @cfg		{integer}		_interval		˽�б���������ı��仯�ļ�ʱ����������Ե���
		 */
		_interval: 50
	};
	/**
	 * @property		_prop		UIʵ�������Լ��ϣ�������ʵ�����еĸ����ڲ�����
	 * @type				object
	 */
	this._prop = {
		/**
		 * @property		_textChangeTimer		������ݱ仯�ļ�ʱ��
		 * @type				window.interval
		 */
		_textChangeTimer: null,
		/**
		 * @property		textbox			�ı���
		 * @type				NodeW
		 */
		textbox: null,
		/**
		 * @property		keyword			��ǰ�Ĺؼ��֣����������⴦��
		 * @type				string
		 */
		keyword: "",
		/**
		 * @property		baseLayer		Suggest�������HTMLԪ������
		 * @type				LayerPopup
		 */
		baseLayer: null,
		/**
		 * @property		view				viewʵ��������UI.ListView��ʵ��
		 * @type				UI.View
		 */
		view: null,
		/**
		 * @property		_isTimerOn		�Ƿ�����ʱ��
		 * @type				boolean
		 */
		_isTimerOn: null
	};
	QW.ObjectH.mix(this._config, oConfig, true);
	return this._init();
};

/**
 * @static
 * @property	_EVENT	���ڹ���CustEvent���¼��б�
 * @type			array
 */
Suggest.UI._EVENT = [
	/**
	 * @event	backspace	�˸�����´���
	 * @param	KEY.BackSpace
	 */
	'backspace', 
	/**
	 * @event	up				���ϼ����´���
	 * @param	KEY.UP
	 */
	'up', 
	/**
	 * @event	down			���¼����´���
	 * @param	KEY.DOWN
	 */
	'down', 
	/**
	 * @event	change		�ı����ݸı䱻��������������ո���Ч
	 * @param	KEY.CHARACTER
	 */
	'change', 
	/**
	 * @event	esc			esc�����´���
	 * @param	KEY.ESC		
	 */
	'esc', 
	/**
	 * @event	enter			�س������´���
	 * @param	KEY.ENTER
	 */
	'enter', 
	/**
	 * @event	focus			�ı���۽�ʱ����
	 * @param	TAB_OR_CLICK
	 */
	'focus', 
	/**
	 * @event	blur			�ı���ʧȥ���㴥��
	 * @param	TAB_OR_ESC
	 */
	'blur', 
	/**
	 * @event	itemfocus	Suggest��Ŀ��focusʱ��������ԴUI.ListView���¼�ð��
	 */
	'itemfocus', 
	/**
	 * @event	itemblur		Suggest��Ŀ��blurʱ��������ԴUI.ListView���¼�ð��
	 */
	'itemblur', 
	/**
	 * @event	itemselect	Suggest��Ŀ��selectʱ��������ԴUI.ListView���¼�ð��
	 */
	'itemselect'
];

Suggest.UI.prototype = {
	/**
	 * �¼��ɷ�
	 * @method		_dispatch
	 * @param		{string}		sType		�¼����ͣ�ΪSuggest.UI._EVENT�����е���
	 * @param		{event}		eEvent(Optional)	event����
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
	 * ʵ����ʼ������������ʱ����
	 * @method		_init
	 * @return		{boolean}	�����Ƿ��ʼ���ɹ�
	 */
	_init: function() {
		return this._initTextbox() && this._initView() && this._initBaseLayer() && this._initEvent();
	},
	/**
	 * �ı����ʼ��
	 * @method		_initTextbox
	 * @return		{boolean}	�����Ƿ��ʼ���ɹ�
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
	 * View��ʼ��
	 * @method		_initView
	 * @return		{boolean}	�����Ƿ��ʼ���ɹ�
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
	 * �������ʼ��
	 * @method		_initBaseLayer
	 * @return		{boolean}	�����Ƿ��ʼ���ɹ�
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
	 * �¼���ʼ��
	 * @method		_initEvent
	 * @return		{boolean}	�����Ƿ��ʼ���ɹ�
	 */
	_initEvent: function() {
		QW.CustEvent.createEvents(this, Suggest.UI._EVENT);
		return true;
	},
	/**
	 * ����Ƿ����ı��仯��ʱ��
	 * @method		_hasTextChangeTimer
	 * @return		{boolean}	�����Ƿ�����
	 */
	_hasTextChangeTimer: function() {
		return this._prop._isTimerOn;
	},
	/**
	 * �ر��ı��仯��ʱ��
	 * @method		_removeTextChangeTimer
	 * @return		{boolean}	�����Ƿ�ɹ��ر�
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
	 * �����ı��仯��ʱ��
	 * @method		_addTextChangeTimer
	 * @return		{boolean}	�����Ƿ�ɹ�����
	 */
	_addTextChangeTimer: function() {
		if (!this._prop._isTimerOn) {
			var oThis = this;
			oThis._prop._textChangeTimer = window.setInterval(function () {
				var value = oThis.getTextboxValue();
				/*
				 * change�Զ����¼��Ĵ�������
				 * �ı���ֵ�иı�
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
	 * ���̰�����������������up,down,backspace,esc,enter�Ȱ�����KeyCode��ͬʱ������һЩ��Ч����
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
	 * ���KeyCode�Ƿ���Ч
	 * @method		_isKeyValid
	 * @param		{integer}	nKeyCode
	 * @return		{boolean}	���ذ����Ƿ���Ч
	 */
	_isKeyValid: function(nKeyCode) {
		var aInvalidCode = this._keyManager._invalidKeyCode;
		for (var i = 0, len = aInvalidCode.length; i < len; i++) {
			if (aInvalidCode[i] == nKeyCode) return false;
		}
		return true;
	},
	/**
	 * ���̰���������
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
	 * ���ò���
	 * @method		set
	 * @param		{string}		sKey			������
	 * @param		{object}		oValue		����ֵ
	 * @return		{object}		�������õ�oValue��Ĭ�����óɹ�
	 * @example		
this.set('textbox', '#id')
	 */
	set: function(sKey, oValue) {
		this._config[sKey] = oValue;
		return oValue;
	},
	/**
	 * ���ز���ֵ
	 * @method		get
	 * @param		{string}		sKey			������
	 * @return		{object}
	 */
	get: function(sKey) {
		return this._config[sKey];
	},
	/**
	 * ��Ⱦ�����б���
	 * @method		render
	 * @param		{array[JSON Object]}			aData			��������
	 */
	render: function(aData) {
		return this._prop.view.render(aData);
	},
	/**
	 * �����ı�������
	 * @method		setTextboxValue
	 * @param		{string}			sValue			Ҫ�趨���ı�ֵ
	 * @param		{boolean}		�Ƿ��趨�ɹ�
	 */
	setTextboxValue: function(sValue){
		this._prop.textbox.core.value = sValue;
//		this._prop.keyword = sValue;
		return true;
	},
	/**
	 * ��ȡ�ı�������
	 * @method		getTextboxValue
	 * @return		{string}		�����ı����ֵ���Ѿ�����trim��
	 */
	getTextboxValue: function(){
		return QW.StringH.trim(this._prop.textbox.core.value);
	},
	/**
	 * ��ʾSuggest�ĵ�����
	 * @method		show
	 * @return		{boolean}		�����Ƿ񵯳��ɹ�
	 */
	show: function() {
		this._prop.baselayer.showPopup(null, this.get('uiReferEl').get('offsetHeight'), null, null, this.get('uiReferEl').core);
		return true;
	},
	/**
	 * ����Suggest�ĵ�����
	 * @method		hide
	 * @return		{boolean}		�����Ƿ����سɹ�
	 */
	hide: function(){
		this._prop.baselayer.hide();
		return true;
	},
	/**
	 * ���ùؼ��֣�ע��ؼ��ֲ�����ζ���ı����ֵ����ʱ�˹������ı����ֵ������Suggestʵ���Ĺؼ�����û�б仯��
	 * @method		setKeyword
	 * @param		{string}		sKey		�ؼ���
	 */
	setKeyword: function(sKey){
		this._prop.keyword = sKey;
	},
	/**
	 * ��ȡ�ؼ��֣�ע��ؼ��ֲ�����ζ���ı����ֵ����ʱ�˹������ı����ֵ������Suggestʵ���Ĺؼ�����û�б仯��
	 * @method		getKeyword
	 * @return		{string}		���عؼ���
	 */
	getKeyword: function(){
		return QW.StringH.trim(this._prop.keyword);
	},
	/**
	 * ��ȡ��n��ʾ�����View�ķ������д�������û�в���
	 * @method		getItem
	 * @param		{integer}	nIndex		�ڼ���
	 * @return		{NodeW}
	 */
	getItem: function(nIndex) {
		return this._prop.view.getItem(nIndex);
	},
	/**
	 * ѡ���б���ĵ�n��
	 * @method		selectItem
	 * @param		{integer}	nIndex		�ڼ���
	 * @return		{boolean}	�����Ƿ�select�ɹ�
	 */
	selectItem: function(nIndex){
		this._prop.view.focusItem(nIndex);
		return true;
	},
	/**
	 * focus�б���ĵ�n��
	 * @method		focusItem
	 * @param		{integer}	nIndex		�ڼ���
	 * @return		{boolean}	�����Ƿ�focus�ɹ�
	 */
	focusItem: function(nIndex){
		this._prop.view.focusItem(nIndex);
		return true;
	},
	/**
	 * blur�б���ĵ�n��
	 * @method		blurItem
	 * @param		{integer}	nIndex		�ڼ���
	 * @return		{boolean}	�����Ƿ�blur�ɹ�
	 */
	blurItem: function(nIndex){
		this._prop.view.blurItem(nIndex);
		return true;
	}
};
