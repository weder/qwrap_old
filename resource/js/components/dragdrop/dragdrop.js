 (function () {

	/**
	 * @class		DragBase				��װ����갴���ƶ��ͷ�,���Ҽ�������,�ṩmousedown,mouseup,mousemove�����¼�
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
		 * @property	delayTime	�ƶ����̴��������λms
		 * @type		int
		 */
		this.delayTime = 0;

		/**
		 * @property	document	��קԪ�������������ĵ�����
		 * @type		Document
		 */
		this.document = document;

		/**
		 * @property	window		��קԪ������������
		 * @type		Window
		 */
		this.window = window;

		/**
		 * @event		mousedown		��갴��
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

		/**
		 * @event		mousemove		����ƶ�
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

		/**
		 * @event		mouseup			����ͷ�
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

		/**
		 * @property	events		�¼�
		 * @type		json
		 */
		this.events = { mousedown : 'mousedown', mousemove : 'mousemove', mouseup : 'mouseup' };

		this._initialize.apply(this, arguments);
	};

	DragBase.prototype = function () {

		var D = QW.Dom, O = QW.ObjectH, E = QW.CustEvent;

		return {
			
			/**
			 * ���캯��
			 * @method		_initialize
			 * @private
			 * @prarm		{json}		options		����
			 * @return		{void}
			 */
			_initialize : function (options) {
				var events = [];
				for (var i in this.events) events.push(this.events[i]);
				E.createEvents(this, events);

				O.mix(this, options || {}, true);
			}

			/**
			 * �ɷ��¼�
			 * @method		_dispatch
			 * @private
			 * @prarm		{string}	type		�¼�����
			 * @prarm		{json}		position	������Ϣ
			 * @return		{void}
			 */
			, _dispatch : function (type, position) {
				var _E = new E(this._element, type);
				_E.position = position;
				return this.fire(_E);
			}

			/**
			 * �ɷ��¼�
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
			 * ��ʼ�����¼���
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
			 * �����¼���
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
			 * ��갴��
			 * @method		_down
			 * @private
			 * @prarm		{EventW}		e		EventWʵ��
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
			 * ����ƶ�
			 * @method		_move
			 * @private
			 * @prarm		{EventW}		e		EventWʵ��
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
			 * ����ͷ�
			 * @method		_up
			 * @private
			 * @prarm		{EventW}		e		EventWʵ��
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
			 * ��ʼ��ק
			 * @method		start
			 * @prarm		{EventW}		e		EventWʵ��
			 * @prarm		{HTMLElement}	element	(Ҫ���������Ԫ��)����ק��Ԫ��
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
	 * @class		DragEntity				��קʵ��
	 * @namespace	QW
	 * @author		haoqi(wangchen@baidu.com)
	 */
	var DragEntity = function () {
		this.constructor = arguments.callee;

		/**
		 * @property	source		Ҫ��ק��Ԫ��
		 * @type		HTMLElement
		 */
		this.source = null;

		/**
		 * @property	proxy		Ҫ��ק��Ԫ�صĴ���
		 * @type		HTMLElement
		 */
		this.proxy = null;

		/**
		 * @property	handle		������קԪ�ص�Ŀ��
		 * @type		HTMLElement
		 */
		this.handle = null;

		/**
		 * @property	locked		����(�Ƿ񲻿���ק)
		 * @type		boolean
		 */
		this.locked = false;

		this._handler = null;

		this._initialize.apply(this, arguments);
	};

	/**
	 * ת��������json��ʽת����DragEntityʵ��
	 * @method		parse
	 * @static
	 * @prarm		{json}		object	EventWʵ��
	 * @return		{DragEntity}
	 */
	DragEntity.parse = function (object) {
		if (object.source) return new this(object);
	};

	DragEntity.prototype = function () {

		return {

			/**
			 * ���캯��
			 * @method		_initialize
			 * @private
			 * @prarm		{json}		object	����
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
	 * @class		Drag				��ק����		��װһ��ͳһ��ΪԪ�ص���ק �൱��һ��DragDropList
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
		 * @property	document		��קԪ�������������ĵ�����
		 * @type		Document
		 */
		this.document = document;

		/**
		 * @property	window			��קԪ������������
		 * @type		Window
		 */
		this.window = window;

		/**
		 * @property	entities		Ҫ��ק��ʵ���б�
		 * @type		Array
		 */
		this.entities = [];

		/**
		 * @property	target			���Ŀ��ķ���
		 * @type		function
		 */
		this.target = null;

		/**
		 * @property	activeDelay		��갴��ʱ������ק���ӳٵ�λms
		 * @type		int
		 */
		this.activeDelay = 1000;

		/**
		 * @property	activePixel		��갴�´�����ק�ľ��뵥λpx
		 * @type		int
		 */
		this.activePixel = 3;

		/**
		 * @property	delayTime		�ƶ����̴��������λms
		 * @type		int
		 */
		this.delayTime = 1;

		/**
		 * @property	CLASS_SOURCE_DRAGGING		proxyԪ����ק��sourceԪ�ص���ʽ
		 * @type		string
		 */
		this.CLASS_SOURCE_DRAGGING = 'source-dragging';

		/**
		 * @property	CLASS_PROXY_DRAGGING		proxyԪ����ק��proxyԪ�ص���ʽ
		 * @type		string
		 */
		this.CLASS_PROXY_DRAGGING  = 'proxy-dragging';

		/**
		 * @property	CLASS_SOURCE_DRAGOVER		proxyԪ�ؽ���Ŀ���sourceԪ�ص���ʽ
		 * @type		string
		 */
		this.CLASS_SOURCE_DRAGOVER = 'source-dragover';

		/**
		 * @property	CLASS_PROXY_DRAGOVER		proxyԪ�ؽ���Ŀ���proxyԪ�ص���ʽ
		 * @type		string
		 */
		this.CLASS_PROXY_DRAGOVER  = 'proxy-dragover';

		/**
		 * @property	events		�¼�
		 * @type		json
		 */
		this.events = {

			/**
			 * @event		dragstart		��ק��ʼ
			 * @param		{CustEvent}		e	CustEvent��ʵ��<br>
				e.target	��ǰ��ק��DragEntity<br>
				e.context	�հ׶��������<br>
				e.position	����<br>
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
				e.target	��ǰ��ק��DragEntity<br>
				e.context	�հ׶��������<br>
				e.position	����<br>
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
				e.target	��ǰ��ק��DragEntity<br>
				e.context	�հ׶��������<br>
				e.position	����<br>
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
			
			/**
			 * @event		dragenter		����Ŀ��
			 * @param		{CustEvent}		e	CustEvent��ʵ��<br>
				e.target	��ǰ��ק��DragEntity<br>
				e.context	�հ׶��������<br>
				e.position	����<br>
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
			, dragenter : 'dragenter'
			
			/**
			 * @event		dragover		��Ŀ������ק��
			 * @param		{CustEvent}		e	CustEvent��ʵ��<br>
				e.target	��ǰ��ק��DragEntity<br>
				e.context	�հ׶��������<br>
				e.position	����<br>
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
			, dragover : 'dragover'
			
			/**
			 * @event		dragleave		�뿪Ŀ��
			 * @param		{CustEvent}		e	CustEvent��ʵ��<br>
				e.target	��ǰ��ק��DragEntity<br>
				e.context	�հ׶��������<br>
				e.position	����<br>
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
			, dragleave : 'dragleave'
			
			/**
			 * @event		invaliddrop		��Ŀ�����ͷ�
			 * @param		{CustEvent}		e	CustEvent��ʵ��<br>
				e.target	��ǰ��ק��DragEntity<br>
				e.context	�հ׶��������<br>
				e.position	����<br>
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
			, invaliddrop : 'invaliddrop'
			
			/**
			 * @event		dragdrop		��Ŀ�����ͷ�
			 * @param		{CustEvent}		e	CustEvent��ʵ��<br>
				e.target	��ǰ��ק��DragEntity<br>
				e.context	�հ׶��������<br>
				e.position	����<br>
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
			, dragdrop : 'dragdrop'

		};

		this._initialize.apply(this, arguments);

	};

	Drag.prototype = function () {

		var D = QW.Dom, O = QW.ObjectH, E = QW.CustEvent;

		return {

			/**
			 * ���캯��
			 * @method		_initialize
			 * @private
			 * @prarm		{json}		object	����
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
			 * ��ԭ����
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
			 * ��DragEntity�������DragEntity����ת����DragEntity����
			 * @method		_restore
			 * @private
			 * @param		{DragEntity|Array}		entities	Ҫת���Ķ����������
			 * @return		{Array}					����
			 */
			, _convertEntitys : function (entities) {
				return entities instanceof this.window.Array ? entities : [entities];
			}

			/**
			 * ת������
			 * @method		convertPosition
			 * @param		{json}			position			��������
			 * @return		{void}
			 */
			, convertPosition : function (position) {}


			/**
			 * ���¼�
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
			 * ע��һ��DragEntity
			 * @method		_register
			 * @private
			 * @param		{DragEntity}			entity		ʵ��
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
			 * ����һ��DragEntity
			 * @method		_dispose
			 * @private
			 * @param		{DragEntity}			entity		ʵ��
			 * @return		{void}
			 */
			, _dispose : function (entity) {
				D.un(entity.handle, 'mousedown', entity._handler);
				entity._handler = null;
			}

			/**
			 * ע��һ��DragEntity
			 * @method		register
			 * @param		{DragEntity}			entity		ʵ��
			 * @return		{void}
			 */
			, register : function (entity) {
				entity = DragEntity.parse(entity);

				this.entities.push(entity);
				this._register(entity);
			}


			/**
			 * ����һ��DragEntity
			 * @method		dispose
			 * @param		{HTMLElement}			source			ʵ���е�source��Ӧ������
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
			 * �ɷ��¼�
			 * @method		_dispatch
			 * @private
			 * @param		{string}	type					�¼�����
			 * @param		{json}		position				��������
			 * @return		{void}
			 */
			, _dispatch : function (type, position) {
				var _E = new E(this._activeEntity, type);
				_E.position = position;
				_E.context = this._context;
				return this.fire(_E);
			}


			/**
			 * �����ƶ�ʱtarget����¼�
			 * @method		_operateMoveTargetEvent
			 * @private
			 * @param		{json}		position				��������
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
			 * �����ɿ�ʱtarget����¼�
			 * @method		_operateUpTargetEvent
			 * @private
			 * @param		{json}		position				��������
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
			 * mousedown�¼�����
			 * @method		_down
			 * @private
			 * @param		{EventW}		e				EventWʵ��
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
			 * mousemove�¼�����
			 * @method		_move
			 * @private
			 * @param		{EventW}		e				EventWʵ��
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
			 * mouseup�¼�����
			 * @method		_up
			 * @private
			 * @param		{EventW}		e				EventWʵ��
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
			 * ����DragEntity
			 * @method		lock
			 * @return		{void}
			 */
			, lock : function () {
				this._locked = true;
			}


			/**
			 * ����DragEntity
			 * @method		unlock
			 * @return		{void}
			 */
			, unlock : function () {
				this._locked = false;
			}

		};
	}();

	/**
	 * @class		SimpleDrag				����ק���Drag�����չ
	 * @namespace	QW
	 * @author		haoqi(wangchen@baidu.com)
	 */
	var SimpleDrag = QW.ClassH.extend(function () {

		/**
		 * @property	container	�޶�������������˴˲�����ô��ק��Ԫ��ֻ���ڴ���������ק
		 * @type		HTMLElement
		 */
		this.container = null;

		/**
		 * @property	withProxy	�Ƿ���Ҫ������������˴˲���������DragEntity��û��proxy�����Ĭ�ϴ���һ���հ�div����������
		 * @type		boolean
		 */
		this.withProxy = true;

		/**
		 * @property	constraintX	�޶�ֻ����קX��
		 * @type		boolean
		 */
		this.constraintX = false;

		/**
		 * @property	constraintY	�޶�ֻ����קY��
		 * @type		boolean
		 */
		this.constraintY = false;

		/**
		 * @property	CLASS_PROXY	�����withProxyΪtrue�����Ĵ��������ϴ���ʽ
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
			 * ��targetת���ɷ���
			 * @method		_convertTarget
			 * @private
			 * @param		{function|Array}		target		Ҫת���ĺ�����������
			 * @return		{function}				����
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
			 * ��дת������
			 * @method		convertPosition
			 * @param		{json}					position	��������
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
			 * ע����ק��ʼ�¼�
			 * @method		ondragstart
			 * @param		{CustEvent}					e		CustEventʵ��
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
			 * ע����ק���¼�
			 * @method		ondrag
			 * @param		{CustEvent}					e		CustEventʵ��
			 * @return		{void}
			 */
			, ondrag : function (e) {
				D.setXY(e.target.proxy, this.constraintY ? null : e.position.pageX, this.constraintX ? null : e.position.pageY);
			}

			/**
			 * ע����ק�����¼�
			 * @method		ondragend
			 * @param		{CustEvent}					e		CustEventʵ��
			 * @return		{void}
			 */
			, ondragend : function (e) {
				var x = this.constraintY ? null : e.position.pageX, y = this.constraintX ? null : e.position.pageY;
				D.setXY(e.target.proxy, x, y);
				D.setXY(e.target.source, x, y);
			}

			/**
			 * ��ô���
			 * @method		_getProxy
			 * @private
			 * @return		{HTMLElement}		����Ԫ��
			 */
			, _getProxy : function () {
				var result = D.create('<div class="' + this.CLASS_PROXY + '"></div>', false, this.document);
				this.document.body.insertBefore(result, this.document.body.firstChild);
				return result;
			}

			/**
			 * ��дע��ʵ��
			 * @method		register
			 * @param		{DragEvent}					entity		ʵ��
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