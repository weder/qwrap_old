(function(){
/*
sArrName ƴ���ַ����ı�������
*/
var sArrName="sArrCMX",sLeft=sArrName+'.push("';
/*
	tag:ģ���ǩ,�����Ժ��壺
	tagG: tagϵ��
	isBgn: �ǿ�ʼ���͵ı�ǩ
	isEnd: �ǽ������͵ı�ǩ
	cond: ��ǩ����
	rlt: ��ǩ���
	sBgn: ��ʼ�ַ���
	sEnd: �����ַ���
*/
var tags={
	'js':{tagG:'js',isBgn:1,isEnd:1,sBgn:'");',sEnd:';'+sLeft},	//����js���, ���������Ҫ�����ģ�壬��print("aaa");
	'if':{tagG:'if',isBgn:1,rlt:1,sBgn:'");if',sEnd:'{'+sLeft},	//if��䣬д��Ϊ{if($a>1)},��Ҫ�Դ�����
	'elseif':{tagG:'if',cond:1,rlt:1,sBgn:'");} else if',sEnd:'{'+sLeft},	//if��䣬д��Ϊ{elseif($a>1)},��Ҫ�Դ�����
	'else':{tagG:'if',cond:1,rlt:2,sEnd:'");}else{'+sLeft},	//else��䣬д��Ϊ{else}
	'/if':{tagG:'if',isEnd:1,sEnd:'");}'+sLeft},	//endif��䣬д��Ϊ{/if}
	'for':{tagG:'for',isBgn:1,rlt:1,sBgn:'");for',sEnd:'{'+sLeft},	//for��䣬д��Ϊ{for(var i=0;i<1;i++)},��Ҫ�Դ�����
	'/for':{tagG:'for',isEnd:1,sEnd:'");}'+sLeft},	//endfor��䣬д��Ϊ{/for}
	'while':{tagG:'while',isBgn:1,rlt:1,sBgn:'");while',sEnd:'{'+sLeft},	//while���,д��Ϊ{while(i-->0)},��Ҫ�Դ�����
	'/while':{tagG:'while',isEnd:1,sEnd:'");}'+sLeft}	//endwhile���, д��Ϊ{/while}
};

function Tmpl(sTmpl){
	/**
		@Class Tmpl ��ģ���ַ���ת��Ϊһ��������
		@param {string} sTmpl ģ���ַ���,��{}��������Ϊjs���ʽ����js���
		@return {function}  ����ģ�庯��function(opts){..}
		@example 
			alert(new Tmpl('{$name} is {$age} years old.')({name:'Tom',age:12}));
	*/

	var N=-1,NStat=[];//����ջ;
	var ss=[
		[/\{strip\}([\s\S]*?)\{\/strip\}/g, function(a,b){return b.replace(/[\r\n]\s*\}/g," }").replace(/[\r\n]\s*/g,"");}],
		[/\\/g,'\\\\'],[/"/g,'\\"'],[/\r/g,'\\r'],[/\n/g,'\\n'], //Ϊjs��ת��.
		[/\{[\s\S]*?\S\}/g,//js��ʹ��}ʱ��ǰ��Ҫ�ӿո�
			function(a){
			a=a.substr(1,a.length-2);
			for(var i=0;i<ss2.length;i++) a=a.replace(ss2[i][0],ss2[i][1]);
			var tagName=a;
			if(/^(.\w+)\W/.test(tagName)) tagName=RegExp.$1;
			var tag=tags[tagName];
			if(tag){
				if(tag.isBgn){
					var stat=NStat[++N]={tagG:tag.tagG,rlt:tag.rlt};
				}
				if(tag.isEnd){
					if(N<0) throw new Error("����Ľ������"+a);
					stat=NStat[N--];
					if(stat.tagG!=tag.tagG) throw new Error("��ǲ�ƥ�䣺"+stat.tagG+"--"+tagName);
				}
				else if(!tag.isBgn){
					if(N<0) throw new Error("����ı��"+a);
					stat=NStat[N];
					if(stat.tagG!=tag.tagG) throw new Error("��ǲ�ƥ�䣺"+stat.tagG+"--"+tagName);
					if(tag.cond && !(tag.cond & stat.rlt)) throw new Error("���ʹ��ʱ�����ԣ�"+tagName);
					stat.rlt=tag.rlt;
				}
				return (tag.sBgn||'')+a.substr(tagName.length)+(tag.sEnd||'');
			}
			else{
				return '",('+a+'),"';
			}
		}]
	];
	var ss2=[[/\\n/g,'\n'],[/\\r/g,'\r'],[/\\"/g,'"'],[/\\\\/g,'\\'],[/\$(?=\w+)/g,'opts.'],[/print/g,sArrName+'.push']];
	for(var i=0;i<ss.length;i++){
		sTmpl=sTmpl.replace(ss[i][0],ss[i][1]);
	}
	if(N>=0) throw new Error("����δ�����ı�ǣ�"+NStat[N].tagG);
	sTmpl='var '+sArrName+'=[];'+sLeft+sTmpl+'");return '+sArrName+'.join("");';
	//alert('ת�����\n'+sTmpl);
	return new Function('opts',sTmpl);
};

QW.Tmpl=Tmpl;
})();