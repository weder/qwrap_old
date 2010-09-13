 (function () {

	/**
	 * @class		DragBase				封装了鼠标按下移动释放,并且计算坐标,提供mousedown,mouseup,mousemove三个事件
	 * @namespace	QW
	 * @author		haoqi(wangchen@baidu.com)
	 */
	var DragBase = function () {
		this.constructor = arguments.callee;
		
		this._offsetX = 0;
		this._offsetY = 0;
		this._previousMouseX = 0;
		this._previousMouseY = 0;
		this._startX = 0;
		this._startY = 0;
		this._locked = false;
		this._element = null;
		this._handler = {};
		
		this._delayTimer = 0;
		this._delayHandler = function () {};


		/**
		 * @property	delayTime	移动过程触发间隔单位ms
		 * @type		int
		 */
		this.delayTime = 0;

		/**
		 * @property	document	拖拽元素所属的宿主文档对象
		 * @type		Document
		 */
		this.document = document;

		/**
		 * @property	window		拖拽元素所属的宿主
		 * @type		Window
		 */
		this.window = window;

		/**
		 * @event		mousedown		鼠标按下
		 * @param		{CustEvent}		e	CustEvent的实例<br>
			e.position 包含<br>
				startX		拖拽开始元素在页面X坐标<br>
				startY		拖拽开始元素在页面Y坐标<br>
				offsetX		鼠标开始位置和元素开始位置X的差值<br>
				offsetY		鼠标开始位置和元素开始位置Y的差值<br>
				pageX		拖拽当前元素在页面X坐标<br>
				pageY		拖拽当前元素在页面Y坐标<br>
				mouseX		鼠标当前在页面X坐标<br>
				mouseY		鼠标当前在页面Y坐标<br>
				deltaX		鼠标当前在页面X坐标和上一次X坐标的插值<br>
				deltaY		鼠标当前在页面Y坐标和上一次Y坐标的插值
		 */

		/**
		 * @event		mousemove		鼠标移动
		 * @param		{CustEvent}		e	CustEvent的实例<br>
			e.position 包含<br>
				startX		拖拽开始元素在页面X坐标<br>
				startY		拖拽开始元素在页面Y坐标<br>
				offsetX		鼠标开始位置和元素开始位置X的差值<br>
				offsetY		鼠标开始位置和元素开始位置Y的差值<br>
				pageX		拖拽当前元素在页面X坐标<br>
				pageY		拖拽当前元素在页面Y坐标<br>
				mouseX		鼠标当前在页面X坐标<br>
				mouseY		鼠标当前在页面Y坐标<br>
				deltaX		鼠标当前在页面X坐标和上一次X坐标的插值<br>
				deltaY		鼠标当前在页面Y坐标和上一次Y坐标的插值
		 */

		/**
		 * @event		mouseup			鼠标释放
		 * @param		{CustEvent}		e	CustEvent的实例<br>
			e.position 包含<br>
				startX		拖拽开始元素在页面X坐标<br>
				startY		拖拽开始元素在页面Y坐标<br>
				offsetX		鼠标开始位置和元素开始位置X的差值<br>
				offsetY		鼠标开始位置和元素开始位置Y的差值<br>
				pageX		拖拽当前元素在页面X坐标<br>
				pageY		拖拽当前元素在页面Y坐标<br>
				mouseX		鼠标当前在页面X坐标<br>
				mouseY		鼠标当前在页面Y坐标<br>
				deltaX		鼠标当前在页面X坐标和上一次X坐标的插值<br>
				deltaY		鼠标当前在页面Y坐标和上一次Y坐标的插值
		 */

		/**
		 * @property	events		事件
		 * @type		json
		 */
		this.events = { mousedown : 'mousedown', mousemove : 'mousemove', mouseup : 'mouseup' };

		this._initialize.apply(this, arguments);
	};

	DragBase.prototype = function () {

		var D = QW.Dom, O = QW.ObjectH, E = QW.CustEvent;

		return {
			
			/**
			 * 构造函数
			 * @method		_initialize
			 * @private
			 * @prarm		{json}		options		属性
			 * @return		{void}
			 */
			_initialize : function (options) {
				var events = [];
				for (var i in this.events) events.push(this.events[i]);
				E.createEvents(this, events);

				O.mix(this, options || {}, true);
			}

			/**
			 * 派发事件
			 * @method		_dispatch
			 * @private
			 * @prarm		{string}	type		事件类型
			 * @prarm		{json}		position	坐标信息
			 * @return		{void}
			 */
			, _dispatch : function (type, position) {
				var _E = new E(this._element, type);
				_E.position = position;
				return this.fire(_E);
			}

			/**
			 * 派发事件
			 * @method		_clearSelection
			 * @private
			 * @return		{void}
			 */
			, _clearSelection : function () {

				try {
					this.document.selection && this.document.selection.empty && (this.document.selection.empty(), 1) || this.window.getSelection && this.window.getSelection().removeAllRanges();
				} catch (exp) {}
			}

			/**
			 * 初始化绑定事件等
			 * @method		_bind
			 * @private
			 * @param		{HTMLELement}	element	
			 * @return		{void}
			 */
			, _bind : function (element) {
				var _self = this;

				this._element = element;
				this._locked = true;

				this._handler.move = function (e) {
					_self._move(e);
				};

				this._handler.up = function (e) {
					setTimeout(function () { _self._up(e); }, 0);
					_self._dispose();
				};

				D.on(this.document, 'mousemove', this._handler.move);
				D.on(this.document, 'mouseup', this._handler.up);
				
				if (this.document.documentElement.setCapture) {
					D.on(this.document.documentElement, 'losecapture', this._handler.up);
					this.document.documentElement.setCapture();
				}
				//D.on(this.window, 'blur', this._handler.up);
			}

			/**
			 * 销毁事件等
			 * @method		_dispose
			 * @private
			 * @return		{void}
			 */
			, _dispose : function () {

				D.un(this.document, 'mousemove', this._handler.move);
				D.un(this.document, 'mouseup', this._handler.up);

				if (this.document.documentElement.setCapture) {
					D.un(this.document.documentElement, 'losecapture', this._handler.up);
					this.document.documentElement.releaseCapture();
				}
				//D.un(this.window, 'blur', this._handler.up);

				this._element = null;
				this._locked = false;
				this._handler = {};
			}

			/**
			 * 鼠标按下
			 * @method		_down
			 * @private
			 * @prarm		{EventW}		e		EventW实例
			 * @return		{void}
			 */
			, _down : function (e) {
				this._clearSelection();

				var element = this._element, elementOffset = D.getXY(element);
				
				this._previousMouseX = e.pageX;
				this._previousMouseY = e.pageY;
				this._startX = elementOffset[0];
				this._startY = elementOffset[1];
				this._offsetX = e.pageX - elementOffset[0];
				this._offsetY = e.pageY - elementOffset[1];

				this._dispatch(
					this.events.mousedown
					, { startX : this._startX, startY : this._startY, offsetX : this._offsetX, offsetY : this._offsetY, pageX : e.pageX - this._offsetX, pageY : e.pageY - this._offsetY, mouseX : e.pageX, mouseY : e.pageY, deltaX : e.pageX - this._previousMouseX, deltaY : e.pageY - this._previousMouseY }
				);
			}
			
			/**
			 * 鼠标移动
			 * @method		_move
			 * @private
			 * @prarm		{EventW}		e		EventW实例
			 * @return		{void}
			 */
			, _move : function (e) {
				var _self = this;

				this._clearSelection();

				/*
				var docRect = D.getDocRect(this.document);
							
				if (e.pageX > docRect.scrollX + docRect.width) this.document.documentElement.scrollLeft = e.pageX - docRect.width;
				else if (e.pageX < docRect.scrollX) this.document.documentElement.scrollLeft = e.pageX;

				if (e.pageY > docRect.scrollY + docRect.height) this.document.documentElement.scrollTop = e.pageY - docRect.height;
				else if (e.pageY < docRect.scrollY) this.document.documentElement.scrollTop = e.pageY;
				*/
				this._delayHandler = function () {
					_self._delayTimer = 0;
					_self._delayHandler = function () {};
					_self._dispatch(
						_self.events.mousemove
						, { startX : _self._startX, startY : _self._startY, offsetX : _self._offsetX, offsetY : _self._offsetY, pageX : e.pageX - _self._offsetX, pageY : e.pageY - _self._offsetY, mouseX : e.pageX, mouseY : e.pageY, deltaX : e.pageX - _self._previousMouseX, deltaY : e.pageY - _self._previousMouseY }
					);
					_self._previousMouseX = e.pageX;
					_self._previousMouseY = e.pageY;
				};
				
				if (!this._delayTimer) this._delayTimer = setTimeout(function () { _self._delayHandler(); }, this.delayTime);
			}

			/**
			 * 鼠标释放
			 * @method		_up
			 * @private
			 * @prarm		{EventW}		e		EventW实例
			 * @return		{void}
			 */
			, _up : function (e) {

				if (this._delayTimer) {
					this._delayHandler();
				}

				this._dispatch(
					this.events.mouseup
					, { startX : this._startX, startY : this._startY, offsetX : this._offsetX, offsetY : this._offsetY, pageX : e.pageX - this._offsetX, pageY : e.pageY - this._offsetY, mouseX : e.pageX, mouseY : e.pageY, deltaX : e.pageX - this._previousMouseX, deltaY : e.pageY - this._previousMouseY }
				);
			}

			/**
			 * 开始拖拽
			 * @method		start
			 * @prarm		{EventW}		e		EventW实例
			 * @prarm		{HTMLElement}	element	(要计算坐标的元素)被拖拽的元素
			 * @return		{void}
			 */
			, start : function (e, element) {
				if (this._locked) return;

				this._bind(element);
				this._down(e);
			}

		};

	}();


	/**
	 * @class		DragEntity				拖拽实体
	 * @namespace	QW
	 * @author		haoqi(wangchen@baidu.com)
	 */
	var DragEntity = function () {
		this.constructor = arguments.callee;

		/**
		 * @property	source		要拖拽的元素
		 * @type		HTMLElement
		 */
		this.source = null;

		/**
		 * @property	proxy		要拖拽的元素的代理
		 * @type		HTMLElement
		 */
		this.proxy = null;

		/**
		 * @property	handle		触发拖拽元素的目标
		 * @type		HTMLElement
		 */
		this.handle = null;

		/**
		 * @property	locked		锁定(是否不可拖拽)
		 * @type		boolean
		 */
		this.locked = false;

		this._handler = null;

		this._initialize.apply(this, arguments);
	};

	/**
	 * 转换方法把json形式转换成DragEntity实例
	 * @method		parse
	 * @static
	 * @prarm		{json}		object	EventW实例
	 * @return		{DragEntity}
	 */
	DragEntity.parse = function (object) {
		if (object.source) return new this(object);
	};

	DragEntity.prototype = function () {

		return {

			/**
			 * 构造函数
			 * @method		_initialize
			 * @private
			 * @prarm		{json}		object	属性
			 * @return		{void}
			 */
			_initialize : function (options) {
				this.source   = options.source;
				this.proxy	  = options.proxy	 || options.source;
				this.handle   = options.handle   || options.source;
				this.locked   = options.locked   || false;
				this._handler = null;
			}

		};

	}();


	/**
	 * @class		Drag				拖拽基类		封装一组统一行为元素的拖拽 相当于一个DragDropList
	 * @namespace	QW
	 * @author		haoqi(wangchen@baidu.com)
	 */
	var Drag = function () {
		this.constructor = arguments.callee;
		
		this._drag = null;
		this._context = {};
		this._activeEntity = null;
		this._locked = false;

		this._activeTimer = 0;
		this._dragging = false;
		this._entered = false;

		/**
		 * @property	document		拖拽元素所属的宿主文档对象
		 * @type		Document
		 */
		this.document = document;

		/**
		 * @property	window			拖拽元素所属的宿主
		 * @type		Window
		 */
		this.window = window;

		/**
		 * @property	entities		要拖拽的实体列表
		 * @type		Array
		 */
		this.entities = [];

		/**
		 * @property	target			检测目标的方法
		 * @type		function
		 */
		this.target = null;

		/**
		 * @property	activeDelay		鼠标按下时触发拖拽的延迟单位ms
		 * @type		int
		 */
		this.activeDelay = 1000;

		/**
		 * @property	activePixel		鼠标按下触发拖拽的距离单位px
		 * @type		int
		 */
		this.activePixel = 3;

		/**
		 * @property	delayTime		移动过程触发间隔单位ms
		 * @type		int
		 */
		this.delayTime = 1;

		/**
		 * @property	CLASS_SOURCE_DRAGGING		proxy元素拖拽中source元素的样式
		 * @type		string
		 */
		this.CLASS_SOURCE_DRAGGING = 'source-dragging';

		/**
		 * @property	CLASS_PROXY_DRAGGING		proxy元素拖拽中proxy元素的样式
		 * @type		string
		 */
		this.CLASS_PROXY_DRAGGING  = 'proxy-dragging';

		/**
		 * @property	CLASS_SOURCE_DRAGOVER		proxy元素进入目标后source元素的样式
		 * @type		string
		 */
		this.CLASS_SOURCE_DRAGOVER = 'source-dragover';

		/**
		 * @property	CLASS_PROXY_DRAGOVER		proxy元素进入目标后proxy元素的样式
		 * @type		string
		 */
		this.CLASS_PROXY_DRAGOVER  = 'proxy-dragover';

		/**
		 * @property	events		事件
		 * @type		json
		 */
		this.events = {

			/**
			 * @event		dragstart		拖拽开始
			 * @param		{CustEvent}		e	CustEvent的实例<br>
				e.target	当前拖拽的DragEntity<br>
				e.context	空白对象的引用<br>
				e.position	包含<br>
					startX		拖拽开始元素在页面X坐标<br>
					startY		拖拽开始元素在页面Y坐标<br>
					offsetX		鼠标开始位置和元素开始位置X的差值<br>
					offsetY		鼠标开始位置和元素开始位置Y的差值<br>
					pageX		拖拽当前元素在页面X坐标<br>
					pageY		拖拽当前元素在页面Y坐标<br>
					mouseX		鼠标当前在页面X坐标<br>
					mouseY		鼠标当前在页面Y坐标<br>
					deltaX		鼠标当前在页面X坐标和上一次X坐标的插值<br>
					deltaY		鼠标当前在页面Y坐标和上一次Y坐标的插值
			 */
			dragstart : 'dragstart'
			
			/**
			 * @event		drag			拖拽中
			 * @param		{CustEvent}		e	CustEvent的实例<br>
				e.target	当前拖拽的DragEntity<br>
				e.context	空白对象的引用<br>
				e.position	包含<br>
					startX		拖拽开始元素在页面X坐标<br>
					startY		拖拽开始元素在页面Y坐标<br>
					offsetX		鼠标开始位置和元素开始位置X的差值<br>
					offsetY		鼠标开始位置和元素开始位置Y的差值<br>
					pageX		拖拽当前元素在页面X坐标<br>
					pageY		拖拽当前元素在页面Y坐标<br>
					mouseX		鼠标当前在页面X坐标<br>
					mouseY		鼠标当前在页面Y坐标<br>
					deltaX		鼠标当前在页面X坐标和上一次X坐标的插值<br>
					deltaY		鼠标当前在页面Y坐标和上一次Y坐标的插值
			 */
			, drag : 'drag'
			
			/**
			 * @event		dragend			拖拽结束
			 * @param		{CustEvent}		e	CustEvent的实例<br>
				e.target	当前拖拽的DragEntity<br>
				e.context	空白对象的引用<br>
				e.position	包含<br>
					startX		拖拽开始元素在页面X坐标<br>
					startY		拖拽开始元素在页面Y坐标<br>
					offsetX		鼠标开始位置和元素开始位置X的差值<br>
					offsetY		鼠标开始位置和元素开始位置Y的差值<br>
					pageX		拖拽当前元素在页面X坐标<br>
					pageY		拖拽当前元素在页面Y坐标<br>
					mouseX		鼠标当前在页面X坐标<br>
					mouseY		鼠标当前在页面Y坐标<br>
					deltaX		鼠标当前在页面X坐标和上一次X坐标的插值<br>
					deltaY		鼠标当前在页面Y坐标和上一次Y坐标的插值
			 */
			, dragend : 'dragend'
			
			/**
			 * @event		dragenter		进入目标
			 * @param		{CustEvent}		e	CustEvent的实例<br>
				e.target	当前拖拽的DragEntity<br>
				e.context	空白对象的引用<br>
				e.position	包含<br>
					startX		拖拽开始元素在页面X坐标<br>
					startY		拖拽开始元素在页面Y坐标<br>
					offsetX		鼠标开始位置和元素开始位置X的差值<br>
					offsetY		鼠标开始位置和元素开始位置Y的差值<br>
					pageX		拖拽当前元素在页面X坐标<br>
					pageY		拖拽当前元素在页面Y坐标<br>
					mouseX		鼠标当前在页面X坐标<br>
					mouseY		鼠标当前在页面Y坐标<br>
					deltaX		鼠标当前在页面X坐标和上一次X坐标的插值<br>
					deltaY		鼠标当前在页面Y坐标和上一次Y坐标的插值
			 */
			, dragenter : 'dragenter'
			
			/**
			 * @event		dragover		在目标里拖拽中
			 * @param		{CustEvent}		e	CustEvent的实例<br>
				e.target	当前拖拽的DragEntity<br>
				e.context	空白对象的引用<br>
				e.position	包含<br>
					startX		拖拽开始元素在页面X坐标<br>
					startY		拖拽开始元素在页面Y坐标<br>
					offsetX		鼠标开始位置和元素开始位置X的差值<br>
					offsetY		鼠标开始位置和元素开始位置Y的差值<br>
					pageX		拖拽当前元素在页面X坐标<br>
					pageY		拖拽当前元素在页面Y坐标<br>
					mouseX		鼠标当前在页面X坐标<br>
					mouseY		鼠标当前在页面Y坐标<br>
					deltaX		鼠标当前在页面X坐标和上一次X坐标的插值<br>
					deltaY		鼠标当前在页面Y坐标和上一次Y坐标的插值
			 */
			, dragover : 'dragover'
			
			/**
			 * @event		dragleave		离开目标
			 * @param		{CustEvent}		e	CustEvent的实例<br>
				e.target	当前拖拽的DragEntity<br>
				e.context	空白对象的引用<br>
				e.position	包含<br>
					startX		拖拽开始元素在页面X坐标<br>
					startY		拖拽开始元素在页面Y坐标<br>
					offsetX		鼠标开始位置和元素开始位置X的差值<br>
					offsetY		鼠标开始位置和元素开始位置Y的差值<br>
					pageX		拖拽当前元素在页面X坐标<br>
					pageY		拖拽当前元素在页面Y坐标<br>
					mouseX		鼠标当前在页面X坐标<br>
					mouseY		鼠标当前在页面Y坐标<br>
					deltaX		鼠标当前在页面X坐标和上一次X坐标的插值<br>
					deltaY		鼠标当前在页面Y坐标和上一次Y坐标的插值
			 */
			, dragleave : 'dragleave'
			
			/**
			 * @event		invaliddrop		从目标外释放
			 * @param		{CustEvent}		e	CustEvent的实例<br>
				e.target	当前拖拽的DragEntity<br>
				e.context	空白对象的引用<br>
				e.position	包含<br>
					startX		拖拽开始元素在页面X坐标<br>
					startY		拖拽开始元素在页面Y坐标<br>
					offsetX		鼠标开始位置和元素开始位置X的差值<br>
					offsetY		鼠标开始位置和元素开始位置Y的差值<br>
					pageX		拖拽当前元素在页面X坐标<br>
					pageY		拖拽当前元素在页面Y坐标<br>
					mouseX		鼠标当前在页面X坐标<br>
					mouseY		鼠标当前在页面Y坐标<br>
					deltaX		鼠标当前在页面X坐标和上一次X坐标的插值<br>
					deltaY		鼠标当前在页面Y坐标和上一次Y坐标的插值
			 */
			, invaliddrop : 'invaliddrop'
			
			/**
			 * @event		dragdrop		从目标里释放
			 * @param		{CustEvent}		e	CustEvent的实例<br>
				e.target	当前拖拽的DragEntity<br>
				e.context	空白对象的引用<br>
				e.position	包含<br>
					startX		拖拽开始元素在页面X坐标<br>
					startY		拖拽开始元素在页面Y坐标<br>
					offsetX		鼠标开始位置和元素开始位置X的差值<br>
					offsetY		鼠标开始位置和元素开始位置Y的差值<br>
					pageX		拖拽当前元素在页面X坐标<br>
					pageY		拖拽当前元素在页面Y坐标<br>
					mouseX		鼠标当前在页面X坐标<br>
					mouseY		鼠标当前在页面Y坐标<br>
					deltaX		鼠标当前在页面X坐标和上一次X坐标的插值<br>
					deltaY		鼠标当前在页面Y坐标和上一次Y坐标的插值
			 */
			, dragdrop : 'dragdrop'

		};

		this._initialize.apply(this, arguments);

	};

	Drag.prototype = function () {

		var D = QW.Dom, O = QW.ObjectH, E = QW.CustEvent;

		return {

			/**
			 * 构造函数
			 * @method		_initialize
			 * @private
			 * @prarm		{json}		object	属性
			 * @return		{void}
			 */
			_initialize : function (options, entities) {
				var events = [];
				for (var i in this.events) events.push(this.events[i]);
				E.createEvents(this, events);

				O.mix(this, options || {}, true);

				this._drag = new DragBase;
				this._drag.window = this.window;
				this._drag.document = this.document;
				this._drag.delayTime = this.delayTime || 1;

				if (entities) {
					entities = this._convertEntitys(entities);
					for (var i = 0 ; i < entities.length ; ++ i) this.register(entities[i]);
				}

				this._bind();
			}

			/**
			 * 还原设置
			 * @method		_restore
			 * @private
			 * @return		{void}
			 */
			, _restore : function () {
				if (this._activeTimer) {
					clearTimeout(this._activeTimer);
					this._activeTimer = 0;
				}
				this._activeEntity = null;
				this._context = {};
				this._entered = false;
				this._dragging = false;
			}


			/**
			 * 把DragEntity对象或者DragEntity数组转换成DragEntity数组
			 * @method		_restore
			 * @private
			 * @param		{DragEntity|Array}		entities	要转换的对象或者数组
			 * @return		{Array}					数组
			 */
			, _convertEntitys : function (entities) {
				return entities instanceof this.window.Array ? entities : [entities];
			}

			/**
			 * 转换坐标
			 * @method		convertPosition
			 * @param		{json}			position			坐标引用
			 * @return		{void}
			 */
			, convertPosition : function (position) {}


			/**
			 * 绑定事件
			 * @method		_bind
			 * @private
			 * @return		{void}
			 */
			, _bind : function () {
				var _self = this;

				this._drag.onmousedown = function (e) { _self._down(e); };
				this._drag.onmousemove = function (e) { _self._move(e); };
				this._drag.onmouseup = function (e) { _self._up(e); _self._restore(); };
			}

			/**
			 * 注册一个DragEntity
			 * @method		_register
			 * @private
			 * @param		{DragEntity}			entity		实体
			 * @return		{void}
			 */
			, _register : function (entity) {
				var _self = this;

				D.on(entity.handle, 'mousedown', entity._handler = function (e) {
					if (_self._locked || entity.locked) return;
					_self._activeEntity = entity;
					_self._drag.start(e, entity.source);
				});
			}

			/**
			 * 销毁一个DragEntity
			 * @method		_dispose
			 * @private
			 * @param		{DragEntity}			entity		实体
			 * @return		{void}
			 */
			, _dispose : function (entity) {
				D.un(entity.handle, 'mousedown', entity._handler);
				entity._handler = null;
			}

			/**
			 * 注册一个DragEntity
			 * @method		register
			 * @param		{DragEntity}			entity		实体
			 * @return		{void}
			 */
			, register : function (entity) {
				entity = DragEntity.parse(entity);

				this.entities.push(entity);
				this._register(entity);
			}


			/**
			 * 销毁一个DragEntity
			 * @method		dispose
			 * @param		{HTMLElement}			source			实体中的source对应的引用
			 * @return		{void}
			 */
			, dispose : function (source) {
				for (var i = 0 ; i < this.entities.length ; ++ i) {
					if (this.entities[i].source == source) {
						this._dispose(this.entities[i]);
						this.entities.splice(i, 1);
						break;
					}
				}
			}

			/**
			 * 派发事件
			 * @method		_dispatch
			 * @private
			 * @param		{string}	type					事件名称
			 * @param		{json}		position				坐标引用
			 * @return		{void}
			 */
			, _dispatch : function (type, position) {
				var _E = new E(this._activeEntity, type);
				_E.position = position;
				_E.context = this._context;
				return this.fire(_E);
			}


			/**
			 * 处理移动时target相关事件
			 * @method		_operateMoveTargetEvent
			 * @private
			 * @param		{json}		position				坐标引用
			 * @return		{void}
			 */
			, _operateMoveTargetEvent : function (position) {

				if (this.target) {
					var istarget = this.target({ target : this._activeEntity, position : position, context : this._context });

					if (istarget) {
						if (this._entered) {
						//over
							return this._dispatch(this.events.dragover, position);
						} else {
						//enter
							this._entered = true;

							D.addClass(this._activeEntity.source, this.CLASS_SOURCE_DRAGOVER);
							D.addClass(this._activeEntity.proxy, this.CLASS_PROXY_DRAGOVER);

							return this._dispatch(this.events.dragenter, position);
						}
					} else if(this._entered) {
					//leave
						this._entered = false;

						D.removeClass(this._activeEntity.source, this.CLASS_SOURCE_DRAGOVER);
						D.removeClass(this._activeEntity.proxy, this.CLASS_PROXY_DRAGOVER);

						return this._dispatch(this.events.dragleave, position);
					}
				}

				return true;
			}

			/**
			 * 处理松开时target相关事件
			 * @method		_operateUpTargetEvent
			 * @private
			 * @param		{json}		position				坐标引用
			 * @return		{void}
			 */
			, _operateUpTargetEvent : function (position) {

				if (this.target) {
					
					D.removeClass(this._activeEntity.source, this.CLASS_SOURCE_DRAGOVER);
					D.removeClass(this._activeEntity.proxy, this.CLASS_PROXY_DRAGOVER);

					if (this._entered) {
						return this._dispatch(this.events.dragdrop, position);
					} else {
						return this._dispatch(this.events.invaliddrop, position);
					}
				}

				return true;
			}

			/**
			 * mousedown事件处理
			 * @method		_down
			 * @private
			 * @param		{EventW}		e				EventW实例
			 * @return		{void}
			 */
			, _down : function (e) {
				var _self = this;

				if (this._activeTimer) clearTimeout(this._activeTimer);

				this._activeTimer = setTimeout(function () {
					_self._activeTimer = 0;
					_self._dragging = true;

					D.addClass(_self._activeEntity.source, _self.CLASS_SOURCE_DRAGGING);
					D.addClass(_self._activeEntity.proxy, _self.CLASS_PROXY_DRAGGING);

					if (!_self._dispatch(_self.events.dragstart, e.position)) return;

					if (!_self._operateMoveTargetEvent(e.position)) return;

				}, this.activeDelay);
			}


			/**
			 * mousemove事件处理
			 * @method		_move
			 * @private
			 * @param		{EventW}		e				EventW实例
			 * @return		{void}
			 */
			, _move : function (e) {

				if (this._dragging) {

					this.convertPosition(e.position);

					if (!this._operateMoveTargetEvent(e.position)) return;

					if (!this._dispatch(this.events.drag, e.position)) return;

				} else {

					if (
						Math.sqrt(
							Math.pow(e.position.pageX - e.position.startX, 2)
							+ Math.pow(e.position.pageY - e.position.startY, 2)
						) > this.activePixel
					) {
						if (this._activeTimer) {
							clearTimeout(this._activeTimer);
							this._activeTimer = 0;
						}

						this._dragging = true;

						D.addClass(this._activeEntity.source, this.CLASS_SOURCE_DRAGGING);
						D.addClass(this._activeEntity.proxy, this.CLASS_PROXY_DRAGGING);

						if (!this._dispatch(this.events.dragstart, e.position)) return;

						if (!this._operateMoveTargetEvent(e.position)) return;

					}

				}

			}

			/**
			 * mouseup事件处理
			 * @method		_up
			 * @private
			 * @param		{EventW}		e				EventW实例
			 * @return		{void}
			 */
			, _up : function (e) {
				
				if (this._dragging) {

					this.convertPosition(e.position);

					D.removeClass(this._activeEntity.source, this.CLASS_SOURCE_DRAGGING);
					D.removeClass(this._activeEntity.proxy, this.CLASS_PROXY_DRAGGING);

					if (!this._operateUpTargetEvent(e.position)) return;

					if (!this._dispatch(this.events.dragend, e.position)) return;

				}
			}

			/**
			 * 锁定DragEntity
			 * @method		lock
			 * @return		{void}
			 */
			, lock : function () {
				this._locked = true;
			}


			/**
			 * 解锁DragEntity
			 * @method		unlock
			 * @return		{void}
			 */
			, unlock : function () {
				this._locked = false;
			}

		};
	}();

	/**
	 * @class		SimpleDrag				简单拖拽类对Drag类的扩展
	 * @namespace	QW
	 * @author		haoqi(wangchen@baidu.com)
	 */
	var SimpleDrag = QW.ClassH.extend(function () {

		/**
		 * @property	container	限定容器，如果传了此参数那么拖拽的元素只能在此容器内拖拽
		 * @type		HTMLElement
		 */
		this.container = null;

		/**
		 * @property	withProxy	是否需要代理，如果传递了此参数，并且DragEntity里没有proxy，则会默认创建一个空白div来当作代理
		 * @type		boolean
		 */
		this.withProxy = true;

		/**
		 * @property	constraintX	限定只能拖拽X轴
		 * @type		boolean
		 */
		this.constraintX = false;

		/**
		 * @property	constraintY	限定只能拖拽Y轴
		 * @type		boolean
		 */
		this.constraintY = false;

		/**
		 * @property	CLASS_PROXY	如果是withProxy为true创建的代理则会加上此样式
		 * @type		string
		 */
		this.CLASS_PROXY = 'drag-proxy';

		arguments.callee.$super.apply(this, arguments);

		this.target = this._convertTarget(this.target);
		

	}, Drag, false);

	QW.ObjectH.mix(SimpleDrag.prototype, function () {

		var D = QW.Dom, O = QW.ObjectH

		return {
			
			/**
			 * 把target转换成方法
			 * @method		_convertTarget
			 * @private
			 * @param		{function|Array}		target		要转换的函数或者数组
			 * @return		{function}				函数
			 */
			_convertTarget : function (target) {
				if (!target) return null;

				if (target instanceof this.window.Function) return target;

				if (!(target instanceof this.window.Array)) target = [target];

				return function (e) {
					var elements = target
						, l = elements.length
						, i = 0
						, targetRect = null;

					for (; i < l ; ++ i) {
						targetRect = D.getRect(elements[i]);

						if (e.position.mouseX > targetRect.left && e.position.mouseX < targetRect.right && e.position.mouseY > targetRect.top && e.position.mouseY < targetRect.bottom) {
							e.context.target = elements[i];
							return true;
						}

					}

					return false;
				};
			}

			/**
			 * 重写转换坐标
			 * @method		convertPosition
			 * @param		{json}					position	坐标引用
			 * @return		{void}
			 */
			, convertPosition : function (position) {
				if (this.container) {
					var rect = (this.container instanceof this.window.Function) ? this.container() : D.getRect(this.container)
						, proxy = this._activeEntity.proxy;

					position.pageX = Math.max(Math.min(position.pageX, rect.right  - proxy.offsetWidth), rect.left);
					position.pageY = Math.max(Math.min(position.pageY,  rect.bottom - proxy.offsetHeight), rect.top);
				}
			}


			/**
			 * 注册拖拽开始事件
			 * @method		ondragstart
			 * @param		{CustEvent}					e		CustEvent实例
			 * @return		{void}
			 */
			, ondragstart : function (e) {
				if (this.withProxy) {
					var rect = D.getRect(e.target.source);
					D.setInnerSize(e.target.proxy, rect.width, rect.height);
					D.setXY(e.target.proxy, e.position.startX, e.position.startY);
				}
				D.setXY(e.target.proxy, this.constraintY ? null : e.position.pageX, this.constraintX ? null : e.position.pageY);
			}


			/**
			 * 注册拖拽中事件
			 * @method		ondrag
			 * @param		{CustEvent}					e		CustEvent实例
			 * @return		{void}
			 */
			, ondrag : function (e) {
				D.setXY(e.target.proxy, this.constraintY ? null : e.position.pageX, this.constraintX ? null : e.position.pageY);
			}

			/**
			 * 注册拖拽结束事件
			 * @method		ondragend
			 * @param		{CustEvent}					e		CustEvent实例
			 * @return		{void}
			 */
			, ondragend : function (e) {
				var x = this.constraintY ? null : e.position.pageX, y = this.constraintX ? null : e.position.pageY;
				D.setXY(e.target.proxy, x, y);
				D.setXY(e.target.source, x, y);
			}

			/**
			 * 获得代理
			 * @method		_getProxy
			 * @private
			 * @return		{HTMLElement}		代理元素
			 */
			, _getProxy : function () {
				var result = D.create('<div class="' + this.CLASS_PROXY + '"></div>', false, this.document);
				this.document.body.insertBefore(result, this.document.body.firstChild);
				return result;
			}

			/**
			 * 重写注册实体
			 * @method		register
			 * @param		{DragEvent}					entity		实体
			 * @return		{void}
			 */
			, register : function (entity) {
				if (!entity.proxy && this.withProxy) {
					entity.proxy = this._getProxy();
				}

				entity = DragEntity.parse(entity);

				this.entities.push(entity);
				this._register(entity);
			}

		};

	}(), true);

	QW.provide('DragBase', DragBase);
	QW.provide('DragEntity', DragEntity);
	QW.provide('Drag', Drag);
	QW.provide('SimpleDrag', SimpleDrag);

})();