/*
 *	Copyright (c) 2009, Baidu Inc. All rights reserved.
 *	http://www.youa.com
 *	version: $version$ $release$ released
 *	author: quguangyu@baidu.com
*/

/**
 * @class Animation ������
 * @namespace QW
 * @cfg {HTMLElement} el ��������Ԫ��
 * @cfg {object} attrs ��������
 * @cfg {number} dur ����ʱ��
 * @cfg {function} easing ��������
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
	 * Ĭ�ϵĶ�������
	 * @public
	 * @static
	 */
	Anim.DefaultEasing = function(p, d) {
		return d * p;
	};

	/**
	 * Ĭ�ϵĶ���ʱ��
	 * @public
	 * @static
	 */
	Anim.DefaultDur = 3000;

	/**
	 * Animtion֧�ֵ��Զ����¼��б�
	 * @public
	 * @static
	 */
	Anim.EVENTS = ["beforeplay", "play", "stop", "pause", "resume", "suspend", "reset"];

	Anim.prototype = (function(){
		return {

			/**
			 * ��ʼ��
			 *
			 * @method initialize
			 * @public
			 * @param {element}  el��������Ԫ��
			 * @param {object}   attrs��������
			 * @param {number}   dur����ʱ��
			 * @param {function} easing��������
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
			 * Anim��ص�һЩ����
			 *
			 * @public
			 */
			patterns : {
				noNegatives : /width|height|opacity|padding/i,
				defaultUnit : /width|height|top$|bottom$|left$|right$/i
			},

			/**
			 * ���ݵĳ�ʼ��
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
			 * �õ�css���Ե�Ĭ�ϵ�λ
			 * 
			 * @method getUnits
			 * @public
			 * @param {string}  ������
			 * @return {string} �ߴ絥λ
			 */
			getUnits : function(attr) {
				if (this.patterns.defaultUnit.test(attr)) {
					return "px";
				}
				return "";
			},

			/**
			 * ��ȡCSS����ֵ
			 * 
			 * @method getAttr
			 * @public
			 * @param {string} ������
			 * @return {number} ��ֵ
			 */
			getAttr : function(attr){
				return parseFloat(Dom.getCurrentStyle(this.el, attr));
			},

			/**
			 * ����css����ֵ
			 * 
			 * @method setAttr
			 * @public
			 * @param {string} ������
			 * @param {number} ��ֵ
			 * @param {string} ��λ
			 * @return void
			 */
			setAttr : function(attr, value, units) {
				if(!isNaN(value)) {
					Dom.setStyle(this.el, attr, value + units);
				}
			},

			/**
			 * ����ÿһ֡�Ĵ���
			 * 
			 * @method onTween
			 * @public
			 * @param {number} �������еİٷֱ�
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
			 * �ж϶����Ƿ��ڲ���
			 * 
			 * @method isPlay
			 * @public
			 * @return {bool} �Ƿ񲥷�
			 */
			isPlay : function() {
				return this.effect && this.effect.isPlaying;
			},

			/**
			 * ��ʼ����
			 * 
			 * @method play
			 * @public
			 * @return void
			 */
			play : function() {
				this.effect.play();
			},
			
			/**
			 * ��ͣ����
			 * 
			 * @method pause
			 * @public
			 * @return void
			 */
			pause : function() {
				this.effect.pause();
			},

			/**
			 * ��������
			 * 
			 * @method resume
			 * @public
			 * @return void
			 */
			resume : function() {
				this.effect.resume();
			},

			/**
			 * ֱ�Ӳ��ŵ����
			 * 
			 * @method suspend
			 * @public
			 * @return void
			 */
			suspend : function() {
				this.effect.suspend();
			},

			/**
			 * ֹͣ����
			 * 
			 * @method stop
			 * @public
			 * @return void
			 */
			stop : function() {
				this.effect.stop();
			},

			/**
			 * ���ö���
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
		 * ��ȡelement����ֵ
		 * 
		 * @method getAttr
		 * @public
		 * @param {string} ������
		 * @return {number} ��ֵ
		 */
		getAttr : function(attr) {
			return this.el[attr] | 0;
		},

		/**
		 * ����element����ֵ
		 * 
		 * @method setAttr
		 * @public
		 * @param {string} ������
		 * @param {number} ��ֵ
		 * @return void
		 */
		setAttr : function(attr, value) {
			this.el[attr] = Math.round(value);
		}
	}, true);

	var ColorAnim = extend(function(){}, Anim);

	mix(ColorAnim.prototype, {

		/**
		 * ColorAnim�õ���һЩ����
		 * 
		 * @public
		 */
		patterns : {
			rgb         : /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,
			hex         : /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,
			hex3        : /^#?([0-9A-F]{1})([0-9A-F]{1})([0-9A-F]{1})$/i
		},
				
		/**
		 * ������ɫ
		 * 
		 * @method parseColor
		 * @public
		 * @param {string} ��ɫֵ��֧��������ʽ��#000/#000000/rgb(0,0,0)
		 * @return {array} ����r��g��b������
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
		 * ��ʼ������
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
		 * ��ȡCSS��ɫ
		 * 
		 * @method setAttr
		 * @public
		 * @param {string} ������
		 * @return {string} ��ɫֵ
		 */
		getAttr : function(attr) {
			return Dom.getStyle(this.el, attr);
		},

		/**
		 * ����CSS��ɫ
		 * 
		 * @method setAttr
		 * @public
		 * @param {string} ������
		 * @param {string} ֵ
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
		 * ����ÿһ֡�Ĵ���
		 * 
		 * @method onTween
		 * @public
		 * @param {number} �������еİٷֱ�
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