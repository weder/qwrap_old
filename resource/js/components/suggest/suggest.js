(function() {
	var els=document.getElementsByTagName('script'), srcPath = '';
	for (var i = 0; i < els.length; i++) {
		var src = els[i].src.split(/components[\\\/]/g);
		if (src[1]) {
			srcPath = src[0];
			break;
		}
	}

	document.write(
		  '<script type="text/javascript" src="'+srcPath+'components/suggest/suggest.control.js"></script>'
		, '<script type="text/javascript" src="'+srcPath+'components/suggest/suggest.cache.js"></script>'
		, '<script type="text/javascript" src="'+srcPath+'components/suggest/suggest.data.js"></script>'
		, '<script type="text/javascript" src="'+srcPath+'components/suggest/suggest.ui.js"></script>'
		, '<script type="text/javascript" src="'+srcPath+'components/suggest/suggest.ui.listview.js"></script>'
	);
})();