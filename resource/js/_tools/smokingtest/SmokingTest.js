var SmokingTest=(function(){
var SmokingTest={};
var TestU=(function(){
var TestU={};
TestU.analyseStr =function (sKeys){
	/*
	��һ���ַ�������js�����У�������������
	@param {String} sKeys ������ 
	@param {boolean} asObj ���Ϊtrue����sKeys����һ������������ 
	@returns {Json} ���ط���������������������
		{String} sKeys ��sKeys
		{String} sNameSpace sKeys����߲���
		{String} lastKey sKeys�����һ��key 
		{Object} value ������ֵ
		{boolean} hasChildren �Ƿ���children
		{String} type �������ͣ�������null/undefined/number/string/boolean/object/function�������һ��error
		{String} sConstructor ���캯����null/undefined/number/string/boolean
				/Object/Array/String/Number...
				/Element/Event
		{String} summary ��Ҫ��Ϣ 
				����Array������ǰ���������sConstructor,�Լ��ܳ���
				����Object������ǰ���������key,sConstructor,�Լ��ܳ���
				����Element������tagName#id.className,
				��������������toString��ǰ50���ַ�(����û�лس�)
	*/
	try{
		var sNameSpace="",lastKey="";
		/(([.\[])?[^.\[]+[\]]*$)/.test(sKeys);
		lastKey=RegExp.$1;
		sNameSpace=sKeys.substr(0,sKeys.length-lastKey.length);
		lastKey=lastKey.replace(/^['".\[]+|['"\]]+$/g,"");
		var value=(new Function("return "+sKeys))();
		var info=TestU.analyse(value);
		info.sKeys=sKeys;
		info.sNameSpace=sNameSpace;
		info.lastKey=lastKey;
		return info;
	}
	catch(ex){
		return {
			sKeys:sKeys,
			sNameSpace:sNameSpace,
			lastKey:lastKey,
			value:"AnalyseError "+ex,
			hasChildren:false,
			type:"error",
			sConstructor:"AnalyseError",
			summary:("AnalyseError "+ex).substr(0,50)
		};
	}
};

TestU.analyse =function (value){
	/*
	����һ������
	@param {String} value ������ 
	@returns {Json} ���ط���������������������
		{Object} value ������ֵ
		{boolean} hasChildren �Ƿ���children
		{String} type �������ͣ�������null/undefined/number/string/boolean/object/function�������һ��error
		{String} sConstructor ���캯����null/undefined/number/string/boolean
				/Object/Array/String/Number...
				/Element/Event
		{String} summary ��Ҫ��Ϣ 
				����Array������ǰ���������sConstructor,�Լ��ܳ���
				����Object������ǰ���������key,sConstructor,�Լ��ܳ���
				����Element������tagName#id.className,
				��������������toString��ǰ50���ַ�(����û�лس�)
	*/
	try{
		var hasChildren=false,type,sConstructor="�����ڲ�����",summary;
		if(value===null) type="null";//ECMS�typeof null����object��
		else type=typeof value;
		switch(type){
			case "null":
			case "undefined":
			case "number":
			case "string":
			case "boolean":
				sConstructor=type;
				summary=(value+"").substr(0,50).replace(/\s+/g," ");
				break;
			case "function":
			case "object":
				//�õ�sConstructor
				var constructor=value.constructor;
				var nodeType=value.nodeType+"";
				if(!constructor){//���磬window.external����û��counstructor����
					if(!sConstructor) sConstructor='Unknown Constructor';
				}
				else{
					sConstructor=trim((constructor+"").split("(")[0].replace("function",""));
				}
				
				//�õ�summary
				if(nodeType=="1"){//HTML Element
					summary=value.tagName+(value.id?"#"+value.id:"")+(value.className?"."+value.className:"");
				}
				else if(trim(""+value.item).substr(0,8)=="function" //typeof(document.all.item)��IE�µĽ��Ϊobject��������function
					 && value.length!==undefined)//Collection
				{
					summary="[]"+(value.length||0);
					sConstructor="Collection";
				}
				else if(sConstructor=="Array"){//Array
					summary="[]"+value.length;
				}
				else if(constructor==Object){//Json����
					var count=0;
					for(var i in value) count++;
					summary="{}"+count;
				}
				else if(type=="function"){//����
					var reg=/\/\*\*[\s\*]*([^\n]*)/g;
					if(reg.test(value+"")) summary=RegExp.$1;
					else summary=trim((value+"").split("{")[0]);
				}
				else{
					summary= (value+"").substr(0,50).replace(/\s+/g," ");
				}
				break;
		}
		if("object".indexOf(type)>-1) {
			for(var i in value){
				hasChildren=true;break;
			}
		}
		if("function"==type ) {
			var pro=value.prototype;
			for(var i in pro){
				if(pro.hasOwnProperty(i)){
					hasChildren=true;
					break;
				}
			}
			for(var i in value){
				if(i != "prototype") {
					hasChildren=true;break;
				}
			}
		}
		return {
			value:value,
			hasChildren:hasChildren,
			type:type,
			sConstructor:sConstructor,
			summary:summary
		};
	}
	catch(ex){
		return {
			value:"AnalyseError "+ex,
			hasChildren:false,
			type:"error",
			sConstructor:"AnalyseError",
			summary:("AnalyseError "+ex).substr(0,50)
		};

	}
};

TestU.stringify = function (val){
	/*
	* ���ض�val��������
	* @param {any} val �������� 
	* @returns {string} ���ط������
	*/
	var info=TestU.analyse(val);
	switch(info.type){
		case "null":
		case "undefined":
		case "number":
		case "boolean":
			return val+"";
		case "string":
			return encode4Html('"'+val+'"');
	}
	var s=[];
	s.push('<div class="ST_M_sumary">'+(info.sConstructor || info.type) +': ' + encode4Html(info.summary)+'</div>');
	s.push('<div class="ST_M_value">'+encode4Html(info.value)+'</div>');
	if(info.hasChildren){
		s.push('<div class="ST_M_list"><ul>');
		var value =info.value;
		var num=0;
		for(var i in value){
			if(num++>300) {s.push('<li class="ST_M_more">...</li>');break;}
			try{
				var infoI=TestU.analyse(value[i]);//��ʱvalue[i]���״�����firefox�µ�window.sessionStorage������Ҫtryһ�¡�
				s.push('<li class="ST_M_subnode-ctn ST_M_subt-'+infoI.type+'"><a href="#" class="ST_M_lastkey">'+i+'</a><span class="ST_M_sConstructor">'+(infoI.sConsturctor || infoI.type)+'</span><span class="ST_M_summary">'+encode4Html(infoI.summary)+'</span></li>');
			}
			catch(ex){
				s.push('<li class="ST_M_subnode-ctn ST_M_subt-exception"><a href="#" class="ST_M_lastkey">'+i+'</a><span class="ST_M_sConstructor">�޷�����</span><span class="ST_M_summary">'+ encode4Html(ex+'')+'</span></li>');
			}
		}
		s.push('</ul></div>');
	}
	return s.join("");
};
return TestU;
})();
var analyseStr=TestU.analyseStr,
	analyse=TestU.analyse,
	stringify=TestU.stringify;

var varEl,jscodeEl,msgEl,tree,inited=false; //�ֱ��ǣ���ǰ����Ԫ�أ�js�����MSG�򣯹۲�����


SmokingTest.init =function (ctn, varsArr, codeStr){
	/**
	* ��ʼ��
	* @namespace SmokingTest
	* @method init ��ʼ��SmokingTest
	* @param {Element} ctn ��SmokingTestģ����ⲿ����
	* @param {Array} ��Ҫ�۲�Ķ���
	*/
	if(!inited){
		//����HTML�ṹ
		var html=[
			'<table class="ST_outer_tbl"%><tr><td id="ST_tree-ctn-outer"><div></div></td><td>',
			'<ul><li>',
				'��ǰ�쿴�Ķ���:<input id="ST_var" ><button>�쿴</button><button>����۲���</button><br/>',
				'<div id="ST_msg"></div>',
			'</li><li>',
				'���д���:<button>��������textarea��Ĵ���</button><br/>',
				'<textarea id="ST_jscode" wrap=off></textarea>',
			'</li></ul>',
			'</td></tr></table>'
			].join('');
		ctn.innerHTML=html;
		
		//Ϊ����Ԫ������¼�
		varEl=$("ST_var");
		jscodeEl=$("ST_jscode");
		msgEl=$("ST_msg");
		var btns=ctn.getElementsByTagName("button");
		btns[0].onclick=function(){var s=trim(varEl.value);s && SmokingTest.dump(s);};
		btns[1].onclick=function(){var s=trim(varEl.value);s && SmokingTest.addTreeItem(s);};
		btns[2].onclick=function(){var s=trim(jscodeEl.value);s && new Function(s)();};

		//����tree
		tree=new Tree({treeCtn:ctn.getElementsByTagName("div")[0]});
		inited=true;
	}
	varsArr=varsArr||[];
	for(var i=0;i<varsArr.length;i++){
		this.addTreeItem(varsArr[i]);
	}
	jscodeEl.value=codeStr||'SmokingTest.dump([0,1,2,3])';
};

SmokingTest.dump=function(o){
	/**
	* printĳ������
	* @namespace SmokingTest
	* @method dump 
	* @param {Object} o ����������
	*/
	if(typeof o=="string") {
		var info=analyseStr(o);
		varEl.defaultValue=varEl.value=o;
	}
	else{
		info=analyse(o);
		varEl.value="";
	}

	msgEl.innerHTML=stringify(info.value);
};

SmokingTest.addTreeItem=function(sKeys){
	/**
	* ��ĳ�������ӵ��۲�����
	* @namespace SmokingTest
	* @method addTreeItem 
	* @param {String} sKeys ������
	*/
	tree.addItem(sKeys);
};

//һЩ�ڲ�����
function trim(s){
	return s.replace(/^[\s\xa0\u3000]+|[\u3000\xa0\s]+$/g, "");
}
function encode4Html(s){
	s=s+'';
	var rplsors=[[/&/g,"&amp;"],
		[/ /g,"&nbsp;"],
		[/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;"],
		[/</g,"&lt;"],
		[/>/g,"&rt;"],
		[/"/g,"&quot;"],
		[/'/g,"&#039;"],
		[/\n/g,"<br/>"]
	];
	for(var i=0,rplsor;rplsor=rplsors[i++];)
		s=s.replace(rplsor[0],rplsor[1]);
	return s;
};
function $(id) {
	return document.getElementById(id);
};
function target(e) {
	e=e||window.event;
	return e.target || e.srcElement;
};
function ancestorNode(el,tagName) {
	while (el && (el = el.parentNode)) {
		if (el.tagName==tagName) return el;
    }
	return null;
};
function hasClass(el, cn) {
	return new RegExp("(?:^|\\s)" +cn+ "(?:\\s|$)",'i').test(el.className);
};

function addClass(el, cn) {
	if (!hasClass(el, cn)) {
		el.className = trim(el.className + ' '+cn);
	}
};
function removeClass(el, cn) {
	if (hasClass(el, cn)) {
		el.className = trim(el.className.replace(new RegExp("(?:\\s|^)" +cn+ "(?:\\s|$)",'i'),' '));
	}
};
function replaceClass (el, cn1, cn2) {
		removeClass(el, cn1);
		addClass(el, cn2);
}




//������
function Tree(opts){
	for(var i in opts) this[i]=opts[i];
	this.render();
}

Tree.prototype={
	renderItem:function(info,onRoot){
		var el=document.createElement("li");
		var s='<div class="ST_node-ctn"><span class="ST_node-ctn-inner ST_t-'+info.type+'"><a href="#" class="ST_lastkey">'+(onRoot?info.sKeys:info.lastKey)+'</a><span class="ST_sConstructor">'+info.sConstructor+'</span><span class="ST_summary">'+encode4Html(info.summary)+'</span></span></div>';
		if(info.hasChildren)
		{
			el.className='folder-closed ST-f-'+info.type;
			el.innerHTML='<span class="ST_img-closed">&nbsp;</span>'+s+'<ul></ul>';
		}
		else{
			el.innerHTML=s;
		}
		el.setAttribute("ST_sKeys",info.sKeys);
		return el;
		
	},
	addItem:function(sKeys,pEl) {
		var info=analyseStr(sKeys);
		pEl=pEl || this.treeWrap;
		var el=this.renderItem(info,pEl==this.treeWrap);
		pEl.appendChild(el);
	},
	/**
	 * openFolder(el): չ��һ��folder
	 * @param {Element} el: 
	 * @returns {void}
	 */
	openFolder:function(el) {
		var sKeys=el.getAttribute("ST_sKeys");
		var info=analyseStr(sKeys);
		var newEl=this.renderItem(info);
		el.parentNode.insertBefore(newEl,el);
		el.parentNode.removeChild(el);
		el=newEl;
		replaceClass(el,"ST_folder-closed","ST_folder-open");
		if(info.hasChildren)
		{
			var itemsCtn=el.childNodes[2];
			itemsCtn.style.display="";
			var value=info.value;
			if("Collection,Array".indexOf(info.sConstructor)>-1){//�����Collection���������������
				var num=0;
				for(var i in value){
					if(num++>100) break;
					this.addItem(info.sKeys+'["'+i+'"]',itemsCtn);
				}
			}
			else{//Json���������󣬶����������򣬷������
				var subKeys=[];
				if(typeof value == "function" ) { //FF��,prototype�ᱻfor in��������ie�²���.
					var pro=value.prototype;
					for(var i in pro){
						subKeys.push("prototype");
						break;
					}
				}
				for(var i in value) {
					if(i=="prototype" && typeof value == "function") continue;
					subKeys.push(i);
				}
				subKeys.sort();
				for(var i =0;i<300 && i<subKeys.length;i++){
					this.addItem(info.sKeys+'["'+subKeys[i]+'"]',itemsCtn);
				}
			}
			replaceClass(el.firstChild,"ST_img-closed","ST_img-open");
		}
	},
	/**
	 * closeFolder(el): �ر�һ��folder
	 * @param {Element} el: 
	 * @returns {void}
	 */
	closeFolder:function(el) {
		replaceClass(el,"ST_folder-open","ST_folder-closed");
		replaceClass(el.firstChild,"ST_img-open","ST_img-closed");
		el.childNodes[2].innerHTML="";
		el.childNodes[2].style.display="none";
	},
	//����ƽ�
	//��tree���г�ʼ��
	render:function(){
		var me=this;
		me.treeCtn.innerHTML='<ul id="ST_tree-wrap"></ul>';
		var treeWrap=me.treeWrap=this.treeCtn.firstChild;
		treeWrap.onclick=function(e){
			var el=target(e);

			//�����ر�folder
			if(hasClass(el,"ST_img-closed")) tree.openFolder(el.parentNode);
			else if(hasClass(el,"ST_img-open")) tree.closeFolder(el.parentNode);
			
			//ST.showJson���ж�Ӧ�ı���
			if(el.tagName == "A"){
				var liEl=ancestorNode(el,"LI");
				var sKeys;
				if(liEl && (sKeys=liEl.getAttribute("ST_sKeys"))) {
					SmokingTest.dump(sKeys);
					return false;
				}
			}

			//ɾ������
			if(hasClass(el,"ST_sConstructor")){
				var liEl=ancestorNode(el,"LI");
				if(liEl && confirm("ɾ��������")){
					liEl.parentNode.removeChild(liEl);
				}
			}
		};

		msgEl.onclick=msgEl.oncontextmenu=function(e){
			var el=target(e);
			//ST.showJson���ж�Ӧ�ı���
			if(el.tagName == "A"){
				SmokingTest.dump(varEl.defaultValue+'.'+el.innerHTML);
				return false;
			}
		};

	}
};

return SmokingTest;
})();

