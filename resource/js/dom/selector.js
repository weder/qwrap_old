/*
	Copyright (c) 2009, Baidu Inc. All rights reserved.
	version: $version$ $release$ released
	author: yingjiakuan@baidu.com
*/

/**
 * @class Selector Css Selector��صļ�������
 * @singleton
 * @namespace QW
 */
(function(){
var QW=window.QW;
var trim=QW.StringH.trim;

var Selector={
	/**
	 * @property {int} queryStamp ���һ�β�ѯ��ʱ�������չα��ʱ���ܻ��õ���������
	 */
	queryStamp:0,
	/**
	 * @property {Json} _operators selector���������
	 */
	_operators:{	//���±��ʽ��aa��ʾattrֵ��vv��ʾ�Ƚϵ�ֵ
		'': 'aa',//isTrue|hasValue
		'=': 'aa=="vv"',//equal
		'!=': 'aa!="vv"', //unequal
		'~=': 'aa&&(" "+aa+" ").indexOf(" vv ")>-1',//onePart
		'|=': 'aa&&(aa+"-").indexOf("vv-")==0', //firstPart
		'^=': 'aa&&aa.indexOf("vv")==0', // beginWith
		'$=': 'aa&&aa.lastIndexOf("vv")==aa.length-"vv".length', // endWith
		'*=': 'aa&&aa.indexOf("vv")>-1' //contains
	},
	/**
	 * @property {Json} _shorthands ����д��
	 */
    _shorthands: [
		[/\#([\w\-]+)/g,'[id="$1"]'],//id����д��
		[/^([\w\-]+)/g, function(a,b){return '[tagName="'+b.toUpperCase()+'"]';}],//tagName����д��
		[/\.([\w\-]+)/g, '[className~="$1"]'],//className����д��
		[/^\*/g, '[tagName]']//����tagName����д��
	],
	/**
	 * @property {Json} _pseudos α���߼�
	 */
	_pseudos:{
		"first-child":function(a){return a.parentNode.getElementsByTagName("*")[0]==a;},
		"last-child":function(a){return !(a=a.nextSibling) || !a.tagName && !a.nextSibling;},
		"only-child":function(a){return getChildren(a.parentNode).length==1;},
		"nth-child":function(a,iFlt){return iFlt(getNth(a,false)); },
		"nth-last-child":function(a,iFlt){return iFlt(getNth(a,true)); },
		"first-of-type":function(a){ var tag=a.tagName; var el=a; while(el=el.previousSlibling){if(el.tagName==tag) return false;} return true;},
		"last-of-type":function(a){ var tag=a.tagName; var el=a; while(el=el.nextSibling){if(el.tagName==tag) return false;} return true; },
		"only-of-type":function(a){var els=a.parentNode.childNodes; for(var i=els.length-1;i>-1;i--){if(els[i].tagName==a.tagName && els[i]!=a) return false;} return true;},
		"nth-of-type":function(a,iFlt){var idx=1;var el=a;while(el=el.previousSibling) {if(el.tagName==a.tagName) idx++;} return iFlt(idx); },//JK������Ϊ������α���������Ż�
		"nth-last-of-type":function(a,iFlt){var idx=1;var el=a;while(el=el.nextSibling) {if(el.tagName==a.tagName) idx++;} return iFlt(idx); },//JK������Ϊ������α���������Ż�
		"empty":function(a){ return !a.firstChild; },
		"parent":function(a){ return !!a.firstChild; },
		"not":function(a,sFlt){ return !sFlt(a); },
		"enabled":function(a){ return !a.disabled; },
		"disabled":function(a){ return a.disabled; },
		"checked":function(a){ return a.checked; },
		"contains":function(a,s){return (a.textContent || a.innerText || "").indexOf(s) >= 0;}
	},
	/**
	 * @property {Json} _attrGetters ���õ�Element����
	 */
	_attrGetters:function(){ 
		var o={'class': 'el.className',
			'for': 'el.htmlFor',
			'href':'el.getAttribute("href",2)'};
		var attrs='name,id,className,value,selected,checked,disabled,type,tagName,readOnly'.split(',');
		for(var i=0,a;a=attrs[i];i++) o[a]="el."+a;
		return o;
	}(),
	/**
	 * @property {Json} _relations selector��ϵ�����
	 */
	_relations:{
		//Ѱ��
		"":function(el,filter,topEl){
			while((el=el.parentNode) && el!=topEl){
				if(filter(el)) return el;
			}
			return null;
		},
		//Ѱ��
		">":function(el,filter,topEl){
			el=el.parentNode;
			return el!=topEl&&filter(el) ? el:null;
		},
		//Ѱ��С�ĸ��
		"+":function(el,filter){
			while(el=el.previousSibling){
				if(el.tagName){
					return filter(el) && el;
				}
			}
			return null;
		},
		//Ѱ���еĸ��
		"~":function(el,filter){
			while(el=el.previousSibling){
				if(el.tagName && filter(el)){
					return el;
				}
			}
			return null;
		}
	},
	/** 
	 * ��һ��selector�ַ���ת����һ�����˺���.
	 * @method selector2Filter
	 * @static
	 * @param {string} sSelector ����selector�����selector��û�й�ϵ�������", >+~"��
	 * @returns {function} : ���ع��˺�����
	 * @example: 
		var fun=selector2Filter("input.aaa");alert(fun);
	 */
	selector2Filter:function(sSelector){
		return s2f(sSelector);
	},
	/** 
	 * �ж�һ��Ԫ���Ƿ����ĳselector.
	 * @method test 
	 * @static
	 * @param {HTMLElement} el: ���������
	 * @param {string} sSelector: ����selector�����selector��û�й�ϵ�������", >+~"��
	 * @returns {function} : ���ع��˺�����
	 */
	test:function(el,sSelector){
		return s2f(sSelector)(el);
	},
	/** 
	 * ��һ��css selector������һ������.
	 * @method filter 
	 * @static
	 * @param {Array|Collection} els: Ԫ������
	 * @param {string} sSelector: ����selector�����selector��û�й�ϵ�������", >+~"��
	 * @param {Element} pEl: ���ڵ㡣Ĭ����document.documentElement
	 * @returns {Array} : �����������������Ԫ����ɵ����顣
	 */
	filter:function(els,sSelector,pEl){
		var sltors=splitSelector(sSelector);
		return filterByRelation(pEl||document.documentElement,els,sltors);
	},
	/** 
	 * ��refElΪ�ο����õ����Ϲ���������HTML Elements. refEl������element������document
	 * @method query
	 * @static
	 * @param {HTMLElement} refEl: �ο�����
	 * @param {string} sSelector: ����selector,
	 * @returns {array} : ����elements���顣
	 * @example: 
		var els=query(document,"li input.aaa");
		for(var i=0;i<els.length;i++ )els[i].style.backgroundColor='red';
	 */
	query:function(refEl,sSelector){
		Selector.queryStamp = queryStamp++;
		refEl=refEl||document.documentElement;
		var els=nativeQuery(refEl,sSelector);
		if(els) return els;//����ʹ��ԭ����
		var groups=trim(sSelector).split(",");
		els=querySimple(refEl,groups[0]);
		for(var i=1,gI;gI=groups[i];i++){
			var els2=querySimple(refEl,gI);
			els=els.concat(els2);
			//els=union(els,els2);//���ػ�̫���������˹���
		}
		return els;
	}

};

/*
	retTrue һ������Ϊtrue�ĺ���
*/
function retTrue(){
	return true;
}

/*
	arrFilter(arr,callback) : ��arr���Ԫ�ؽ��й���
*/
function arrFilter(arr,callback){
	var rlt=[],i=0;
	if(callback==retTrue){
		if(arr instanceof Array) return arr;
		else{
			for(var len=arr.length;i<len;i++) {
				rlt[i]=arr[i];
			}
		}
	}
	else{
		for(var oI;oI=arr[i++];) {
			callback(oI) && rlt.push(oI);
		}
	}
	return rlt;
};

var elContains,//�����������֧��contains()������FF
	getChildren,//�����������֧��children������FF3.5-
	hasNativeQuery,//�����������֧��ԭ��querySelectorAll()������IE8-
	findId=function(id) {return document.getElementById(id);};

(function(){
	var div=document.createElement('div');
	div.innerHTML='<div class="aaa"></div>';
	hasNativeQuery=(div.querySelectorAll && div.querySelectorAll('.aaa').length==1);
	elContains=div.contains?
		function(pEl,el){ return pEl!=el && pEl.contains(el);}:
		function(pEl,el){ return (pEl.compareDocumentPosition(el) & 16);};
	getChildren=div.children?
		function(pEl){ return pEl.children;}:
		function(pEl){ 
			return arrFilter(pEl.children,function(el){return el.tagName;});
		};
})();



/*
 * nth(sN): ����һ���жϺ��������ж�һ�����Ƿ�����ĳ���ʽ��
 * @param { string } sN: ���ʽ���磺'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
 * @return { function } function(i){return i����sN}: �����жϺ�����
 */
function nth(sN){
	if(sN=="even") sN='2n';
	if(sN=="odd") sN='2n+1';
	sN=sN.replace(/(^|\D+)n/g,"$11n");
	if(!(/n/.test(sN))) {
		return function(i){return i==sN;}
	}
	else{
		var arr=sN.split("n");
		var a=arr[0]|0, b=arr[1]|0;
		return function(i){var d=i-b; return d>=0 && d%a==0;};
	}
}

/*
 * getNth(el,reverse): �õ�һ��Ԫ�ص�nthֵ��
 * @param { element } el: HTML Element
 * @param { boolean } : �Ƿ����㣭�����Ϊ�棬�൱��nth-last
 * @return { int } : ����nthֵ
 */
function getNth(el,reverse){
	var pEl=el.parentNode;
	if(pEl.__queryStamp!=queryStamp){
		var els=getChildren(pEl);
		for(var i=0,elI;elI=els[i++];){
			elI.__siblingIdx=i;
		};
		pEl.__queryStamp=queryStamp;
		pEl.__childrenNum=i;
	}
	if(reverse) return pEl.__childrenNum-el.__siblingIdx+1;
	else return el.__siblingIdx;
}

/*
 * s2f(sSelector): ��һ��selector�õ�һ�����˺���filter�����selector��û�й�ϵ�������", >+~"��
 */
function s2f(sSelector){
	if(sSelector=='') return retTrue;
	var pseudos=[],//α������,ÿһ��Ԫ�ض������飬����Ϊ��α������α��ֵ
		attrs=[],//�������飬ÿһ��Ԫ�ض������飬����Ϊ�������������ԱȽϷ����Ƚ�ֵ
		s=trim(sSelector);
	s=s.replace(/\:([\w\-]+)(\(([^)]+)\))?/g,function(a,b,c,d,e){pseudos.push([b,d]);return "";});//α��
	for(var i=0,shorthands=Selector._shorthands,sh;sh=shorthands[i];i++)
		s=s.replace(sh[0],sh[1]);
	//var reg=/\[\s*([\w\-]+)\s*([!~|^$*]?\=)?\s*(?:(["']?)([^\]'"]*)\3)?\s*\]/g; //����ѡ����ʽ����
	var reg=/\[\s*((?:[\w\u00c0-\uFFFF-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/g; //����ѡ����ʽ����,thanks JQuery
	s=s.replace(reg,function(a,b,c,d,e){attrs.push([b,c||"",e||""]);return "";});//��ͨд��[foo][foo=""][foo~=""]��
	if(!(/^\s*$/).test(s)) {
		throw "Unsupported Selector:\n"+sSelector+"\n-"+s; 
	}

	//�����Ͻ��������ת���ɹ��˺���
	var flts=[];
	if(attrs.length){
		var sFun=[];
		for(var i=0,attr;attr=attrs[i];i++){//���Թ���
			var attrGetter=Selector._attrGetters[attr[0]] || 'el.getAttribute("'+attr[0]+'")';
			sFun.push(Selector._operators[attr[1]].replace(/aa/g,attrGetter).replace(/vv/g,attr[2]));
		}
		sFun='return '+sFun.join("&&");
		flts.push(new Function("el",sFun));
	}
	for(var i=0,pI;pI=pseudos[i];i++) {//α�����
		var fun=Selector._pseudos[pI[0]];
		if(!fun) {
			throw "Unsupported Selector:\n"+pI[0]+"\n"+s;
		}
		if(pI[0].indexOf("nth-")==0){ //��α�������ת���ɹ��˺�����
			flts.push(function(fun,arg){return function(el){return fun(el,arg);}}(fun,nth(pI[1])));
		}
		else if(pI[0]=="not"){ //��α�������ת���ɹ��˺�����
			flts.push(function(fun,arg){return function(el){return fun(el,arg);}}(fun,s2f(pI[1])));
		}
		else if(pI[0]=="contains"){ //��α�������ת���ɹ��˺�����
			flts.push(function(fun,arg){return function(el){return fun(el,arg);}}(fun,pI[1]));
		}
		else flts.push(fun);
	}
	//�����ռ�filter function
	var fltsLen=flts.length;
	switch(fltsLen){//����Խ��Խ��
		case 0: return retTrue;
		case 1: return flts[0];
		case 2: return function(el){return flts[0](el)&&flts[1](el);};
	}
	return function(el){
		for (var i=0;i<fltsLen;i++){
			if(!flts[i](el)) return false;
		}
		return true;
	};
};

/* 
	* {int} xxxStamp: ȫ�ֱ�����ѯ���
 */
var queryStamp=0,
	relationStamp=0,
	querySimpleStamp=0;

/*
* nativeQuery(refEl,sSelector): �����ԭ����querySelectorAll������ֻ�Ǽ򵥲�ѯ�������ԭ����query�����򷵻�null. 
* @param {Element} refEl �ο�Ԫ��
* @param {string} sSelector selector�ַ���
* @returns 
*/
function nativeQuery(refEl,sSelector){
		if(hasNativeQuery && /^((^|,)\s*[.\w-][.\w\s\->+~]*)+$/.test(sSelector)) {
			//���������Դ���querySelectorAll�����ұ���query���Ǽ�selector����ֱ�ӵ���selector�Լ���
			//�����������֧����">~+"��ʼ�Ĺ�ϵ�����
			var arr=[],els=refEl.querySelectorAll(sSelector);
			for(var i=0,elI;elI=els[i++];) arr.push(elI);
			return arr;
		}
		return null;
};

/* 
* querySimple(pEl,sSelector): �õ�pEl�µķ��Ϲ���������HTML Elements. 
* sSelector��û��","�����
* pEl��Ĭ����document.body 
* @see: query��
*/
function querySimple(pEl,sSelector){
	querySimpleStamp++;
	/*
		Ϊ����߲�ѯ�ٶȣ�����������ԭ��
		�����ȣ�ԭ����ѯ
		�����ȣ���' '��'>'��ϵ������ǰ���������򣨴��浽���ѯ
		�����ȣ�id��ѯ
		�����ȣ�ֻ��һ����ϵ������ֱ�Ӳ�ѯ
		��ԭʼ���ԣ����ù�ϵ�жϣ���������ײ������ϲ����ߣ������óɹ�������������
	*/

	//�����ȣ�ԭ����ѯ
	var els=nativeQuery(pEl,sSelector);
	if(els) return els;//����ʹ��ԭ����


	var sltors=splitSelector(sSelector),
		sltorsLen=sltors.length;

	var pEls=[pEl],
		i,
		elI,
		pElI;

	var sltor0;
	//�����ȣ���' '��'>'��ϵ������ǰ���������򣨴��ϵ��£���ѯ
	while(sltor0=sltors[0]){
		if(!pEls.length) return [];
		var relation=sltor0[0];
		els=[];
		if(relation=='+'){//��һ���ܵ�
			filter=s2f(sltor0[1]);
			for(i=0;elI=pEls[i++];){
				while(elI=elI.nextSibling){
					if(elI.tagName){
						if(filter(elI)) els.push(elI);
						break;
					}
				}
			}
			pEls=els;
			sltors.splice(0,1);
		}
		else if(relation=='~'){//���еĵܵ�
			filter=s2f(sltor0[1]);
			for(i=0;elI=pEls[i++];){
				if(i>1 && elI.parentNode==pEls[i-2].parentNode) continue;//���أ�����Ѿ�query���ֳ����򲻱�query�ܵ�
				while(elI=elI.nextSibling){
					if(elI.tagName){
						if(filter(elI)) els.push(elI);
					}
				}
			}
			pEls=els;
			sltors.splice(0,1);
		}
		else{
			break;
		}
	}
	if(!sltorsLen || !pEls.length) return pEls;
	
	//�����ȣ�idIdx��ѯ
	for(var idIdx=0,id;sltor=sltors[idIdx];idIdx++){
		if((/^[.\w-]*#([\w-]+)/i).test(sltor[1])){
			id=RegExp.$1;
			sltor[1]=sltor[1].replace('#'+id,'');
			break;
		}
	}
	if(idIdx<sltorsLen){//����id
		var idEl=findId(id);
		if(!idEl) return [];
		for(i=0,pElI;pElI=pEls[i++];){
			if(elContains(pElI,idEl)) {
				els=filterByRelation(pEl,[idEl],sltors.slice(0,idIdx+1));
				if(!els.length || idIdx==sltorsLen-1) return els;
				return querySimple(idEl,sltors.slice(idIdx+1).join(',').replace(/,/g,' '));
			}
		}
		return [];
	}

	//---------------
	var getChildrenFun=function(pEl){return pEl.getElementsByTagName(tagName);},
		tagName='*',
		className='';
	sSelector=sltors[sltorsLen-1][1];
	sSelector=sSelector.replace(/^[\w\-]+/,function(a){tagName=a;return ""});
	if(hasNativeQuery){
		sSelector=sSelector.replace(/^[\w\*]*\.([\w\-]+)/,function(a,b){className=b;return ""});
	}
	if(className){
		getChildrenFun=function(pEl){return pEl.querySelectorAll(tagName+'.'+className);};
	}

	//�����ȣ�ֻʣһ��'>'��' '��ϵ��(���ǰ��Ĵ��룬��ʱ�����ܳ��ֻ�ֻʣ'+'��'~'��ϵ��)
	if(sltorsLen==1){
		if(sltors[0][0]=='>') {
			getChildrenFun=getChildren;
			var filter=s2f(sltors[0][1]);
		}
		else{
			filter=s2f(sSelector);
		}
		els=[];
		for(i=0;pElI=pEls[i++];){
			els=els.concat(arrFilter(getChildrenFun(pElI),filter));
		}
		return els;
	}

	//�����ȣ�ֻ��' '��ϵ��(�ߵ������֧ʱ��sltors.length�ض�����1)
	/*
	//JK2010-08���������ȵ�Ч������ô�ã����Ҵ������������������Ҳ��ҵĸ�Ч�÷��Ĳ��Բ�һ�£��������û���ʹ���Ѷ�
	var onlyBlank=true;
	for(i=0;i<sltorsLen;i++){
		if(!sltors[i][0]){
			onlyBlank=false;
			break;
		}
	}
	if(onlyBlank){
		pEls=querySimple(pEl,sltors[0][1]);
		for(i=1;i<sltorsLen;i++){
			els=[];
			var sltorI=sltors[i][1];
			for(var j=1;j<pEls.length;j++){
				if(elContains(pEls[j-1],pEls[j])){
					pEls.splice(j,1);
					j--;
				}
			}
			if(!pEls.length) return [];
			for(var j=0;j<pEls.length;j++){
				els=els.concat(querySimple(pEls[j],sltorI));
			}
			pEls=els;
		}
		return els;
	}
	*/

	//�ߵ�һ����ϵ����'>'��' '�����ܷ���
	sltors[sltors.length-1][1] = sSelector;
	els=[];
	for(i=0;pElI=pEls[i++];){
		els=els.concat(filterByRelation(pElI,getChildrenFun(pElI),sltors));
	}
	return els;
};


function splitSelector(sSelector){
	var sltors=[];
	var reg=/(^|\s*[>+~ ]\s*)(([\w\-\:.#*]+|\([^\)]*\)|\[\s*((?:[\w\u00c0-\uFFFF-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\6|)\s*\])+)(?=($|\s*[>+~ ]\s*))/g;
	var s=trim(sSelector).replace(reg,function(a,b,c,d){sltors.push([trim(b),c]);return "";});
	if(!(/^\s*$/).test(s)) {
		throw "Unsupported Selector:\n"+sSelector+"\n--"+s; 
	}
	return sltors;
}

/*
�ж�һ������������ڵ��Ƿ������ϵҪ��----�ر�˵��������ĵ�һ����ϵֻ���Ǹ��ӹ�ϵ���������ϵ;
*/

function filterByRelation(pEl,els,sltors){
	relationStamp++;
	var sltor=sltors[0],
		len=sltors.length,
		relationJudge=sltor[0]?	//
			function(el){return el.parentNode==pEl;}:
			retTrue;
	var filters=[],
		reations=[],
		needNext=[];
		
	for(var i=0;i<len;i++){
		sltor=sltors[i];
		filters[i]=s2f(sltor[1]);//����
		reations[i]=Selector._relations[sltor[0]];//Ѱ�׺���
		if(sltor[0]=='' || sltor[0]=='~') needNext[i]=true;//�Ƿ�ݹ�Ѱ��
	}
	els=arrFilter(els,filters[len-1]);//�������
	if(len==1) return arrFilter(els,relationJudge);

	function chkRelation(el){//��ϵ�˹���
		var parties=[],//�м��ϵ��
			j=len-1,
			party=parties[j]=reations[j](el,filters[j-1],pEl);
		if(!party) {
			return false;
		}
		for(j--;j>-1;j--){
			if(party){
				if(j==0){
					if(relationJudge(party)) return true;//ͨ�����ļ��
					else party=null;//�����һ�ر����
				}
				//else if(sltors[j][5] && !elContains(pEl,party)) party=null;//�ҹ�ͷ��
				else{
					party=parties[j]=reations[j](parties[j+1],filters[j-1],pEl);
					if(party) continue;
				}
			}
			while (!party){//����
				j++;//����һ��
				if(j==len) return false;//�˵�����
				if(needNext[j]) party=parties[j]=reations[j](parties[j],filters[j-1],pEl);
			}
			party=parties[j]=reations[j](parties[j+1],filters[j-1],pEl);

		}
	};
	return arrFilter(els,chkRelation);
}

QW.Selector=Selector;
})();
