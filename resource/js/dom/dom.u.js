/** 
* Dom Utils����Domģ�������
* @class DomU 
* @singleton
* @namespace QW
*/
QW.DomU = function () {
	var Selector=QW.Selector;
	var DomU = {

		/** 
		* ��cssselector��ȡԪ�ؼ� 
		* @method	query
		* @param {String} sSelector cssselector�ַ���
		* @param {Element} refEl (Optional) �ο�Ԫ�أ�Ĭ��Ϊdocument.documentElement
		* @return {Array}
		*/
		query: function (sSelector,refEl) {
			return Selector.query(refEl || document.documentElement,sSelector);
		},
		/** 
		* ��ȡdoc��һЩ������Ϣ 
		* @method	getDocRect
		* @param	{object} doc (Optional) document����/Ĭ��Ϊ��ǰ������document
		* @return	{object} ����doc��scrollX,scrollY,width,height,scrollHeight,scrollWidthֵ��json
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
		* ͨ��html�ַ�������Dom���� 
		* @method	create
		* @param	{string}	html html�ַ���
		* @param	{boolean}	rfrag (Optional) �Ƿ񷵻�documentFragment����
		* @param	{object}	doc	(Optional)	document Ĭ��Ϊ ��ǰdocument
		* @return	{element}	����html�ַ���element�����documentFragment����
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
		* ��NodeCollectionתΪElementCollection
		* @method	pluckWhiteNode
		* @param	{NodeCollection|array} list Node�ļ���
		* @return	{array}						Element�ļ���
		*/
		, pluckWhiteNode : function (list) {
			var result = [], i = 0, l = list.length;
			for (; i < l ; i ++)
				if (DomU.isElement(list[i])) result.push(list[i]);
			return result;
		}

		/** 
		* �ж�Nodeʵ���Ƿ�̳���Element�ӿ�
		* @method	isElement
		* @param	{object} element Node��ʵ��
		* @return	{boolean}		 �жϽ��
		*/
		, isElement : function (element) {
			return !!(element && element.nodeType == 1);
		}

		/** 
		* ����Dom���ṹ��ʼ������¼�
		* @method	ready
		* @param	{function} handler �¼��������
		* @param	{object}	doc	(Optional)	document Ĭ��Ϊ ��ǰdocument
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
		* �ж�һ�������Ƿ������һ������
		* @method	rectContains
		* @param	{object} rect1	����
		* @param	{object} rect2	����
		* @return	{boolean}		�ȽϽ��
		*/
		, rectContains : function (rect1, rect2) {
			return rect1.left	 <= rect2.left
				&& rect1.right   >= rect2.right
				&& rect1.top     <= rect2.top
				&& rect1.bottom  >= rect2.bottom;
		}

		/** 
		* �ж�һ�������Ƿ����һ�������н���
		* @method	rectIntersect
		* @param	{object} rect1	����
		* @param	{object} rect2	����
		* @return	{rect}			�������λ�null
		*/
		, rectIntersect : function (rect1, rect2) {
			//����������
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
		* ����һ��element
		* @method	createElement
		* @param	{string}	tagName		Ԫ������
		* @param	{json}		property	����
		* @param	{document}	doc	(Optional)		document
		* @return	{element}	������Ԫ��
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