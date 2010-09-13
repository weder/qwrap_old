var TestH=(function(){
var TH={};
TH.analyse =function (value){
	/**
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
					summary="[].length = "+(value.length||0);
					sConstructor="Collection";
				}
				else if(sConstructor=="Array"){//Array
					summary="[].length = "+value.length;
				}
				else if(constructor==Object){//Json����
					var count=0;
					for(var i in value) count++;
					summary="{}.propertyCount = "+count;
				}
				else if(type=="function"){//����
					summary=trim((value+"").split("{")[0]);
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

TH.stringify = function (val){
	/**
	* ���ض�val��������
	* @param {any} val �������� 
	* @returns {string} ���ط������
	*/
	var info=TH.analyse(val);
	switch(info.type){
		case "null":
		case "undefined":
		case "number":
		case "boolean":
			return val+"";
		case "string":
			return '"'+val+'"';
	}
	var s=[];
	s.push((info.sConstructor || info.type) +": " + info.summary+"\n"+info.value);
	if(info.hasChildren){
		s.push("-----------------");
		var value =info.value;
		var num=0;
		for(var i in value){
			if(num++>300) {s.push("...");break;}
			try{
				var infoI=TH.analyse(value[i]);//��ʱvalue[i]���״�����firefox�µ�window.sessionStorage������Ҫtryһ�¡�
				s.push(i+" 	"+ (infoI.sConsturctor || infoI.type) +" 	" +infoI.summary );
			}
			catch(ex){
				s.push(i+" 	�޷�����"+ ex);
			}
		}
	}
	return s.join("\n");
};
//һЩ�ڲ�����
function trim(s){
	return s.replace(/^[\s\xa0\u3000]+|[\u3000\xa0\s]+$/g, "");
}
return TH;
})();


