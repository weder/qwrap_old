QW.NodeC = {
	arrayMethods:'map,forEach,filter,toArray'.split(','),//部分Array的方法也会集成到NodeW里
	wrapMethods : { //在此json里的方法，会返回带包装的结果，如果其值为-1，返回“返回值”的包装结果,否则返回第i个位置的参数的包装结果
		/*
		* @config wrapMethods.$
		* @default -1
		*/
		$ : -1
		, query : -1
		//, outerHTML : 0
		//, getName : 0
		, addEventListener : 0
		, removeEventListener : 0
		, on : 0
		, un : 0
		, delegate : 0
		, undelegate : 0
		, fire : 0
		//, getStyle : 0
		//, getCurrentStyle : 0
		, setStyle : 0
		//, hasClass : 0
		, addClass : 0
		, removeClass : 0
		, replaceClass : 0
		, show : 0
		, hide : 0
		//, isVisible : 0
		//, borderWidth : 0
		//, paddingWidth : 0
		//, marginWidth : 0
		//, getXY : 0
		, setXY : 0
		, setSize : 0
		, setInnerSize : 0
		, setRect : 0
		, setInnerRect : 0
		//, getRect : 0
		, nextSibling : -1
		, previousSibling : -1
		, ancestorNode : -1
		, parentNode : -1
		, firstChild : -1
		, lastChild : -1
		//, contains : 0
		, insertAdjacentHTML : 0
		, insertAdjacentElement : -1
		, appendChild : -1
		, insertBefore : -1
		, insertAfter : -1
		, insertSiblingBefore : -1
		, insertSiblingAfter : -1
		, replaceNode : -1
		, replaceChild : -1
		, removeNode : -1
		//, get : 0
		, set : 0
		//, getAttr : 0
		, setAttr : 0
		, toggle : 0
		, toggleClass : 0
		, forEach:0
		, filter:-1
		//, isFormChanged :
		//, encodeURIForm :
		//, getValue:
		, setValue:0
		//, getHtml:
		, setHtml:0
		//, getSize :
		, submit : 0
		, click : 0
		, focus : 0
		, blur : 0
		, removeAttr : 0
		, cloneNode : -1
	},
	gsetterMethods : { //在此json里的方法，会是一个getter与setter的混合体
		val :['getValue','setValue'],
		html : ['getHtml','setHtml'],
		attr :['','getAttr','setAttr'],
		css :['','getCurrentStyle','setStyle'],
		size : ['getSize', 'setSize'],
		xy : ['getXY', 'setXY']
	}
};