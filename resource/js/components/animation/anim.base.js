/*
 *	Copyright (c) 2009, Baidu Inc. All rights reserved.
 *	http://www.youa.com
 *	version: $version$ $release$ released
 *	author: quguangyu@baidu.com
*/

/**
 * @class Animation 动画类
 * @namespace QW
 * @cfg {HTMLElement} el 动画作用元素
 * @cfg {object} attrs 动画配置
 * @cfg {number} dur 动画时长
 * @cfg {function} easing 动画算子
 */

(function() {
	var Dom = QW.Dom,
		mix = QW.ObjectH.mix,
		extend = QW.ClassH.extend,
		CustEvent = QW.CustEvent;
		$ = Dom.$;

	var Anim = function(){
		this.initialize.apply(this, arguments);
	};

	/**
	 * 默认的动画算子
	 * @public
	 * @static
	 */
	Anim.DefaultEasing = function(p, d) {
		return d * p;
	};

	/**
	 * 默认的动画时长
	 * @public
	 * @static
	 */
	Anim.DefaultDur = 3000;

	/**
	 * Animtion支持的自定义事件列表
	 * @public
	 * @static
	 */
	Anim.EVENTS = ["beforeplay", "play", "stop", "pause", "resume", "suspend", "reset"];

	Anim.prototype = (function(){
		return {

			/**
			 * 初始化
			 *
			 * @method initialize
			 * @public
			 * @param {element}  el动画作用元素
			 * @param {object}   attrs动画配置
			 * @param {number}   dur动画时长
			 * @param {function} easing动画算子
			 * @return void
			 */
			initialize : function(el, attrs, dur, easing) {
				if(!Dom.isElement($(el))) throw new Error(['Animation','Initialize Error','Element Not Found!']);
				this.el = $(el);
				this.attrs = attrs;
				this.dur = dur || Anim.DefaultDur;
				this.easing = typeof easing == "function" ? easing : Anim.DefaultEasing;
				CustEvent.createEvents(this, Anim.EVENTS);
				if(!this.effect) {
					var me = this;
					this.effect = new QW.Effect(function(per){
						me.onTween(per);	
					}, this.dur);
					Anim.EVENTS.forEach(function(evt) {
						me.effect.on(evt,function() {
							me.fire(evt);
						});
					});
				}
				this.initData();
			},

			/**
			 * Anim相关的一些正则
			 *
			 * @public
			 */
			patterns : {
				noNegatives : /width|height|opacity|padding/i,
				defaultUnit : /width|height|top$|bottom$|left$|right$/i
			},

			/**
			 * 数据的初始化
			 * 
			 * @method initDate
			 * @public
			 * @return void
			 */
			initData : function(){
				for(var attr in this.attrs) {
					var opts = this.attrs[attr];
					if(typeof opts.from == "undefined") {
						opts.finish = opts.start = this.getAttr(attr);
					}else{
						opts.finish = opts.start = opts.from;
					}
					if(typeof opts.to != "undefined") {
						opts.finish = opts.to;
					}
					if(typeof opts.by != "undefined") {
						opts.finish = opts.start + opts.by;
					}
					opts.dis = opts.finish - opts.start;

					if(typeof opts.units == "undefined") {
						opts.units = this.getUnits(attr);
					}

					if(typeof opts.easing == "undefined") {
						opts.easing = this.easing;
					}
				}
			},

			/**
			 * 得到css属性的默认单位
			 * 
			 * @method getUnits
			 * @public
			 * @param {string}  属性名
			 * @return {string} 尺寸单位
			 */
			getUnits : function(attr) {
				if (this.patterns.defaultUnit.test(attr)) {
					return "px";
				}
				return "";
			},

			/**
			 * 获取CSS属性值
			 * 
			 * @method getAttr
			 * @public
			 * @param {string} 属性名
			 * @return {number} 数值
			 */
			getAttr : function(attr){
				return parseFloat(Dom.getCurrentStyle(this.el, attr));
			},

			/**
			 * 设置css属性值
			 * 
			 * @method setAttr
			 * @public
			 * @param {string} 属性名
			 * @param {number} 数值
			 * @param {string} 单位
			 * @return void
			 */
			setAttr : function(attr, value, units) {
				if(!isNaN(value)) {
					Dom.setStyle(this.el, attr, value + units);
				}
			},

			/**
			 * 动画每一帧的处理
			 * 
			 * @method onTween
			 * @public
			 * @param {number} 动画运行的百分比
			 * @return void
			 */
			onTween : function(per) {
				for(var attr in this.attrs) {
					var opts = this.attrs[attr];

					if(typeof opts.begin != "undefined" && per < 0.1) {
						this.setAttr(attr, opts.begin, opts.units);
					}

					var value  = opts.start + opts.easing(per, opts.dis);

					if (value < 0 && this.patterns.noNegatives.test(attr)) {
						value = 0;
					}
					
					this.setAttr(attr, value, opts.units);

					if(typeof opts.end != "undefined" && per == 1) {
						this.setAttr(attr, opts.end, opts.units);
					}
				}
			},

			/**
			 * 判断动画是否在播放
			 * 
			 * @method isPlay
			 * @public
			 * @return {bool} 是否播放
			 */
			isPlay : function() {
				return this.effect && this.effect.isPlaying;
			},

			/**
			 * 开始播放
			 * 
			 * @method play
			 * @public
			 * @return void
			 */
			play : function() {
				this.effect.play();
			},
			
			/**
			 * 暂停播放
			 * 
			 * @method pause
			 * @public
			 * @return void
			 */
			pause : function() {
				this.effect.pause();
			},

			/**
			 * 继续播放
			 * 
			 * @method resume
			 * @public
			 * @return void
			 */
			resume : function() {
				this.effect.resume();
			},

			/**
			 * 直接播放到最后
			 * 
			 * @method suspend
			 * @public
			 * @return void
			 */
			suspend : function() {
				this.effect.suspend();
			},

			/**
			 * 停止播放
			 * 
			 * @method stop
			 * @public
			 * @return void
			 */
			stop : function() {
				this.effect.stop();
			},

			/**
			 * 重置动画
			 * 
			 * @method reset
			 * @public
			 * @return void
			 */
			reset : function() {
				this.effect.reset();
			}
		};
	})();

	var ScrollAnim = extend(function(){}, Anim);

	mix(ScrollAnim.prototype, {
		/**
		 * 获取element属性值
		 * 
		 * @method getAttr
		 * @public
		 * @param {string} 属性名
		 * @return {number} 数值
		 */
		getAttr : function(attr) {
			return this.el[attr] | 0;
		},

		/**
		 * 设置element属性值
		 * 
		 * @method setAttr
		 * @public
		 * @param {string} 属性名
		 * @param {number} 数值
		 * @return void
		 */
		setAttr : function(attr, value) {
			this.el[attr] = Math.round(value);
		}
	}, true);

	var ColorAnim = extend(function(){}, Anim);

	mix(ColorAnim.prototype, {

		/**
		 * ColorAnim用到的一些正则
		 * 
		 * @public
		 */
		patterns : {
			rgb         : /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,
			hex         : /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,
			hex3        : /^#?([0-9A-F]{1})([0-9A-F]{1})([0-9A-F]{1})$/i
		},
				
		/**
		 * 处理颜色
		 * 
		 * @method parseColor
		 * @public
		 * @param {string} 颜色值，支持三种形式：#000/#000000/rgb(0,0,0)
		 * @return {array} 包含r、g、b的数组
		 */
		parseColor : function(s){
			if (s.length == 3) { return s; }
		
			var c = this.patterns.hex.exec(s);
			if (c && c.length == 4) {
				return [ parseInt(c[1], 16), parseInt(c[2], 16), parseInt(c[3], 16) ];
			}
		
			c = this.patterns.rgb.exec(s);
			if (c && c.length == 4) {
				return [ parseInt(c[1], 10), parseInt(c[2], 10), parseInt(c[3], 10) ];
			}
		
			c = this.patterns.hex3.exec(s);
			if (c && c.length == 4) {
				return [ parseInt(c[1] + c[1], 16), parseInt(c[2] + c[2], 16), parseInt(c[3] + c[3], 16) ];
			}
			
			return [0, 0, 0];
		},
			
		/**
		 * 初始化数据
		 * 
		 * @method initData
		 * @public
		 * @return void
		 */
		initData : function(){
			for(var attr in this.attrs) {
				var opts = this.attrs[attr];
				if(typeof opts.from == "undefined") {
					opts.finish = opts.start = this.parseColor(this.getAttr(attr));
				}else{
					opts.finish = opts.start = this.parseColor(opts.from);
				}
				if(typeof opts.to != "undefined") {
					opts.finish = this.parseColor(opts.to);
				}
				if(typeof opts.easing == "undefined") {
					opts.easing = this.easing;
				}

				opts.dis = [];
				opts.finish.forEach(function(d,i){
					opts.dis.push(d - opts.start[i]);
				});
			}
		},

		/**
		 * 获取CSS颜色
		 * 
		 * @method setAttr
		 * @public
		 * @param {string} 属性名
		 * @return {string} 颜色值
		 */
		getAttr : function(attr) {
			return Dom.getStyle(this.el, attr);
		},

		/**
		 * 设置CSS颜色
		 * 
		 * @method setAttr
		 * @public
		 * @param {string} 属性名
		 * @param {string} 值
		 * @return void
		 */
		setAttr : function(attr, values) {
			if(typeof values == "string") {
				Dom.setStyle(this.el, attr, values);
			} else {
				Dom.setStyle(this.el, attr, "rgb("+values.join(",")+")");
			}
		},

		/**
		 * 动画每一帧的处理
		 * 
		 * @method onTween
		 * @public
		 * @param {number} 动画运行的百分比
		 * @return void
		 */
		onTween : function(per) {
			for(var attr in this.attrs) {
				var opts = this.attrs[attr];
				var values = [];
				var me = this;
				opts.start.forEach(function(s,i){
					var value = s + opts.easing(per, opts.dis[i]);
					values.push(Math.max(Math.floor(value),0));
				});
				
				this.setAttr(attr, values);

				if(typeof opts.end != "undefined" && per == 1) {
					this.setAttr(attr, opts.end);
				}
			}
		}
	}, true);

	QW.provide({
		Anim		: Anim,
		ScrollAnim	: ScrollAnim,
		ColorAnim	: ColorAnim
	});
})();