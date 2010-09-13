/** 
* @class EventH Event Helper，处理一些Event对象兼容问题
* @singleton
* @helper
* @namespace QW
*/
QW.EventH = function () {
	var getDoc = function (e) {
		var target = EventH.target(e), doc = document;

		/*
		ie unload target is null
		*/

		if (target) {
			doc = target.document || target.ownerDocument || (target.window || target.defaultView) && target || document;
		}
		return doc;
	};

	var EventH = {

		/** 
		* 获取鼠标位于完整页面的X坐标
		* @method	pageX
		* @param	{event}		event	(Optional)event对象 默认为调用位置所在宿主的event
		* @param	{element}	element (Optional)任意element对象 element对象所在宿主的event
		* @return	{int}		X坐标
		*/
		pageX : function () {
			var e = EventH.getEvent.apply(EventH, arguments)
				, doc = getDoc(e);
			return ('pageX' in e) ? e.pageX : (e.clientX + (doc.documentElement.scrollLeft || doc.body.scrollLeft) - 2);
		}

		/** 
		* 获取鼠标位于完整页面的Y坐标
		* @method	pageY
		* @param	{event}		event	(Optional)event对象 默认为调用位置所在宿主的event
		* @param	{element}	element (Optional)任意element对象 element对象所在宿主的event
		* @return	{int}		Y坐标
		*/
		, pageY : function () {
			var e = EventH.getEvent.apply(EventH, arguments)
				, doc = getDoc(e);
			return ('pageY' in e) ? e.pageY : (e.clientY + (doc.documentElement.scrollTop || doc.body.scrollTop) - 2);
		}
		
		/** 
		* 获取鼠标距离触发事件对象顶端X坐标
		* @method	layerX
		* @param	{event}		event	(Optional)event对象 默认为调用位置所在宿主的event
		* @param	{element}	element (Optional)任意element对象 element对象所在宿主的event
		* @return	{int}		X坐标
		, layerX : function () {
			var e = EventH.getEvent.apply(EventH, arguments);
			return ('layerX' in e) ? e.layerX : e.offsetX;
		}
		*/
		
		
		/** 
		* 获取鼠标距离触发事件对象顶端Y坐标
		* @method	layerY
		* @param	{event}		event	(Optional)event对象 默认为调用位置所在宿主的event
		* @param	{element}	element (Optional)任意element对象 element对象所在宿主的event
		* @return	{int}		Y坐标
		, layerY : function () {
			var e = EventH.getEvent.apply(EventH, arguments);
			return ('layerY' in e) ? e.layerY : e.offsetY;
		}
		*/
		
		
		/** 
		* 获取鼠标滚轮方向
		* @method	detail
		* @param	{event}		event	(Optional)event对象 默认为调用位置所在宿主的event
		* @param	{element}	element (Optional)任意element对象 element对象所在宿主的event
		* @return	{int}		大于0向下,小于0向上.
		*/
		, detail : function () {
			var e = EventH.getEvent.apply(EventH, arguments);
			return e.detail || -(e.wheelDelta || 0);
		}
		
		/** 
		* 获取触发事件的按键对应的ascii码
		* @method	keyCode
		* @param	{event}		event	(Optional)event对象 默认为调用位置所在宿主的event
		* @param	{element}	element (Optional)任意element对象 element对象所在宿主的event
		* @return	{int}		键盘ascii
		*/
		, keyCode : function () {
			var e = EventH.getEvent.apply(EventH, arguments);
			return ('keyCode' in e) ? e.keyCode : (e.charCode || e.which || 0);
		}
		
		/** 
		* 阻止事件冒泡
		* @method	stopPropagation
		* @param	{event}		event	(Optional)event对象 默认为调用位置所在宿主的event
		* @param	{element}	element (Optional)任意element对象 element对象所在宿主的event
		* @return	{void}
		*/
		, stopPropagation : function () {
			var e = EventH.getEvent.apply(EventH, arguments);
			if (e.stopPropagation) e.stopPropagation();
			else e.cancelBubble = true;
		}
		
		/** 
		* 阻止事件默认行为
		* @method	preventDefault
		* @param	{event}		event	(Optional)event对象 默认为调用位置所在宿主的event
		* @param	{element}	element (Optional)任意element对象 element对象所在宿主的event
		* @return	{void}
		*/
		, preventDefault : function () {
			var e = EventH.getEvent.apply(EventH, arguments);
			if (e.preventDefault) e.preventDefault();
			else e.returnValue = false;
		}
		
		/** 
		* 获取事件触发时是否持续按住ctrl键
		* @method	ctrlKey
		* @param	{event}		event	(Optional)event对象 默认为调用位置所在宿主的event
		* @param	{element}	element (Optional)任意element对象 element对象所在宿主的event
		* @return	{boolean}	判断结果
		*/
		, ctrlKey : function () {
			var e = EventH.getEvent.apply(EventH, arguments);
			return e.ctrlKey;
		}
		
		/** 
		* 事件触发时是否持续按住shift键
		* @method	shiftKey
		* @param	{event}		event	(Optional)event对象 默认为调用位置所在宿主的event
		* @param	{element}	element (Optional)任意element对象 element对象所在宿主的event
		* @return	{boolean}	判断结果
		*/
		, shiftKey : function () {
			var e = EventH.getEvent.apply(EventH, arguments);
			return e.shiftKey;
		}
		
		/** 
		* 事件触发时是否持续按住alt键
		* @method	altKey
		* @param	{event}		event	(Optional)event对象 默认为调用位置所在宿主的event
		* @param	{element}	element (Optional)任意element对象 element对象所在宿主的event
		* @return	{boolean}	判断结果
		*/
		, altKey : function () {
			var e = EventH.getEvent.apply(EventH, arguments);
			return e.altKey;
		}
		
		/** 
		* 触发事件的元素
		* @method	target
		* @param	{event}		event	(Optional)event对象 默认为调用位置所在宿主的event
		* @param	{element}	element (Optional)任意element对象 element对象所在宿主的event
		* @return	{element}	node 对象
		*/
		, target : function () {
			var e = EventH.getEvent.apply(EventH, arguments), node = e.srcElement || e.target;

			if (!node) return null;
			if (node.nodeType == 3) node = node.parentNode;
			return node;
		}
		
		/** 
		* 获取元素
		* @method	target
		* @param	{event}		event	(Optional)event对象 默认为调用位置所在宿主的event
		* @param	{element}	element (Optional)任意element对象 element对象所在宿主的event
		* @return	{element}	mouseover/mouseout 事件时有效 over时为来源元素,out时为移动到的元素.
		*/
		, relatedTarget : function () {
			var e = EventH.getEvent.apply(EventH, arguments);
			if ('relatedTarget' in e) return e.relatedTarget;
			if (e.type == 'mouseover') return e.fromElement || null;
			if (e.type == 'mouseout') return e.toElement || null;
			return null;
		}

		/** 
		* 获得event对象
		* @method	target
		* @param	{event}		event	(Optional)event对象 默认为调用位置所在宿主的event
		* @param	{element}	element (Optional)任意element对象 element对象所在宿主的event
		* @return	{event}		event对象
		*/
		, getEvent : function (event, element) {
			if (event) {
				return event;
			} else if (element) {
				if (element.document) return element.document.parentWindow.event;
				if (element.parentWindow) return element.parentWindow.event;
			}

			if ('undefined' != typeof Event && arguments.callee.caller) {
				var f = arguments.callee;
				do {
					if (/Event/.test(f.arguments[0])) return f.arguments[0];
				} while (f = f.caller);
				return null;
			} else {
				return window.event || null;
			}
		}
	};

	return EventH;
}();