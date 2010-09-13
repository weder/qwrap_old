(function () {

	/**
	 * @class		LayoutDragDrop				布局拖拽类，封装了拖拽时dom操作等一些基本业务逻辑。
	 * @namespace	QW
	 * @author		haoqi(wangchen@baidu.com)
	 */
	var LayoutDragDrop = function () {

		this.constructor = arguments.callee;

		//this._startWidth = 0;

		/**
		 * @property	containers	可以拖入的容器列表
		 * @type		HTMLElement
		 */
		this.containers = [];

		/**
		 * @property	siblings	可以参照拖动到周围的元素列表
		 * @type		HTMLElement
		 */
		this.siblings = [];

		/**
		 * @property	vertical	拖拽对齐方式是否是垂直
		 * @type		boolean
		 */
		this.vertical = true;
		
		/**
		 * @property	DragOptions	SimpleDrag类的参数
		 * @type		json
		 */
		this.DragOptions = {};

		/**
		 * @property	events		事件
		 * @type		json
		 */
		this.events = {

			/**
			 * @event		dragstart		拖拽开始
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
			dragstart : 'dragstart'
			
			/**
			 * @event		drag			拖拽中
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
			, drag : 'drag'
			
			/**
			 * @event		dragend			拖拽结束
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
			, dragend : 'dragend'

		};

		this._dragDrop = null;

		this._initialize.apply(this, arguments);
	};

	LayoutDragDrop.prototype = function () {
		
		var D = QW.Dom, O = QW.ObjectH, E = QW.CustEvent;

		return {

			/**
			 * 构造函数
			 * @method		_initialize
			 * @private
			 * @param		{json}			options		参数
			 * @param		{Array}			entities	实体列表
			 * @return		{void}
			 */
			_initialize : function (options, entities) {
				var _self = this;

				var events = [];
				for (var i in this.events) events.push(this.events[i]);
				E.createEvents(this, events);
				
				O.mix(this, options || {}, true);

				O.mix(this.DragOptions, { delayTime : 50, target : function (e) { return _self._target(e); }, withProxy : true });

				this._dragDrop = new QW.SimpleDrag(this.DragOptions, entities || null);

				this._bind();
			}

			/**
			 * 目标检测函数
			 * @method		_target
			 * @private
			 * @param		{CustEvent}			e	CustEvent的实例
			 * @return		{boolean}
			 */
			, _target : function (e) {
				var mouse = { x : e.position.mouseX, y : e.position.mouseY }
					, siblingTarget = null
					, containerTarget = null

				if (!this.siblings.length && !this.containers.length) return false;

				for (var i = 0, min = Infinity ; i < this.siblings.length ; ++ i) {

					var pos = D.getRect(this.siblings[i]);

					pos.x = pos.left + pos.width / 2;
					pos.y = pos.top + pos.height / 2;

					var temp = Math.pow(Math.max(Math.abs(mouse.x - pos.x) - pos.width / 2, 0), 2) + Math.pow(Math.max(Math.abs(mouse.y - pos.y) - pos.height / 2, 0), 2);

					if (temp < min) {
						min = temp;
						siblingTarget = this.siblings[i];
						e.context.insertLeft = mouse.x < pos.x;
						e.context.insertTop = mouse.y < pos.y;
					}
				}

				for (var i = 0, min = Infinity ; i < this.containers.length ; ++ i) {
					var pos = D.getRect(this.containers[i]);

					pos.x = pos.left + pos.width / 2;
					pos.y = pos.top + pos.height / 2;
					
					var temp = Math.pow(Math.max(Math.abs(mouse.x - pos.x) - pos.width / 2, 0), 2) + Math.pow(Math.max(Math.abs(mouse.y - pos.y) - pos.height / 2, 0), 2);

					if (temp < min) {
						min = temp;
						containerTarget = this.containers[i];
					}
				}

				if (containerTarget && !D.contains(containerTarget, siblingTarget)) {
					e.context.target = containerTarget;
					e.context.container = true;
				} else {
					e.context.target = siblingTarget;
					e.context.container = false;
				}

				return true;
			}

			/**
			 * 初始化绑定事件
			 * @method		_bind
			 * @private
			 * @return		{void}
			 */
			, _bind : function () {
				var _self = this;
				
				this._dragDrop.on('dragstart', function (e) { _self._dragstart(e); });
				this._dragDrop.on('dragover', function (e) { _self._dragover(e); });
				this._dragDrop.on('drag', function (e) { _self._drag(e); });
				this._dragDrop.on('dragend', function (e) { _self._dragend(e); });

			}

			/**
			 * 拖拽开始处理
			 * @method		_dragstart
			 * @private
			 * @param		{CustEvent}			e	CustEvent的实例
			 * @return		{void}
			 */
			, _dragstart : function (e) {

				var rect = D.getRect(e.target.source);
				
				D.setInnerSize(e.target.proxy, rect.width, rect.height);

				//e.context._startWidth = rect.width;
				this._dispatch(e);
			}

			/**
			 * 拖拽进入目标中处理
			 * @method		_dragover
			 * @private
			 * @param		{CustEvent}			e	CustEvent的实例
			 * @return		{void}
			 */
			, _dragover : function (e) {
				if (e.target.source == e.context.target || e.context.target == e.target.source.parentNode) return;

				if (e.context.container) {
					D.appendChild(e.context.target, e.target.source);
				} else {
					if (this.vertical && e.context.insertTop || !this.vertical && e.context.insertLeft) {
						D.insertSiblingBefore(e.context.target, e.target.source);
					} else {
						D.insertSiblingAfter(e.context.target, e.target.source);
					}
				}

				//var rect = D.getRect(e.target.source);

				//D.setInnerSize(e.target.proxy, rect.width, rect.height);
			}

			/**
			 * 拖拽中处理
			 * @method		_drag
			 * @private
			 * @param		{CustEvent}			e	CustEvent的实例
			 * @return		{void}
			 */
			, _drag : function (e) {
				var position = e.position, proxy = e.target.proxy;

				//D.setXY(proxy, position.mouseX - position.offsetX / e.context._startWidth * proxy.offsetWidth, position.pageY);

				//e.preventDefault();
				this._dispatch(e);
			}

			/**
			 * 拖拽结束
			 * @method		_dragend
			 * @private
			 * @param		{CustEvent}			e	CustEvent的实例
			 * @return		{void}
			 */
			, _dragend : function (e) {			
				this._dispatch(e);
			}

			/**
			 * 派发事件
			 * @method		_dispatch
			 * @private
			 * @param		{CustEvent}			e	CustEvent的实例
			 * @return		{void}
			 */
			, _dispatch : function (e) {
				var _E = new E(e.target, e.type);
				_E.position = e.position;
				return this.fire(_E);
			}

			/**
			 * 锁定拖拽组
			 * @method		lock
			 * @return		{void}
			 */
			, lock : function () {
				this._dragDrop.lock();
			}

			/**
			 * 解锁锁定拖拽组
			 * @method		lock
			 * @return		{void}
			 */
			, unlock : function () {
				this._dragDrop.unlock();
			}

			/**
			 * 添加实体
			 * @method		add
			 * @param		{DragEntity}	entity		DragEntity实例
			 * @return		{void}
			 */
			, add : function (entity) {
				this._dragDrop.register(entity);
			}

			/**
			 * 添加参考元素
			 * @method		addSibling
			 * @param		{HTMLELement}	element		参考元素
			 * @return		{void}
			 */
			, addSibling : function (element) {
				this.siblings.push(element);
			}

			/**
			 * 添加容器
			 * @method		addContainer
			 * @param		{HTMLELement}	element		容器
			 * @return		{void}
			 */
			, addContainer : function (element) {
				this.containers.push(element);
			}


			/**
			 * 删除实体
			 * @method		del
			 * @param		{DragEntity}	entity		DragEntity实例
			 * @return		{void}
			 */
			, del : function (element) {
				this._dragDrop.dispose(element);
			}


			/**
			 * 删除参考元素
			 * @method		delSibling
			 * @param		{HTMLELement}	element		容器
			 * @return		{void}
			 */
			, delSibling : function (element) {
				for (var i = 0, l = this.siblings.length ; i < l ; ++ i) {
					if (this.siblings[i] == element) {
						this.siblings.splice(i, 1);
						break;
					}
				}
			}

			/**
			 * 删除容器
			 * @method		delContainer
			 * @param		{HTMLELement}	element		容器
			 * @return		{void}
			 */
			, delContainer : function (element) {
				for (var i = 0, l = this.containers.length ; i < l ; ++ i) {
					if (this.containers[i] == element) {
						this.containers.splice(i, 1);
						break;
					}
				}
			}

		};

	}();

	QW.provide('LayoutDragDrop', LayoutDragDrop);

})();