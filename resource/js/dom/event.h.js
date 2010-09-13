/** 
* @class EventH Event Helper������һЩEvent�����������
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
		* ��ȡ���λ������ҳ���X����
		* @method	pageX
		* @param	{event}		event	(Optional)event���� Ĭ��Ϊ����λ������������event
		* @param	{element}	element (Optional)����element���� element��������������event
		* @return	{int}		X����
		*/
		pageX : function () {
			var e = EventH.getEvent.apply(EventH, arguments)
				, doc = getDoc(e);
			return ('pageX' in e) ? e.pageX : (e.clientX + (doc.documentElement.scrollLeft || doc.body.scrollLeft) - 2);
		}

		/** 
		* ��ȡ���λ������ҳ���Y����
		* @method	pageY
		* @param	{event}		event	(Optional)event���� Ĭ��Ϊ����λ������������event
		* @param	{element}	element (Optional)����element���� element��������������event
		* @return	{int}		Y����
		*/
		, pageY : function () {
			var e = EventH.getEvent.apply(EventH, arguments)
				, doc = getDoc(e);
			return ('pageY' in e) ? e.pageY : (e.clientY + (doc.documentElement.scrollTop || doc.body.scrollTop) - 2);
		}
		
		/** 
		* ��ȡ�����봥���¼����󶥶�X����
		* @method	layerX
		* @param	{event}		event	(Optional)event���� Ĭ��Ϊ����λ������������event
		* @param	{element}	element (Optional)����element���� element��������������event
		* @return	{int}		X����
		, layerX : function () {
			var e = EventH.getEvent.apply(EventH, arguments);
			return ('layerX' in e) ? e.layerX : e.offsetX;
		}
		*/
		
		
		/** 
		* ��ȡ�����봥���¼����󶥶�Y����
		* @method	layerY
		* @param	{event}		event	(Optional)event���� Ĭ��Ϊ����λ������������event
		* @param	{element}	element (Optional)����element���� element��������������event
		* @return	{int}		Y����
		, layerY : function () {
			var e = EventH.getEvent.apply(EventH, arguments);
			return ('layerY' in e) ? e.layerY : e.offsetY;
		}
		*/
		
		
		/** 
		* ��ȡ�����ַ���
		* @method	detail
		* @param	{event}		event	(Optional)event���� Ĭ��Ϊ����λ������������event
		* @param	{element}	element (Optional)����element���� element��������������event
		* @return	{int}		����0����,С��0����.
		*/
		, detail : function () {
			var e = EventH.getEvent.apply(EventH, arguments);
			return e.detail || -(e.wheelDelta || 0);
		}
		
		/** 
		* ��ȡ�����¼��İ�����Ӧ��ascii��
		* @method	keyCode
		* @param	{event}		event	(Optional)event���� Ĭ��Ϊ����λ������������event
		* @param	{element}	element (Optional)����element���� element��������������event
		* @return	{int}		����ascii
		*/
		, keyCode : function () {
			var e = EventH.getEvent.apply(EventH, arguments);
			return ('keyCode' in e) ? e.keyCode : (e.charCode || e.which || 0);
		}
		
		/** 
		* ��ֹ�¼�ð��
		* @method	stopPropagation
		* @param	{event}		event	(Optional)event���� Ĭ��Ϊ����λ������������event
		* @param	{element}	element (Optional)����element���� element��������������event
		* @return	{void}
		*/
		, stopPropagation : function () {
			var e = EventH.getEvent.apply(EventH, arguments);
			if (e.stopPropagation) e.stopPropagation();
			else e.cancelBubble = true;
		}
		
		/** 
		* ��ֹ�¼�Ĭ����Ϊ
		* @method	preventDefault
		* @param	{event}		event	(Optional)event���� Ĭ��Ϊ����λ������������event
		* @param	{element}	element (Optional)����element���� element��������������event
		* @return	{void}
		*/
		, preventDefault : function () {
			var e = EventH.getEvent.apply(EventH, arguments);
			if (e.preventDefault) e.preventDefault();
			else e.returnValue = false;
		}
		
		/** 
		* ��ȡ�¼�����ʱ�Ƿ������סctrl��
		* @method	ctrlKey
		* @param	{event}		event	(Optional)event���� Ĭ��Ϊ����λ������������event
		* @param	{element}	element (Optional)����element���� element��������������event
		* @return	{boolean}	�жϽ��
		*/
		, ctrlKey : function () {
			var e = EventH.getEvent.apply(EventH, arguments);
			return e.ctrlKey;
		}
		
		/** 
		* �¼�����ʱ�Ƿ������סshift��
		* @method	shiftKey
		* @param	{event}		event	(Optional)event���� Ĭ��Ϊ����λ������������event
		* @param	{element}	element (Optional)����element���� element��������������event
		* @return	{boolean}	�жϽ��
		*/
		, shiftKey : function () {
			var e = EventH.getEvent.apply(EventH, arguments);
			return e.shiftKey;
		}
		
		/** 
		* �¼�����ʱ�Ƿ������סalt��
		* @method	altKey
		* @param	{event}		event	(Optional)event���� Ĭ��Ϊ����λ������������event
		* @param	{element}	element (Optional)����element���� element��������������event
		* @return	{boolean}	�жϽ��
		*/
		, altKey : function () {
			var e = EventH.getEvent.apply(EventH, arguments);
			return e.altKey;
		}
		
		/** 
		* �����¼���Ԫ��
		* @method	target
		* @param	{event}		event	(Optional)event���� Ĭ��Ϊ����λ������������event
		* @param	{element}	element (Optional)����element���� element��������������event
		* @return	{element}	node ����
		*/
		, target : function () {
			var e = EventH.getEvent.apply(EventH, arguments), node = e.srcElement || e.target;

			if (!node) return null;
			if (node.nodeType == 3) node = node.parentNode;
			return node;
		}
		
		/** 
		* ��ȡԪ��
		* @method	target
		* @param	{event}		event	(Optional)event���� Ĭ��Ϊ����λ������������event
		* @param	{element}	element (Optional)����element���� element��������������event
		* @return	{element}	mouseover/mouseout �¼�ʱ��Ч overʱΪ��ԴԪ��,outʱΪ�ƶ�����Ԫ��.
		*/
		, relatedTarget : function () {
			var e = EventH.getEvent.apply(EventH, arguments);
			if ('relatedTarget' in e) return e.relatedTarget;
			if (e.type == 'mouseover') return e.fromElement || null;
			if (e.type == 'mouseout') return e.toElement || null;
			return null;
		}

		/** 
		* ���event����
		* @method	target
		* @param	{event}		event	(Optional)event���� Ĭ��Ϊ����λ������������event
		* @param	{element}	element (Optional)����element���� element��������������event
		* @return	{event}		event����
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