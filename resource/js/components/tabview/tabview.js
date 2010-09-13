/**
 * @fileoverview TabView class
 * @author:{@link mailto:ranklau@gmail.com Rank liu}
 * @update: 2008-10-31 bblib2 2010/4/23
 */



(function () {

	/**
	 * @class TabViewGroup  基类的构造函数
	 * @param {object}
	 * @constructor
	 */
	function TabViewGroup(oGroup) {
		if (!oGroup.tabNode) throw new Error(['TabViewGroup', 'constructor', 'tabNode must be a HTMLElement']);
		this.tabNode     = oGroup.tabNode;
		this.disabled    = oGroup.disabled || false;
		this.contentNode = oGroup.contentNode;
		return this;
	}
	/**
	 * 强制转换成TabViewGroup
	 *
	 * @public
	 * @static
	 * @method oGroup
	 * @param {DOM Element} tabNode
	 * @return {TabViewGroup}
	 */
	TabViewGroup.castGroup = function(oGroup) {
		try {
			if (oGroup.constructor!=TabViewGroup) oGroup = new TabViewGroup(oGroup);
			return oGroup;
		} catch(e) {
			throw new Error(['TabViewGroup','cast','Cast arguments to TabViewGroup error, check your arguments before cast']);
		}
	};

	/**
	 * @class TABVIEW_EVENT tabview的标准事件接口
	 * @static
	 * @interface
	 * @public
	 */


	var TABVIEW_EVENT = {
		DEACTIVATE			   : 'deactivate',
		ACTIVATE			   : 'activate',
		BEFORE_ADD			   : 'beforeadd',
		AFTER_ADD			   : 'afteradd',
		BEFORE_REMOVE		   : 'beforeremove',
		AFTER_REMOVE		   : 'afterremove'
	};

	/**
	 * @class TABVIEW_SELECTOR tabview能获取的selector列表，不供外部使用该类，只由tabview提供接口
	 * @constructor
	 * @public
	 */

	var TABVIEW_SELECTOR = {};

	TABVIEW_SELECTOR.DEFAULT = { tab : '>:first-child > *', content : '>:nth-child(2) > *' };

	/**
	 * @class TabView 基类的构造函数
	 * @constructor
	 */

	function TabView () {

		return this._constructor.apply(this, arguments);
	}

	TabView.prototype = (function () {

		/*
		 * custom event ref
		 *
		 * @private
		 * @const
		 * @static
		 * @property {object}
		 * @default {object}
		 */
		var E = QW.CustEvent, D = QW.Dom, O = QW.ObjectH;

		return {

			/**
			 * @public
			 * @property {array} aGroups
			 * @default {null}
			 */
			aGroups: [],

			/**
			 * @public
			 * @property {HTMLElement} container
			 * @default {null}
			 */
			container: null,

			/**
			 * @public
			 * @readonly
			 * @property {number} length
			 * @default {0}
			 */
			length: 0,

			/**
			 * @public
			 * @property {array} eventDelayType
			 * @default {'mouseout,'keyup'}
			 */
			eventDelayType: ['mouseout', 'keydown'],
			
			/**
			 * @public
			 * @property {number} eventDelay
			 * @default {0}
			 */
			eventDelay: 0,

			/**
			 * @public
			 * @property {object} selector
			 * @default {TABVIEW_SELECTOR.DEFAULT}
			 */
			selector: TABVIEW_SELECTOR.DEFAULT,

			/**
			 * @public
			 * @property {string} TAB_ACTIVATE_CN
			 * @default {selected}
			 */
			TAB_ACTIVATE_CN: 'selected', 
			//tabActivateClassName

			/**
			 * @public
			 * @property {string} TAB_DEACTIVATE_CN
			 * @default {empty}
			 */
			TAB_DEACTIVATE_CN: 'unselected', 
			/* tabDeactivateClassName */

			/**
			 * @public
			 * @property {string} CONTENT_ACTIVATE_CN
			 * @default {selected}
			 */
			CONTENT_ACTIVATE_CN: 'selected', 
			/* contentActivateClassName */

			/**
			 * @public
			 * @property {string} CONTENT_DEACTIVATE_CN
			 * @default {empty}
			 */
			CONTENT_DEACTIVATE_CN: 'unselected', 
			/* contentDeactivateClassName */

			/**
			 * @public
			 * @property {array|string} events
			 * @default {['click']}
			 */
			events: ['click'],

			/**
			 * @public
			 * @property {object} current
			 * @default {null}
			 */
			current: { 'oGroup': null, 'n': null },

			/**
			 * @public
			 * @property {number} maxTabLength
			 * @default {10}
			 */
			maxTabLength: 10,

			/**
			 * @public
			 * @property {bool} preventDefault
			 * @default {true}
			 */
			preventDefault: true,

			/**
			 * @public
			 * @property {bool} stopPropagation
			 * @default {true}
			 */
			stopPropagation: true,

			/**
			 * @public
			 * @property {bool} keyTabChange
			 * @default {true}
			 */
			keyTabChange : true,

			/**
			 * @private
			 * @property {number} _timer
			 * @default {null}
			 */
			_timer: null,

			/**
			 * 默认构造函数
			 *
			 * @private
			 * @method _constructor
			 * @param {HTMLElement} container 为标签容器
			 * @param {object}      coptions  为一些配置选项
			 * @return void
			 */
			_constructor: function(container, options) {
				
				var events = [];
				for (var i in TABVIEW_EVENT) events.push(TABVIEW_EVENT[i]);
				E.createEvents(this, events);


				/* 如果第一个元素是HTMLElement */
				if (D.isElement(container)) {

					this.container = container;
					O.mix(this, options || {}, true);
					this.renderTabView();

				} else {

					O.mix(this, container || {}, true);

				}

				return this;
			},


			/**
			 * 根据标签索引设置激活状态
			 *
			 * @private
			 * @method _setActive
			 * @param {number} n为标签索引
			 * @return void
			 */
			_setActive: function (index, compel) {
				if (this.aGroups[index].disabled) return false;

				var previousGroup = this.current.oGroup;
				var previousIndex = this.current.n;
				var currentGroup = this.aGroups[index];

				if (previousGroup) {
					if (!this._dispatchEvent(TABVIEW_EVENT.DEACTIVATE, currentGroup, index, previousGroup, previousIndex) && !compel) return;
				}

				this.current = {};
				this.current.oGroup = currentGroup;
				this.current.n = index;

				if (previousGroup) {

					D.replaceClass(previousGroup.tabNode, this.TAB_ACTIVATE_CN, this.TAB_DEACTIVATE_CN);
					if (previousGroup.contentNode) {
						D.replaceClass(previousGroup.contentNode, this.CONTENT_ACTIVATE_CN, this.CONTENT_DEACTIVATE_CN);
					}

				}

				D.replaceClass(currentGroup.tabNode, this.TAB_DEACTIVATE_CN, this.TAB_ACTIVATE_CN);
				if (currentGroup.contentNode) {
					D.replaceClass(currentGroup.contentNode, this.CONTENT_DEACTIVATE_CN, this.CONTENT_ACTIVATE_CN);
				}

				if (!this._dispatchEvent(TABVIEW_EVENT.ACTIVATE, currentGroup, index, previousGroup, previousIndex) && !compel) return;
				
			},

			/**
			 * 触发自定义事件
			 *
			 * @private
			 * @param {string} type为标签索引
			 * @param {TabViewGroup} oGroup为tabviewGroup的引用
			 * @param {number} index  为标签索引
			 * @return boolean
			 */
			_dispatchEvent: function(type, currentGroup, index, previousGroup, previousIndex) {
				var event = new E(this, type);
				event.currentGroup = currentGroup;
				event.index = index;
				event.previousGroup = previousGroup;
				event.previousIndex = previousIndex;
				return this.fire(event);
			},

			/**
			 * 为oGroups插入一个TabView组.
			 *
			 * @private
			 * @method _insertGroup
			 * @param {number} n为标签索引
			 * @param {object} oGroup 是TabViewGroup格式,形如: {tabNode:elementTab, contentNode:elementContent}
			 * @return void
			 */
			_insertGroup: function (index, oGroup) {
				var aGroups = this.aGroups;
				if (index<=0) return [oGroup].concat(aGroups);
				return aGroups.slice(0, index+1).concat(oGroup, aGroups.slice(index+1));
			},

			/**
			 * 为一个TabView组添加监听事件
			 *
			 * @private
			 * @method addTabNodeListener
			 * @param {object} oGroup 是TabViewGroup格式,形如: {tabNode:elementTab, contentNode:elementContent}
			 * @return void
			 */
			addTabNodeListener: function (oGroup) {

				if (this.events.constructor==String) this.events = [this.events];

				var events = this.events;
				var instance = this;
				var eventsLength = events.length;
				var tabNode = oGroup.tabNode;

				for (var i=0; i<eventsLength; i++) {
					D.on(tabNode, events[i], function (e) {
						if (instance.preventDefault) e.preventDefault();
						if (instance.stopPropagation) e.stopPropagation();

						clearTimeout(instance._timer);
						instance._timer = setTimeout(function() {
							var tabIndex = instance.queryTabNodeIndex(tabNode);
							if (null != tabIndex) instance.setActiveTab(tabIndex);
						}, instance.eventDelay);
					});

					if (instance.keyTabChange)
					D.on(tabNode, 'keydown', function (e) {
						var n = 0;
						if (e.keyCode == 38 || e.keyCode == 39) {
							n = 1;
						} else if (e.keyCode == 40 || e.keyCode == 37) {
							n = -1;
						} else {
							return;
						}
						
						if (!instance.current.oGroup || instance.length < 2) return;

						var index = (instance.current.n + n + instance.length) % instance.length;

						instance.setActiveTab(index);

						if (instance.preventDefault) e.preventDefault();
						if (instance.stopPropagation) e.stopPropagation();
					});

					if (0!=this.eventDelay) {
						for(var j=0; j<this.eventDelayType.length; j++) {
							D.on(tabNode, instance.eventDelayType[j], function(e) {
								clearTimeout(instance._timer);
							});
						}
					}
				}

			},

			/**
			 * 根据一个标签节点查找该节点所在标签集合中的索引
			 *
			 * @public
			 * @method queryTabNodeIndex
			 * @param {DOM Element} tabNode 标签节点的引用
			 * @return {number} 返回标签索引
			 */
			queryTabNodeIndex: function (tabNode) {
				if (!tabNode) return null;
				var aGroups = this.aGroups;
				var groupsLength = aGroups.length;
				for (var i=0; i<groupsLength; i++) {
					if (aGroups[i].tabNode==tabNode) return i;
				}
				return null;
			},

			/**
			 * 以HTML结构来初始化TabView
			 *
			 * @method renderTabView
			 * @return void
			 */
			renderTabView: function() {
				var tabs		= D.query(this.selector.tab, this.container);
				var contents	= D.query(this.selector.content, this.container);

				var selectedIdx = 0;
				var oGroup      = null;

				var len  = tabs.length;

				for (var i=0; i<len; i++) {
					oGroup = { 'tabNode':tabs[i], 'contentNode':contents[i] };
					if (D.hasClass(tabs[i], this.TAB_ACTIVATE_CN)) selectedIdx = i;
					this.addTab(oGroup);
				}
				this.setActiveTab(selectedIdx);
				return this;
			},

			/**
			 * 除入tab
			 *
			 * @method insertTab
			 * @param {number} index 是tab的索引
			 * @param {object} oGroup 是json格式,形如: {tabNode:elementTab, contentNode:elementContent}
			 * @return {this}
			 */
			insertTab: function (index, oGroup) {
				index = parseInt(index) || 0;
				if (this.length >= this.maxTabLength) return false;
				;;;;/* todo */
				
				oGroup = TabViewGroup.castGroup(oGroup);
				if (!this._dispatchEvent(TABVIEW_EVENT.BEFORE_ADD, oGroup, index)) return false;

				this.aGroups = this._insertGroup(index, oGroup);
				this.addTabNodeListener(oGroup);
				this.length++;

				this._dispatchEvent(TABVIEW_EVENT.AFTER_ADD, oGroup, index);

				if (D.hasClass(oGroup.tabNode, this.TAB_ACTIVATE_CN)) this.setActiveTab(index);
				return this;

			},

			/**
			 * 删除tab
			 *
			 * @method removeTab
			 * @param {number} index 是tab的索引
			 * @return {this}
			 */
			removeTab: function (index) {
				if (!this.aGroups[index]) return false;
				var oGroup = this.aGroups[index];
				if (!this._dispatchEvent(TABVIEW_EVENT.BEFORE_REMOVE, oGroup, index)) return false;

				D.removeNode(oGroup.tabNode);
				if (oGroup.contentNode) D.removeNode(oGroup.contentNode);
				oGroup.tabNode = oGroup.contentNode = null;
				this.aGroups.splice(index, 1);
				this.length--;
				
				this._dispatchEvent(TABVIEW_EVENT.AFTER_REMOVE, oGroup, index);
				if (this.current.n==index) this.setActiveTab(index-1<0 ? 0 : index-1);
				return this;
			},

			/**
			 * 添加tab
			 *
			 * @method addTab
			 * @param {object} oGroup 是json格式,形如: {tabNode:elementTab, contentNode:elementContent}
			 * @param {boolean} 如果oGroup是用createGroup生成的,则需要将b设为true
			 * @return {this}
			 */
			addTab: function (oGroup) {
				this.insertTab(this.length, oGroup);
				return this;
			},

			addTabList: function() {

			},

			/**
			 * 设置激活状态tab
			 *
			 * @method setActiveTab
			 * @param {number} n为tab所在的索引
			 * @return {bool}
			 */
			setActiveTab: function (index, compel) {
				if (index>this.length-1) return false;
				return this._setActive(index, compel);
			},

			/**
			 * 设置一个TabView组的diabled状态
			 *
			 * @method disabledTab
			 * @param {number} index为tab所在的索引
			 * @return {this}
			 */
			disabledTab: function(index) {
				if (this.aGroups && this.aGroups[index])
					this.aGroups[index].disabled = true;
			},

			/**
			 * 消毁tabview
			 *
			 * @param {void}
			 * @return {void}
			 */
			dispose: function() {
				clearTimeout(this._timer);
			}

		}

	})();

	QW.provide('TabViewGroup', TabViewGroup);
	QW.provide('TABVIEW_EVENT', TABVIEW_EVENT);
	QW.provide('TABVIEW_SELECTOR', TABVIEW_SELECTOR);
	QW.provide('TabView', TabView);

})();