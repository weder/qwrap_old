
(function(){

describe('Browser', {
	'Browser Members': function() {
		value_of(QW.Browser).log();
	},
	'detect': function(){
		if(QW.Browser.detect){
			var e = QW.Browser.detect(
				{
					"@ie*": function(){
						return "ie";
					},
					"@firefox": function(){
						return "firefox";
					}
				}
			);
			value_of(e()).log();
		}else{
			value_of("detect not enabled").log();
		}
	}
});

})();