

(function(){
	/**
	* @class SelectAssist SelectAssist是一个Json对象，是针对Select标签的小工具箱
	* @singleton 
	* @namespace QW
	*/
	var SelectAssist={};
	var $=QW.NodeH.$,
		fire=QW.EventTargetH.fire;

	/** 
	* 向一个Select对象上添加options
	* @method appendOptions
	* @static
	* @param {Element} el SelectElement
	* @param {array} optsAr options的数据数组
		*	如果其元素也是数组，则其元素的第一个子元素为option的text，第二个子元素为option的value；
		*	如果其元素为字符串，则option的text和value都是该字符串
	* @param {string} val 选中值
	* @return {void} 
	*/
	SelectAssist.appendOptions=function(el,optsAr,val){
		SelectAssist.refreshOptions(el,optsAr,val,$(el).length);
	};

	/** 
	* 更新一个Select对象的options
	* @method refreshOptions
	* @static
	* @param {Element} el SelectElement
	* @param {array} optsAr options的数据数组
		*	如果其元素也是数组，则其元素的第一个子元素为option的text，第二个子元素为option的value；
		*	如果其元素为字符串，则option的text和value都是该字符串
	* @param {string} val 选中值
	* @param {int} keepNum 需要保修的options数目，默认为1
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
	* 绑定组联下拉框
	*	对于被绑定成级联的下拉框，会多出以下几个属性：
	*		parentSelect----父select
	*		subSelect----子select
	*		optDataSrc----本select的数据来源，可以是function，也可以是array
	*		minLength----option的最小数目
	*		attribute:defaultValue----第一次初始化时的默认值
	* @method cascadeSelects
	* @static
	* @param {Json} opts 传入参数，支持以下属性：
		* selects:数组，依次为父/子/孙下拉框，如[province,city,county];
		* defaultValues: 数组，各下拉框的初始值[province,city,county];
		* optDataSrc: 数组，各下拉框的数据来源，可以是Array，也可以是闭包，闭包参数为[province,city,county];
		* minLengths: 数组，各下拉框的最少options数目，即：更新该下拉框时保留的options的数目，默认为初始化时各下拉框的options数目;
	* @return {void} 
	*/

	SelectAssist.cascadeSelects=function(opts){
		var els=opts.selects,vals=opts.defaultValues||[],minLengths=opts.minLengths||[];
		for(var i=0;i<els.length;i++) {
			els[i]=$(els[i]);
		}
		for(var i=0;i<els.length;i++) //初始化
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
		for(var i=0;i<els.length;i++) //设默认值
		{
			SelectAssist.refreshCascadedSelect(els[i]);
			var val=els[i].getAttribute("defaultValue");
			if(val!=null) {
				els[i].value=val+"";// 加空值是为了避免一个IEbug
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
	* 绑定地址级联下拉框
	* @method cascadeArea
	* @static
	* @param {Json} opts 传入参数，支持以下属性：
		* selects:数组，依次为父/子/孙下拉框，如[province,city,county];
		* defaultValues: 各下拉框的初始值[province,city,county];
		* minLengths: 数组，各下拉框的最少options数目，即：更新该下拉框时保留的options的数目，默认为初始化时各下拉框的options数目;
		* AREAS:json，省市级联数据来源
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
	* 两个option交换属性(用dom节点的调换，会导致scrollTop不可控。)
	* @method swapOptionProperties
	* @static
	* @param {OptionElement} opt1 Option Element：
	* @param {OptionElement} opt1 Option Element：
	* @return {void} 
	*/
	SelectAssist.swapOptionProperties=function(opt1,opt2){
		//opt1.swapNode(opt1);//用dom节点的调换，会导致scrollTop不可控。
		var props=["value","text","selected"];
		for(var i=0;i<props.length;i++){
			var p=props[i],v=opt1[p];
			opt1[p]=opt2[p];
			opt2[p]=v;
		}
	};

	/** 
	* 移动选中option的位置
	* @method moveOption
	* @static
	* @param {SelectElement} el Select Element：
	* @param {int} step 移动方向，-1表示上移一位，1表示下移一位，-2表示移到顶部，2表示移到底部：
	* @return {void} 
	*/
	SelectAssist.moveOption=function(el,step){
		var opts=el.options;
		if(step==-1){//moveUp.向上移一位
			for(var i=1;i<opts.length;i++) {
				if( opts[i].selected && !opts[i-1].selected ) {
					SelectAssist.swapOptionProperties(opts[i],opts[i-1]);
				}
			}
		}
		else if(step==1){//moveDown向下移一位
			for(var i=opts.length-2;i>-1;i--) {
				if( opts[i].selected && !opts[i+1].selected ) {
					SelectAssist.swapOptionProperties(opts[i],opts[i+1]);
				}
			}
		}
		else if(step==-2){//moveToTop移到顶
			var oRef=null;
			for(var i=0;i<opts.length;i++) {
				if( opts[i].selected) {
					if(oRef) el.insertBefore(opts[i],oRef);
				}
				else if(!oRef ) {
					oRef=opts[i];
				}
			}
			if(true) {//控制滚动条(IE下有点乱，仍然不理想)。
				oRef=opts[0];
				oRef.text+="";
				oRef.selected=true;
			}
		}
		else if(step==2){//moveToBottom移到底
			var oRef=null;
			for(var i=opts.length-1;i>-1;i--) {
				if( opts[i].selected ) {
					oRef=el.insertBefore(opts[i],oRef);
				}
			}
			if(oRef) {//控制滚动条(IE下有点乱，仍然不理想)。
				oRef=opts[opts.length-1];
				oRef.text+="";
				oRef.selected=true;
			}
		}
		else throw new Error("参数错误。")
	};

	/** 
	* 迁移option
	* @method transferOption
	* @static
	* @param {SelectElement} el Select Element：
	* @param {SelectElement} el Select Element：
	* @param {boolean} isForAll 是否全部迁移
	* @return {void} 
	*/
	SelectAssist.transferOption=function(el1,el2,isForAll){
		var opts=el1.options;
		for(var i=0;i<opts.length;i++){
			if(isForAll || opts[i].selected){
				var opt=el2.appendChild(opts[i]);
				opt.text+="";//控制滚动条(IE下有点乱，仍然不理想)
				opt.selected=true;
				i--;
			}
		}
	};


	/** 
	* 绑定商圈级联下拉框
	* @method cascadeArea
	* @static
	* @param {Json} opts 传入参数，支持以下属性：
		* selects:数组，依次为父/子/孙下拉框，如[province,city,county];
		* defaultValues: 各下拉框的初始值[province,city,county];
		* minLengths: 数组，各下拉框的最少options数目，即：更新该下拉框时保留的options的数目，默认为初始化时各下拉框的options数目;
		* AREAS:json，省市级联数据来源
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
	* 绑定行业级联下拉框
	* @method cascadeIndustry
	* @static
	* @param {Json} opts 传入参数，支持以下属性：
		* selects:数组，依次为父/子/孙下拉框，如[province,city,county];
		* defaultValues: 各下拉框的初始值[province,city,county];
		* minLengths: 数组，各下拉框的最少options数目，即：更新该下拉框时保留的options的数目，默认为初始化时各下拉框的options数目;
		* AREAS:json，省市级联数据来源
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

