/** 
* Dom Utils，是Dom模块核心类
* @class DomU 
* @singleton
* @namespace QW
*/
QW.DomU = function () {
	var Selector=QW.Selector;
	var DomU = {

		/** 
		* 按cssselector获取元素集 
		* @method	query
		* @param {String} sSelector cssselector字符串
		* @param {Element} refEl (Optional) 参考元素，默认为document.documentElement
		* @return {Array}
		*/
		query: function (sSelector,refEl) {
			return Selector.query(refEl || document.documentElement,sSelector);
		},
		/** 
		* 获取doc的一些坐标信息 
		* @method	getDocRect
		* @param	{object} doc (Optional) document对象/默认为当前宿主的document
		* @return	{object} 包含doc的scrollX,scrollY,width,height,scrollHeight,scrollWidth值的json
		*/
		getDocRect : function (doc) {
			var doc            = doc || window.document
				, win		   = doc.parentWindow || doc.defaultView
				, $F           = function (val) { return parseInt(val, 10) || 0; }
				, left         = win.pageXOffset || Math.max($F(doc.documentElement.scrollLeft), $F(doc.body.scrollLeft))
				, top          = win.pageYOffset || Math.max($F(doc.documentElement.scrollTop),  $F(doc.body.scrollTop))
				, width        = Math.max ($F(doc.documentElement.clientWidth) , 0)
				, height       = Math.max ($F(doc.documentElement.clientHeight), 0)
				, scrollHeight = Math.max ($F(doc.documentElement.scrollHeight), $F(doc.body.offsetHeight))
				, scrollWidth  = Math.max ($F(doc.documentElement.scrollWidth) , $F(doc.body.offsetWidth));

			if (
				(!doc.compatMode || doc.compatMode == 'CSS1Compat')
				&& doc.documentElement && doc.documentElement.clientHeight)
			{
				height = doc.documentElement.clientHeight;
				width  = doc.documentElement.clientWidth;
			} else if (doc.body && doc.body.clientHeight) {
				height = doc.body.clientHeight;
				width  = doc.body.clientWidth;
			} else if(win.innerWidth && win.innerHeight && doc.width) {
				height = win.innerHeight;
				width  = win.innerWidth;
				if (doc.height>height) height -= 16;
				if (doc.width>width)   width  -= 16;
			} 

			if (/webkit/i.test(window.navigator.userAgent)) {
				scrollHeight = Math.max(scrollHeight, $F(doc.body.scrollHeight));
			}
			
			scrollHeight = Math.max(height, scrollHeight);
			scrollWidth = Math.max(width, scrollWidth);

			return {
				'scrollX' : left,  'scrollY' : top,
				'width'   : width, 'height'  : height,
				'scrollHeight' : scrollHeight,
				'scrollWidth'  : scrollWidth
			};
		}

		/** 
		* 通过html字符串创建Dom对象 
		* @method	create
		* @param	{string}	html html字符串
		* @param	{boolean}	rfrag (Optional) 是否返回documentFragment对象
		* @param	{object}	doc	(Optional)	document 默认为 当前document
		* @return	{element}	返回html字符的element对象或documentFragment对象
		*/
		, create : function () {
			var temp = document.createElement('div');

			return function (html, rfrag, doc) {
				var dtemp = doc && doc.createElement('div') || temp;
				dtemp.innerHTML = html;
				var element = dtemp.firstChild;
				
				if (!element || !rfrag) {
					return element;
				} else {
					doc = doc || document;
					var frag = doc.createDocumentFragment();
					while (element = dtemp.firstChild) frag.appendChild(element);
					return frag;
				}
			};
		}()

		/** 
		* 把NodeCollection转为ElementCollection
		* @method	pluckWhiteNode
		* @param	{NodeCollection|array} list Node的集合
		* @return	{array}						Element的集合
		*/
		, pluckWhiteNode : function (list) {
			var result = [], i = 0, l = list.length;
			for (; i < l ; i ++)
				if (DomU.isElement(list[i])) result.push(list[i]);
			return result;
		}

		/** 
		* 判断Node实例是否继承了Element接口
		* @method	isElement
		* @param	{object} element Node的实例
		* @return	{boolean}		 判断结果
		*/
		, isElement : function (element) {
			return !!(element && element.nodeType == 1);
		}

		/** 
		* 监听Dom树结构初始化完毕事件
		* @method	ready
		* @param	{function} handler 事件处理程序
		* @param	{object}	doc	(Optional)	document 默认为 当前document
		* @return	{void}
		*/
		, ready : function (handler, doc) {
			doc = doc || document;
			if (doc.addEventListener) {
				doc.addEventListener("DOMContentLoaded", handler, false);
			} else {
				var fireDOMReadyEvent = function () {
					fireDOMReadyEvent = new Function;
					handler();
				};
				void function () {
					try {
						doc.body.doScroll('left');
					} catch (exp) {
						return window.setTimeout(arguments.callee, 10);
					}
					fireDOMReadyEvent();
				}();
				doc.attachEvent('onreadystatechange', function () {
					/^(?:loaded|complete)$/.test(doc.readyState) && fireDOMReadyEvent();
				});
			}
		}
	

		/** 
		* 判断一个矩形是否包含另一个矩形
		* @method	rectContains
		* @param	{object} rect1	矩形
		* @param	{object} rect2	矩形
		* @return	{boolean}		比较结果
		*/
		, rectContains : function (rect1, rect2) {
			return rect1.left	 <= rect2.left
				&& rect1.right   >= rect2.right
				&& rect1.top     <= rect2.top
				&& rect1.bottom  >= rect2.bottom;
		}

		/** 
		* 判断一个矩形是否和另一个矩形有交集
		* @method	rectIntersect
		* @param	{object} rect1	矩形
		* @param	{object} rect2	矩形
		* @return	{rect}			交集矩形或null
		*/
		, rectIntersect : function (rect1, rect2) {
			//修正变量名
			var t = Math.max( rect1.top,	  rect2.top    )
				, r = Math.min( rect1.right,  rect2.right  )
				, b = Math.min( rect1.bottom, rect2.bottom )
				, l = Math.max( rect1.left,   rect2.left   );
			
			if (b >= t && r >= l) {
				return { top : t, right : r, bottom: b, left : l };
			} else {
				return null;
			}
		}

		/** 
		* 创建一个element
		* @method	createElement
		* @param	{string}	tagName		元素类型
		* @param	{json}		property	属性
		* @param	{document}	doc	(Optional)		document
		* @return	{element}	创建的元素
		*/
		, createElement : function (tagName, property, doc) {
			doc = doc || document;
			var element = doc.createElement(tagName);
			
			if (property) {
				for (var i in property) element[i] = property[i];
			}
			return element;
		}

	};
	
	return DomU;
}();