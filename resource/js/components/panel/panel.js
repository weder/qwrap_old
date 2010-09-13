/**
 * @fileoverview Panel/Container class
 * @author:{@link mailto:ranklau@gmail.com PingchuanLiu}
 * @last-modified : 2008-4-30
 * @last-modified : 2008-5-13
 */

/**
 *
 * 一个Panel最底层的基类, 用它
 * 可以扩展出Popup,Dialog,Tip,Mask,Menu,LayerPopup,MessageBox等类.
 *
 * @class Panel
 * @constructor
 * 
 */


(function () {

	function Panel(op, config) {
		if (!document.body) throw new Error(['Panel','create error','Document body not found or not loaded!']);

		return this._initPanel.apply(this,arguments);
	};


	Panel.IFRAME_SRC = location.protocol.toLowerCase() != 'https:' ? 'about:blank' : function () {
		var elements = document.getElementsByTagName('script');
		return elements[elements.length - 1].src.match(/^.*[\/\\]/)[0] + 'blank.html';
	}();

	Panel.prototype = function () {

		var D = QW.Dom, O = QW.ObjectH;

		/**
		 * @private
		 * @static
		 * @type {int}
		 */
		var _zIndex = 100;

		/**
		 * panel id counter
		 * @private
		 * @static
		 * @type {int}
		 */
		var _id_cnt = 0;


		return {

			id: null,

			/**
			 * @public
			 * @type {bool}
			 * @default {false}
			 */
			useIframe: null,

			/**
			 * @public
			 * @type {bool}
			 * @default {false}
			 */
			draggable: false,

			/**
			 * @public
			 * @type {bool}
			 * @default {false}
			 */
			resizable: false,


			/**
			 * @public
			 * @readonly
			 * @type {bool}
			 * @default {false}
			 */
			visibility: false,

			/**
			 * @public
			 * @type {object}
			 * @default {null}
			 */
			panelRect: {},

			/**
			 * @public
			 * @type {string}
			 * @const
			 * @default {panel}
			 */
			PANEL_CLASS : 'panel',

			/**
			 * @public
			 * @type {string}
			 * @const
			 * @default {panel-iframe}
			 */
			IFRAME_CLASS: 'panel-iframe',

			/**
			 * @public
			 * @type {string}
			 * @const
			 * @default {panel-iframe}
			 */
			INNER_CLASS : 'panel-content',

			/**
			 * @private
			 * @type {element}
			 * @default {null}
			 */
			_panel  : null,

			/**
			 * @private
			 * @type {element}
			 * @default {null}
			 */
			_content  : null,

			/**
			 * @private
			 * @type {element}
			 * @default {null}
			 */
			_iframe : null,


			/**
			 * @private
			 * @type {bool}
			 * @default {true}
			 */
			_initialized : false,
			

			/**
			 * 创建一个容器控件
			 *
			 * @method
			 * @protected
			 * @method _initPanel
			 * @param void
			 * @return {Panel object}
			 */
			_initPanel: function (op, config) {

				if (this._initialized) return this;
				if (D.isElement(op)) {
					this.renderPanel(op);
					O.mix(this, config||{}, true);
				} else {
					O.mix(this, op||{}, true);
					this._createPanelBox();
				}

				this.setPanelVisible (false);
				this._initialized = true;
				if (!this._panel.id) this._panel.id = (this.id || 'BAIDU_PANEL_' +(_id_cnt ++));

				return this;
			},

			/**
			 * 创建一个容器控件
			 *
			 * @method
			 * @protected
			 * @param void
			 * @return {Panel object}
			 */
			_createPanelBox: function() {
				this._panel = D.create('<div class="' + this.PANEL_CLASS + '"></div>');
				this._content = D.create('<div class="' + this.INNER_CLASS + '"></div>');
				this._panel.appendChild(this._content);
				if (this.useIframe) this._createIframe();
				document.body.appendChild(this._panel);	
			},

			/**
			 * 设置样式
			 *
			 * @method
			 * @param void
			 * @return {element}
			 */
			setStyle: function (op, value) {
				D.setStyle(this._panel, op, value);
				if (this._iframe) D.setStyle(this._iframe, op, value);
				return this;
			},

			/**
			 * 设置className
			 *
			 * @method addClassName
			 * @param void
			 * @return {element}
			 */
			 addClassName: function (cn) {
				 D.addClass(this._panel, cn);
				 if (this._iframe) D.addClass(this._iframe, cn);
			 },

			/**
			 * 重置className
			 *
			 * @method resetClassName
			 * @param void
			 * @return {element}
			 */
			resetClassName: function() {
				this._panel.className = this.PANEL_CLASS;
			},
			
			/**
			 * 得到panel控件
			 *
			 * @method getPanel
			 * @param void
			 * @return {element}
			 */
			getPanel: function () {
				return this._panel;
			},

			/**
			 * 得到iframe控件
			 *
			 * @method getIframe
			 * @param void
			 * @return {element}
			 */
			getIframe: function () {
				return this._iframe;
			},

			/**
			 * 创建一个iframe控件
			 *
			 * @method _createIframe
			 * @protected
			 * @param void
			 * @return {element}
			 */
			_createIframe: function () {
				this._iframe = D.create('<iframe class="' + this.IFRAME_CLASS + '" frameborder="0" src="' + Panel.IFRAME_SRC + '"></iframe>');
				this._panel.appendChild(this._iframe);
			},


			/**
			 * 检测使用position fixed的条件
			 *
			 * @method
			 * @protected
			 * @param void
			 * @protected
			 * @return {bool}
			 */
			_chkPosCanbeFixed: function () {
				return !QW.Browser.ie || (QW.Browser.ie && QW.Browser.version > 6);
			},

			/**
			 * 检测自动生成iframe条件
			 *
			 * @method
			 * @protected
			 * @param void
			 * @return {bool}
			 */
			_chkIframe: function () {
				var useIframe = !!window.ActiveXObject 
								&& ((QW.Browser.version < 7 
								&& document.getElementsByTagName('select').length)
								|| document.getElementsByTagName('object').length);
				return useIframe;
			},

			/**
			 * 存储panel rectangle
			 *
			 * @method saveRect
			 * @param  {number} x坐标
			 * @param  {number} y坐标
			 * @param  {number} w宽度
			 * @param  {number} h高度
			 * @return {panelRect}
			 */
			saveRect: function (x, y, w, h) {
				x = parseInt(x, 10);
				y = parseInt(y, 10);
				w = parseInt(w, 10);
				h = parseInt(h, 10);
				if ( !isNaN (x) ) this.panelRect['left']   = x;
				if ( !isNaN (y) ) this.panelRect['top']    = y;
				if ( !isNaN (w) ) this.panelRect['width']  = w;
				if ( !isNaN (h) ) this.panelRect['height'] = h;
				return this.panelRect;
			},

			/**
			 * 设置Panel的坐标和尺寸
			 *
			 * @method setPanelRect
			 * @param  {number} x坐标
			 * @param  {number} y坐标
			 * @param  {number} w宽度
			 * @param  {number} h高度
			 * @return {Panel object}
			 */
			setPanelRect: function (x, y, w, h) {
				D.setRect (this._panel, x, y, w, h)

				if (h==null && w!=null) {
					h = this.getPanelAutoHeight(w);
				}
				this.saveRect (x, y, w, h);
				return this;
			},

			/**
			 * 设置Panel的尺寸
			 *
			 * @method setPanelSize
			 * @param {number} w宽度
			 * @param {number} h高度
			 * @return {Panel object}
			 */
			setPanelSize: function (w, h) {
				this.saveRect (null, null, w, h);
				D.setSize ([this._panel], w, h);
				return this;
			},

			/**
			 * 设置Panel的坐标
			 *
			 * @method setPanelXY
			 * @param  {number} x坐标
			 * @param  {number} y坐标
			 * @return {Panel object}
			 */
			setPanelXY: function (x, y) {
				this.saveRect(x, y);
				D.setXY(this._panel, x, y);
				return this;
			},


			/**
			 * 全屏Panel
			 *
			 * @method setPanelFullscreen
			 * @return {Panel object}
			 */
			setPanelFullscreen: function () {
				var rect = D.getDocRect();
				var x, y, w, h;
				x = y = 0;
				w = rect.scrollWidth;
				h = rect.scrollHeight;
				D.setRect(this._panel, x, y, w, h);
				return this;
			},

			/**
			 * 根据传入的宽度,而得到panel的高度,
			 * 该高度是容器的自适应高度
			 *
			 * @method getPanelAutoHeight
			 * @param  {number} w宽度
			 * @return {Panel object}
			 */
			getPanelAutoHeight: function(w) {
				var panel = this._panel;
				var disp = D.getStyle (panel, 'display');
				D.setStyle(panel, 'width', w+'px');

				if (disp=='none') D.setStyle (panel, 'display', 'block');
				var padding = D.paddingWidth (panel);
				var border  = D.borderWidth  (panel);
				var extras  = padding[0]+padding[2]+border[0]+border[2];
				var h = panel.offsetHeight - extras;

				D.setStyle(panel, 'display', disp);
				return h;
			},

			/**
			 * 设置Panel绝对水平垂直居中
			 *
			 * @method setPanelCenter
			 * @param {number} w宽度
			 * @param {number} h高度
			 * @return {Panel object}
			 */
			setPanelCenter: function (w, h) {
				if (!isNaN(parseInt(w, 10))) h = this.getPanelAutoHeight(w);
				this.saveRect (null, null, w, h);

				var bounds = D.getDocRect ();
				var x = parseInt ((bounds.width-w)/2);
				var y = parseInt ((bounds.height-h)/2);

				if (x<0) x = 0;
				if (y<0) y = 0;

				/* if position is 'fixed', x and y coordinate not include bounds coords */
				var position = this.getPanelPosition();
				if ('fixed'!=position) {
					x = x + bounds.scrollX;
					y = y + bounds.scrollY;
					if (x<=bounds.scrollX) x = bounds.scrollX;
					if (y<=bounds.scrollY) y = bounds.scrollY;
				}

				D.setRect(this._panel, x, y);
				return this;
			},

			/**
			 * 得到panel的position
			 *
			 * @param  {void}
			 * @return {string}
			 */
			getPanelPosition: function() {
				return D.getStyle(this._panel, 'position').toLowerCase();
			},

			/**
			 * 向panel中追加元素
			 *
			 * @method appendToPanel
			 * @param  {element} el 元素对象
			 * @return {Panel object}
			 */
			appendToPanel: function (el) {
				this._panel.appendChild(el);
			},


			/**
			 * 向panel内容中追加元素
			 *
			 * @method appendToContent
			 * @param {element} el 元素对象
			 * @return {Panel object}
			 */
			appendToContent: function (el) {
				this._content.appendChild(el);
			},

			/**
			 * 显示Panel控件
			 *
			 * @method showPanel
			 * @param  {number} x 坐标
			 * @param  {number} y 坐标
			 * @param  {number} w 宽度
			 * @param  {number} h 高度
			 * @return {Panel}
			 */
			showPanel: function (x, y, w, h, el) {
				/* \u5F88\u62B1\u6B49\uFF0C\u5F39\u51FA\u5C42\u6B63\u5E38\u65E0\u6CD5\u4F7F\u7528\u3002\n\u53EF\u80FD\u662F\u7531\u4E8E\u6D4F\u89C8\u5668\u5F00\u542F\u4E86"\u6D6E\u52A8\u5E7F\u544A\u62E6\u622A\u529F\u80FD"\uFF0C\u8BF7\u5C1D\u8BD5\u5173\u95ED\u8BE5\u529F\u80FD\u540E\u91CD\u8BD5\u3002\n\n\u5982\u4F55\u5173\u95ED"\u6D6E\u52A8\u5E7F\u544A\u62E6\u622A\u529F\u80FD"\u8BF7\u53C2\u9605\u5E2E\u52A9\u4E2D\u5FC3FAQ\u3002 */
				el = D.$(el);

				if (D.isElement(el)) {
					var p = D.getRect(el);
					var position = this.getPanelPosition();

					x = parseInt(x, 10) || 0;
					y = parseInt(y, 10) || 0;
					x += p.left;
					y += p.top;

					if ('fixed'==position) {
						var bounds = D.getDocRect ();
						x -= bounds.scrollX;
						y -= bounds.scrollY;
					}
				}

				this.setPanelRect.apply(this, arguments);
				this.setPanelVisible(true);
			},

			/**
			 * 自动调整panel的位置
			 *
			 * @method autoAdjustPanelPosition
			 * @param  {number} x 坐标
			 * @param  {number} y 坐标
			 * @param  {number} w 宽度
			 * @param  {number} h 高度
			 * @return {Panel}
			 */
			autoAdjustPanelPosition: function() {
				var p = D.getRect(this._panel);
				var border = D.borderWidth(this._panel);
				var position = this.getPanelPosition();
				var bounds = D.getDocRect();

				var x = y = 0;
				var w = bounds.width, h = bounds.height;

				if ('fixed'!=position) {
					x = bounds.scrollX;
					y = bounds.scrollY;
				} else if (QW.Browser.ie && 'fixed'==position) {
					/* DOM getXY bug, if position is 'fixed' and browser is iexplorer,
					do not need to add bounds.left and bounds.top */
					p.left   -= bounds.scrollX;
					p.top    -= bounds.scrollY;
					p.right  -= bounds.scrollX;
					p.bottom -= bounds.scrollY;
				}

				if ( p.left < x ) this.setStyle({'left': x+'px'});
				if ( p.top  < y ) this.setStyle({'top':  y+'px'});

				if ( p.right  > w+x ) this.setStyle({'left':  (w + x - p.width  - border[1] - border[3]) +'px'});
				if ( p.bottom > h+y ) this.setStyle({'top':   (h + y - p.height - border[0] - border[2]) +'px'});
			},

			/**
			 * 设置某对象是否可见
			 *
			 * @method setPanelVisible
			 * @param  {bool} 
			 * @return {Panel}
			 */
			setPanelVisible: function (b, zIndexNotIncrease) {
				b = (b===false ? 'none' : 'block');
				if ('block'===b && !zIndexNotIncrease) D.setStyle(this._panel, 'zIndex', _zIndex++);
				D.setStyle(this._panel, 'display', b);
			},

			/**
			 * 隐藏Panel控件
			 *
			 * @method hidePanel
			 * @param void
			 * @return {Panel object}
			 */
			hidePanel: function () {
				this.setPanelVisible(false);
			},

			/**
			 * 从HTML里渲染一个panel
			 *
			 * @method renderPanel
			 * @param  {HTMLElement} el 为一个HTMLElement对象
			 * @return {Panel object}
			 */
			renderPanel: function(el) {
				var innerEl = D.query('.' + this.INNER_CLASS, el);
				if (!innerEl || !D.isElement(innerEl[0])) throw new Error(['Panel','render error','Panel inner is not a HTMLElement!']);
				this._panel = el;
				this._content = innerEl[0];
				return this;
			},

			/**
			 * 检测panel是否存在
			 *
			 * @method showPanel
			 * @param  void
			 * @return {boolean}
			 */
			detectPanel: function() {
				if (!this._panel || !D.$(this._panel.id)) {
					alert('很抱歉，弹出层无法正常使用。\n可能是由于浏览器开启了"浮动广告拦截功能"，请尝试关闭该功能后重试。\n\n如何关闭"浮动广告拦截功能"请参阅帮助中心FAQ。');
					this.dispose();
					return false;
				}
				return true;
			},
			

			/**
			 * 销毁Panel对象
			 *
			 * @method disposePanel
			 * @param  void
			 * @return void
			 */
			disposePanel: function () {
				/*Dom.removeNode(this._iframe);
				Dom.removeNode(this._content);
				Dom.removeNode(this._panel);*/
				this._iframe = this._content = this._panel = null;
				if('function'==typeof CollectGarbage)CollectGarbage();
			},
			

			//虚函数
			detect: function() {
				return this.detectPanel();
			},

			show: function() {
				if (!this.detect()) return false;
				this.showPanel();
				if (!this.detect()) return false;
				return true;
			},

			render: function() {
				this.renderPanel.apply(this, arguments);
			},

			contains: function(el) {
				return D.contains(this._panel, el);
			},

			hide: function() { 
				return this.hidePanel();
			},

			dispose: function() {
				return this.disposePanel();
			},
				
			isVisible: function() {
				return this.visibility;
			}
		}

	}();
















	/**
	 * @class BasePopup class
	 * @author: {@link mailto:liupingchuan01@baidu.com liupingchuan}
	 * @version 1.0 
	 * @create-date   : 2008-3-24
	 * @last-modified : 2008-4-30
	 */

	var BaseLayer = QW.ClassH.extend(function (op, config) {
		arguments.callee.$super.apply(this, arguments);

		QW.CustEvent.createEvents(this, 'windowresize,beforeshow,aftershow,beforehide,afterhide');

		this._initBaseLayer.apply(this, arguments);

		panelManager.push(this);

		return this;
	}, Panel, false);

	QW.ObjectH.mix(BaseLayer.prototype, function () {

		var D = QW.Dom, O = QW.ObjectH, E = QW.CustEvent;

		return {
			/**
			 * 是否居中
			 *
			 * @public
			 * @type {bool}
			 * @default {false}
			 */
			center    : false,

			/**
			 * 是否有阴影
			 *
			 * @public
			 * @type {bool}
			 * @default {false}
			 */
			shadow    : false,

			/**
			 * @public
			 * @type {string}
			 * @default {absolute}
			 */
			position: 'absolute',

			/**
			 * 是否有尖角
			 *
			 * @public
			 * @type {bool}
			 * @default {false}
			 */
			cue       : false,

			/**
			 * 是否有圆角
			 *
			 * @public
			 * @type {bool}
			 * @default {false}
			 */
			corner    : false,

			/**
			 * 是否可拖放大小
			 *
			 * @public
			 * @type {bool}
			 * @default {false}
			 */
			resizable : false,

			/**
			 * 是否可拖放坐标
			 *
			 * @public
			 * @type {bool}
			 * @default {false}
			 */
			draggable : !!QW.Drag,

			/**
			 * 拖放代理
			 *
			 * @public
			 * @type {element}
			 * @default {null}
			 */
			dragProxy : null,


			/**
			 * 拖放代理样式
			 *
			 * @public
			 * @type {string}
			 * @default {panel-drag-proxy}
			 */
			dragProxyClass : 'drag-proxy',

			/**
			 * 拖拽中代理样式
			 *
			 * @public
			 * @type {string}
			 * @default {panel-drag-proxy-dragging}
			 */
			dragProxyClassDragging : 'proxy-dragging',

			/**
			 * 是否需要拖放代理
			 *
			 * @public
			 * @type {bool}
			 * @default {false}
			 */
			withDragProxy : false,

			/**
			 * 是否有bubbton
			 *
			 * @public
			 * @type {array}
			 * @default {null}
			 */
			buttons   : null,

			/**
			 * 是否有header
			 *
			 * @public
			 * @type {bool}
			 * @default {true}
			 */
			header    : true,

			/**
			 * header如果有拖拽功能附加的样式
			 *
			 * @public
			 * @type {string}
			 * @default {panel-drag-header}
			 */
			headerClassDrag : 'panel-drag-enabled',

			/**
			 * 是否有body
			 *
			 * @public
			 * @type {bool}
			 * @default {true}
			 */
			body      : true,

			/**
			 * 是否有footer
			 *
			 * @public
			 * @type {bool}
			 * @default {true}
			 */
			footer    : true,

			/**
			 * 初始化时的className
			 *
			 * @public
			 * @type {string}
			 * @default {panel-t2}
			 */
			className : 'panel-t2',

			/**
			 * 初始化时的宽度
			 *
			 * @public
			 * @type {Number}
			 * @default {null}
			 */
			width     : null,

			/**
			 * 初始化时的高度，有阴影时建议不设置高度属性
			 *
			 * @public
			 * @type {Number}
			 * @default {null}
			 */
			height    : null,

			/**
			 * 初始化时的X坐标
			 *
			 * @public
			 * @type {Number}
			 * @default {null}
			 */
			left      : null,

			/**
			 * 初始化时的Y坐标
			 *
			 * @public
			 * @type {Number}
			 * @default {null}
			 */
			top       : null,

			/**
			 * 是否用iframe作遮罩层，null时为自动（IE6，及更低版本自动设为true）
			 *
			 * @public
			 * @type {Number}
			 * @default {null}
			 */
			useIframe : null,

			/**
			 * 是否需要关闭按钮
			 *
			 * @public
			 * @type {bool}
			 * @default {false}
			 */
			close     : false,

			/**
			 * 是否开启esc键，开启后，弹出层后，按esc关闭
			 *
			 * @public
			 * @type {bool}
			 * @default {false}
			 */
			useEscKey : false,

			/**
			 * 是否开启自动定位（自动定位需将center设为false），自动定位可由程序自动控制在可视范围以内
			 *
			 * @public
			 * @type {bool}
			 * @default {true}
			 */
			autoPosition: true,

			/**
			 * 初始化层的标题
			 *
			 * @public
			 * @type {String}
			 * @default {空字符串}
			 */
			caption   : '',

			/**
			 * 是否可见
			 *
			 * @public
			 * @readonly
			 * @type {boolean}
			 */
			visibility   : false,

			/**
			 * 初始化层的内容
			 *
			 * @public
			 * @type {String|HTMLElement}
			 * @default {空字符串}
			 */
			content   : '',


			_header      : null,

			_body        : null,

			_footer      : null,

			_close       : null,

			_resize      : null,

			_shadow      : null,

			_cue         : null,

			_oDD         : null,

			_corners     : [],

			_initialized : false,

			_timer       : null,

			_delay       : 300,

			/**
			 * @body className
			 * @type {String}
			 * @private
			 */
			BD_CLASS     : 'bd',

			/**
			 * @footer className
			 * @type {String}
			 * @private
			 */
			FT_CLASS     : 'ft',

			/**
			 * @header className
			 * @type {String}
			 * @private
			 */
			HD_CLASS     : 'hd',

			/**
			 * @shadow className
			 * @type {String}
			 * @private
			 */
			SHADOW_CLASS : 'sd',

			/**
			 * @close className
			 * @type {String}
			 * @private
			 */
			CLOSE_CLASS  : 'close',

			/**
			 * @resize className
			 * @type {String}
			 * @private
			 */
			RESIZE_CLASS : 'resize',

			/**
			 * @esc key code
			 * @type {String}
			 * @private
			 */
			ESC_KEY_CODE : 27,

			/**
			 * 初始化popup
			 *
			 * @method _initBaseLayer
			 * @param  {object} op object选项
			 * @private
			 * @return {this}
			 */
			_initBaseLayer: function (op, config) {
				this._initialized = false;

				if (D.isElement(op)) {
					this.render(op);
					O.mix(this, config||{}, true);
				} else {
					O.mix(this, op||{}, true);
					this.applyConfig(op);
				}

				this._addPopupEvent();
				this._initialized = true;

				return this;
			},

			/**
			 * 得到Popup控件
			 *
			 * @method getPopup
			 * @param void
			 * @return {element}
			 */
			getPopup: function () {
				return this._panel;
			},

			/**
			 * 检测自动生成position条件
			 *
			 * @private
			 * @return {string}
			 */
			_chkPosition: function() {
				var position = this.position;
				if ('fixed'==position.toLowerCase() && !this._chkPosCanbeFixed())
					position = 'absolute';
				return position;
			},

			/**
			 * @private
			 */
			_addPopupEvent: function () {
				this.initResizable   ();
				if (this.draggable) this.initDraggable   ();

				var instance = this;
				var resizeFn = function () { 
					instance._timer = setTimeout (function () {
						clearTimeout(instance._timer);
						if (!instance.isVisible()) return;
						instance.fire('windowresize');
						
					}, instance._delay);
				}
				//var escFn = function(e) {
				//	e = window.event || e;
				//	keycode = e.keyCode || e.which;
				//	if(keycode==instance.ESC_KEY_CODE && instance.useEscKey) 
				//		instance.hide();
				//}
				var disposeFn = function(e) {
					instance.dispose();
				}
				if (!QW.Browser.firefox) D.on(window, 'unload', disposeFn);
				D.on(window,   'resize',  resizeFn);
				//QWEvent.observe(document, 'keydown', escFn);
				//QWEvent.observe(window,'scroll',resizeFn);
			},

			/**
			 * 移除附加元素,包括圆角,
			 * resize,阴影,尖角和close
			 *
			 * @method removeElements
			 * @private
			 * @return {this}
			 */
			removeElements: function() {
				QW.ArrayH.map([this._corners[0],this._corners[1],this._resize,this._shadow,this._cue,this._close], function (i) {
					if (i && i.parentNode) D.removeNode(i);
				});
				if (this._footer) this._footer.innerHTML = '';
			},

			/**
			 * 创建容器
			 *
			 * @method createContainer
			 * @private
			 * @return {this}
			 */
			createContainer: function() {
				if (this._initialized==false) {

					var position = this._chkPosition();

					if(this.useIframe!=null) useIframe = this.useIframe;
					else useIframe = this._chkIframe();

					this.setStyle ('position', position);

					if (this.header) {
						this._header = D.create('<div class="' + this.HD_CLASS + '"></div>');
						this.appendToContent (this._header);
					}
					if (this.body) {
						this._body   = D.create('<div class="' + this.BD_CLASS + '"></div>');
						this.appendToContent (this._body);
						
					}
					if (this.footer) {
						this._footer = D.create('<div class="' + this.FT_CLASS + '"></div>');
						this.appendToContent (this._footer);
					}
				}
				this.resetClassName();
				this.addClassName(this.className);

			},

			appendToBody: function(el) {
				this._body.appendChild(el);
			},

			appendToHeader: function(el) {
				this._header.appendChild(el);
			},

			appendToFooter: function(el) {
				this._footer.appendChild(el);
			},

			/**
			 * 初始化拖动
			 *
			 * @private
			 */
			initDraggable: function () {
				var _self = this;

				if (!this.header) return;

				D.addClass(this._header, this.headerClassDrag);

				var offsetX = 0, offsetY = 0;

				if (this.shadow) {
					offsetX = this._shadow.offsetLeft;
					offsetY = this._shadow.offsetTop;
				}

				var drag = new QW.SimpleDrag({
					
					activeDelay : 0

					, withProxy : this.withDragProxy
					
					, CLASS_PROXY_DRAGGING : this.dragProxyClassDragging
						
					, CLASS_PROXY : this.dragProxyClass
					
					, container : function () {
						var rect = D.getDocRect();
						
						rect.left = rect.scrollX;
						rect.right = rect.scrollX + rect.width - offsetX;
						rect.top = rect.scrollY;
						rect.bottom = rect.scrollY + rect.height - offsetY;

						return rect;
					}
				
				}, { source : this._panel, handle : this._header, proxy : this.dragProxy });

			},

			/**
			 * 初始化拖动大小
			 *
			 * @private
			 */
			initResizable: function() {
			},


			/**
			 * 应用config
			 *
			 * @method applyConfig
			 * @public
			 * @return {this}
			 */
			applyConfig: function (op) {
				this.removeElements  ();
				this.createContainer ();
				this.createButtons   ();
				this.createCorners   ();
				this.createDirArrow  ();
				this.createShadow    ();
				this.createCloseBtn  ();
				if (this.caption) this.setCaption(this.caption);
				if (this.content) this.setContent(this.content);
				return this;
			},

			/**
			 * 创建button
			 *
			 * @method createButtons
			 * @private
			 * @return {this}
			 */
			createButtons:  function () {
				if (this.buttons && this._footer) {
					var buttons = this.buttons;
					var len = buttons.length;
					for (var i=0; i<len; i++) {
						var temp = D.create('<button></button>');
						D.set(temp, buttons[i]);
						D.appendChild(this._footer, temp);
					}
				}
			},

			/**
			 * 创建关闭按钮
			 *
			 * @method createCloseBtn
			 * @private
			 * @return void
			 */
			createCloseBtn: function() {
				if (this.close) {
					var instance = this;
					var hideHandler = function()  { instance.hide(); }

					this._close  = D.create('<span class="' + this.CLOSE_CLASS + '"></span>');
					this.appendToPanel(this._close);
					D.on(this._close, 'click', hideHandler);
				}
			},

			/**
			 * 创建阴影
			 *
			 * @method createShadow
			 * @private
			 * @return void
			 */
			createShadow: function() {
				if (this.shadow) {
					this._shadow = D.create('<span class="' + this.SHADOW_CLASS + '"></span>');
					this.appendToPanel(this._shadow);
				}
			},

			/**
			 * 创建圆角
			 *
			 * @method createCorners
			 * @private
			 * @return void
			 */
			createCorners: function() {
				if (this.corner) {
					//hard code;
					this._corners[0] = D.create('<span class="co1"></span>');
					this._corners[1] = D.create('<span class="co2"></span>');
					this._corners[0].innerHTML = 
					this._corners[1].innerHTML = '<span></span>';
					this.appendToPanel(this._corners[0]);
					this.appendToPanel(this._corners[1]);
				}
			},

			/**
			 * 创建方向箭头
			 *
			 * @method createDirArrow
			 * @private
			 * @return void
			 */
			createDirArrow: function() {
				if (this.cue) {
					this._cue = D.create('<span class="cue"></span>');
					this.appendToPanel(this._cue);
				}
			},

			/**
			 * 填充内容
			 *
			 * @method setContent
			 * @param {string} sHTML HTML字符串
			 * @return void
			 */
			setContent: function(sHTML) {
				if(typeof sHTML=='object') {
					this._body.innerHTML = '';
					this.appendToBody(sHTML);
				} else {
					this._body.innerHTML = sHTML;
				}
				return this._body;
			},

			/**
			 * 设置标题
			 *
			 * @method setCaption
			 * @param {string} sHTML HTML字符串
			 * @return void
			 */
			setCaption: function(sHTML) {
				if(this._header) 
					this._header.innerHTML = '<h3>' +sHTML+ '</h3>';
			},

			/**
			 * 填充头部
			 *
			 * @method setHeader
			 * @param {string} sHTML HTML字符串
			 * @remarks 不推荐使用v2后会删除此接口
			 * @return void
			 */
			setHeader: function(sHTML) {
				this.setCaption(sHTML);
			},

			/**
			 * 填充尾部
			 *
			 * @method setFooter
			 * @param {string} sHTML HTML字符串
			 * @return void
			 */
			setFooter: function(sHTML) {
				if(this._footer)
					this._footer.innerHTML = sHTML;
			},

			/**
			 * 设置popup垂直水平居中
			 *
			 * @method setPopupCenter
			 * @param {number} w 宽度
			 * @param {number} h 高度
			 * @return void
			 */
			setPopupCenter: function(w, h) {
				this.setPanelCenter (w, h);
				return this;
			},

			/**
			 * 显示popup
			 *
			 * @method showPopup
			 * @param {number} x x坐标
			 * @param {number} y y坐标
			 * @param {number} w 宽度
			 * @param {number} h 高度
			 * @return void
			 */
			showPopup: function(x, y, w, h, el) {

				x = x || this.left;
				y = y || this.top;
				w = w || this.width;
				h = h || this.height;

				this.showPanel(x, y, w, h, el);

				if (this.center && !D.isElement(el)) {
					x = x || w || this.panelRect['width'];
					y = y || h || this.panelRect['height'];
					this.setPopupCenter(x, y);
				}

				if (!this.center && this.autoPosition) 
					this.adjustPosition();

				if (isNaN(parseInt(w,10))) {
					//fix IE 6 bug, when container position is absolute, the shadow will be changed;
					w = this._panel.offsetWidth;
					
					if (this._shadow)
						D.setStyle(this._shadow,'width', w);
				}
				return this;
			},

			/**
			 * 从一个HTMLElement元素来创建popup
			 *
			 * @method renderPopup
			 * @param {HTMLElement}
			 * @return {popup}
			 */
			renderPopup: function(el) {
				var instance = this;
				var position = this._chkPosition();

				//this.renderPanel(el);
				this.setStyle ('position', position);
				

				var width = parseInt(D.getCurrentStyle(el, 'width'),10)||0;
				if (width) this.width = width;

				var shadow = D.query('.' + this.SHADOW_CLASS, el);
				var header = D.query('.' + this.HD_CLASS, el);
				var body   = D.query('.' + this.BD_CLASS, el);
				var footer = D.query('.' + this.FT_CLASS, el);
				var close  = D.query('.' + this.CLOSE_CLASS, el);
				if (!body) throw new Error(['Popup','render error','Panel body HTMLElement can not be finded!']);

				this._shadow  = shadow ? shadow[0] : null;
				this._header  = header ? header[0] : null;
				this._body    = body   ? body[0]   : null;
				this._footer  = footer ? footer[0] : null;
				this._close   = close  ? close[0]  : null;

				if (this._close) {
					var fn = function()  { instance.hide(); }
					D.on(this._close, 'click', fn);
				}
				return this;
			},

			/**
			 * 隐藏popup
			 *
			 * @method hidePopup
			 * @return void
			 */
			hidePopup: function() {
				this.hidePanel();
				return this;
			},

			/**
			 * 得到popup所在的矩形区域
			 *
			 * @method getRect
			 * @private
			 * @return {object}
			 */
			getRect: function() {
				return this.panelRect;
			},

			/**
			 * 得到popup所在的矩形区域
			 *
			 * @method getBounds
			 * @return {object}
			 */
			getBounds: function() {
				return this.getRect();
			},

			/**
			 * 设置Popup的坐标和尺寸
			 *
			 * @method setPopupRect
			 * @param  {number} x坐标
			 * @param  {number} y坐标
			 * @param  {number} w宽度
			 * @param  {number} h高度
			 * @return {Panel object}
			 */
			setPopupRect: function() {
				return this.setPanelRect.apply(this, arguments);
			},

			/**
			 * 自动调整坐标使得层在可视范围之内
			 *
			 * @method adjustPosition
			 * @param  void
			 * @return {void}
			 */
			adjustPosition: function () {
				this.autoAdjustPanelPosition();
			},

			/**
			 * 消毁popup
			 *
			 * @method disposePopup
			 * @param  void
			 * @return {void}
			 */
			disposePopup: function() {
				/*Dom.removeNode([this._header, this._body, this._footer,
								this._cue, this._shadow, this._resize, this._close,
								this._corners[0], this._corners[1]]);*/
				if (this) this.disposePanel();
				this._header = this._body = this._footer = null;
				this._cue = this._shadow = this._resize = this._close = null;
				if('function'==typeof CollectGarbage)CollectGarbage();
			},

			/**
			 * 检测panel是否存在，如果不存在，则消毁panel
			 *
			 * @method detectPopup
			 * @param  void
			 * @return {void}
			 */
			detectPopup: function() {
				var b = this.detectPanel();
				if (!b) this.dispose();
				return b;
			},

			/** 
			 * virtual function,
			 * implements interface
			 */
			show: function() {
				if (!this.detect()) return false;
				if (!this.fire('beforeshow')) return false;
				this.showPopup.apply(this,arguments);
				this.visibility = true;
				this.fire('aftershow');
				if (!this.detect()) return false;
				return true;
			},

			detect: function() {
				return this.detectPopup();
			},

			hide: function() {
				if (!this.detect()) return false;
				if (!this.fire('beforehide')) return false;
				this.hidePopup();
				this.visibility = false;			
				this.fire('afterhide');
				if (!this.detect()) return false;
				return true;
			},

			isVisible: function() {
				return this.visibility;
			},

			render: function() {
				return this.renderPopup.apply(this, arguments);
			},

			dispose: function() {
				this.disposePopup();
			}

		}


	}(), true);













	/**
	 * @class LayerPopup class
	 * @author: {@link mailto:liupingchuan01@baidu.com liupingchuan}
	 * @version 1.0 
	 * @create-date   : 2008-5-26
	 * @last-modified : 2008-9-14
	 */

	var LayerPopup = QW.ClassH.extend(function (op) {
		arguments.callee.$super.apply(this, arguments);

		QW.CustEvent.createEvents(this, 'blur,aftershowtimer,afterhidetimer');

		this._addLayerPopupListener();
		
		if (this.timeoutListener) this._initTimeoutListener();

		return this;
	}, BaseLayer, false);

	QW.ObjectH.mix(LayerPopup.prototype, function () {

		var D = QW.Dom, E = QW.CustEvent;
		
		return {

			/**
			 * 关闭popup的延迟时间
			 *
			 * @type {Number}
			 * @public
			 */
			hideTimeout : 500,

			/**
			 * 展开popup的延迟时间
			 *
			 * @type {Number}
			 * @public
			 */
			showTimeout : 500,

			/**
			 * 关闭延迟时间的timer
			 *
			 * @type {Number}
			 * @public
			 */
			hideTimer : null,

			/**
			 * 是否开启timer来监听mouseover和mouseout事件
			 *
			 * @type {Bool}
			 * @public
			 */
			timeoutListener : false,

			/**
			 * 是否开启timer来监听mouseover和mouseout事件
			 *
			 * @type {Bool}
			 * @private
			 */
			_isInitTimeoutLsr: false,

			/**
			 * 显示延迟时间的timer
			 *
			 * @type {Number}
			 * @public
			 */
			showTimer : null,

			showTimerEvents: 'mouseover',

			hideTimerEvents: 'mouseout',

			

			/**
			 * 添加事件
			 *
			 * @method _addLayerPopupListener
			 * @private
			 * @param  void
			 * @return void
			 */
			_addLayerPopupListener: function () {

				var instance = this;

				var popupBlurHandler = function(e) { 
					var el = e.target;
					if (!instance.contains(el) && instance.visibility) {
						if (instance.visibility) {
							instance.fire('blur');
							instance.hide();
						}
					}
				};

				D.on(document, 'mousedown', popupBlurHandler);
				D.on(document, 'keyup',     popupBlurHandler);

				/*CustEvent.observe(this, 'aftershow', function() {
					QWEvent.stopObserving(document, 'mousedown', popupBlurHandler);
					QWEvent.stopObserving(document, 'keyup',     popupBlurHandler);

				});*/
			},


			/**
			 * 初始化延迟函数
			 *
			 * @method _initTimeoutListener
			 * @private
			 * @param  void
			 * @return void
			 */
			_initTimeoutListener: function() {
				if (!this._isInitTimeoutLsr) {
					var instance = this;
					D.on(this.getPopup(), this.showTimerEvents, function(){
						if (!instance.fire('aftershowtimer')) return;
						instance.clearAllTimeout();
					});
					D.on(this.getPopup(), this.hideTimerEvents,  function() {
						if (!instance.fire('afterhidetimer')) return;
						instance.delayHide();
					});
					this._isInitTimeoutLsr = true;
				}
			},

			/**
			 * 延时关闭Popup
			 *
			 * @method timerHide
			 * @param  {Number} hideTimeout为延迟的时间，单位为毫秒
			 * @return void
			 */
			delayHide: function(hideTimeout) {
				this._initTimeoutListener();
				this.hideTimeout = parseInt(hideTimeout, 10) || this.hideTimeout;
				this.clearAllTimeout();
				var instance = this;
				this.hideTimer = setTimeout(function() {
					instance.hide();
				}, this.hideTimeout);
			},

			/**
			 * 延时显示Popup
			 *
			 * @method delayShow
			 * @return void
			 */
			delayShow: function() {
				this._initTimeoutListener();
				var instance = this;
				var args = arguments;
				this.clearAllTimeout();
				this.showTimer = setTimeout(function() {
					instance.show.apply(instance,args);
				}, this.showTimeout);
			},

			/**
			 * 清除timeout
			 *
			 * @method clearAllTimeout
			 * @return void
			 */
			clearAllTimeout: function() {
				clearTimeout(this.hideTimer);
				clearTimeout(this.showTimer);
			},

			show: function() {
				if (!this.detect()) return false;
				if (!this.fire('beforeshow')) return false;
				this.clearAllTimeout();
				this.showPopup.apply(this, arguments);
				this.visibility = true;
				this.fire('aftershow');
				if (!this.detect()) return false;
				return true;
			},

			hide: function() {
				if (!this.fire('beforehide')) return false;
				this.clearAllTimeout();
				this.hidePopup();
				this.visibility = false;			
				this.fire('afterhide');
				return true;
			}

		}

	}(), true);


	/**
	 * @class Dialog class
	 * @author: {@link mailto:liupingchuan01@baidu.com liupingchuan}
	 * @version 1.0 
	 * @create-date   : 2008-3-24
	 * @last-modified : 2008-4-30
	 */
	var Dialog = QW.ClassH.extend(function (op, config) {
		op     = op || {};
		config = config || {};
		this._initDialog(op, config);

		return this;
	}, BaseLayer, false);


	QW.ObjectH.mix(Dialog.prototype, {

		close      : true,
		modal      : true,
		
		center     : true,
		shadow     : true,
		useEscKey  : true,
		useIframe  : null,

		header     : true,
		body       : true,
		footer     : true,

		content    : '',
		caption    : '',
		className  : 'panel-t1',

		mask       : null,
		MASK_CLASS : 'mask',

		/**
		 * 初始化
		 *
		 * @method _initDialog
		 * @private
		 * @return void
		 */
		_initDialog: function(op, config) {

			if (QW.Dom.isElement(op)) {
				this.mask = new Mask({useIframe: config.useIframe});
				config.className = config.className || this.className;
				config.useIframe = false;
			} else {
				this.mask = new Mask({useIframe: op.useIframe});
				op.className = op.className || this.className;
				op.useIframe = false;
			}

			Dialog.$super.call(this, op, config);
			return this;
		},

		/**
		 * 设置蒙板全屏
		 *
		 * @public
		 * @method setMaskFullscreen
		 * @return void
		 */
		setMaskFullscreen: function() {
			this.mask.setPanelFullscreen();
		},

		/**
		 * 对话框居中
		 *
		 * @private
		 * @method showDialog
		 * @param {number} x x坐标
		 * @param {number} y y坐标
		 * @param {number} w 宽度
		 * @param {number} h 高度
		 * @return void
		 */
		setDialogCenter: function (x, y, w, h, el) {
			this.setPopupCenter.apply(this, arguments);
		},

		/**
		 * 显示dialog
		 *
		 * @private
		 * @method showDialog
		 * @param {number} x x坐标
		 * @param {number} y y坐标
		 * @param {number} w 宽度
		 * @param {number} h 高度
		 * @return void
		 */
		showDialog: function(x, y, w, h, el) {
			if (this.modal) this.showMask(); else this.hideMask();
			this.showPopup.apply(this,arguments);
			return this;
		},

		/**
		 * 设置Dialog的坐标和尺寸
		 *
		 * @method setDialogRect
		 * @param  {number} x坐标
		 * @param  {number} y坐标
		 * @param  {number} w宽度
		 * @param  {number} h高度
		 * @return {Panel object}
		 * 
		 */
		setDialogRect: function() {
			return this.setPopupRect.apply(this, arguments);
		},

		/**
		 * 显示mask
		 *
		 * @method showMask
		 * @param {number} x x坐标
		 * @param {number} y y坐标
		 * @param {number} w 宽度
		 * @param {number} h 高度
		 * @return void
		 */
		showMask: function() {
			this.mask.show.apply(this.mask, arguments);
			return this.mask;
		},

		/**
		 * 隐藏mask
		 *
		 * @method hideDialog
		 * @return void
		 */
		hideMask: function() {
			this.mask.hide();
			return this.mask;
		},

		/**
		 * 隐藏dialog
		 *
		 * @method hideDialog
		 * @return void
		 */
		hideDialog: function() {
			this.hidePopup ();
			this.hideMask  ();
		},

		/** 
		 * Virtual function,
		 * override these function when 
		 * you inherit BaseLayer
		 * implements interface
		 */
		show: function() {
			if (!this.detect()) return false;
			if (!this.fire('beforeshow')) return false;
			this.showDialog.apply(this,arguments);
			this.visibility = true;
			this.fire('aftershow');
			if (!this.detect()) return false;
			return true;

		},

		hide: function() {
			if (!this.fire('beforehide')) return false;
			this.hideDialog();
			this.visibility = false;
			this.fire('afterhide');
			return true;
		},
		
		dispose: function() {
			this.disposePopup();
			this.mask.dispose();
		}

	}, true);


























	/* new version class Mask, MaskMgr, MessageBox, PanelManager */
	/* version 2.0 */



	var Singleton = function (){
		var _instance = null;
		return {
			getInstance: function (kclass) {
				if (_instance) return _instance;
				return new kclass();
			}
		}
	}();



	/**
	 * @class Mask class
	 * @author: {@link mailto:liupingchuan01@baidu.com liupingchuan}
	 * @version 1.0 
	 * @create-date   : 2008-3-24
	 * @last-modified : 2009-5-29
	 */
	var Mask = QW.ClassH.extend(function (op, config) {

		QW.CustEvent.createEvents(this, 'beforeshow,aftershow');

		return this._initMask.apply(this, arguments);
	}, Panel, false);


	QW.ObjectH.mix(Mask.prototype, function (){

		var D = QW.Dom, O = QW.ObjectH;

		return {

			_scrollTimer: null,		
			_resizeTimer: null,

			scrollInterval: 50,		
			resizeInterval: 50,

			leftOffset  : 200,
			topOffset   : 200,
			rightOffset :  0,
			bottomOffset: 200,

			MASK_CLASS : 'mask',

			/**
			 * @private
			 */
			_initMask: function (op) {
				op = op || {};
				op.useIframe = op.useIframe==null ? this._chkIframe() : op.useIframe;
				O.mix(this, op, true);
				
				this._addMaskEvent();
				Mask.$super.call(this, op);

				var maskPosition = this._chkPosCanbeFixed() ? 'fixed' : 'absolute';
				this.addClassName(this.MASK_CLASS);
				this.setStyle('position', maskPosition);
				return this;
			},

			/**
			 * @private
			 */
			_addMaskEvent: function() {
				var instance = this;

				if (!this._chkPosCanbeFixed()) {

					D.on(window, 'scroll', function() {
						clearTimeout(instance._scrollTimer);

						instance._scrollTimer = setTimeout(function() {
							clearTimeout(instance._scrollTimer);
							instance.adaptBounds();
						}, instance.scrollInterval);

					});

					D.on(window, 'resize', function() {
						clearTimeout(instance._resizeTimer);

						instance._resizeTimer = setTimeout(function() {
							clearTimeout(instance._resizeTimer);
							instance.adaptBounds();
						}, instance.resizeInterval);

					});

				};
			},

			adaptBounds: function() {
				var panel = this.getPanel();
				if (!panel) return;
				var position = D.getStyle(panel,'position').toLowerCase();

				if ('fixed'!=position) {

					var bounds = D.getDocRect();
					var p = D.getRect(this.getPanel());
					var x = y = w = h = 0;

					x = bounds.scrollX - this.leftOffset<=0 ? 0 : bounds.scrollX - this.leftOffset;
					y = bounds.scrollY - this.topOffset<=0  ? 0 : bounds.scrollY - this.topOffset;
					w = this.rightOffset;
					h = this.bottomOffset;

					w += bounds.width;
					h += bounds.height
					if ( p.width  > w ) w = null;
					if ( p.height > h ) h = null;
					this.setPanelRect(x, y, w, h);

				} else {

					this.setStyle('width' , '100%');
					this.setStyle('height', '100%');
					this.setStyle('left'  , '0');
					this.setStyle('top'   , '0');

				}
			},

			show: function() {
				if (!this.detect()) return false;
				if (!this.fire('beforeshow')) return false;

				this.showPanel.apply(this, arguments);
				this.adaptBounds();
				this.visibility = true;

				if (!this.detect()) return false;
				this.fire('aftershow');
				return true;
			}
		};
	}(), true);










	/**
	 * messagebox icon const 
	 */

	var MB_ICON = {
		WARNING: 'bb-confirm-warning',
		SUCCESS: 'bb-confirm-success',
		FAILURE: 'bb-confirm-failure',
		NULL: 'bb-confirm-null'
	};


	/**
	 * messagebox button const
	 */
	var MB_BUTTON = {
		OK:     { key: 'OK'    , text: '确定', retVal: 1 },
		CANCEL: { key: 'CANCEL', text: '取消', retVal: 2 },
		ABORT:  { key: 'ABORT' , text: '放弃', retVal: 3 },
		RETRY:  { key: 'RETRY' , text: '重试', retVal: 4 },
		IGNORE: { key: 'IGNORE', text: '忽略', retVal: 5 },
		YES:    { key: 'YES'   , text: '&nbsp;是&nbsp;' , retVal: 6 },
		NO:     { key: 'NO'    , text: '&nbsp;否&nbsp;' , retVal: 7 }
	};





	/**
	 * MessageBox final class
	 */
	var MessageBox = QW.ClassH.extend(function(op, config) {
		arguments.callee.$super.apply(this, arguments);

		QW.CustEvent.createEvents(this, 'close');

		return this._initMessageBox.apply(this, arguments);
	}, Dialog, false);


	QW.ObjectH.mix(MessageBox.prototype, {

		icon: MB_ICON.WARNING,

		singleton: false,

		focusButton: null,

		header: false,

		className: 'panel-t6',

		position: 'fixed',

		width: 500,

		lazyShow: false,

		eventArgs: {},

		buttons: [MB_BUTTON.OK],

		_contentBox: null,

		_contentHeader: null,

		_contentBody: null,

		/**
		 * @private
		 */
		_initMessageBox: function() {
			this._initContentBox();
			if(this.caption) this.setCaption(this.caption);
			if(this.content) this.setContent(this.content);
			if(!this.lazyShow) this.show();
			return this;
		},

		/**
		 * @private
		 */
		_initContentBox: function() {
			var buttons = this.buttons, instance = this;

			this._contentBox    = QW.Dom.create('<div class="' + this.icon + '"></div>');
			this._contentHeader = document.createElement('h4');
			this._contentBody   = document.createElement('div');

			this._contentBox.appendChild(this._contentHeader);
			this._contentBox.appendChild(this._contentBody);
			this._body.appendChild(this._contentBox);

			if (this.buttons && this.buttons.length) {
				this._contentFooter = QW.Dom.create('<p class="submit"></p>');
				this._contentBox.appendChild(this._contentFooter);
			}

			new function createButtons() {

				if (!buttons || !buttons.length) return;			

				for (var i=0; i<buttons.length; i++) {

					if ('key' in buttons[i] && 'text' in buttons[i] && 'retVal' && buttons[i]) {

						/* create new button */
						instance[buttons[i].key]  = QW.Dom.create('<button></button>');
						
						var span = QW.Dom.create('<span>&nbsp;&nbsp;</span>');

						instance._contentFooter.appendChild(instance[buttons[i].key]);
						instance._contentFooter.appendChild(span);

						instance[buttons[i].key].innerHTML = buttons[i].text;

						/* new scope */
						(function (i) {
							QW.Dom.on(instance[buttons[i].key], 'click', function(e) {
								instance.eventArgs = { 'evt': e, 'retVal': buttons[i].retVal };
								instance.hide();
							});
						})(i);
					}

				}
			}
		},

		/* override createButtons method */
		createButtons: function(){

		},

		/* override showDialog method */
		/**
		 * 显示dialog
		 *
		 * @private
		 * @method showDialog
		 * @param {number} x x坐标
		 * @param {number} y y坐标
		 * @param {number} w 宽度
		 * @param {number} h 高度
		 * @return void
		 */
		showDialog: function(x, y, w, h, el) {
			if (this.modal) this.showMask(); else this.hideMask();
			this.showPopup.apply(this,arguments);
			if (this.focusButton && 
				this.focusButton['key'] && 
				this[this.focusButton['key']]) {
				this[this.focusButton['key']].focus();
			};
			return this;
		},

		hide: function() {
			var _E = new QW.CustEvent(this, 'close');
			QW.ObjectH.mix(_E, this.eventArgs);
			if (!this.fire(_E)) return false;

			Dialog.prototype.hide.call(this);
			if (this.singleton) this.dispose();
			return true;
		},

		/* override setCaption method */
		setCaption: function(caption) {
			if (this._contentHeader) this._contentHeader.innerHTML = caption;
		},

		/* override setContent method */
		setContent: function(content) {
			if (!this._contentBody) return false;

			if (QW.Dom.isElement(content)) {
				this._contentBody.appendChild(content);
			} else {
				this._contentBody.innerHTML = content;
			}
			return true;
		}
	}, true);

	/* alert, confirm static method */
	QW.ObjectH.mix(MessageBox, {

		alert: function (option) {
			var defop = {
				caption: '',
				content: '',
				singleton:true,
				buttons: [MB_BUTTON.OK],
				focusButton: MB_BUTTON.OK
			};
			defop = QW.ObjectH.mix(defop, option, true);
			return new MessageBox(defop);
		},

		confirm: function (option) {
			var defop = {
				caption: '',
				content: '',
				singleton:true,
				buttons: [MB_BUTTON.OK, MB_BUTTON.CANCEL],
				focusButton: MB_BUTTON.OK
			};
			defop = QW.ObjectH.mix(defop, option, true);
			return new MessageBox(defop);
		}

	}, true);




	/**
	 * Panel工厂方法类
	 */
	var PanelFactory = function (panelManager) {
		this.constructor = arguments.callee;
		this.manager = panelManager;
	};

	/**
	 * Panel工厂方法类成员配置
	 */
	PanelFactory.CLASSLIST = {
		'messagebox' : MessageBox
		, 'layerpopup' : LayerPopup
		, 'dialog' : Dialog
	};

	PanelFactory.prototype = function () {
		return {
			/**
			 * 创建Panel
			 *
			 * @method 类名, 参数,....
			 * @return 类实例
			 */
			create : function (className) {
				className = new String(className).toLowerCase();
				if (PanelFactory.CLASSLIST[className]) {
					var args = Array.prototype.slice.call(arguments, 1);

					var C = PanelFactory.CLASSLIST[className];
					var F = function () { C.apply(this, args); };
					F.prototype = C.prototype;
					
					var instance = new F;
					this.manager.push(instance);
					return instance;
				} else {
					//...err
				}
			}
		};
	}();


	/**
	 * Panel管理器类
	 */
	var PanelManager = function () {
		this.constructor = arguments.callee;
		this.list = [];

		QW.CustEvent.createEvents(this, 'esc');
		
		this.bindListener();
	};

	PanelManager.prototype = function () {
		return {
			/**
			 * @esc key code
			 * @type {String}
			 * @private
			 */
			ESC_KEY_CODE : 27
			
			/**
			 * 绑定事件
			 * @return 管理器
			 */
			, bindListener : function () {
				var _self = this;
				var escHandler = function(e) {
					var k = e.keyCode;
					if(k == _self.ESC_KEY_CODE) _self.fire('esc');
				}
				QW.Dom.on(document, 'keydown', escHandler);
				return this;
			}

			/**
			 * push进Panel实例
			 *
			 * @method Panel实例
			 * @return 管理器
			 */
			, push : function (instance) {
				var _self = this;
				instance.show = function (show) {
					return function () {
						_self.moveLast(instance);
						return show.apply(this, arguments);
					};
				}(instance.show);
				this.moveLast(instance);
				return this;
			}

			/**
			 * 把Panel实例移动到队伍末尾
			 *
			 * @method Panel实例
			 * @return 管理器
			 */
			, moveLast : function (instance) {
				var index = QW.ArrayH.indexOf(this.list, instance);
				if (index == - 1) {
					this.list.push(instance);
					return this;
				}
				if (index <  this.list.length - 1) {
					this.list.splice(index, 1);
					this.list.push(instance);
				}
				return this;
			}
		};
	}();

	var panelManager = new PanelManager();

	var panelFactory = new PanelFactory(panelManager);

	panelManager.on('esc', function () {
		for (var i = panelManager.list.length - 1 ; i > -1 ; --i) {
			if (panelManager.list[i].visibility) {
				panelManager.list[i].hide();
				break;
			}
		}
	});

	QW.provide('Panel', Panel);
	QW.provide('BaseLayer', BaseLayer);
	QW.provide('LayerPopup', LayerPopup);
	QW.provide('Dialog', Dialog);
	QW.provide('Singleton', Singleton);
	QW.provide('Mask', Mask);
	QW.provide('MB_ICON', MB_ICON);
	QW.provide('MB_BUTTON', MB_BUTTON);
	QW.provide('MessageBox', MessageBox);
	QW.provide('PanelFactory', PanelFactory);
	QW.provide('PanelManager', PanelManager);
	QW.provide('panelManager', panelManager);
	QW.provide('panelFactory', panelFactory);


})();