var UnitTest=(function(){
var UT={};
UT.specs=[];
var TH=TestH,
	stringify=TH.stringify,
	mix=function(obj,src){
		for(var i in src) if(!(i in obj)) obj[i]=src[i];
	},
	$=function(id){
		return document.getElementById(id);	
	},
	createEl=function(){
		var div=document.createElement("div");
		return function(html){
			div.innerHTML=html;
			return div.firstChild;
		};
	}(),
	target=function(e){
		e=e||event;
		return e.srcElement||e.target;
	},
	encode4Html=function(s){
		var el = document.createElement('pre');//����Ҫ��pre����div��ʱ�ᶪʧ���У����磺'a\r\n\r\nb'
		var text = document.createTextNode(s);
		el.appendChild(text);
		return el.innerHTML;
	},
	tmpl=function(sTmpl,opts){
		return sTmpl.replace(/\{\$(\w+)\}/g,function(a,b){return opts[b]==undefined?"-":encode4Html(opts[b])});
	};


var setSpecClassName=function(specId,cn){
	var el=$("spec_"+specId)
	if(el){
		el.className=cn;
		$("spec_"+specId+"_list").className=cn;
	}
};
var Browser=UT.Browser=	{
		// By Rendering Engines
		Trident: navigator.appName === "Microsoft Internet Explorer",
		Webkit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
		Gecko: navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') === -1,
		KHTML: navigator.userAgent.indexOf('KHTML') !== -1,
		Presto: navigator.appName === "Opera"
};
var increasingId=1,//����id
	currentSpec=null,
	currentCaseStatus=0,//��ǰcase��status
	currentCaseName=null,//��ǰcase��name
	currentShouldInfo=null;//��ǰ��ShouldInfo
	currentErrorMsg=null;//��ǰ��ShouldInfo

var Logger=UT.Logger={
	titleTmpl:[
		'<h1>JSSpec</h1><ul>',
		'<li>[<a href="?" class="rerun">Rerun all specs</a>]</li>',
		'<li><span id="total_examples">{$total}</span> examples</li>',
		'<li><span id="total_failures">{$fails}</span> failures</li>',
		'<li><span id="total_errors">{$errors}</span> errors</li>',
		'<li><span id="progress">{$per}</span>% done</li>',
		'<li><span id="total_elapsed">{$secs}</span> secs</li>',
		'</ul>',
		'<p><a href="http://hi.baidu.com/jkisjk">JK</a>: Thanks: <a href="http://jania.pe.kr/aw/moin.cgi/JSSpec">JSSpec homepage</a></p>',
	].join(""),
	specListTmpl:'<li id="spec_{$id}_list"><h3><a href="#spec_{$id}">{$context}</a> [<a href="#" class="rerun" specId="{$id}">rerun</a>]</h3></li>',
	specTmpl:['<li id="spec_{$id}">',
			'<h3><a href="#spec_{$id}" class="spec_hd" specId="{$id}" onclick="return false;">{$context}</a> [<a href="#spec_{$id}" class="rerun" specId="{$id}">rerun</a>]</h3>',
			'<ul id="spec_{$id}_examples" class="examples" style="display:none"></ul>',
			'</li>'
	].join(""),
	exampleTmpl:'<li id="example_{$id}"><h4>{$name}</h4><pre class="examples-code"><code>{$code}</code></pre></li>',
	codeTmpl:'<pre class="examples-code"><code>{$code}</code></pre>',
	init:function(){
		var container=$("jsspec_container");
		if(!container){
			container=createEl("<div id=jsspec_container></div>");
			document.body.appendChild(container);
		}
		container.innerHTML=[
			'<div id="title">title</div>',
			'<div id="list"><h2>List</h2><ul class="specs" id="specs_list"></ul></div>',
			'<div id="log"><h2>Log</h2><ul class="specs" id="specs_log"></ul></div>'
		].join("");
		container.onclick=function(e){
			var el=target(e);
			if(el.className=="rerun"){ //rerun
				var specId=el.getAttribute("specId");
				var specs=UT.specs;
				for(var i=0;i<specs.length;i++){
					if(!specId || specId==specs[i].id){
						specs[i].status=-1;
						specs[i].caseStatus={};
						$("spec_"+specs[i].id+"_examples").innerHTML="";
					}
				}
				UT.startExec();
			}
			else if(el.className=="spec_hd"){
				var specId=el.getAttribute("specId");
				var examplesEl=$("spec_"+specId+"_examples");
				if(examplesEl){
					examplesEl.style.display=examplesEl.style.display=="none"?"":"none";
				}
			}
		};
		Logger.o_title=$("title");
		Logger.o_specs_list=$("specs_list");
		Logger.o_specs_log=$("specs_log");
		Logger.o_title.innerHTML=tmpl(Logger.titleTmpl,{});
		for(var i=0;i<UT.specs.length;i++){
			var spec=UT.specs[i];
			var specInfo={id:spec.id,context:spec.context};
			Logger.o_specs_list.appendChild(createEl(tmpl(Logger.specListTmpl,specInfo)));
			Logger.o_specs_log.appendChild(createEl(tmpl(Logger.specTmpl,specInfo)));
		}
	},
	initForCase:function(){
		if(currentSpec){
			var specId=currentSpec.id;
			if(!$('spec_'+specId)){
				var specInfo={id:specId,context:currentSpec.context};
				Logger.o_specs_list.appendChild(createEl(tmpl(Logger.specListTmpl,specInfo)));
				Logger.o_specs_log.appendChild(createEl(tmpl(Logger.specTmpl,specInfo)));
			}
			if(currentSpec && currentSpec.caseMap[currentCaseName]){
				if(!currentSpec.caseId[currentCaseName]) {
					currentSpec.caseId[currentCaseName]=increasingId++;
				}
				var caseId=currentSpec.caseId[currentCaseName];
				if(!$('example_'+caseId)){
					var el=createEl(tmpl(Logger.exampleTmpl,{id:caseId,name:currentCaseName,code:currentSpec.caseMap[currentCaseName]}));
					$('spec_'+specId+'_examples').appendChild(el);
				}
			}
		}

	},
	log:function(self,message){
		if(currentSpec && currentCaseName && currentSpec.caseMap[currentCaseName]) {
			var caseId=currentSpec.caseId[currentCaseName],
				el=$('example_'+caseId),
				infoEl=createEl("<div></div>"),
				html=(message||'')+tmpl(Logger.codeTmpl,{code:stringify(self)});
			//alert(html);
			try{infoEl.innerHTML=html;}
			catch(ex){
				alert(html);
			}
			el.appendChild(infoEl);
			return;
		}
		alert(message+"\n"+stringify(self));
	},
	refreshSpecs:function(){
		var total=0,fails=0,errors=0,overs=0;
		for(var i =0;i<UT.specs.length;i++){
			var spec=UT.specs[i],specId=spec.id;caseMap=spec.caseMap,caseStatus=spec.caseStatus;
			var specClassName="";
			if(spec.status==0) specClassName="ongoing";
			else if(spec.status==1) specClassName="success";
			for(var j in caseMap){
				total++;
				var status=caseStatus[j];
				if(status) overs++;
				if(status & 4) fails++;
				if(status & 2) errors++;
				if(status >1) specClassName="exception";
			}
			setSpecClassName(specId,specClassName);
		}
		Logger.o_title.innerHTML=tmpl(Logger.titleTmpl,{total:total,errors:errors,fails:fails,per:(100*overs/(total||1)).toFixed(0),secs:(new Date()-executeStartDate)/1000});


	},
	renderResult:function(ex){
		var spec=currentSpec;
		Logger.refreshSpecs();
		var id=spec.caseId[currentCaseName],status=spec.caseStatus[currentCaseName];
		var el=$("example_"+id);
		if(status==1){
			el.className="success";
		}
		else if(status>1){
			$('spec_'+spec.id+'_examples').style.display="";
			el.className="exception";
			var infoEl=createEl("<div></div>"),html=[];
			if(currentShouldInfo){
				html.push(
					'<p>matcher: ',tmpl(Logger.codeTmpl,{code:currentShouldInfo.sFun}),'</p>',
					'<p>actual(self): ',tmpl(Logger.codeTmpl,{code:stringify(currentShouldInfo.self)}),'</p>',
					currentShouldInfo.self!=null && currentShouldInfo.property!=null ?
						'<p>self.'+currentShouldInfo.property+': '+tmpl(Logger.codeTmpl,{code:stringify(currentShouldInfo.self[currentShouldInfo.property])})+'</p>':'',
					'<p>value: ',tmpl(Logger.codeTmpl,{code:stringify(currentShouldInfo.value)}),'</p>'
				);
			}
			html.push('<p>',currentErrorMsg || ex && ex.message || '','</p>')
			if(ex){
				if(Browser.Webkit) 
					html.push('<p> at ',ex.sourceURL,', line ',ex.line,'</p>');
				else 
					html.push('<p> at ',ex.fileName,', line ',ex.lineNumber,'</p>');
			}
			infoEl.innerHTML=html.join("");
			el.appendChild(infoEl);
		}
		executeTimer=setTimeout(executor,50);
	}
}
var Spec=UT.Spec = function(context, caseMap, base) {
	this.id = increasingId++;
	this.context = context;
	this.caseMap = caseMap;
	this.base=base;
	this.caseStatus={};//json����keyΪcaseName,��ֵΪstatus: 0:δ����, 1:ͨ��, 2:�����쳣, 4,��ͨ��
	this.caseId={};//json����keyΪcaseId,
	this.status=-1;//status: -1:δ����, 0: ������, 1:�������
};

mix(Spec.prototype,{
	rerun: function (){
		

	}
});

var Subject=UT.Subject=function (self){
	this.self=self;
};

mix(Subject.prototype,{
	_should: function(property,value,op,selfPre,selfTail,valuePre,valueTail,isReverse){
		var selfDesc=[
				selfPre,
				property==null?"self":"self[property]",
				selfTail
			],
			valueDesc=[
				valuePre,
				"value",
				valueTail
			];
		var desc=[].concat( isReverse?valueDesc:selfDesc, op, isReverse?selfDesc:valueDesc );
		var sFun=desc.join(" ");
		//alert([sFun,this.self,property,value]);
		var tempCur={
			self:this.self,
			property:property,
			value:value,
			sFun:sFun
		};
		try{
			var fun=new Function("self","property","value","return ("+sFun+");");
		}
		catch(ex){//����ĵ�����_should���������matcher���Ϸ�
			currentCaseStatus|=2;
			currentErrorMsg="Matcher is illegle: "+ex.message;
			currentShouldInfo=tempCur;
			return;
		}
		try{
			var result=fun(this.self,property,value);
		}
		catch(ex){//����matcherʱ�״�
			currentCaseStatus|=4;
			currentErrorMsg="Not match: "+ex.message;
			currentShouldInfo=tempCur;
			return; 
		}
		if(result !== true) {//Not Match
			currentCaseStatus|=4;
			currentErrorMsg="Not match";
			currentShouldInfo=tempCur;
			return;
		}
		currentCaseStatus|=1;//Match
		return result;
	},
	should: function (op,value){
		return this._should(null,value,op);
	},
	should_be: function (value){
		return this._should(null,value,"===");
	},
	should_not_be: function (value){
		return this._should(null,value,"!==");
	},
	should_have_method: function(methodName){
		return this._should(methodName,"function","==","typeof");
	},
	should_have_property: function(property){
		return this._should(null,property,"in",null,null,null,null,true);
	},
	should_contains: function(value){
		return this._should(null,value,".contains",null,null,"(",")");
	},
	property_should:function (property,op,value){
		return this._should(property,value,op);
	},
	property_should_be:function (property,value){
		return this._should(property,value,"===");
	},
	property_should_not_be:function (property,value){
		return this._should(property,value,"!==");
	},

	log: function(message){
		Logger.log(this.self,message);
	}
});

UT.describe = function(context, caseMap, base) {
	UT.specs.push(new Spec(context, caseMap, base));
};

//��ʱ����case,
var executeTimer=0,
	executeStartDate=0;
	executor =function(){
		for(var i=0;i<UT.specs.length;i++){
			var spec=UT.specs[i],caseStatus=spec.caseStatus,caseMap=spec.caseMap;
			currentSpec=spec;
			if(spec.status<1) {
				spec.status=0;
				for(var j in caseMap){
					var currentCase=caseMap[j];
					if(!caseStatus[j]){
						currentCaseName=j;
						currentCaseStatus=0;
						currentErrorMsg=null;
						currentShouldInfo=null;
						Logger.initForCase();
						if(Browser.Trident){//�׳�
							caseMap[j]();
							caseStatus[j]=currentCaseStatus||1;//��ʱ��һ��Case��û��should�жϣ�������Ҫ "||1"
							Logger.renderResult();
						}
						else{
							try{
								caseMap[j]();
								caseStatus[j]=currentCaseStatus||1;
								Logger.renderResult();
							}
							catch(ex){
								caseStatus[j]= currentCaseStatus&6 || 2;//�ڲ��Ա�������Ҫ��ʾ�ô�����
								Logger.renderResult(ex);
							}
						}
						return;//ÿ��ֻrunһ��case
					}
				}
				spec.status= 1;
			}
		}
		Logger.refreshSpecs();
		clearTimeout(executeTimer);
};
UT.startExec=function(){
	clearTimeout(executeTimer);
	executeStartDate=new Date();
	executeTimer=setTimeout(executor,50);
}


mix(window,{//export
	value_of:function (self){
		return new Subject(self);
	},
	describe:UT.describe
});

if(Browser.Trident){
	window.onerror=function(message, fileName, lineNumber) {
		try{
			currentSpec.caseStatus[currentCaseName]=currentCaseStatus&6 || 2;//�ڲ��Ա�������Ҫ��ʾ�ô�����
		}catch(ex){;}
		Logger.renderResult({message:currentErrorMsg||message,fileName:fileName,lineNumber:lineNumber});
		return true;
	};
	
}
window.onload=function(){
	Logger.init();
	UT.startExec();
}
return UT;
})();

