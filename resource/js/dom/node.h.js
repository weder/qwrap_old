/** 
* @class NodeH Node Helper，针对element兼容处理和功能扩展
* @singleton
* @namespace QW
*/
QW.NodeH = function () {

	var ObjectH = QW.ObjectH;
	var DomU = QW.DomU;
	var Browser = QW.Browser;
	var Selector = QW.Selector;

	/** 
	* 获得element对象
	* @method	$
	* @param	{element|string|wrap}	element	id,Element实例或wrap
	* @param	{object}				doc		(Optional)document 默认为 当前document
	* @return	{element}				得到的对象或null
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
		* 获得element对象的outerHTML属性
		* @method	outerHTML
		* @param	{element|string|wrap}	element	id,Element实例或wrap
		* @param	{object}				doc		(Optional)document 默认为 当前document
		* @return	{string}				outerHTML属性值
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
		* 判断element是否包含某个className
		* @method	hasClass
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{string}				className	样式名
		* @return	{void}
		*/
		, hasClass : function (element, className) {
			element = $(element);
			return new RegExp('(?:^|\\s)' + regEscape(className) + '(?:\\s|$)', 'i').test(element.className);
		}

		/** 
		* 给element添加className
		* @method	addClass
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{string}				className	样式名
		* @return	{void}
		*/
		, addClass : function (element, className) {
			element = $(element);
			if (!NodeH.hasClass(element, className))
				element.className = element.className ? element.className + ' ' + className : className;
		}

		/** 
		* 移除element某个className
		* @method	removeClass
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{string}				className	样式名
		* @return	{void}
		*/
		, removeClass : function (element, className) {
			element = $(element);
			if (NodeH.hasClass(element, className))
				element.className = element.className.replace(new RegExp('(?:^|\\s)' + regEscape(className) + '(?=\\s|$)', 'ig'), '');
		}

		/** 
		* 替换element的className
		* @method	replaceClass
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{string}				oldClassName	目标样式名
		* @param	{string}				newClassName	新样式名
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
		* element的className1和className2切换
		* @method	toggleClass
		* @param	{element|string|wrap}	element			id,Element实例或wrap
		* @param	{string}				className1		样式名1
		* @param	{string}				className2		(Optional)样式名2
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
		* 显示element对象
		* @method	show
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{string}				value		(Optional)display的值 默认为空
		* @return	{void}
		*/
		, show : function (element, value) {
			element = $(element);
			element.style.display = value || '';
		}

		/** 
		* 隐藏element对象
		* @method	hide
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @return	{void}
		*/
		, hide : function (element) {
			element = $(element);
			element.style.display = 'none';
		}

		/** 
		* 隐藏/显示element对象
		* @method	toggle
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{string}				value		(Optional)显示时display的值 默认为空
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
		* 判断element对象是否可见
		* @method	isVisible
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @return	{boolean}				判断结果
		*/
		, isVisible : function (element) {
			element = $(element);
			//return this.getStyle(element, 'visibility') != 'hidden' && this.getStyle(element, 'display') != 'none';
			//return !!(element.offsetHeight || element.offestWidth);
			return !!(element.offsetHeight || element.offestWidth);
		}


		/** 
		* 获取element对象距离doc的xy坐标
		* @method	getXY
		* @param	{element|string|wrap}	element		id,Element实例或wrap
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
		* 设置element对象的xy坐标
		* @method	setXY
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{int}					x			(Optional)x坐标 默认不设置
		* @param	{int}					y			(Optional)y坐标 默认不设置
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
		* 设置element对象的offset宽高
		* @method	setSize
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{int}					w			(Optional)宽 默认不设置
		* @param	{int}					h			(Optional)高 默认不设置
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
		* 设置element对象的宽高
		* @method	setInnerSize
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{int}					w			(Optional)宽 默认不设置
		* @param	{int}					h			(Optional)高 默认不设置
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
		* 设置element对象的offset宽高和xy坐标
		* @method	setRect
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{int}					x			(Optional)x坐标 默认不设置
		* @param	{int}					y			(Optional)y坐标 默认不设置
		* @param	{int}					w			(Optional)宽 默认不设置
		* @param	{int}					h			(Optional)高 默认不设置
		* @return	{void}
		*/
		, setRect : function (element, x, y, w, h) {
			NodeH.setXY(element, x, y);
			NodeH.setSize(element, w, h);
		}

		/** 
		* 设置element对象的宽高和xy坐标
		* @method	setRect
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{int}					x			(Optional)x坐标 默认不设置
		* @param	{int}					y			(Optional)y坐标 默认不设置
		* @param	{int}					w			(Optional)宽 默认不设置
		* @param	{int}					h			(Optional)高 默认不设置
		* @return	{void}
		*/
		, setInnerRect : function (element, x, y, w, h) {
			NodeH.setXY(element, x, y);
			NodeH.setInnerSize(element, w, h);
		}

		/** 
		* 获取element对象的宽高
		* @method	getSize
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @return	{object}				width,height
		*/
		, getSize : function (element) {
			element = $(element);
			return { width : element.offsetWidth, height : element.offsetHeight };
		}

		/** 
		* 获取element对象的宽高和xy坐标
		* @method	setRect
		* @param	{element|string|wrap}	element		id,Element实例或wrap
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
		* 向后获取element对象复合条件的兄弟节点
		* @method	nextSibling
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{string}				selector	(Optional)简单选择器 默认为空即最近的兄弟节点
		* @return	{node}					找到的node或null
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
		* 向前获取element对象复合条件的兄弟节点
		* @method	previousSibling
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{string}				selector	(Optional)简单选择器 默认为空即最近的兄弟节点
		* @return	{node}					找到的node或null
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
		* 向上获取element对象复合条件的兄弟节点
		* @method	previousSibling
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{string}				selector	(Optional)简单选择器 默认为空即最近的兄弟节点
		* @return	{element}					找到的node或null
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
		* 向上获取element对象复合条件的兄弟节点
		* @method	parentNode
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{string}				selector	(Optional)简单选择器 默认为空即最近的兄弟节点
		* @return	{element}					找到的node或null
		*/
		, parentNode : function (element, selector) {
			return NodeH.ancestorNode(element, selector);
		}

		/** 
		* 从element对象内起始位置获取复合条件的节点
		* @method	firstChild
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{string}				selector	(Optional)简单选择器 默认为空即最近的兄弟节点
		* @return	{node}					找到的node或null
		*/
		, firstChild : function (element, selector) {
			var fcheck = Selector.selector2Filter(selector || '');
			element = $(element).firstChild;
			while (element && !fcheck(element)) element = element.nextSibling;
			return element;
		}

		/** 
		* 从element对象内结束位置获取复合条件的节点
		* @method	lastChild
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{string}				selector	(Optional)简单选择器 默认为空即最近的兄弟节点
		* @return	{node}					找到的node或null
		*/
		, lastChild : function (element, selector) {
			var fcheck = Selector.selector2Filter(selector || '');
			element = $(element).lastChild;
			while (element && !fcheck(element)) element = element.previousSibling;
			return element;
		}

		/** 
		* 判断目标是否是element对象的子孙节点
		* @method	contains
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{element|string|wrap}	target		目标 id,Element实例或wrap
		* @return	{boolean}				判断结果
		*/
		, contains : function (element, target) {
			element = $(element), target = $(target);
			return element.contains
				? element != target && element.contains(target)
				: !!(element.compareDocumentPosition(target) & 16);
		}

		/** 
		* 向element对象前/后，内起始，内结尾插入html
		* @method	insertAdjacentHTML
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{string}				type		位置类型
		* @param	{element|string|wrap}	html		插入的html
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
		* 向element对象前/后，内起始，内结尾插入element对象
		* @method	insertAdjacentElement
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{string}				type		位置类型
		* @param	{element|string|wrap}	target		目标id,Element实例或wrap
		* @return	{element}				目标element对象
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
		* 向element对象内追加element对象
		* @method	firstChild
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{element|string|wrap}	target		目标id,Element实例或wrap
		* @return	{element}				目标element对象
		*/
		, appendChild : function (element, target) {
			return $(element).appendChild($(target));
		}

		/** 
		* 向element对象前插入element对象
		* @method	insertSiblingBefore
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{element|string|wrap}	nelement	目标id,Element实例或wrap
		* @return	{element}				目标element对象
		*/
		, insertSiblingBefore : function (element, nelement) {
			element = $(element);
			return element.parentNode.insertBefore($(nelement), element);
		}

		/** 
		* 向element对象后插入element对象
		* @method	insertSiblingAfter
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{element|string|wrap}	nelement	目标id,Element实例或wrap
		* @return	{element}				目标element对象
		*/
		, insertSiblingAfter : function (element, nelement) {
			element = $(element);
			element.parentNode.insertBefore($(nelement), element.nextSibling || null);
		}

		/** 
		* 向element对象内部的某元素前插入element对象
		* @method	insertBefore
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{element|string|wrap}	nelement	目标id,Element实例或wrap
		* @param	{element|string|wrap}	relement	插入到id,Element实例或wrap前
		* @return	{element}				目标element对象
		*/
		, insertBefore : function (element, nelement, relement) {
			return $(element).insertBefore($(nelement), relement && $(relement) || null);
		}

		/** 
		* 向element对象内部的某元素后插入element对象
		* @method	insertAfter
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{element|string|wrap}	nelement	目标id,Element实例或wrap
		* @param	{element|string|wrap}	nelement	插入到id,Element实例或wrap后
		* @return	{element}				目标element对象
		*/
		, insertAfter : function (element, nelement, relement) {
			return $(element).insertBefore($(nelement), relement && $(relement).nextSibling || null);
		}

		/** 
		* 用一个元素替换自己
		* @method	replaceNode
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{element|string|wrap}	nelement		新对象
		* @return	{element}				如替换成功，此方法可返回被替换的节点，如替换失败，则返回 NULL
		*/
		, replaceNode : function (element, nelement) {
			element = $(element);
			return element.parentNode.replaceChild($(nelement), element);
		}

		/** 
		* 从element里把relement替换成nelement
		* @method	replaceChild
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{element|string|wrap}	nelement	新节点id,Element实例或wrap
		* @param	{element|string|wrap}	relement	被替换的id,Element实例或wrap后
		* @return	{element}				如替换成功，此方法可返回被替换的节点，如替换失败，则返回 NULL
		*/
		, replaceChild : function (element, nelement, relement) {
			return $(element).replaceChild($(nelement), $(relement));
		}

		/** 
		* 把element移除掉
		* @method	removeNode
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @return	{element}				如删除成功，此方法可返回被删除的节点，如失败，则返回 NULL。
		*/
		, removeNode : function (element) {
			element = $(element);
			return element.parentNode.removeChild(element);
		}

		/** 
		* 从element里把target移除掉
		* @method	removeChild
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{element|string|wrap}	target		目标id,Element实例或wrap后
		* @return	{element}				如删除成功，此方法可返回被删除的节点，如失败，则返回 NULL。
		*/
		, removeChild : function (element, target) {
			return $(element).removeChild($(target));
		}
		/** 
		* 对元素调用ObjectH.get
		* @method	get
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{string}				property	成员名称
		* @return	{object}				成员引用
		* @see ObjectH.getEx
		*/
		, get : function (element, property) {
			//var args = [$(element)].concat([].slice.call(arguments, 1));
			element = $(element);
			return ObjectH.getEx.apply(null, arguments);
		}

		/** 
		* 对元素调用ObjectH.set
		* @method	set
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{string}				property	成员名称
		* @param	{object}				value		成员引用/内容
		* @return	{void}
		* @see ObjectH.setEx
		*/
		, set : function (element, property, value) {
			element = $(element);
			ObjectH.setEx.apply(null, arguments);
		}

		/** 
		* 获取element对象的属性
		* @method	getAttr
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{string}				attribute	属性名称
		* @param	{int}					iFlags		(Optional)ieonly 获取属性值的返回类型 可设值0,1,2,4 
		* @return	{string}				属性值 ie里有可能不是object
		*/
		, getAttr : function (element, attribute, iFlags) {
			element = $(element);
			return element.getAttribute(attribute, iFlags || null);
		}

		/** 
		* 设置element对象的属性
		* @method	setAttr
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{string}				attribute	属性名称
		* @param	{string}				value		属性的值
		* @param	{int}					iCaseSensitive	(Optional)
		* @return	{void}
		*/
		, setAttr : function (element, attribute, value, iCaseSensitive) {
			element = $(element);
			element.setAttribute(attribute, value, iCaseSensitive || null);
		}

		/** 
		* 删除element对象的属性
		* @method	removeAttr
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{string}				attribute	属性名称
		* @param	{int}					iCaseSensitive	(Optional)
		* @return	{void}
		*/
		, removeAttr : function (element, attribute, iCaseSensitive) {
			element = $(element);
			return element.removeAttribute(attribute, iCaseSensitive || 0);
		}

		/** 
		* 根据条件查找element内元素
		* @method	query
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{string}				selector	条件
		* @return	{array}					element元素数组
		*/
		, query : function (element, selector) {
			element = $(element);
			return Selector.query(element, selector || '');
		}

		/** 
		* 查找element内所有包含className的集合
		* @method	getElementsByClass
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{string}				className	样式名
		* @return	{array}					element元素数组
		*/
		, getElementsByClass : function (element, className) {
			element = $(element);
			return Selector.query(element, '.' + className);
		}

		/** 
		* 获取element的value
		* @method	getValue
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @return	{string}				元素value
		*/
		, getValue : function (element) {
			element = $(element);
			//if(element.value==element.getAttribute('data-placeholder')) return '';
			return element.value;
		}

		/** 
		* 设置element的value
		* @method	setValue
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{string}				value		内容
		* @return	{void}					
		*/
		, setValue : function (element, value) {
			$(element).value=value;
		}

		/** 
		* 获取element的innerHTML
		* @method	getHTML
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @return	{string}					
		*/
		, getHtml : function (element) {
			element = $(element);
			return element.innerHTML;
		}

		/** 
		* 设置element的innerHTML
		* @method	setHtml
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{string}				value		内容
		* @return	{void}					
		*/
		, setHtml : function (element,value) {
			$(element).innerHTML=value;
		}

		/** 
		* 获得form的所有elements并把value转换成由'&'连接的键值字符串
		* @method	encodeURIForm
		* @param	{element}	element			form对象
		* @param	{string}	filter	(Optional)	过滤函数,会被循环调用传递给item作参数要求返回布尔值判断是否过滤
		* @return	{string}					由'&'连接的键值字符串
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
		* 判断form的内容是否有改变
		* @method	isFormChanged
		* @param	{element}	element			form对象
		* @param	{string}	filter	(Optional)	过滤函数,会被循环调用传递给item作参数要求返回布尔值判断是否过滤
		* @return	{bool}					是否改变
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
		* 克隆元素
		* @method	cloneNode
		* @param	{element}	element			form对象
		* @param	{bool}		bCloneChildren	(Optional) 是否深度克隆 默认值false
		* @return	{element}					克隆后的元素
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
		* 获得element对象的样式
		* @method	getStyle
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{string}				attribute	样式名
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
		* 获得element对象当前的样式
		* @method	getCurrentStyle
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{string}				attribute	样式名
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
		* 设置element对象的样式
		* @method	setStyle
		* @param	{element|string|wrap}	element		id,Element实例或wrap
		* @param	{string}				attribute	样式名
		* @param	{string}				value		值
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
		* 获取element对象的border宽度
		* @method	borderWidth
		* @param	{element|string|wrap}	element		id,Element实例或wrap
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
		* 获取element对象的padding宽度
		* @method	paddingWidth
		* @param	{element|string|wrap}	element		id,Element实例或wrap
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
		* 获取element对象的margin宽度
		* @method	marginWidth
		* @param	{element|string|wrap}	element		id,Element实例或wrap
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