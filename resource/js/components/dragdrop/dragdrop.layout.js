(function () {

	/**
	 * @class		LayoutDragDrop				������ק�࣬��װ����קʱdom������һЩ����ҵ���߼���
	 * @namespace	QW
	 * @author		haoqi(wangchen@baidu.com)
	 */
	var LayoutDragDrop = function () {

		this.constructor = arguments.callee;

		//this._startWidth = 0;

		/**
		 * @property	containers	��������������б�
		 * @type		HTMLElement
		 */
		this.containers = [];

		/**
		 * @property	siblings	���Բ����϶�����Χ��Ԫ���б�
		 * @type		HTMLElement
		 */
		this.siblings = [];

		/**
		 * @property	vertical	��ק���뷽ʽ�Ƿ��Ǵ�ֱ
		 * @type		boolean
		 */
		this.vertical = true;
		
		/**
		 * @property	DragOptions	SimpleDrag��Ĳ���
		 * @type		json
		 */
		this.DragOptions = {};

		/**
		 * @property	events		�¼�
		 * @type		json
		 */
		this.events = {

			/**
			 * @event		dragstart		��ק��ʼ
			 * @param		{CustEvent}		e	CustEvent��ʵ��<br>
				e.position ����<br>
					startX		��ק��ʼԪ����ҳ��X����<br>
					startY		��ק��ʼԪ����ҳ��Y����<br>
					offsetX		��꿪ʼλ�ú�Ԫ�ؿ�ʼλ��X�Ĳ�ֵ<br>
					offsetY		��꿪ʼλ�ú�Ԫ�ؿ�ʼλ��Y�Ĳ�ֵ<br>
					pageX		��ק��ǰԪ����ҳ��X����<br>
					pageY		��ק��ǰԪ����ҳ��Y����<br>
					mouseX		��굱ǰ��ҳ��X����<br>
					mouseY		��굱ǰ��ҳ��Y����<br>
					deltaX		��굱ǰ��ҳ��X�������һ��X����Ĳ�ֵ<br>
					deltaY		��굱ǰ��ҳ��Y�������һ��Y����Ĳ�ֵ
			 */
			dragstart : 'dragstart'
			
			/**
			 * @event		drag			��ק��
			 * @param		{CustEvent}		e	CustEvent��ʵ��<br>
				e.position ����<br>
					startX		��ק��ʼԪ����ҳ��X����<br>
					startY		��ק��ʼԪ����ҳ��Y����<br>
					offsetX		��꿪ʼλ�ú�Ԫ�ؿ�ʼλ��X�Ĳ�ֵ<br>
					offsetY		��꿪ʼλ�ú�Ԫ�ؿ�ʼλ��Y�Ĳ�ֵ<br>
					pageX		��ק��ǰԪ����ҳ��X����<br>
					pageY		��ק��ǰԪ����ҳ��Y����<br>
					mouseX		��굱ǰ��ҳ��X����<br>
					mouseY		��굱ǰ��ҳ��Y����<br>
					deltaX		��굱ǰ��ҳ��X�������һ��X����Ĳ�ֵ<br>
					deltaY		��굱ǰ��ҳ��Y�������һ��Y����Ĳ�ֵ
			 */
			, drag : 'drag'
			
			/**
			 * @event		dragend			��ק����
			 * @param		{CustEvent}		e	CustEvent��ʵ��<br>
				e.position ����<br>
					startX		��ק��ʼԪ����ҳ��X����<br>
					startY		��ק��ʼԪ����ҳ��Y����<br>
					offsetX		��꿪ʼλ�ú�Ԫ�ؿ�ʼλ��X�Ĳ�ֵ<br>
					offsetY		��꿪ʼλ�ú�Ԫ�ؿ�ʼλ��Y�Ĳ�ֵ<br>
					pageX		��ק��ǰԪ����ҳ��X����<br>
					pageY		��ק��ǰԪ����ҳ��Y����<br>
					mouseX		��굱ǰ��ҳ��X����<br>
					mouseY		��굱ǰ��ҳ��Y����<br>
					deltaX		��굱ǰ��ҳ��X�������һ��X����Ĳ�ֵ<br>
					deltaY		��굱ǰ��ҳ��Y�������һ��Y����Ĳ�ֵ
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
			 * ���캯��
			 * @method		_initialize
			 * @private
			 * @param		{json}			options		����
			 * @param		{Array}			entities	ʵ���б�
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
			 * Ŀ���⺯��
			 * @method		_target
			 * @private
			 * @param		{CustEvent}			e	CustEvent��ʵ��
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
			 * ��ʼ�����¼�
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
			 * ��ק��ʼ����
			 * @method		_dragstart
			 * @private
			 * @param		{CustEvent}			e	CustEvent��ʵ��
			 * @return		{void}
			 */
			, _dragstart : function (e) {

				var rect = D.getRect(e.target.source);
				
				D.setInnerSize(e.target.proxy, rect.width, rect.height);

				//e.context._startWidth = rect.width;
				this._dispatch(e);
			}

			/**
			 * ��ק����Ŀ���д���
			 * @method		_dragover
			 * @private
			 * @param		{CustEvent}			e	CustEvent��ʵ��
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
			 * ��ק�д���
			 * @method		_drag
			 * @private
			 * @param		{CustEvent}			e	CustEvent��ʵ��
			 * @return		{void}
			 */
			, _drag : function (e) {
				var position = e.position, proxy = e.target.proxy;

				//D.setXY(proxy, position.mouseX - position.offsetX / e.context._startWidth * proxy.offsetWidth, position.pageY);

				//e.preventDefault();
				this._dispatch(e);
			}

			/**
			 * ��ק����
			 * @method		_dragend
			 * @private
			 * @param		{CustEvent}			e	CustEvent��ʵ��
			 * @return		{void}
			 */
			, _dragend : function (e) {			
				this._dispatch(e);
			}

			/**
			 * �ɷ��¼�
			 * @method		_dispatch
			 * @private
			 * @param		{CustEvent}			e	CustEvent��ʵ��
			 * @return		{void}
			 */
			, _dispatch : function (e) {
				var _E = new E(e.target, e.type);
				_E.position = e.position;
				return this.fire(_E);
			}

			/**
			 * ������ק��
			 * @method		lock
			 * @return		{void}
			 */
			, lock : function () {
				this._dragDrop.lock();
			}

			/**
			 * ����������ק��
			 * @method		lock
			 * @return		{void}
			 */
			, unlock : function () {
				this._dragDrop.unlock();
			}

			/**
			 * ���ʵ��
			 * @method		add
			 * @param		{DragEntity}	entity		DragEntityʵ��
			 * @return		{void}
			 */
			, add : function (entity) {
				this._dragDrop.register(entity);
			}

			/**
			 * ��Ӳο�Ԫ��
			 * @method		addSibling
			 * @param		{HTMLELement}	element		�ο�Ԫ��
			 * @return		{void}
			 */
			, addSibling : function (element) {
				this.siblings.push(element);
			}

			/**
			 * �������
			 * @method		addContainer
			 * @param		{HTMLELement}	element		����
			 * @return		{void}
			 */
			, addContainer : function (element) {
				this.containers.push(element);
			}


			/**
			 * ɾ��ʵ��
			 * @method		del
			 * @param		{DragEntity}	entity		DragEntityʵ��
			 * @return		{void}
			 */
			, del : function (element) {
				this._dragDrop.dispose(element);
			}


			/**
			 * ɾ���ο�Ԫ��
			 * @method		delSibling
			 * @param		{HTMLELement}	element		����
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
			 * ɾ������
			 * @method		delContainer
			 * @param		{HTMLELement}	element		����
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