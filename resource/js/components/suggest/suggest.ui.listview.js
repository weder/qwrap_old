/**
 * @class	Suggest.UI.ListView	����UI��view���ֵ�һ��ʵ�֣�Ҳ����õ����ͣ��б�
 * @namespace	Suggest
 * @author	Remember2015(wangzilong@baidu.com)
 */

/**
 * @constructor		
 * @param	{object}		oConfig	���캯����������ϸ�����������
 * @example	
new Suggest.UI.ListView({
	uiTemplate: "<p>{display}</p><q>{value}</q>"
})
 * @return	{boolean}	�����Ƿ���ɹ�
 */
Suggest.UI.ListView = function(oConfig) {
	Suggest._argValid(oConfig, 'object', arguments.callee);
	/**
	 * @property	_config		ListViewʵ����˽�б������ϣ������ǹ���ʵ����Ҫ�����ò���
	 * @type			object
	 */
	this._config = {
		/**
		 * @cfg		{string}		uiTemplate(Optional)		������Ⱦģ�壬�����ã���ʹ�ô�ģ���ʽ�����ݣ����ȼ�����uiRender
		 * @exapmle		
if (data == {valueA: '1', valueB: '2'}) 
	uiTemplate = {
		uiTemplate: "<b>{valueA} + {valueB}</b>"
	};
		 */
		uiTemplate: "",
		uiListContainer: null,
		/**
		 * @cfg			{function}		uiRender(Optional)		������Ⱦ���������ղ���Ϊdata���󣬷���ΪDom�ڵ�(����wrap)
		 * @example
var render = function(oData) {
	return QW.$$(QW.Dom.create('<span onclick="alert(document.location)">' + oData.val.resultNumber + '<span>')); 
}
		 */
		uiRender: null,
		/**
		 * @cfg			{function}		uiHighlighter(Optional)		��ʾ��ʾ��ʱ����Ҫ���⴦��ؼ��ָ�������������ʱʹ��
		 * @exapmle		
var uiHighlighter = function(oEl) {
	var elKeyEl = QW.$$(oEl).query('.key').core[0];
	var sHtml = elKeyEl.innerHTML;
	elKeyEl.innerHTML = sHtml.replace(sug.getKeyword(), '<em style="color:#d06000;font-weight:bold">' + sug.getKeyword() + '</em>')
};
		 */
		uiHighlighter: Suggest.O,
		/**
		 * @cfg		{integer}		uiItemNumber(Optional)		�б���������������data��20�uiItemNumber����Ϊ10����ֻ��ʾ10����ǿ���ͨ�����¼�����
		 */
		uiItemNumber: -1,
		/**
		 * @cfg			{object}		uiStyle		��ʽ���ϣ�����containerClass��selectedClass��focusClass�ȣ��ṩĬ��ֵ
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
	 * @property		_prop		ListViewʵ�������Լ��ϣ�������ʵ�����еĸ����ڲ�����
	 * @type				object
	 */
	this._prop = {
		/**
		 * @property		container		Suggest�б����HTMLԪ������
		 * @type				NodeW
		 */
		container: null,
		/**
		 * @property		items		�����б����ӦHTMLԪ�صļ���
		 * @type				array[NodeW]
		 */
		items: [],
		/**
		 * @property		start		ListViewʵ����ʾ��container�������Ŀ����ʾindex
		 * @type				integer
		 */
		start: 0
	};
	QW.ObjectH.mix(this._config, oConfig, true);
	return this._init();
};
/**
 * @static
 * @property	_EVENT	���ڹ���CustEvent���¼��б�
 * @type			array
 */
Suggest.UI.ListView._EVENT = [
	/**
	 * @event	itemfocus	Suggest��Ŀ��focusʱ������UI����¼�
	 * @param	mouseenter
	 */
	'itemfocus', 
	/**
	 * @event	itemblur		Suggest��Ŀblurʱ������UI����¼�
	 * @param	mouseout
	 */
	'itemblur', 
	/**
	 * @event	itemselect	Suggest��Ŀ�����ʱ������UI����¼�
	 * @param	mousedown
	 */
	'itemselect'
];

Suggest.UI.ListView.prototype = {
	/**
	 * ʵ����ʼ������������ʱ����
	 * @method		_init
	 * @return		{boolean}	�����Ƿ��ʼ���ɹ�
	 */
	_init: function() {
		this._prop.container = this.get('uiListContainer') || QW.NodeW(document.createElement('div'));
//		this._prop.container.addClass(this.get('uiStyle').containerClass);
		this._initEvent();
		return true;
	},
	/**
	 * �¼���ʼ��
	 * @method		_initEvent
	 * @return		{boolean}	�����Ƿ��ʼ���ɹ�
	 */
	_initEvent: function() {
		QW.CustEvent.createEvents(this, Suggest.UI.ListView._EVENT);
		return true;
	},
	/**
	 * �¼��ɷ�
	 * @method		_dispatch
	 * @param		{string}		sType		�¼����ͣ�ΪSuggest.UI.ListView._EVENT�����е���
	 * @param		{integer}	nIndex	�¼���������Ŀ��index
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
	 * ���ò���
	 * @method		set
	 * @param		{string}		sKey			������
	 * @param		{object}		oValue		����ֵ
	 * @return		{object}		�������õ�oValue��Ĭ�����óɹ�
	 * @example		
this.set('uiItemNumber', 10)
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
	 * �����б��������
	 * @method		getContainer
	 * @return		{NodeW}
	 */
	getContainer: function() {
		return this._prop.container;
	},
	/**
	 * ��Ⱦ�����б���
	 * @method		render
	 * @param		{array[JSON Object]}			aData			��������
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
	 * ��Ⱦ�����б���
	 * @method		renderItem
	 * @param		{object}		oData			������
	 * @param		{integer}	nIndex		�ڼ���
	 * @return		{NodeW}		��Ⱦ��ϵ��б���
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
	 * Ϊ�б�����¼�
	 * @method		_bindEventToItem
	 * @param		{NodeW}		oEl			�󶨶���
	 * @param		{integer}	nIndex		�ڼ���
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
	 * ���¹���һ��
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
	 * ���Ϲ���һ��
	 * @method		scrollUp
	 */
	scrollUp: function() {
		this._prop.container.removeChild(this._prop.items[this._prop.start]);
		this._prop.items[this._prop.start + this.get('uiItemNumber') - 1].insertSiblingAfter(this._prop.items[this._prop.start + this.get('uiItemNumber')]);
		this._prop.start++;
	},
	/**
	 * �б��������n��
	 * @method		scrollTo
	 * @param		{integer}	nIndex		�ڼ���
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
	 * �����б���ĵ�n��
	 * @method		getItem
	 * @param		{integer}	nIndex		�ڼ���
	 * @return		{NodeW}
	 */
	getItem: function(nIndex) {
		return this._prop.items[nIndex];
	},
	/**
	 * ѡ���б���ĵ�n��
	 * @method		selectItem
	 * @param		{integer}	nIndex		�ڼ���
	 * @return		{boolean}	�����Ƿ�select�ɹ�
	 */
	selectItem: function(nIndex) {
		this._prop.items[nIndex].addClass(this.get('uiStyle').selectClass);
		return true;
	},
	/**
	 * focus�б���ĵ�n��
	 * @method		focusItem
	 * @param		{integer}	nIndex		�ڼ���
	 * @return		{boolean}	�����Ƿ�focus�ɹ�
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
	 * ������n��
	 * @method		highlight
	 * @param		{integer}	nIndex		�ڼ���
	 * @return		{boolean}	�����Ƿ�focus�ɹ�
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
	 * blur�б���ĵ�n��
	 * @method		blurItem
	 * @param		{integer}	nIndex		�ڼ���
	 * @return		{boolean}	�����Ƿ�blur�ɹ�
	 */
	blurItem: function(nIndex) {
		nIndex = parseInt(nIndex, 10);
		if (nIndex < 0) 
			return false;
		this._prop.items[nIndex].removeClass(this.get('uiStyle').focusClass);
		return true;
	}
};