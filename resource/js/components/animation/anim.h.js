(function() {
	var QW = window.QW, 
		mix = QW.ObjectH.mix, 
		HH = QW.HelperH, 
		DOM = QW.Dom,
		NodeW = QW.NodeW,
		applyTo = HH.applyTo, 
		methodizeTo = HH.methodizeTo;

	var AnimH = (function(){
		var newAnim = function(el, opt, callback, dur, type) {
			var Anim = QW.Anim;
			switch(type) {
				case "color" :
					Anim = QW.ColorAnim;
					break;
				case "scroll" :
					Anim = QW.ScrollAnim;
					break;
			}
			var anim = new Anim(el, opt, dur||800);
			if(callback) {
				anim.on("suspend", function() {
					callback();
				});
			}
			anim.play();
			return anim;
		};

		return {
			fadeIn : function(el, dur, callback) {
				return newAnim(el, {
					"opacity" : {
						to    : 1
					},
					"display" : {
						begin : 'block'
					}
				}, callback, dur);
			},
			fadeOut : function(el, dur, callback) {
				return newAnim(el, {
					"opacity" : {
						to    : 0
					},
					"display" : {
						end	  : 'none'
					}
				}, callback, dur);
			},
			slideUp : function(el, dur, callback) {
				return newAnim(el, {
					"height" : {
						to  : 0
					}
				}, callback, dur);
			},
			slideDown : function(el, dur, callback) {
				el = QW.$$(el);
				el.setStyle("height","");
				var height = parseInt(el.getCurrentStyle("height"));
				el.setStyle("height","0");
				return newAnim(el, {
					"height" : {
						from : 0,
						to : height
					}
				}, callback, dur);
			},
			shine4Error : function(el, dur, callback) {
				return newAnim(el, {
					"backgroundColor" : {
						from : "#f33",
						to	 : "#fff",
						end	 : ""
					}
				}, callback, dur, "color");
			}
		};
	})();


	AnimH = HH.mul(AnimH);
	mix(DOM, AnimH);
	AnimH = HH.rwrap(AnimH, NodeW, 0);
	applyTo(AnimH, NodeW);
	methodizeTo(AnimH, NodeW.prototype, 'core');
})();