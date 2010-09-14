

(function(){
	/**
	* @class SelectAssist SelectAssist��һ��Json���������Select��ǩ��С������
	* @singleton 
	* @namespace QW
	*/
	var SelectAssist={};
	var $=QW.NodeH.$,
		fire=QW.EventTargetH.fire;

	/** 
	* ��һ��Select���������options
	* @method appendOptions
	* @static
	* @param {Element} el SelectElement
	* @param {array} optsAr options����������
		*	�����Ԫ��Ҳ�����飬����Ԫ�صĵ�һ����Ԫ��Ϊoption��text���ڶ�����Ԫ��Ϊoption��value��
		*	�����Ԫ��Ϊ�ַ�������option��text��value���Ǹ��ַ���
	* @param {string} val ѡ��ֵ
	* @return {void} 
	*/
	SelectAssist.appendOptions=function(el,optsAr,val){
		SelectAssist.refreshOptions(el,optsAr,val,$(el).length);
	};

	/** 
	* ����һ��Select�����options
	* @method refreshOptions
	* @static
	* @param {Element} el SelectElement
	* @param {array} optsAr options����������
		*	�����Ԫ��Ҳ�����飬����Ԫ�صĵ�һ����Ԫ��Ϊoption��text���ڶ�����Ԫ��Ϊoption��value��
		*	�����Ԫ��Ϊ�ַ�������option��text��value���Ǹ��ַ���
	* @param {string} val ѡ��ֵ
	* @param {int} keepNum ��Ҫ���޵�options��Ŀ��Ĭ��Ϊ1
	* @return {void} 
	*/
	SelectAssist.refreshOptions=function(el,optsAr,val,keepNum){
		el=$(el);
		if(keepNum==null) keepNum=1;
		if(keepNum<el.length) el.length=keepNum;
		var len;
		if(optsAr && (len=optsAr.length)){
			var idx=el.length,valExist=false;
			for(var i=0;i<len;i++){
				var o=optsAr[i]||"";
				if(o.constructor==Array){
					el[idx+i]=new Option(o[0],o[1]);
					valExist || (valExist=o[1]==val)
				}
				else {
					el[idx+i]=new Option(o,o,o==val);
					valExist || (valExist=o==val)
				}
			}
		}
		//alert([val,valExist]);
		if(valExist) el.defaultValue=el.value=val;

		fire(el,"change");
	};
	/** 
	* ������������
	*	���ڱ��󶨳ɼ����������򣬻������¼������ԣ�
	*		parentSelect----��select
	*		subSelect----��select
	*		optDataSrc----��select��������Դ��������function��Ҳ������array
	*		minLength----option����С��Ŀ
	*		attribute:defaultValue----��һ�γ�ʼ��ʱ��Ĭ��ֵ
	* @method cascadeSelects
	* @static
	* @param {Json} opts ���������֧���������ԣ�
		* selects:���飬����Ϊ��/��/����������[province,city,county];
		* defaultValues: ���飬��������ĳ�ʼֵ[province,city,county];
		* optDataSrc: ���飬���������������Դ��������Array��Ҳ�����Ǳհ����հ�����Ϊ[province,city,county];
		* minLengths: ���飬�������������options��Ŀ���������¸�������ʱ������options����Ŀ��Ĭ��Ϊ��ʼ��ʱ���������options��Ŀ;
	* @return {void} 
	*/

	SelectAssist.cascadeSelects=function(opts){
		var els=opts.selects,vals=opts.defaultValues||[],minLengths=opts.minLengths||[];
		for(var i=0;i<els.length;i++) {
			els[i]=$(els[i]);
		}
		for(var i=0;i<els.length;i++) //��ʼ��
		{
			els[i].minLength=minLengths[i]!=null?minLengths[i]:els[i].length;
			if(vals[i]!=null) els[i].setAttribute("defaultValue",vals[i]);
			else vals[i]=els[i].getAttribute("defaultValue");
			els[i].optDataSrc=opts.optDataSrc[i];
			if(i>0) els[i].parentSelect=els[i-1];
			if(i<els.length-1){
				els[i].subSelect=els[i+1];
				if(!els[i].onchange) els[i].onchange=SelectAssist._cascadeOnchange;
			}
		}
		for(var i=0;i<els.length;i++) //��Ĭ��ֵ
		{
			SelectAssist.refreshCascadedSelect(els[i]);
			var val=els[i].getAttribute("defaultValue");
			if(val!=null) {
				els[i].value=val+"";// �ӿ�ֵ��Ϊ�˱���һ��IEbug
				fire(els[i],"change");
			}
		}
	};
	SelectAssist._cascadeOnchange=function(e){
		SelectAssist.refreshCascadedSelect(this.subSelect);
	};

	SelectAssist.refreshCascadedSelect=function(el){
		var ar=el.optDataSrc;
		if(typeof(ar)=="function") ar=ar.call(el,el);
		SelectAssist.refreshOptions(el,ar,null,el.minLength);
	};
	/** 
	* �󶨵�ַ����������
	* @method cascadeArea
	* @static
	* @param {Json} opts ���������֧���������ԣ�
		* selects:���飬����Ϊ��/��/����������[province,city,county];
		* defaultValues: ��������ĳ�ʼֵ[province,city,county];
		* minLengths: ���飬�������������options��Ŀ���������¸�������ʱ������options����Ŀ��Ĭ��Ϊ��ʼ��ʱ���������options��Ŀ;
		* AREAS:json��ʡ�м���������Դ
	* @return {void} 
	*/
	SelectAssist.cascadeArea=function(opts) {
		var areas=opts.AREAS||SelectAssist.AREAS
		opts.optDataSrc=[areas.PROVINCES,
			function(el){return areas.CITIES[el.parentSelect.value];},
			function(el){return areas.COUNTIES[el.parentSelect.value];}
			];
		SelectAssist.cascadeSelects(opts);
	};

	/** 
	* ����option��������(��dom�ڵ�ĵ������ᵼ��scrollTop���ɿء�)
	* @method swapOptionProperties
	* @static
	* @param {OptionElement} opt1 Option Element��
	* @param {OptionElement} opt1 Option Element��
	* @return {void} 
	*/
	SelectAssist.swapOptionProperties=function(opt1,opt2){
		//opt1.swapNode(opt1);//��dom�ڵ�ĵ������ᵼ��scrollTop���ɿء�
		var props=["value","text","selected"];
		for(var i=0;i<props.length;i++){
			var p=props[i],v=opt1[p];
			opt1[p]=opt2[p];
			opt2[p]=v;
		}
	};

	/** 
	* �ƶ�ѡ��option��λ��
	* @method moveOption
	* @static
	* @param {SelectElement} el Select Element��
	* @param {int} step �ƶ�����-1��ʾ����һλ��1��ʾ����һλ��-2��ʾ�Ƶ�������2��ʾ�Ƶ��ײ���
	* @return {void} 
	*/
	SelectAssist.moveOption=function(el,step){
		var opts=el.options;
		if(step==-1){//moveUp.������һλ
			for(var i=1;i<opts.length;i++) {
				if( opts[i].selected && !opts[i-1].selected ) {
					SelectAssist.swapOptionProperties(opts[i],opts[i-1]);
				}
			}
		}
		else if(step==1){//moveDown������һλ
			for(var i=opts.length-2;i>-1;i--) {
				if( opts[i].selected && !opts[i+1].selected ) {
					SelectAssist.swapOptionProperties(opts[i],opts[i+1]);
				}
			}
		}
		else if(step==-2){//moveToTop�Ƶ���
			var oRef=null;
			for(var i=0;i<opts.length;i++) {
				if( opts[i].selected) {
					if(oRef) el.insertBefore(opts[i],oRef);
				}
				else if(!oRef ) {
					oRef=opts[i];
				}
			}
			if(true) {//���ƹ�����(IE���е��ң���Ȼ������)��
				oRef=opts[0];
				oRef.text+="";
				oRef.selected=true;
			}
		}
		else if(step==2){//moveToBottom�Ƶ���
			var oRef=null;
			for(var i=opts.length-1;i>-1;i--) {
				if( opts[i].selected ) {
					oRef=el.insertBefore(opts[i],oRef);
				}
			}
			if(oRef) {//���ƹ�����(IE���е��ң���Ȼ������)��
				oRef=opts[opts.length-1];
				oRef.text+="";
				oRef.selected=true;
			}
		}
		else throw new Error("��������")
	};

	/** 
	* Ǩ��option
	* @method transferOption
	* @static
	* @param {SelectElement} el Select Element��
	* @param {SelectElement} el Select Element��
	* @param {boolean} isForAll �Ƿ�ȫ��Ǩ��
	* @return {void} 
	*/
	SelectAssist.transferOption=function(el1,el2,isForAll){
		var opts=el1.options;
		for(var i=0;i<opts.length;i++){
			if(isForAll || opts[i].selected){
				var opt=el2.appendChild(opts[i]);
				opt.text+="";//���ƹ�����(IE���е��ң���Ȼ������)
				opt.selected=true;
				i--;
			}
		}
	};


	/** 
	* ����Ȧ����������
	* @method cascadeArea
	* @static
	* @param {Json} opts ���������֧���������ԣ�
		* selects:���飬����Ϊ��/��/����������[province,city,county];
		* defaultValues: ��������ĳ�ʼֵ[province,city,county];
		* minLengths: ���飬�������������options��Ŀ���������¸�������ʱ������options����Ŀ��Ĭ��Ϊ��ʼ��ʱ���������options��Ŀ;
		* AREAS:json��ʡ�м���������Դ
	* @return {void} 
	*/
	SelectAssist.cascadeDianAddress=function(opts) {
		opts.optDataSrc=[
			function(el){
				var arr=[];
				var data = SelectAssist.DianAddress;
				//locid":"75fb2a357d38397c5e1e75fa","level":"1","locname":"\u5317\u4eac","
				for(var i in data){
					arr.push([data[i].locname,i]);
				}
				return arr;
			},
			function(el){
				var arr=[];
				var data = SelectAssist.DianAddress[el.parentSelect.value];
				if(!data) return [];
				data=data._children;
				if(!data) return [];
				//locid":"75fb2a357d38397c5e1e75fa","level":"1","locname":"\u5317\u4eac","
				for(var i in data){
					arr.push([data[i].locname,i]);
				}
				return arr;
			},
			function(el){
				var arr=[];
				var data=SelectAssist.DianAddress[el.parentSelect.parentSelect.value];
				if(!data) return [];
				data=data._children;
				if(!data) return [];
				data=data[el.parentSelect.value];
				if(!data) return [];
				data=data._children;
				if(!data) return [];
				//locid":"75fb2a357d38397c5e1e75fa","level":"1","locname":"\u5317\u4eac","
				for(var i in data){
					arr.push([data[i].locname,i]);
				}
				return arr;
			}
		];
		SelectAssist.cascadeSelects(opts);
	};

	SelectAssist.initDianAddress = function(d) {
		SelectAssist.DianAddress = d.data.data;
	};

	/** 
	* ����ҵ����������
	* @method cascadeIndustry
	* @static
	* @param {Json} opts ���������֧���������ԣ�
		* selects:���飬����Ϊ��/��/����������[province,city,county];
		* defaultValues: ��������ĳ�ʼֵ[province,city,county];
		* minLengths: ���飬�������������options��Ŀ���������¸�������ʱ������options����Ŀ��Ĭ��Ϊ��ʼ��ʱ���������options��Ŀ;
		* AREAS:json��ʡ�м���������Դ
	* @return {void} 
	*/
	SelectAssist.cascadeIndustry=function(opts) {
		opts.optDataSrc=[
			function(el){
				var arr=[];
				var data = SelectAssist.Industry;
				//locid":"75fb2a357d38397c5e1e75fa","level":"1","locname":"\u5317\u4eac","
				for(var i in data){
					arr.push([data[i].cname,i]);
				}
				return arr;
			},
			function(el){
				var arr=[];
				var data = SelectAssist.Industry[el.parentSelect.value];
				if(!data) return [];
				data=data._children;
				if(!data) return [];
				//locid":"75fb2a357d38397c5e1e75fa","level":"1","locname":"\u5317\u4eac","
				for(var i in data){
					arr.push([data[i].cname,i]);
				}
				return arr;
			}
		];
		SelectAssist.cascadeSelects(opts);
	};

	SelectAssist.initIndustry = function(d) {
		SelectAssist.Industry = d.data.data;
	};

	QW.provide('SelectAssist',SelectAssist);
})();

