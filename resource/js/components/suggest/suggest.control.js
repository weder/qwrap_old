/**
 * @class		Suggest				���ڴ���Suggest��������Դ������Ϊ�ű�CallBack(�漰����)���ű�����(������json�ı�)
 * @namespace	Suggest
 * @author		Remember2015(wangzilong@baidu.com)
 */
/**
 * @constructor		
 * @param	{object}		oConfig	���캯����������ϸ�����������
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
 * @return	{boolean}	�����Ƿ���ɹ�
 */
Suggest = function(oConfig) {
	Suggest._argValid(oConfig, 'object', arguments.callee);
	/**
	 * @property	_config		Suggestʵ���ı������ϣ������ǹ���ʵ����Ҫ�����ò���
	 * @type			object
	 */
	this._config = {
		/**
		 * @cfg		{boolean}		autoFocusFirstItem		�Ƿ��Զ�focus��һ��
		 */
		autoFocusFirstItem: true,
		/**
		 * @cfg		{boolean}		autoSelectToEnter		�Ƿ���ѡ��ĳһ��ʱ����enter�¼�
		 */
		autoSelectToEnter: false,
		/**
		 * @cfg		{integer}		cacheCapacity		Cache��������Dataʵ������ʱʹ��
		 */
		cacheCapacity: -1,
		/**
		 * @cfg		{boolean}		cacheAutoScale		Cache�Ƿ��Զ����ƴ�С��Dataʵ������ʱʹ��
		 */
		cacheAutoScale: true,
		/**
		 * @cfg		{Suggest.Data}		data		dataʵ�����紫��β��������������data����
		 */
		data: null,
		/**
		 * @cfg		{string}		dataUrl		dataʵ���������������data�ĵ�
		 */
		dataUrl: "",
		/**
		 * @cfg		{string}		dataType		dataʵ���������������data�ĵ�
		 */
		dataType: "ScriptCallBack",
		/**
		 * @cfg		{function}		dataCallback		dataʵ���������������data�ĵ�
		 */
		dataCallback: Suggest.O,
		/**
		 * @cfg		{function}		dataHandler		dataʵ���������������data�ĵ�
		 */
		dataHandler: function(sKey, oData, oThis) {
			if (oData.err == 'mcphp.ok') {
				oThis._read(oData.data.res.object)
				//oThis._read(oArg.r.concat(oArg.r.slice(0)));
				oThis._prop.cache.pushCache(sKey, oData.data.res.object);
			}
		},
		/**
		 * @cfg		{string}		dataCapacity		dataʵ���������������data�ĵ�
		 */
		dataCapacity: 10,
		/**
		 * @cfg		{object}		ui		uiʵ�����紫��β��������������UI����
		 */
		ui: null,
		/**
		 * @cfg		{string|NodeW}		textbox		uiʵ���������������ui�ĵ�
		 */
		textbox: '',
		/**
		 * @cfg		{string}		uiTemplate		uiʵ���������������ui�ĵ�
		 */
		uiTemplate: '<div><span class="key">{display}</span><span class="val">{val}</span></div>',
		/**
		 * @cfg		{function}		uiRender		uiʵ���������������ui�ĵ�
		 */
		uiRender: Suggest.O,
		/**
		 * @cfg		{function}		uiHighlighter		uiʵ���������������ui�ĵ�
		 */
		uiHighlighter: Suggest.O,
		/**
		 * @cfg		{object}		uiBaseLayerConfig		uiʵ���������������ui�ĵ�
		 */
		uiBaseLayerConfig: {
			autoPosition: false
		},
		/**
		 * @cfg		{integer}		uiItemNumber		uiʵ���������������ui�ĵ�
		 */
		uiItemNumber: -1,
		/**
		 * @cfg		{object}		uiContainer		uiʵ���������������ui�ĵ�
		 */
		uiContainer: null,
		/**
		 * @cfg		{object}		uiStyle		uiʵ���������������ui�ĵ�
		 */
		uiStyle: {
			itemClass: 'item',
			containerClass: 'panel-suggest',
			selectClass: 'selected',
			focusClass: 'selected'
		},
		/**
		 * @cfg		{object}		uiView	uiʵ���������������ui�ĵ�
		 */
		uiView: null,
		uiSelectFilter: function(d){return true}
	};

	/**
	 * @property		_prop		Suggestʵ�������Լ��ϣ�������ʵ�����еĸ����ڲ�����
	 * @type				object
	 */
	this._prop = {
		/**
		 * @property		index		��ǰ��ע���ֵ
		 * @type				integer
		 */
		index: -1,
		/**
		 * @property		isShown		�Ƿ���ʾ
		 * @type				boolean
		 */
		isShown: false,
		/**
		 * @property		data		dataʵ��
		 * @type				object
		 */
		data: null,
		/**
		 * @property		ui		uiʵ��
		 * @type				object
		 */
		ui: null
	};

	/**
	 * @property		_filter		Suggestʵ���ĵ����������Ԥ�������ڼ���Ƿ����select���߿���focus
	 * @type				object
	 */
	this._filter = {};

	QW.ObjectH.mix(this._config, oConfig, true);
	this._init();
};

/**
 * @static
 * @property	_EVENT	���ڹ���CustEvent���¼��б�
 * @type			array
 */
