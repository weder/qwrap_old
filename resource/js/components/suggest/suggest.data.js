/**
 * @class		Suggest.Data				用于处理Suggest的数据来源。可以为脚本CallBack(涉及跨域)，脚本数据(即返回json文本)
 * @namespace	Suggest
 * @author		Remember2015(wangzilong@baidu.com)
 */
/**
 * @constructor		
 * @param	{object}		oConfig	构造函数参数，详细参照类的配置
 * @example	
new Suggest.Data({
	dataUrl: "http://abc.com/?suggest&xx=xx"
})
 * @return	{boolean}	返回是否构造成功
 */
Suggest.Data = function(oConfig) {
	Suggest._argValid(oConfig, 'object', arguments.callee);
		/**
	 * @property	_config		Data实例的私有变量集合，里面是构造实例需要的配置参数
	 * @type			object
	 */
	this._config = {
		/**
		 * @cfg		{string}		dataUrl		请求数据的地址
		 */
		dataUrl: null,
		/**
		 * @cfg		{string}		dataType		Data类型，枚举：ScriptCallBack, ScriptData
		 */
		dataType: "ScriptCallBack",
		/**
		 * @cfg		{function}		dataCallBack		请求数据之后的回调函数
		 */
		dataCallBack: Suggest.O,
		/**
		 * @cfg		{function}		dataHandler		返回数据的处理函数，用于操作数据的校验与读取
		 */
		dataHandler: Suggest.O,
		/**
		 * @cfg		{integer}		dataCapacity		数据对象的容量，-1为没有容量限制
		 */
		dataCapacity: -1
	};
	/**
	 * @property		_prop		Data实例的属性集合，里面是实例运行的各种内部变量
	 * @type				object
	 */
	this._prop = {
		/**
		 * @property		key		关键字，不具备读写操作，内部使用的变量
		 * @type				string
		 */
		key: "",
		/**
		 * @property		index		当前项的指针
		 * @type				integer
		 */
		index: -1,
		/**
		 * @property		originalIndex		之前项的指针
		 * @type				integer
		 */
		originalIndex: -1,
		/**
		 * @property		cache		Suggest.Cache实例
		 * @type				Suggest.Cache
		 */
		cache: null,
		/**
		 * @property		data		数据容器
		 * @type				array
		 */
		data: []
	};

	QW.ObjectH.mix(this._config, oConfig, true);
	return this._init();
};
/**
 * @static
 * @property	_EVENT	用于构造CustEvent的事件列表
 * @type			array
 */
Suggest.Data._EVENT = [
	/**
	 * @event		datachange		返回数据时会触发
	 */
	"datachange", 
	/**
	 * @event		indexchange		index指针改变时候触发，index指针指向当前项
	 */
	"indexchange", 
	/**
	 * @event		overflow			返回的数据超过容量时触发
	 */
	"overflow"
];
/**
 * @static
 * @property	_UID		用于管理不同关键字所对应的全局callback，处理跨域
 * @type			object
 */
Suggest.Data._UID = {};
Suggest.Data.prototype = {
	/**
	 * 实例初始化函数，构造时调用
	 * @method		_init
	 * @return		{boolean}	返回是否初始化成功
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
	 * 缓存初始化
	 * @method		_initCache
	 * @return		{boolean}	返回是否初始化成功
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
	 * 事件初始化
	 * @method		_initEvent
	 * @return		{boolean}	返回是否初始化成功
	 */
	_initEvent: function() {
		return QW.CustEvent.createEvents(this, Suggest.Data._EVENT);
	},
	/**
	 * 事件派发
	 * @method		_dispatch
	 * @param		{string}		sType		事件类型，为Suggest.Data._EVENT数组中的项
	 * @param		{event}		eEvent(Optional)	event对象
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
	 * 查询关键字
	 * @method		query
	 * @param		{string}			sKey							关键字
	 * @param		{function}		fCallback(Optional)		回调函数
	 * @return		{boolean}		返回是否查询成功
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
	 * 内部方法，负责具体的请求
	 * @method		_request
	 * @param		{function}		fCallback(Optional)		回调函数
	 * @return		{boolean}		返回是否查询成功
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
	 * 生成_request的回调函数
	 * @method		_scriptCallbackHandler
	 * @param		{string}			sKey			关键字
	 */
	_scriptCallbackHandler: function(sKey) {
		var oThis = this;
		var handler = this.get('dataHandler');
		return function(oData) {
			handler(sKey, oData, oThis);
		};
	},
	/**
	 * 读取查询返回的数据，并触发datachange事件
	 * @method		_read
	 * @param		{array[JSON Object]}			aDataSource			数据源
	 * @return		{boolean}		返回是否读取成功
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
	 * 设置当前项，会触发indexchange事件
	 * @method		setCurrent
	 * @param		{integer}		nIndex		第n项
	 * @return		{boolean}		返回设定是否成功
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
	 * 返回数据集
	 * @method		getData
	 * @return		{array[JSON Object]}
	 */
	getData: function() {
		return this._prop.data;
	},
	/**
	 * 返回之前项的指针
	 * @method		getOriginalIndex
	 * @return		{integer}
	 */
	getOriginalIndex: function() {
		return this._prop.originalIndex;
	},
	/**
	 * 返回当前项的指针
	 * @method		getIndex
	 * @return		{integer}
	 */
	getIndex: function() {
		return this._prop.index;
	},
	/**
	 * 返回某一项的数据
	 * @method		getItem
	 * @param		{integer}		nIndex		第n项
	 * @return		{boolean|object}		返回数据表示成功，false表示失败
	 */
	getItem: function(nIndex) {
		if(!Suggest._argValid(nIndex, 'number', arguments.callee))
			return false;
		if(nIndex > this.getLength() - 1) 
			return false;
		return this._prop.data[nIndex];
	},
	/**
	 * 返回当前数据集合的大小
	 * @method		getLength
	 * @return		{integer}
	 */
	getLength: function() {
		return this._prop.data.length;
	},
	/**
	 * 增加数据
	 * @method		increase
	 * @param		{integer}		nLength		增加的数据量
	 * @param		{function}		fCallback(Optional)		回调函数
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
