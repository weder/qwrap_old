(function () {

	var TabViewScroll = function () {
		this.constructor = arguments.callee;

		this.container = null;
		this.scroll = null;
		this.top = null;
		this.right = null;
		this.bottom = null;
		this.left = null;

		this.CLASS_SCROLL = 'scroll';
		this.CLASS_SCROLLED = 'scrolled';

		this.preventDefault = true;

		//this.events = { scroll : 'scroll' };

		this.step = 10;
		this.timer = 50;
		this.startTimer = 100;
		this._timer = 0;

		this.Direction = {
			TOP			: function (e, s, m) { e.scrollTop = m ? e.scrollTop - s : s; }
			, RIGHT		: function (e, s, m) { e.scrollLeft = m ? e.scrollLeft + s : s; }
			, BOTTOM	: function (e, s, m) { e.scrollTop = m ? e.scrollTop + s : s; }
			, LEFT		: function (e, s, m) { e.scrollLeft = m ? e.scrollLeft - s : s; }
		};

		this._initialize.apply(this, arguments);
	};

	TabViewScroll.prototype = function () {

		var D = QW.Dom, O = QW.ObjectH;//, E = QW.CustEvent;

		return {
			_initialize : function (options) {
				O.mix(this, options || {}, true);
				this._bind();
				this.refresh();
			}

			, to : function (direction, step) {
				this.Direction[direction.toUpperCase()](this.scroll, step);
				this.refresh();
			}

			, move : function (direction, step) {
				this.Direction[direction.toUpperCase()](this.scroll, step, true);
				this.refresh();
			}

			, refresh : function () {
				if (this.container.offsetHeight > this.scroll.offsetHeight) {
					if (this.top) {
						if (this.scroll.scrollTop == 0) {
							D.replaceClass(this.top, this.CLASS_SCROLL, this.CLASS_SCROLLED);
						} else {
							D.replaceClass(this.top, this.CLASS_SCROLLED, this.CLASS_SCROLL);
						}
					}
					
					if (this.bottom) {
						if (this.scroll.scrollTop + this.scroll.offsetHeight == this.scroll.scrollHeight) {
							D.replaceClass(this.bottom, this.CLASS_SCROLL, this.CLASS_SCROLLED);
						} else {
							D.replaceClass(this.bottom, this.CLASS_SCROLLED, this.CLASS_SCROLL);
						}
					}
				}

				if (this.container.offsetWidth > this.scroll.offsetWidth) {
					if (this.left) {
						if (this.scroll.scrollLeft == 0) {
							D.replaceClass(this.left, this.CLASS_SCROLL, this.CLASS_SCROLLED);
						} else {
							D.replaceClass(this.left, this.CLASS_SCROLLED, this.CLASS_SCROLL);
						}
					}
					if (this.right) {
						if (this.scroll.scrollLeft + this.scroll.offsetWidth == this.scroll.scrollWidth) {
							D.replaceClass(this.right, this.CLASS_SCROLL, this.CLASS_SCROLLED);
						} else {
							D.replaceClass(this.right, this.CLASS_SCROLLED, this.CLASS_SCROLL);
						}
					}
				}
			}

			, _bind : function () {
				var _self = this;

				if (this.container.offsetWidth > this.scroll.offsetWidth) {
					if (this.left) {
						if (this.preventDefault) D.on(this.left, 'click', function (e) { e.preventDefault() });
						D.on(this.left, 'mousedown', function (e) { _self._down('left'); });
						D.on(this.left, 'mouseup', function (e) { _self._stop() });
					}
					if (this.right) {
						if (this.preventDefault) D.on(this.right, 'click', function (e) { e.preventDefault() });
						D.on(this.right, 'mousedown', function (e) { _self._down('right'); });
						D.on(this.right, 'mouseup', function (e) { _self._stop() });
					}
				}
				if (this.container.offsetHeight > this.scroll.offsetHeight) {
					if (this.top) {
						if (this.preventDefault) D.on(this.top, 'click', function (e) { e.preventDefault() });
						D.on(this.top, 'mousedown', function (e) { _self._down('top'); });
						D.on(this.top, 'mouseup', function (e) { _self._stop() });
					}
					if (this.bottom) {
						if (this.preventDefault) D.on(this.bottom, 'click', function (e) { e.preventDefault() });
						D.on(this.bottom, 'mousedown', function (e) { _self._down('bottom'); });
						D.on(this.bottom, 'mouseup', function (e) { _self._stop() });
					}
				}
			}

			, _down : function (direction) {
				this.move(direction, this.step);
				this._start(direction);
			}

			, _start : function (direction) {
				var _self = this;
				if (this._timer) clearInterval(this._timer);
				this._timer = setTimeout(function () {
					_self._timer = setInterval(function () { _self.move(direction, _self.step); }, _self.timer);
				}, this.startTimer);
			}

			, _stop : function () {
				if (!this._timer) return;
				clearInterval(this._timer);
				this._timer = 0;
			}

		};

	}();

	QW.provide('TabViewScroll', TabViewScroll);
//onscroll事件
//在封装个新的滚动类
})();