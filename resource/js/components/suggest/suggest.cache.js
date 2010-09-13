/**
 * @class				Suggest.Cache		���ڻ���֮ǰ����ʾ�������Ҫ����Data��ʹ��Key=Value��ֵ�Խ��л��棬����δ���棬����Null
 * @namespace			Suggest
 * @author	Remember2015(wangzilong@baidu.com)
 */
/**
 * @constructor		
 * @param	{object}		oConfig	���캯����������ϸ�����������
 * @example	
new Suggest.Cache({
	cacheCapcity: 10
})
 * @return	{boolean}	�����Ƿ���ɹ�
 */
Suggest.Cache = function(oConfig) {
	Suggest._argValid(oConfig, 'object', arguments.callee);
	/**
	 * @property	_config		Cacheʵ����˽�б������ϣ������ǹ���ʵ����Ҫ�����ò���
	 * @type			object
	 */
	this._config = {
		/**
		 * @cfg		{integer}		cacheCapacity		���������
		 */
		cacheCapacity: -1,
		/**
		 * @cfg		{boolean}		cacheAutoScale		�Զ����ƻ������ݣ���overflowʱ�Զ�����
		 */
		cacheAutoScale: true
	};
	/**
	 * @property		_prop		Cacheʵ�������Լ��ϣ�������ʵ�����еĸ����ڲ�����
	 * @type				object
	 */
	this._prop = {
		cache: []
	};
	QW.ObjectH.mix(this._config, oConfig, true);
	return this._init();
};

Suggest.Cache.prototype = {
	/**
	 * ʵ����ʼ������������ʱ����
	 * @method		_init
	 * @return		{boolean}	�����Ƿ��ʼ���ɹ�
	 */
	_init: function() {
		return true;
	},
	/**
	 * ���ò���
	 * @method		set
	 * @param		{string}		sKey			������
	 * @param		{object}		oValue		����ֵ
	 * @return		{object}		�������õ�oValue��Ĭ�����óɹ�
	 * @example		
this.set('cacheCapacity', 20)
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
	 * ���ػ���ֵ
	 * @method		getCache
	 * @param		{string}		sKey			������
	 * @return		{object}
	 */
	getCache: function(sKey) {
		if (!Suggest._argValid(sKey, 'string', arguments.callee)) {
			return false;
		}
		if (this._prop.cache[sKey])
			return this._prop.cache[sKey];
		else return null;
	},
	/**
	 * ���뻺��ֵ
	 * @method		getCache
	 * @param		{string}		sKey			������
	 * @param		{object}		oValue		����ֵ
	 * @return		{object|boolean}		�������õ�oValue��ʾ�ɹ�������false��ʾʧ��
	 */
	pushCache: function(sKey, oValue) {
		if (!Suggest._argValid(sKey, 'string', arguments.callee)) {
			return false;
		}
		var bAutoScale = this.get('cacheAutoScale'), nCacheCapacity = this.get('cacheCapacity');
		if (!bAutoScale && nCacheCapacity != -1 && this._prop.cache.length >= nCacheCapacity) {
			Suggest._debug('overflow', 'Can not push data into cache because of overflow', arguments.callee);
			return false;
		}
		if (bAutoScale && nCacheCapacity != -1 && this._prop.cache.length >= nCacheCapacity) {
			this._prop.cache.shift();
		}
		this._prop.cache[sKey] = oValue;
		return oValue;
	},
	/**
	 * ����Ƿ���ĳ������
	 * @method		hasCache
	 * @param		{string}		sKey			������
	 * @return		{boolean}
	 */
	hasCache: function(sKey) {
		return this._prop.cache[sKey] != window.undefined ? true : false;
	},
	/**
	 * ��ջ���
	 * @method		empty
	 * @return		{boolean}	�����Ƿ���ճɹ�
	 */
	empty: function() {
		try {
			this._prop.cache.length = 0;
			return true;
		} catch (ex) {
			return false;
		}
	},
	/**
	 * ��ȡ��ǰ�����С
	 * @method		getLength
	 * @return		{integer}	���ش�С
	 */
	getLength: function() {
		return this._prop.cache.length;
	}
};