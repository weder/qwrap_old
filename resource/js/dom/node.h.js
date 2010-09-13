/** 
* @class NodeH Node Helper�����element���ݴ���͹�����չ
* @singleton
* @namespace QW
*/
QW.NodeH = function () {

	var ObjectH = QW.ObjectH;
	var DomU = QW.DomU;
	var Browser = QW.Browser;
	var Selector = QW.Selector;

	/** 
	* ���element����
	* @method	$
	* @param	{element|string|wrap}	element	id,Elementʵ����wrap
	* @param	{object}				doc		(Optional)document Ĭ��Ϊ ��ǰdocument
	* @return	{element}				�õ��Ķ����null
	*/
	var $ = function (element, doc) {
		if ('string' == typeof element) {
			doc = doc || document;
			return doc.getElementById(element);
		} else {
			return (ObjectH.getType(element) == "wrap") ? arguments.callee(element.core) : element;
		}
	};

	var regEscape = function (str) {
		return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
	};

	var NodeH = {
		
		/** 
		* ���element�����outerHTML����
		* @method	outerHTML
		* @param	{element|string|wrap}	element	id,Elementʵ����wrap
		* @param	{object}				doc		(Optional)document Ĭ��Ϊ ��ǰdocument
		* @return	{string}				outerHTML����ֵ
		*/
		outerHTML : function () {
			var temp = document.createElement('div');
			
			return function (element, doc) {
				element = $(element);
				if ('outerHTML' in element) {
					return element.outerHTML;
				} else {
					temp.innerHTML='';
					var dtemp = doc && doc.createElement('div') || temp;
					dtemp.appendChild(element.cloneNode(true));
					return dtemp.innerHTML;
				}
			};
		}()

		/** 
		* �ж�element�Ƿ����ĳ��className
		* @method	hasClass
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{string}				className	��ʽ��
		* @return	{void}
		*/
		, hasClass : function (element, className) {
			element = $(element);
			return new RegExp('(?:^|\\s)' + regEscape(className) + '(?:\\s|$)', 'i').test(element.className);
		}

		/** 
		* ��element���className
		* @method	addClass
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{string}				className	��ʽ��
		* @return	{void}
		*/
		, addClass : function (element, className) {
			element = $(element);
			if (!NodeH.hasClass(element, className))
				element.className = element.className ? element.className + ' ' + className : className;
		}

		/** 
		* �Ƴ�elementĳ��className
		* @method	removeClass
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{string}				className	��ʽ��
		* @return	{void}
		*/
		, removeClass : function (element, className) {
			element = $(element);
			if (NodeH.hasClass(element, className))
				element.className = element.className.replace(new RegExp('(?:^|\\s)' + regEscape(className) + '(?=\\s|$)', 'ig'), '');
		}

		/** 
		* �滻element��className
		* @method	replaceClass
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{string}				oldClassName	Ŀ����ʽ��
		* @param	{string}				newClassName	����ʽ��
		* @return	{void}
		*/
		, replaceClass : function (element, oldClassName, newClassName) {
			element = $(element);
			if (NodeH.hasClass(element, oldClassName)) {
				element.className = element.className.replace(new RegExp('(^|\\s)' + regEscape(oldClassName) + '(?=\\s|$)', 'ig'), '$1' + newClassName);
			} else {
				NodeH.addClass(element, newClassName);
			}
		}

		/** 
		* element��className1��className2�л�
		* @method	toggleClass
		* @param	{element|string|wrap}	element			id,Elementʵ����wrap
		* @param	{string}				className1		��ʽ��1
		* @param	{string}				className2		(Optional)��ʽ��2
		* @return	{void}
		*/
		, toggleClass : function (element, className1, className2) {
			className2 = className2 || '';
			if (NodeH.hasClass(element, className1)) {
				NodeH.replaceClass(element, className1, className2);
			} else {
				NodeH.replaceClass(element, className2, className1);
			}
		}

		/** 
		* ��ʾelement����
		* @method	show
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{string}				value		(Optional)display��ֵ Ĭ��Ϊ��
		* @return	{void}
		*/
		, show : function (element, value) {
			element = $(element);
			element.style.display = value || '';
		}

		/** 
		* ����element����
		* @method	hide
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @return	{void}
		*/
		, hide : function (element) {
			element = $(element);
			element.style.display = 'none';
		}

		/** 
		* ����/��ʾelement����
		* @method	toggle
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{string}				value		(Optional)��ʾʱdisplay��ֵ Ĭ��Ϊ��
		* @return	{void}
		*/
		, toggle : function (element, value) {
			if (NodeH.isVisible(element)) {
				NodeH.hide(element);
			} else {
				NodeH.show(element, value);
			}
		}

		/** 
		* �ж�element�����Ƿ�ɼ�
		* @method	isVisible
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @return	{boolean}				�жϽ��
		*/
		, isVisible : function (element) {
			element = $(element);
			//return this.getStyle(element, 'visibility') != 'hidden' && this.getStyle(element, 'display') != 'none';
			//return !!(element.offsetHeight || element.offestWidth);
			return !!(element.offsetHeight || element.offestWidth);
		}


		/** 
		* ��ȡelement�������doc��xy����
		* @method	getXY
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @return	{array}					x, y
		*/
		, getXY : function() {
			if (document.documentElement.getBoundingClientRect && !!window.ActiveXObject) {
			// IE
				return function (element) {
					element = $(element);
					var box       = element.getBoundingClientRect()
						, offsetX = box.left - (Browser.ie7 ? 2 : 0)
						, offsetY = box.top - (Browser.ie7 ? 2 : 0)
						, rect    = null;

					if (NodeH.getCurrentStyle(element, 'position') != 'fixed' || Browser.ie6) {
						rect = DomU.getDocRect(element.ownerDocument);
						offsetX += rect.scrollX, offsetY += rect.scrollY;
					}

					try {
						var f = element.ownerDocument.parentWindow.frameElement || null;
						if (f) {
							var offset = 2 - (f.frameBorder || 1) * 2;
							offsetX += offset;
							offsetY += offset;
						}
					}
					catch(exp) {}

					return [offsetX, offsetY];
				}

			} else {

				return function(element) { 
				// manually calculate by crawling up offsetParents
					element = $(element);
					var pos = [element.offsetLeft, element.offsetTop];
					var parentNode = element.offsetParent;
					var patterns = {
						HYPHEN: /(-[a-z])/i, // to normalize get/setStyle
						ROOT_TAG: /^(?:body|html)$/i, // body for quirks mode, html for standards
						OP_SCROLL:/^(?:inline|table-row)$/i
					};

					// safari: subtract body offsets if el is abs (or any offsetParent), unless body is offsetParent
					//Browser.isSafari
					var accountForBody = (Browser.safari && NodeH.getCurrentStyle(element, 'position') == 'absolute' && element.offsetParent == element.ownerDocument.body);

					if (parentNode != element) {
						while (parentNode) {
							pos[0] += parentNode.offsetLeft;
							pos[1] += parentNode.offsetTop;
							if (!accountForBody && Browser.safari && NodeH.getCurrentStyle(parentNode, 'position') == 'absolute') { 
								accountForBody = true;
							}
							parentNode = parentNode.offsetParent;
						}
					}

					if (accountForBody) { 
					//safari doubles in this case
						pos[0] -= element.ownerDocument.body.offsetLeft;
						pos[1] -= element.ownerDocument.body.offsetTop;
					}

					parentNode = element.parentNode;

					// account for any scrolled ancestors
					while ( parentNode.tagName && !patterns.ROOT_TAG.test(parentNode.tagName) ) {
						if (parentNode.scrollTop || parentNode.scrollLeft) {
						// work around opera inline/table scrollLeft/Top bug (false reports offset as scroll)
							if (!patterns.OP_SCROLL.test(NodeH.getCurrentStyle(parentNode, 'display'))) { 
								if (!Browser.opera || NodeH.getCurrentStyle(parentNode, 'overflow') !== 'visible') { // opera inline-block misreports when visible
									pos[0] -= parentNode.scrollLeft;
									pos[1] -= parentNode.scrollTop;
								}
							}
						}
						parentNode = parentNode.parentNode; 
					}

					return pos;
				};

			}

		}()

		/** 
		* ����element�����xy����
		* @method	setXY
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{int}					x			(Optional)x���� Ĭ�ϲ�����
		* @param	{int}					y			(Optional)y���� Ĭ�ϲ�����
		* @return	{void}
		*/
		, setXY : function (element, x, y) {
			element = $(element);
			x = parseInt(x, 10);
			y = parseInt(y, 10);
			if ( !isNaN(x) ) NodeH.setStyle(element, 'left', x + 'px');
			if ( !isNaN(y) ) NodeH.setStyle(element, 'top', y + 'px');
		}

		/** 
		* ����element�����offset���
		* @method	setSize
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{int}					w			(Optional)�� Ĭ�ϲ�����
		* @param	{int}					h			(Optional)�� Ĭ�ϲ�����
		* @return	{void}
		*/
		, setSize : function (element, w, h) {
			element = $(element);
			w = parseFloat (w, 10);
			h = parseFloat (h, 10);

			if (isNaN(w) && isNaN(h)) return;

			var borders = NodeH.borderWidth(element);
			var paddings = NodeH.paddingWidth(element);

			if ( !isNaN(w) ) NodeH.setStyle(element, 'width', Math.max(+w - borders[1] - borders[3] - paddings[1] - paddings[3], 0) + 'px');
			if ( !isNaN(h) ) NodeH.setStyle(element, 'height', Math.max(+h - borders[0] - borders[2] - paddings[1] - paddings[2], 0) + 'px');
		}

		/** 
		* ����element����Ŀ��
		* @method	setInnerSize
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{int}					w			(Optional)�� Ĭ�ϲ�����
		* @param	{int}					h			(Optional)�� Ĭ�ϲ�����
		* @return	{void}
		*/
		, setInnerSize : function (element, w, h) {
			element = $(element);
			w = parseFloat (w, 10);
			h = parseFloat (h, 10);

			if ( !isNaN(w) ) NodeH.setStyle(element, 'width', w + 'px');
			if ( !isNaN(h) ) NodeH.setStyle(element, 'height', h + 'px');
		}

		/** 
		* ����element�����offset��ߺ�xy����
		* @method	setRect
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{int}					x			(Optional)x���� Ĭ�ϲ�����
		* @param	{int}					y			(Optional)y���� Ĭ�ϲ�����
		* @param	{int}					w			(Optional)�� Ĭ�ϲ�����
		* @param	{int}					h			(Optional)�� Ĭ�ϲ�����
		* @return	{void}
		*/
		, setRect : function (element, x, y, w, h) {
			NodeH.setXY(element, x, y);
			NodeH.setSize(element, w, h);
		}

		/** 
		* ����element����Ŀ�ߺ�xy����
		* @method	setRect
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{int}					x			(Optional)x���� Ĭ�ϲ�����
		* @param	{int}					y			(Optional)y���� Ĭ�ϲ�����
		* @param	{int}					w			(Optional)�� Ĭ�ϲ�����
		* @param	{int}					h			(Optional)�� Ĭ�ϲ�����
		* @return	{void}
		*/
		, setInnerRect : function (element, x, y, w, h) {
			NodeH.setXY(element, x, y);
			NodeH.setInnerSize(element, w, h);
		}

		/** 
		* ��ȡelement����Ŀ��
		* @method	getSize
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @return	{object}				width,height
		*/
		, getSize : function (element) {
			element = $(element);
			return { width : element.offsetWidth, height : element.offsetHeight };
		}

		/** 
		* ��ȡelement����Ŀ�ߺ�xy����
		* @method	setRect
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @return	{object}				width,height,left,top,bottom,right
		*/
		, getRect : function (element) {
			element = $(element);
			var p = NodeH.getXY(element);
			var x = p[0];
			var y = p[1];
			var w = element.offsetWidth; 
			var h = element.offsetHeight;
			return {
				'width'  : w,    'height' : h,
				'left'   : x,    'top'    : y,
				'bottom' : y+h,  'right'  : x+w
			};
		}

		/** 
		* ����ȡelement���󸴺��������ֵܽڵ�
		* @method	nextSibling
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{string}				selector	(Optional)��ѡ���� Ĭ��Ϊ�ռ�������ֵܽڵ�
		* @return	{node}					�ҵ���node��null
		*/
		, nextSibling : function (element, selector) {
			var fcheck = Selector.selector2Filter(selector || '');
			element = $(element);
			do {
				element = element.nextSibling;
			} while (element && !fcheck(element));
			return element;
		}

		/** 
		* ��ǰ��ȡelement���󸴺��������ֵܽڵ�
		* @method	previousSibling
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{string}				selector	(Optional)��ѡ���� Ĭ��Ϊ�ռ�������ֵܽڵ�
		* @return	{node}					�ҵ���node��null
		*/
		, previousSibling : function (element, selector) {
			var fcheck = Selector.selector2Filter(selector || '');
			element = $(element);
			do {
				element = element.previousSibling;
			} while (element && !fcheck(element)); 
			return element;
		}

		/** 
		* ���ϻ�ȡelement���󸴺��������ֵܽڵ�
		* @method	previousSibling
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{string}				selector	(Optional)��ѡ���� Ĭ��Ϊ�ռ�������ֵܽڵ�
		* @return	{element}					�ҵ���node��null
		*/
		, ancestorNode : function (element, selector) {
			var fcheck = Selector.selector2Filter(selector || '');
			element = $(element);
			do {
				element = element.parentNode;
			} while (element && !fcheck(element));
			return element;
		}

		/** 
		* ���ϻ�ȡelement���󸴺��������ֵܽڵ�
		* @method	parentNode
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{string}				selector	(Optional)��ѡ���� Ĭ��Ϊ�ռ�������ֵܽڵ�
		* @return	{element}					�ҵ���node��null
		*/
		, parentNode : function (element, selector) {
			return NodeH.ancestorNode(element, selector);
		}

		/** 
		* ��element��������ʼλ�û�ȡ���������Ľڵ�
		* @method	firstChild
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{string}				selector	(Optional)��ѡ���� Ĭ��Ϊ�ռ�������ֵܽڵ�
		* @return	{node}					�ҵ���node��null
		*/
		, firstChild : function (element, selector) {
			var fcheck = Selector.selector2Filter(selector || '');
			element = $(element).firstChild;
			while (element && !fcheck(element)) element = element.nextSibling;
			return element;
		}

		/** 
		* ��element�����ڽ���λ�û�ȡ���������Ľڵ�
		* @method	lastChild
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{string}				selector	(Optional)��ѡ���� Ĭ��Ϊ�ռ�������ֵܽڵ�
		* @return	{node}					�ҵ���node��null
		*/
		, lastChild : function (element, selector) {
			var fcheck = Selector.selector2Filter(selector || '');
			element = $(element).lastChild;
			while (element && !fcheck(element)) element = element.previousSibling;
			return element;
		}

		/** 
		* �ж�Ŀ���Ƿ���element���������ڵ�
		* @method	contains
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{element|string|wrap}	target		Ŀ�� id,Elementʵ����wrap
		* @return	{boolean}				�жϽ��
		*/
		, contains : function (element, target) {
			element = $(element), target = $(target);
			return element.contains
				? element != target && element.contains(target)
				: !!(element.compareDocumentPosition(target) & 16);
		}

		/** 
		* ��element����ǰ/������ʼ���ڽ�β����html
		* @method	insertAdjacentHTML
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{string}				type		λ������
		* @param	{element|string|wrap}	html		�����html
		* @return	{void}
		*/
		, insertAdjacentHTML : function (element, type, html) {
			element = $(element);
			if (element.insertAdjacentHTML) {
				element.insertAdjacentHTML(type, html);
			} else {
				var df;
				var r = element.ownerDocument.createRange();
				switch (String(type).toLowerCase()) {
					case "beforebegin":
						r.setStartBefore(element);
						df = r.createContextualFragment(html);
						break;
					case "afterbegin":
						r.selectNodeContents(element);
						r.collapse(true);
						df = r.createContextualFragment(html);
						break;
					case "beforeend":
						r.selectNodeContents(element);
						r.collapse(false);
						df = r.createContextualFragment(html);
						break;
					case "afterend":
						r.setStartAfter(element);
						df = r.createContextualFragment(html);
						break;
				}
				NodeH.insertAdjacentElement(element, type, df);
			}
		}

		/** 
		* ��element����ǰ/������ʼ���ڽ�β����element����
		* @method	insertAdjacentElement
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{string}				type		λ������
		* @param	{element|string|wrap}	target		Ŀ��id,Elementʵ����wrap
		* @return	{element}				Ŀ��element����
		*/
		, insertAdjacentElement : function (element, type, target) {
			element = $(element), target = $(target);
			if (element.insertAdjacentElement) {
				element.insertAdjacentElement(type, target);
			} else {
				switch (String(type).toLowerCase()) {
					case "beforebegin":
						element.parentNode.insertBefore(target, element);
						break;
					case "afterbegin":
						element.insertBefore(target, element.firstChild);
						break;
					case "beforeend":
						element.appendChild(target);
						break;
					case "afterend":
						element.parentNode.insertBefore(target, element.nextSibling || null);
						break;
				}
			}
			return target;
		}

		/** 
		* ��element������׷��element����
		* @method	firstChild
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{element|string|wrap}	target		Ŀ��id,Elementʵ����wrap
		* @return	{element}				Ŀ��element����
		*/
		, appendChild : function (element, target) {
			return $(element).appendChild($(target));
		}

		/** 
		* ��element����ǰ����element����
		* @method	insertSiblingBefore
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{element|string|wrap}	nelement	Ŀ��id,Elementʵ����wrap
		* @return	{element}				Ŀ��element����
		*/
		, insertSiblingBefore : function (element, nelement) {
			element = $(element);
			return element.parentNode.insertBefore($(nelement), element);
		}

		/** 
		* ��element��������element����
		* @method	insertSiblingAfter
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{element|string|wrap}	nelement	Ŀ��id,Elementʵ����wrap
		* @return	{element}				Ŀ��element����
		*/
		, insertSiblingAfter : function (element, nelement) {
			element = $(element);
			element.parentNode.insertBefore($(nelement), element.nextSibling || null);
		}

		/** 
		* ��element�����ڲ���ĳԪ��ǰ����element����
		* @method	insertBefore
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{element|string|wrap}	nelement	Ŀ��id,Elementʵ����wrap
		* @param	{element|string|wrap}	relement	���뵽id,Elementʵ����wrapǰ
		* @return	{element}				Ŀ��element����
		*/
		, insertBefore : function (element, nelement, relement) {
			return $(element).insertBefore($(nelement), relement && $(relement) || null);
		}

		/** 
		* ��element�����ڲ���ĳԪ�غ����element����
		* @method	insertAfter
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{element|string|wrap}	nelement	Ŀ��id,Elementʵ����wrap
		* @param	{element|string|wrap}	nelement	���뵽id,Elementʵ����wrap��
		* @return	{element}				Ŀ��element����
		*/
		, insertAfter : function (element, nelement, relement) {
			return $(element).insertBefore($(nelement), relement && $(relement).nextSibling || null);
		}

		/** 
		* ��һ��Ԫ���滻�Լ�
		* @method	replaceNode
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{element|string|wrap}	nelement		�¶���
		* @return	{element}				���滻�ɹ����˷����ɷ��ر��滻�Ľڵ㣬���滻ʧ�ܣ��򷵻� NULL
		*/
		, replaceNode : function (element, nelement) {
			element = $(element);
			return element.parentNode.replaceChild($(nelement), element);
		}

		/** 
		* ��element���relement�滻��nelement
		* @method	replaceChild
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{element|string|wrap}	nelement	�½ڵ�id,Elementʵ����wrap
		* @param	{element|string|wrap}	relement	���滻��id,Elementʵ����wrap��
		* @return	{element}				���滻�ɹ����˷����ɷ��ر��滻�Ľڵ㣬���滻ʧ�ܣ��򷵻� NULL
		*/
		, replaceChild : function (element, nelement, relement) {
			return $(element).replaceChild($(nelement), $(relement));
		}

		/** 
		* ��element�Ƴ���
		* @method	removeNode
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @return	{element}				��ɾ���ɹ����˷����ɷ��ر�ɾ���Ľڵ㣬��ʧ�ܣ��򷵻� NULL��
		*/
		, removeNode : function (element) {
			element = $(element);
			return element.parentNode.removeChild(element);
		}

		/** 
		* ��element���target�Ƴ���
		* @method	removeChild
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{element|string|wrap}	target		Ŀ��id,Elementʵ����wrap��
		* @return	{element}				��ɾ���ɹ����˷����ɷ��ر�ɾ���Ľڵ㣬��ʧ�ܣ��򷵻� NULL��
		*/
		, removeChild : function (element, target) {
			return $(element).removeChild($(target));
		}
		/** 
		* ��Ԫ�ص���ObjectH.get
		* @method	get
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{string}				property	��Ա����
		* @return	{object}				��Ա����
		* @see ObjectH.getEx
		*/
		, get : function (element, property) {
			//var args = [$(element)].concat([].slice.call(arguments, 1));
			element = $(element);
			return ObjectH.getEx.apply(null, arguments);
		}

		/** 
		* ��Ԫ�ص���ObjectH.set
		* @method	set
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{string}				property	��Ա����
		* @param	{object}				value		��Ա����/����
		* @return	{void}
		* @see ObjectH.setEx
		*/
		, set : function (element, property, value) {
			element = $(element);
			ObjectH.setEx.apply(null, arguments);
		}

		/** 
		* ��ȡelement���������
		* @method	getAttr
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{string}				attribute	��������
		* @param	{int}					iFlags		(Optional)ieonly ��ȡ����ֵ�ķ������� ����ֵ0,1,2,4 
		* @return	{string}				����ֵ ie���п��ܲ���object
		*/
		, getAttr : function (element, attribute, iFlags) {
			element = $(element);
			return element.getAttribute(attribute, iFlags || null);
		}

		/** 
		* ����element���������
		* @method	setAttr
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{string}				attribute	��������
		* @param	{string}				value		���Ե�ֵ
		* @param	{int}					iCaseSensitive	(Optional)
		* @return	{void}
		*/
		, setAttr : function (element, attribute, value, iCaseSensitive) {
			element = $(element);
			element.setAttribute(attribute, value, iCaseSensitive || null);
		}

		/** 
		* ɾ��element���������
		* @method	removeAttr
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{string}				attribute	��������
		* @param	{int}					iCaseSensitive	(Optional)
		* @return	{void}
		*/
		, removeAttr : function (element, attribute, iCaseSensitive) {
			element = $(element);
			return element.removeAttribute(attribute, iCaseSensitive || 0);
		}

		/** 
		* ������������element��Ԫ��
		* @method	query
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{string}				selector	����
		* @return	{array}					elementԪ������
		*/
		, query : function (element, selector) {
			element = $(element);
			return Selector.query(element, selector || '');
		}

		/** 
		* ����element�����а���className�ļ���
		* @method	getElementsByClass
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{string}				className	��ʽ��
		* @return	{array}					elementԪ������
		*/
		, getElementsByClass : function (element, className) {
			element = $(element);
			return Selector.query(element, '.' + className);
		}

		/** 
		* ��ȡelement��value
		* @method	getValue
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @return	{string}				Ԫ��value
		*/
		, getValue : function (element) {
			element = $(element);
			//if(element.value==element.getAttribute('data-placeholder')) return '';
			return element.value;
		}

		/** 
		* ����element��value
		* @method	setValue
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{string}				value		����
		* @return	{void}					
		*/
		, setValue : function (element, value) {
			$(element).value=value;
		}

		/** 
		* ��ȡelement��innerHTML
		* @method	getHTML
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @return	{string}					
		*/
		, getHtml : function (element) {
			element = $(element);
			return element.innerHTML;
		}

		/** 
		* ����element��innerHTML
		* @method	setHtml
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{string}				value		����
		* @return	{void}					
		*/
		, setHtml : function (element,value) {
			$(element).innerHTML=value;
		}

		/** 
		* ���form������elements����valueת������'&'���ӵļ�ֵ�ַ���
		* @method	encodeURIForm
		* @param	{element}	element			form����
		* @param	{string}	filter	(Optional)	���˺���,�ᱻѭ�����ô��ݸ�item������Ҫ�󷵻ز���ֵ�ж��Ƿ����
		* @return	{string}					��'&'���ӵļ�ֵ�ַ���
		*/
		, encodeURIForm : function (element, filter) {

			element = $(element);

			filter = filter || function (element) { return false; };

			var result = []
				, els = element.elements
				, l = els.length
				, i = 0
				, push = function (name, value) {
					result.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
				};
			
			for (; i < l ; ++ i) {
				var el = els[i], name = el.name, value;

				if (el.disabled || !name) continue;
				
				switch (el.type) {
					case "text":
					case "hidden":
					case "password":
					case "textarea":
						if (filter(el)) break;
						push(name, el.value);
						break;
					case "radio":
					case "checkbox":
						if (filter(el)) break;
						if (el.checked) push(name, el.value);
						break;
					case "select-one":
						if (filter(el)) break;
						if (el.selectedIndex > -1) push(name, el.value);
						break;
					case "select-multiple":
						if (filter(el)) break;
						var opts = el.options;
						for (var j = 0 ; j < opts.length ; ++ j) {
							if (opts[j].selected) push(name, opts[j].value);
						}
						break;
				}
			}
			return result.join("&");
		}

		/** 
		* �ж�form�������Ƿ��иı�
		* @method	isFormChanged
		* @param	{element}	element			form����
		* @param	{string}	filter	(Optional)	���˺���,�ᱻѭ�����ô��ݸ�item������Ҫ�󷵻ز���ֵ�ж��Ƿ����
		* @return	{bool}					�Ƿ�ı�
		*/
		, isFormChanged : function (element, filter) {

			element = $(element);

			filter = filter || function (element) { return false; };

			var els = element.elements, l = els.length, i = 0, j = 0, el, opts;
			
			for (; i < l ; ++ i, j = 0) {
				el = els[i];
				
				switch (el.type) {
					case "text":
					case "hidden":
					case "password":
					case "textarea":
						if (filter(el)) break;
						if (el.defaultValue != el.value) return true;
						break;
					case "radio":
					case "checkbox":
						if (filter(el)) break;
						if (el.defaultChecked != el.checked) return true;
						break;
					case "select-one":
						j = 1;
					case "select-multiple":
						if (filter(el)) break;
						opts = el.options;
						for (; j < opts.length ; ++ j) {
							if (opts[j].defaultSelected != opts[j].selected) return true;
						}
						break;
				}
			}

			return false;
		}

		/** 
		* ��¡Ԫ��
		* @method	cloneNode
		* @param	{element}	element			form����
		* @param	{bool}		bCloneChildren	(Optional) �Ƿ���ȿ�¡ Ĭ��ֵfalse
		* @return	{element}					��¡���Ԫ��
		*/
		, cloneNode : function (bCloneChildren) {
			$(element).cloneNode(bCloneChildren || false);
		}

	};

	void function () {
		var camelize = function (string) {
			return String(string).replace(/\-(\w)/g, function(a, b){ return b.toUpperCase(); });
		};

		var getPixel = function (element, value) {
			if (/px$/.test(value) || !value) return parseInt(value, 10) || 0;
			var current = element.style.right;
			var result;

			NodeH.setStyle(element, 'right', value);

			result = element.style.pixelRight || 0;
			element.style.right = current;
			return result;
		};

		/** 
		* ���element�������ʽ
		* @method	getStyle
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{string}				attribute	��ʽ��
		* @return	{string}				
		*/
		NodeH.getStyle = function (element, attribute) {
			element = $(element);
			var result = element.style[camelize(attribute)];

			if (attribute == 'opacity') {
				if (result) return parseInt(result, 10);
				if (result = (arguments.callee(element, 'filter') || '').match(/alpha\(opacity=(.*)\)/))
					if (result[1]) return parseInt(result[1], 10) / 100;
				return 1.0;
			}
			return (!result || result == 'auto') ? null : result;
		};
		
		/** 
		* ���element����ǰ����ʽ
		* @method	getCurrentStyle
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{string}				attribute	��ʽ��
		* @return	{string}				
		*/
		NodeH.getCurrentStyle = function (element, attribute, pseudo) {
			element = $(element);
			var result = '';

			if (element.ownerDocument.defaultView && element.ownerDocument.defaultView.getComputedStyle) {
				var style = element.ownerDocument.defaultView.getComputedStyle(element, pseudo || null);
				result = style ? style.getPropertyValue(attribute) : null;
			} else if (element.currentStyle) {
				result = element.currentStyle[camelize(attribute)];
			}
			if (attribute == 'opacity') {
				if (result) return parseInt(result, 10);
				if (result = (arguments.callee(element, 'filter') || '').match(/alpha\(opacity=(.*)\)/))
					if (result[1]) return parseInt(result[1], 10) / 100;
				return 1.0;
			}
			
			return (!result || result == 'auto') ? null : result;
		};
		
		/** 
		* ����element�������ʽ
		* @method	setStyle
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @param	{string}				attribute	��ʽ��
		* @param	{string}				value		ֵ
		* @return	{void}
		*/
		NodeH.setStyle = function (element, attributes, value) {
			element = $(element);

			if (typeof attributes == "string") {
				var temp = {};
				temp[attributes] = value;
				attributes = temp;
			}

			//if (element.currentStyle && !element.currentStyle['hasLayout']) element.style.zoom = 1;
			
			for (var prop in attributes) {
				if ('opacity' == prop && !!window.ActiveXObject) {
					element.style['filter'] = 'alpha(opacity=' + (attributes[prop] * 100) + ')';
				} else {
					element.style[camelize(prop)] = attributes[prop];
				}
			}
		};

		/** 
		* ��ȡelement�����border���
		* @method	borderWidth
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @return	{array}					topWidth, rightWidth, bottomWidth, leftWidth
		*/
		NodeH.borderWidth = function (element) {
			element = $(element);

			if (element.currentStyle && !element.currentStyle.hasLayout) {
				element.style.zoom = 1;
			}

			return [
				element.clientTop
				, element.offsetWidth - element.clientWidth - element.clientLeft
				, element.offsetHeight - element.clientHeight - element.clientTop
				, element.clientLeft
			];
		};

		/** 
		* ��ȡelement�����padding���
		* @method	paddingWidth
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @return	{array}					topWidth, rightWidth, bottomWidth, leftWidth
		*/
		NodeH.paddingWidth = function (element) {
			element = $(element);
			return [
				getPixel(element, NodeH.getCurrentStyle(element, 'padding-top'))
				, getPixel(element, NodeH.getCurrentStyle(element, 'padding-right'))
				, getPixel(element, NodeH.getCurrentStyle(element, 'padding-bottom'))
				, getPixel(element, NodeH.getCurrentStyle(element, 'padding-left'))
			];
		};

		/** 
		* ��ȡelement�����margin���
		* @method	marginWidth
		* @param	{element|string|wrap}	element		id,Elementʵ����wrap
		* @return	{array}					topWidth, rightWidth, bottomWidth, leftWidth
		*/
		NodeH.marginWidth = function (element) {
			element = $(element);
			return [
				getPixel(element, NodeH.getCurrentStyle(element, 'margin-top'))
				, getPixel(element, NodeH.getCurrentStyle(element, 'margin-right'))
				, getPixel(element, NodeH.getCurrentStyle(element, 'margin-bottom'))
				, getPixel(element, NodeH.getCurrentStyle(element, 'margin-left'))
			];
		};
	}();

	NodeH.$ = $;
	
	return NodeH;
}();