/**
 * @class		Suggest.Data				���ڴ���Suggest��������Դ������Ϊ�ű�CallBack(�漰����)���ű�����(������json�ı�)
 * @namespace	Suggest
 * @author		Remember2015(wangzilong@baidu.com)
 */
/**
 * @constructor		
 * @param	{object}		oConfig	���캯����������ϸ�����������
 * @example	
new Suggest.Data({
	dataUrl: "http://abc.com/?suggest&xx=xx"
})
 * @return	{boolean}	�����Ƿ���ɹ�
 */
Suggest.Data = function(oConfig) {
	Suggest._argValid(oConfig, 'object', arguments.callee);
		/**
	 * @property	_config		Dataʵ����˽�б������ϣ������ǹ���ʵ����Ҫ�����ò���
	 * @type			object
	 */
	this._config = {
		/**
		 * @cfg		{string}		dataUrl		�������ݵĵ�ַ
		 */
		dataUrl: null,
		/**
		 * @cfg		{string}		dataType		Data���ͣ�ö�٣�ScriptCallBack, ScriptData
		 */
		dataType: "ScriptCallBack",
		/**
		 * @cfg		{function}		dataCallBack		��������֮��Ļص�����
		 */
		dataCallBack: Suggest.O,
		/**
		 * @cfg		{function}		dataHandler		�������ݵĴ����������ڲ������ݵ�У�����ȡ
		 */
		dataHandler: Suggest.O,
		/**
		 * @cfg		{integer}		dataCapacity		���ݶ����������-1Ϊû����������
		 */
		dataCapacity: -1
	};
	/**
	 * @property		_prop		Dataʵ�������Լ��ϣ�������ʵ�����еĸ����ڲ�����
	 * @type				object
	 */
	this._prop = {
		/**
		 * @property		key		�ؼ��֣����߱���д�������ڲ�ʹ�õı���
		 * @type				string
		 */
		key: "",
		/**
		 * @property		index		��ǰ���ָ��
		 * @type				integer
		 */
		index: -1,
		/**
		 * @property		originalIndex		֮ǰ���ָ��
		 * @type				integer
		 */
		originalIndex: -1,
		/**
		 * @property		cache		Suggest.Cacheʵ��
		 * @type				Suggest.Cache
		 */
		cache: null,
		/**
		 * @property		data		��������
		 * @type				array
		 */
		data: []
	};

	QW.ObjectH.mix(this._config, oConfig, true);
	return this._init();
};
/**
 * @static
 * @property	_EVENT	���ڹ���CustEvent���¼��б�
 * @type			array
 */
Suggest.Data._EVENT = [
	/**
	 * @event		datachange		��������ʱ�ᴥ��
	 */
	"datachange", 
	/**
	 * @event		indexchange		indexָ��ı�ʱ�򴥷���indexָ��ָ��ǰ��
	 */
	"indexchange", 
	/**
	 * @event		overflow			���ص����ݳ�������ʱ����
	 */
	"overflow"
];
/**
 * @static
 * @property	_UID		���ڹ���ͬ�ؼ�������Ӧ��ȫ��callback���������
 * @type			object
 */
