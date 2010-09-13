/**
 * @class				Suggest.Cache		用于缓存之前的提示结果。主要缓存Data，使用Key=Value键值对进行缓存，如尚未缓存，返回Null
 * @namespace			Suggest
 * @author	Remember2015(wangzilong@baidu.com)
 */
/**
 * @constructor		
 * @param	{object}		oConfig	构造函数参数，详细参照类的配置
 * @example	
new Suggest.Cache({
	cacheCapcity: 10
})
 * @return	{boolean}	返回是否构造成功
 */
Suggest.Cache = function(oConfig) {
	Suggest._argValid(oConfig, 'object', arguments.callee);
	/**
	 * @property	_config		Cache实例的私有变量集合，里面是构造实例需要的配置参数
	 * @type			object
	 */
	this._config = {
		/**
		 * @cfg		{integer}		cacheCapacity		缓存的容量
		 */
		cacheCapacity: -1,
		/**
		 * @cfg		{boolean}		cacheAutoScale		自动控制缓存内容，当overflow时自动调整
		 */
		cacheAutoScale: true
	};
	/**
	 * @property		_prop		Cache实例的属性集合，里面是实例运行的各种内部变量
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
	 * 实例初始化函数，构造时调用
	 * @method		_init
	 * @return		{boolean}	返回是否初始化成功
	 */
	_init: function() {
		return true;
	},
	/**
	 * 设置参数
	 * @method		set
	 * @param		{string}		sKey			属性名
	 * @param		{object}		oValue		属性值
	 * @return		{object}		返回设置的oValue，默认设置成功
	 * @example		
this.set('cacheCapacity', 20)
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
	 * 返回缓存值
	 * @method		getCache
	 * @param		{string}		sKey			属性名
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
	 * 填入缓存值
	 * @method		getCache
	 * @param		{string}		sKey			属性名
	 * @param		{object}		oValue		属性值
	 * @return		{object|boolean}		返回设置的oValue表示成功，返回false表示失败
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
	 * 检测是否含有某个缓存
	 * @method		hasCache
	 * @param		{string}		sKey			属性名
	 * @return		{boolean}
	 */
	hasCache: function(sKey) {
		return this._prop.cache[sKey] != window.undefined ? true : false;
	},
	/**
	 * 清空缓存
	 * @method		empty
	 * @return		{boolean}	返回是否清空成功
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
	 * 获取当前缓存大小
	 * @method		getLength
	 * @return		{integer}	返回大小
	 */
	getLength: function() {
		return this._prop.cache.length;
	}
};