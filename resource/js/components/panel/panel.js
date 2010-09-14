/**
 * @fileoverview Panel/Container class
 * @author:{@link mailto:ranklau@gmail.com PingchuanLiu}
 * @last-modified : 2008-4-30
 * @last-modified : 2008-5-13
 */

/**
 *
 * һ��Panel��ײ�Ļ���, ����
 * ������չ��Popup,Dialog,Tip,Mask,Menu,LayerPopup,MessageBox����.
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
			 * ����һ�������ؼ�
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
			 * ����һ�������ؼ�
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
			 * ������ʽ
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
			 * ����className
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
			 * ����className
			 *
			 * @method resetClassName
			 * @param void
			 * @return {element}
			 */
			resetClassName: function() {
				this._panel.className = this.PANEL_CLASS;
			},
			
			/**
			 * �õ�panel�ؼ�
			 *
			 * @method getPanel
			 * @param void
			 * @return {element}
			 */
			getPanel: function () {
				return this._panel;
			},

			/**
			 * �õ�iframe�ؼ�
			 *
			 * @method getIframe
			 * @param void
			 * @return {element}
			 */
			getIframe: function () {
				return this._iframe;
			},

			/**
			 * ����һ��iframe�ؼ�
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
			 * ���ʹ��position fixed������
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
			 * ����Զ�����iframe����
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
			 * �洢panel rectangle
			 *
			 * @method saveRect
			 * @param  {number} x����
			 * @param  {number} y����
			 * @param  {number} w���
			 * @param  {number} h�߶�
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
			 * ����Panel������ͳߴ�
			 *
			 * @method setPanelRect
			 * @param  {number} x����
			 * @param  {number} y����
			 * @param  {number} w���
			 * @param  {number} h�߶�
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
			 * ����Panel�ĳߴ�
			 *
			 * @method setPanelSize
			 * @param {number} w���
			 * @param {number} h�߶�
			 * @return {Panel object}
			 */
			setPanelSize: function (w, h) {
				this.saveRect (null, null, w, h);
				D.setSize ([this._panel], w, h);
				return this;
			},

			/**
			 * ����Panel������
			 *
			 * @method setPanelXY
			 * @param  {number} x����
			 * @param  {number} y����
			 * @return {Panel object}
			 */
			setPanelXY: function (x, y) {
				this.saveRect(x, y);
				D.setXY(this._panel, x, y);
				return this;
			},


			/**
			 * ȫ��Panel
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
			 * ���ݴ���Ŀ��,���õ�panel�ĸ߶�,
			 * �ø߶�������������Ӧ�߶�
			 *
			 * @method getPanelAutoHeight
			 * @param  {number} w���
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
			 * ����Panel����ˮƽ��ֱ����
			 *
			 * @method setPanelCenter
			 * @param {number} w���
			 * @param {number} h�߶�
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
			 * �õ�panel��position
			 *
			 * @param  {void}
			 * @return {string}
			 */
			getPanelPosition: function() {
				return D.getStyle(this._panel, 'position').toLowerCase();
			},

			/**
			 * ��panel��׷��Ԫ��
			 *
			 * @method appendToPanel
			 * @param  {element} el Ԫ�ض���
			 * @return {Panel object}
			 */
			appendToPanel: function (el) {
				this._panel.appendChild(el);
			},


			/**
			 * ��panel������׷��Ԫ��
			 *
			 * @method appendToContent
			 * @param {element} el Ԫ�ض���
			 * @return {Panel object}
			 */
			appendToContent: function (el) {
				this._content.appendChild(el);
			},

			/**
			 * ��ʾPanel�ؼ�
			 *
			 * @method showPanel
			 * @param  {number} x ����
			 * @param  {number} y ����
			 * @param  {number} w ���
			 * @param  {number} h �߶�
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
			 * �Զ�����panel��λ��
			 *
			 * @method autoAdjustPanelPosition
			 * @param  {number} x ����
			 * @param  {number} y ����
			 * @param  {number} w ���
			 * @param  {number} h �߶�
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
			 * ����ĳ�����Ƿ�ɼ�
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
			 * ����Panel�ؼ�
			 *
			 * @method hidePanel
			 * @param void
			 * @return {Panel object}
			 */
			hidePanel: function () {
				this.setPanelVisible(false);
			},

			/**
			 * ��HTML����Ⱦһ��panel
			 *
			 * @method renderPanel
			 * @param  {HTMLElement} el Ϊһ��HTMLElement����
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
			 * ���panel�Ƿ����
			 *
			 * @method showPanel
			 * @param  void
			 * @return {boolean}
			 */
			detectPanel: function() {
				if (!this._panel || !D.$(this._panel.id)) {
					alert('�ܱ�Ǹ���������޷�����ʹ�á�\n���������������������"����������ع���"���볢�Թرոù��ܺ����ԡ�\n\n��ιر�"����������ع���"����İ�������FAQ��');
					this.dispose();
					return false;
				}
				return true;
			},
			

			/**
			 * ����Panel����
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
			

			//�麯��
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
			 * �Ƿ����
			 *
			 * @public
			 * @type {bool}
			 * @default {false}
			 */
			center    : false,

			/**
			 * �Ƿ�����Ӱ
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
			 * �Ƿ��м��
			 *
			 * @public
			 * @type {bool}
			 * @default {false}
			 */
			cue       : false,

			/**
			 * �Ƿ���Բ��
			 *
			 * @public
			 * @type {bool}
			 * @default {false}
			 */
			corner    : false,

			/**
			 * �Ƿ���ϷŴ�С
			 *
			 * @public
			 * @type {bool}
			 * @default {false}
			 */
			resizable : false,

			/**
			 * �Ƿ���Ϸ�����
			 *
			 * @public
			 * @type {bool}
			 * @default {false}
			 */
			draggable : !!QW.Drag,

			/**
			 * �ϷŴ���
			 *
			 * @public
			 * @type {element}
			 * @default {null}
			 */
			dragProxy : null,


			/**
			 * �ϷŴ�����ʽ
			 *
			 * @public
			 * @type {string}
			 * @default {panel-drag-proxy}
			 */
			dragProxyClass : 'drag-proxy',

			/**
			 * ��ק�д�����ʽ
			 *
			 * @public
			 * @type {string}
			 * @default {panel-drag-proxy-dragging}
			 */
			dragProxyClassDragging : 'proxy-dragging',

			/**
			 * �Ƿ���Ҫ�ϷŴ���
			 *
			 * @public
			 * @type {bool}
			 * @default {false}
			 */
			withDragProxy : false,

			/**
			 * �Ƿ���bubbton
			 *
			 * @public
			 * @type {array}
			 * @default {null}
			 */
			buttons   : null,

			/**
			 * �Ƿ���header
			 *
			 * @public
			 * @type {bool}
			 * @default {true}
			 */
			header    : true,

			/**
			 * header�������ק���ܸ��ӵ���ʽ
			 *
			 * @public
			 * @type {string}
			 * @default {panel-drag-header}
			 */
			headerClassDrag : 'panel-drag-enabled',

			/**
			 * �Ƿ���body
			 *
			 * @public
			 * @type {bool}
			 * @default {true}
			 */
			body      : true,

			/**
			 * �Ƿ���footer
			 *
			 * @public
			 * @type {bool}
			 * @default {true}
			 */
			footer    : true,

			/**
			 * ��ʼ��ʱ��className
			 *
			 * @public
			 * @type {string}
			 * @default {panel-t2}
			 */
			className : 'panel-t2',

			/**
			 * ��ʼ��ʱ�Ŀ��
			 *
			 * @public
			 * @type {Number}
			 * @default {null}
			 */
			width     : null,

			/**
			 * ��ʼ��ʱ�ĸ߶ȣ�����Ӱʱ���鲻���ø߶�����
			 *
			 * @public
			 * @type {Number}
			 * @default {null}
			 */
			height    : null,

			/**
			 * ��ʼ��ʱ��X����
			 *
			 * @public
			 * @type {Number}
			 * @default {null}
			 */
			left      : null,

			/**
			 * ��ʼ��ʱ��Y����
			 *
			 * @public
			 * @type {Number}
			 * @default {null}
			 */
			top       : null,

			/**
			 * �Ƿ���iframe�����ֲ㣬nullʱΪ�Զ���IE6�������Ͱ汾�Զ���Ϊtrue��
			 *
			 * @public
			 * @type {Number}
			 * @default {null}
			 */
			useIframe : null,

			/**
			 * �Ƿ���Ҫ�رհ�ť
			 *
			 * @public
			 * @type {bool}
			 * @default {false}
			 */
			close     : false,

			/**
			 * �Ƿ���esc���������󣬵�����󣬰�esc�ر�
			 *
			 * @public
			 * @type {bool}
			 * @default {false}
			 */
			useEscKey : false,

			/**
			 * �Ƿ����Զ���λ���Զ���λ�轫center��Ϊfalse�����Զ���λ���ɳ����Զ������ڿ��ӷ�Χ����
			 *
			 * @public
			 * @type {bool}
			 * @default {true}
			 */
			autoPosition: true,

			/**
			 * ��ʼ����ı���
			 *
			 * @public
			 * @type {String}
			 * @default {���ַ���}
			 */
			caption   : '',

			/**
			 * �Ƿ�ɼ�
			 *
			 * @public
			 * @readonly
			 * @type {boolean}
			 */
			visibility   : false,

			/**
			 * ��ʼ���������
			 *
			 * @public
			 * @type {String|HTMLElement}
			 * @default {���ַ���}
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
			 * ��ʼ��popup
			 *
			 * @method _initBaseLayer
			 * @param  {object} op objectѡ��
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
			 * �õ�Popup�ؼ�
			 *
			 * @method getPopup
			 * @param void
			 * @return {element}
			 */
			getPopup: function () {
				return this._panel;
			},

			/**
			 * ����Զ�����position����
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
			 * �Ƴ�����Ԫ��,����Բ��,
			 * resize,��Ӱ,��Ǻ�close
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
			 * ��������
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
			 * ��ʼ���϶�
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
			 * ��ʼ���϶���С
			 *
			 * @private
			 */
			initResizable: function() {
			},


			/**
			 * Ӧ��config
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
			 * ����button
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
			 * �����رհ�ť
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
			 * ������Ӱ
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
			 * ����Բ��
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
			 * ���������ͷ
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
			 * �������
			 *
			 * @method setContent
			 * @param {string} sHTML HTML�ַ���
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
			 * ���ñ���
			 *
			 * @method setCaption
			 * @param {string} sHTML HTML�ַ���
			 * @return void
			 */
			setCaption: function(sHTML) {
				if(this._header) 
					this._header.innerHTML = '<h3>' +sHTML+ '</h3>';
			},

			/**
			 * ���ͷ��
			 *
			 * @method setHeader
			 * @param {string} sHTML HTML�ַ���
			 * @remarks ���Ƽ�ʹ��v2���ɾ���˽ӿ�
			 * @return void
			 */
			setHeader: function(sHTML) {
				this.setCaption(sHTML);
			},

			/**
			 * ���β��
			 *
			 * @method setFooter
			 * @param {string} sHTML HTML�ַ���
			 * @return void
			 */
			setFooter: function(sHTML) {
				if(this._footer)
					this._footer.innerHTML = sHTML;
			},

			/**
			 * ����popup��ֱˮƽ����
			 *
			 * @method setPopupCenter
			 * @param {number} w ���
			 * @param {number} h �߶�
			 * @return void
			 */
			setPopupCenter: function(w, h) {
				this.setPanelCenter (w, h);
				return this;
			},

			/**
			 * ��ʾpopup
			 *
			 * @method showPopup
			 * @param {number} x x����
			 * @param {number} y y����
			 * @param {number} w ���
			 * @param {number} h �߶�
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
			 * ��һ��HTMLElementԪ��������popup
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
			 * ����popup
			 *
			 * @method hidePopup
			 * @return void
			 */
			hidePopup: function() {
				this.hidePanel();
				return this;
			},

			/**
			 * �õ�popup���ڵľ�������
			 *
			 * @method getRect
			 * @private
			 * @return {object}
			 */
			getRect: function() {
				return this.panelRect;
			},

			/**
			 * �õ�popup���ڵľ�������
			 *
			 * @method getBounds
			 * @return {object}
			 */
			getBounds: function() {
				return this.getRect();
			},

			/**
			 * ����Popup������ͳߴ�
			 *
			 * @method setPopupRect
			 * @param  {number} x����
			 * @param  {number} y����
			 * @param  {number} w���
			 * @param  {number} h�߶�
			 * @return {Panel object}
			 */
			setPopupRect: function() {
				return this.setPanelRect.apply(this, arguments);
			},

			/**
			 * �Զ���������ʹ�ò��ڿ��ӷ�Χ֮��
			 *
			 * @method adjustPosition
			 * @param  void
			 * @return {void}
			 */
			adjustPosition: function () {
				this.autoAdjustPanelPosition();
			},

			/**
			 * ����popup
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
			 * ���panel�Ƿ���ڣ���������ڣ�������panel
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
			 * �ر�popup���ӳ�ʱ��
			 *
			 * @type {Number}
			 * @public
			 */
			hideTimeout : 500,

			/**
			 * չ��popup���ӳ�ʱ��
			 *
			 * @type {Number}
			 * @public
			 */
			showTimeout : 500,

			/**
			 * �ر��ӳ�ʱ���timer
			 *
			 * @type {Number}
			 * @public
			 */
			hideTimer : null,

			/**
			 * �Ƿ���timer������mouseover��mouseout�¼�
			 *
			 * @type {Bool}
			 * @public
			 */
			timeoutListener : false,

			/**
			 * �Ƿ���timer������mouseover��mouseout�¼�
			 *
			 * @type {Bool}
			 * @private
			 */
			_isInitTimeoutLsr: false,

			/**
			 * ��ʾ�ӳ�ʱ���timer
			 *
			 * @type {Number}
			 * @public
			 */
			showTimer : null,

			showTimerEvents: 'mouseover',

			hideTimerEvents: 'mouseout',

			

			/**
			 * ����¼�
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
			 * ��ʼ���ӳٺ���
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
			 * ��ʱ�ر�Popup
			 *
			 * @method timerHide
			 * @param  {Number} hideTimeoutΪ�ӳٵ�ʱ�䣬��λΪ����
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
			 * ��ʱ��ʾPopup
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
			 * ���timeout
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
		 * ��ʼ��
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
		 * �����ɰ�ȫ��
		 *
		 * @public
		 * @method setMaskFullscreen
		 * @return void
		 */
		setMaskFullscreen: function() {
			this.mask.setPanelFullscreen();
		},

		/**
		 * �Ի������
		 *
		 * @private
		 * @method showDialog
		 * @param {number} x x����
		 * @param {number} y y����
		 * @param {number} w ���
		 * @param {number} h �߶�
		 * @return void
		 */
		setDialogCenter: function (x, y, w, h, el) {
			this.setPopupCenter.apply(this, arguments);
		},

		/**
		 * ��ʾdialog
		 *
		 * @private
		 * @method showDialog
		 * @param {number} x x����
		 * @param {number} y y����
		 * @param {number} w ���
		 * @param {number} h �߶�
		 * @return void
		 */
		showDialog: function(x, y, w, h, el) {
			if (this.modal) this.showMask(); else this.hideMask();
			this.showPopup.apply(this,arguments);
			return this;
		},

		/**
		 * ����Dialog������ͳߴ�
		 *
		 * @method setDialogRect
		 * @param  {number} x����
		 * @param  {number} y����
		 * @param  {number} w���
		 * @param  {number} h�߶�
		 * @return {Panel object}
		 * 
		 */
		setDialogRect: function() {
			return this.setPopupRect.apply(this, arguments);
		},

		/**
		 * ��ʾmask
		 *
		 * @method showMask
		 * @param {number} x x����
		 * @param {number} y y����
		 * @param {number} w ���
		 * @param {number} h �߶�
		 * @return void
		 */
		showMask: function() {
			this.mask.show.apply(this.mask, arguments);
			return this.mask;
		},

		/**
		 * ����mask
		 *
		 * @method hideDialog
		 * @return void
		 */
		hideMask: function() {
			this.mask.hide();
			return this.mask;
		},

		/**
		 * ����dialog
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
		OK:     { key: 'OK'    , text: 'ȷ��', retVal: 1 },
		CANCEL: { key: 'CANCEL', text: 'ȡ��', retVal: 2 },
		ABORT:  { key: 'ABORT' , text: '����', retVal: 3 },
		RETRY:  { key: 'RETRY' , text: '����', retVal: 4 },
		IGNORE: { key: 'IGNORE', text: '����', retVal: 5 },
		YES:    { key: 'YES'   , text: '&nbsp;��&nbsp;' , retVal: 6 },
		NO:     { key: 'NO'    , text: '&nbsp;��&nbsp;' , retVal: 7 }
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
		 * ��ʾdialog
		 *
		 * @private
		 * @method showDialog
		 * @param {number} x x����
		 * @param {number} y y����
		 * @param {number} w ���
		 * @param {number} h �߶�
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
	 * Panel����������
	 */
	var PanelFactory = function (panelManager) {
		this.constructor = arguments.callee;
		this.manager = panelManager;
	};

	/**
	 * Panel�����������Ա����
	 */
	PanelFactory.CLASSLIST = {
		'messagebox' : MessageBox
		, 'layerpopup' : LayerPopup
		, 'dialog' : Dialog
	};

	PanelFactory.prototype = function () {
		return {
			/**
			 * ����Panel
			 *
			 * @method ����, ����,....
			 * @return ��ʵ��
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
	 * Panel��������
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
			 * ���¼�
			 * @return ������
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
			 * push��Panelʵ��
			 *
			 * @method Panelʵ��
			 * @return ������
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
			 * ��Panelʵ���ƶ�������ĩβ
			 *
			 * @method Panelʵ��
			 * @return ������
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