Suggest.Data._UID = {};
Suggest.Data.prototype = {
	/**
	 * ʵ����ʼ������������ʱ����
	 * @method		_init
	 * @return		{boolean}	�����Ƿ��ʼ���ɹ�
	 */
	_init: function() {
		var sTp = this.get('dataType');
		if (this.get('dataUrl') != '') {
			if (sTp == "ScriptCallBack") {
				var sUrl = this.get('dataUrl') + "&max_count=" + this.get('dataCapacity');
				this.set('dataUrl', sUrl);
			}
			if (sTp == "ScriptData") {
			}
		} 
		return this._initCache() && this._initEvent();
	},
	/**
	 * �����ʼ��
	 * @method		_initCache
	 * @return		{boolean}	�����Ƿ��ʼ���ɹ�
	 */
	_initCache: function() {
		var oSugCache = new Suggest.Cache(this._config);
		if (!oSugCache) {
			Suggest._debug("arg", "cacheCapacity", arguments.callee);
			return false;
		}
		this._prop.cache = this.set('cache', oSugCache);
		return true;
	},
	/**
	 * �¼���ʼ��
	 * @method		_initEvent
	 * @return		{boolean}	�����Ƿ��ʼ���ɹ�
	 */
	_initEvent: function() {
		return QW.CustEvent.createEvents(this, Suggest.Data._EVENT);
	},
	/**
	 * �¼��ɷ�
	 * @method		_dispatch
	 * @param		{string}		sType		�¼����ͣ�ΪSuggest.Data._EVENT�����е���
	 * @param		{event}		eEvent(Optional)	event����
	 */
	_dispatch: function(sType) {
		if (!QW.ArrayH.contains(Suggest.Data._EVENT, sType)) {
			Suggest._debug('arg', 'event type "' + sType.toString() + '" not exist', this);
			return false;
		}
		var eEvent = new QW.CustEvent(this, sType);
		eEvent.suggestData = this;
		this.fire(eEvent);
	},
	/**
	 * ��ѯ�ؼ���
	 * @method		query
	 * @param		{string}			sKey							�ؼ���
	 * @param		{function}		fCallback(Optional)		�ص�����
	 * @return		{boolean}		�����Ƿ��ѯ�ɹ�
	 */
	query: function(sKey, fCallback) {
		if(!Suggest._argValid(sKey, 'string', arguments.callee))
			return false;
		this._prop.key = sKey;
		if (this._prop.cache.hasCache(sKey)) {
			this._read(this._prop.cache.getCache(sKey));
			if (fCallback)
				fCallback.apply(this);
			return true;
		} else {
			return this._request(this.get('dataCallback'));
		}
	},
	/**
	 * �ڲ�������������������
	 * @method		_request
	 * @param		{function}		fCallback(Optional)		�ص�����
	 * @return		{boolean}		�����Ƿ��ѯ�ɹ�
	 */
	_request: function(fCallback) {
		var uid = 0;
		do {
			uid = (Math.random()*100000000).toFixed(0);
		}
		while (Suggest.Data._UID[uid] !== window.undefined);
		Suggest.Data._UID[uid] = '';
		if (this.get('dataType') == "ScriptCallBack") {
			var head = document.getElementsByTagName("head")[0];
			var script = document.createElement("script");
			var done = false;
			script.src = this.get('dataUrl') + '&keyword=' + window.encodeURIComponent(QW.StringH.trim(this._prop.key)) + "&callback=_SuggestCallBack" + uid;
			window["_SuggestCallBack" + uid] = this._scriptCallbackHandler(this._prop.key);
			if (Suggest._argValid(fCallback, 'function', arguments.callee)) {
				script.onload = script.onreadystatechange = function() {
					if ( !done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") ) {
							done = true;
							fCallback();
					}
				};
			}
			head.appendChild(script);
			return true;
		} 
	},
	/**
	 * ����_request�Ļص�����
	 * @method		_scriptCallbackHandler
	 * @param		{string}			sKey			�ؼ���
	 */
	_scriptCallbackHandler: function(sKey) {
		var oThis = this;
		var handler = this.get('dataHandler');
		return function(oData) {
			handler(sKey, oData, oThis);
		};
	},
	/**
	 * ��ȡ��ѯ���ص����ݣ�������datachange�¼�
	 * @method		_read
	 * @param		{array[JSON Object]}			aDataSource			����Դ
	 * @return		{boolean}		�����Ƿ��ȡ�ɹ�
	 */
	_read: function(aDataSource) {
		if (aDataSource.length !== undefined) {
			this._prop.data = aDataSource;
			this._dispatch('datachange');
			return true;
		} else {
			Suggest._debug('arg', 'aDataSource must be an array', aDataSource);
			return false;
		}
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
	 * ���õ�ǰ��ᴥ��indexchange�¼�
	 * @method		setCurrent
	 * @param		{integer}		nIndex		��n��
	 * @return		{boolean}		�����趨�Ƿ�ɹ�
	 */
	setCurrent: function(nIndex) {
		if(!Suggest._argValid(nIndex, 'number', arguments.callee))
			return false;
		if(nIndex > this.getLength()) {
			Suggest._debug("arg", "index setted is larger than the length of data", arguments.callee)
			return false;
		}
		this._prop.originalIndex  = this._prop.index;
		this._prop.index = nIndex;
		this._dispatch('indexchange');
		return true;
	},
	/**
	 * �������ݼ�
	 * @method		getData
	 * @return		{array[JSON Object]}
	 */
	getData: function() {
		return this._prop.data;
	},
	/**
	 * ����֮ǰ���ָ��
	 * @method		getOriginalIndex
	 * @return		{integer}
	 */
	getOriginalIndex: function() {
		return this._prop.originalIndex;
	},
	/**
	 * ���ص�ǰ���ָ��
	 * @method		getIndex
	 * @return		{integer}
	 */
	getIndex: function() {
		return this._prop.index;
	},
	/**
	 * ����ĳһ�������
	 * @method		getItem
	 * @param		{integer}		nIndex		��n��
	 * @return		{boolean|object}		�������ݱ�ʾ�ɹ���false��ʾʧ��
	 */
	getItem: function(nIndex) {
		if(!Suggest._argValid(nIndex, 'number', arguments.callee))
			return false;
		if(nIndex > this.getLength() - 1) 
			return false;
		return this._prop.data[nIndex];
	},
	/**
	 * ���ص�ǰ���ݼ��ϵĴ�С
	 * @method		getLength
	 * @return		{integer}
	 */
	getLength: function() {
		return this._prop.data.length;
	},
	/**
	 * ��������
	 * @method		increase
	 * @param		{integer}		nLength		���ӵ�������
	 * @param		{function}		fCallback(Optional)		�ص�����
	 * @return		{boolean}		
	 */
	increase: function(nLength, fCallback) {
		var sUrl = this.get('dataUrl');
		sUrl.replace(/&max_count=([^&]*)/gi, function(a, b) {
			return "&max_count=" + (parseInt(b, 10) + nLength);
		});
		return this._request(fCallback);
	}
};