Suggest._EVENT = [
	/**
	 * @event		backspace		�˸������
	 */
	'backspace', 
	/**
	 * @event		input		�����������ʱ��
	 */
	'input', 
	/**
	 * @event		enter		�س������´���
	 */
	'enter', 
	/**
	 * @event		esc		esc�����´���
	 */
	'esc', 
	/**
	 * @event		focus		�ı���focus��ʱ�򴥷�
	 */
	'focus', 
	/**
	 * @event		blur		�ı���blurʱ����
	 */
	'blur', 
	/**
	 * @event		itemfocus		��ʾ��focusʱ����
	 */
	'itemfocus', 
	/**
	 * @event		itemblur		��ʾ��blurʱ����
	 */
	'itemblur', 
	/**
	 * @event		itemselect		��ʾ��ѡ��ʱ����
	 */
	'itemselect'
];

Suggest.prototype = {
	/**
	 * �¼��ɷ�
	 * @method		_dispatch
	 * @param		{string}		sType		�¼����ͣ�ΪSuggest.Data._EVENT�����е���
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
	 * ʵ����ʼ������������ʱ����
	 * @method		_init
	 * @return		{boolean}	�����Ƿ��ʼ���ɹ�
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
	 * data���Գ�ʼ������Suggest.Data�๹��
	 * @method		_initData
	 * @return		{boolean}	�����Ƿ��ʼ���ɹ�
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
	 * ui���Գ�ʼ������Suggest.UI�๹��
	 * @method		_initData
	 * @return		{boolean}	�����Ƿ��ʼ���ɹ�
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
	 * �¼���ʼ������������Data��UI���¼����Լ���ʼ���Լ����¼�
	 * @method		_initEvent
	 * @return		{boolean}	�����Ƿ��ʼ���ɹ�
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
	 * ���ò���
	 * @method		set
	 * @param		{string}		sKey			������
	 * @param		{object}		oValue		����ֵ
	 * @return		{object}		�������õ�oValue��Ĭ�����óɹ�
	 * @example		
this.set('dataType', 'ScriptCallback')
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
	 * ���ù�����
	 * @method		setFilter
	 * @param		{string}		sKey			������
	 * @param		{object}		oValue		����ֵ
	 * @return		{object}		�������õ�oValue��Ĭ�����óɹ�
	 */
	setFilter: function(sKey, oValue) {
		this._filter[sKey] = oValue;
		return oValue;
	},
	/**
	 * ����Data����
	 * @method		getData
	 * @return		{object}		������Suggest��dataʵ��
	 */
	getData: function() {
		return this._prop.data;
	},
	/**
	 * ���عؼ��֣�ע���Ǻ�Textbox��Value��һ����ֵ
	 * @method		getKeyword
	 * @return		{string}		�ؼ���
	 */
	getKeyword: function() {
		return this._prop.ui.getKeyword();
	},
	/**
	 * ���ùؼ��֣�ע���Ǻ�Textbox��Value��һ����ֵ
	 * @method		setKeyword
	 * @param		{string}		sKey			�ؼ���
	 * @return		{boolean}		�Ƿ��޸ĳɹ�
	 */
	setKeyword: function(skey) {
		return this._prop.ui.setTextboxValue(skey);
	},
	/**
	 * ���ص�n����ʾ��Ŀ
	 * @method		getItem
	 * @param		{integer}		nIndex		��n���0����
	 * @return		{object}			��n�����ݣ���ʽΪ{index:x,data:x,ui:x}
	 */
	getItem: function(nIndex) {
		//���ض����ʽ������ʾ
		return {
			index: nIndex,
			data: this._prop.data.getItem(nIndex),
			ui: this._prop.ui.getItem(nIndex)
		}
	},
	/**
	 * ����Suggest�Ƿ���ʾ
	 * @method		isShown
	 * @return		{boolean}
	 */
	isShown: function() {
		return this._prop.isShown;
	},
	/**
	 * ��ʾUI����
	 * @method		show
	 * @return		{boolean}		�Ƿ���ʾ�ɹ�
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
	 * ����UI����
	 * @method		hide
	 * @return		{boolean}		�Ƿ����سɹ�
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
	 * ���ݹؼ��ֽ�����ʾ
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
	 * select�б���ĵ�n��
	 * @method		select
	 * @param		{integer}	nIndex		�ڼ���
	 * @return		{boolean}	�����Ƿ�select�ɹ�
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
	 * focus�б���ĵ�n��
	 * @method		focus
	 * @param		{integer}	nIndex		�ڼ���
	 * @return		{boolean}	�����Ƿ�focus�ɹ�
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
	 * blur�б���ĵ�n��
	 * @method		blur
	 * @param		{integer}	nIndex		�ڼ���
	 * @return		{boolean}	�����Ƿ�blur�ɹ�
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
	 * ����ʹ�ã�blurǰһ�focus��һ��
	 * @method		exchange
	 * @param		{integer}	nBlurIndex		�ڼ���
	 * @param		{integer}	nFocusIndex		�ڼ���
	 * @return		{boolean}	�����Ƿ�exchange�ɹ�
	 */
	exchange: function(nBlurIndex, nFocusIndex) {
		if (!Suggest._argValid(nBlurIndex, "number", arguments.callee) || !Suggest._argValid(nFocusIndex, "number", arguments.callee))
			return false;
		return this.blur(nBlurIndex) && this.focus(nFocusIndex);
	},
	/**
	 * ����ǰһ��
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
	 * ������һ��
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
 * �������Ժ������ڲ�����ʹ��
 * @method				_debug
 * @static
 */
Suggest._debug = function(sType, sMsg, fFunc) {
	var sTypeStr = "";
	switch (sType) {
		case "arg":
			sTypeStr = "��������";
			break;
		case "ret":
			sTypeStr = "���ش���";
			break;
		case "net":
			sTypeStr = "�����쳣";
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
 * ������⺯�����ڲ�����ʹ��
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
 * �պ�������ΪĬ�ϻص�����
 * @static
 * @method				O
 */
Suggest.O = function() {};

QW.provide("Suggest", Suggest);