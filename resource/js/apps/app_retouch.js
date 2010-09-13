/*
* 将直属于QW的方法与命名空间上提一层到window
*/
void function () {
	var F = function (e, handler) {
		var element = this, ban = element.getAttribute('data--ban');

		if (ban && !isNaN(ban)) {
			if (element.__BAN_TIMER) {
				QW.EventH.preventDefault(e);
				return;
			}

			element.__BAN_TIMER = setTimeout(function () { element.__BAN_TIMER = 0; }, ban);
		}

		handler.call(element, e);
	};
	QW.EventTargetH.typedef('click', 'click', F);
	QW.EventTargetH.typedef('dblclick', 'dblclick', F);
	QW.EventTargetH.typedef('submit', 'submit', F);
}();

QW.W=QW.NodeW;
QW.ObjectH.mix(window,QW);
QW.provideDomains=[QW,window];