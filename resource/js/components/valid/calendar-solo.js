
window.QWCalendar=(function(){
	var Calendar={VERSION:"0.0.1"};
	var Env=function(){
			var na=window.navigator,ua = na.userAgent.toLowerCase();
			// 判断浏览器的代码,部分来自JQuery,致谢!
			var b= {
				platform: na.platform,
				//mozilla: /mozilla/.test( ua ) && !/(compatible|webkit|firefox)/.test( ua ),//废弃
				msie: /msie/.test( ua ) && !/opera/.test( ua ),
				opera: /opera/.test( ua ),
				//gecko: /gecko/.test( ua ) && /khtml/.test( ua ),//废弃
				safari: /webkit/.test( ua ) && !/chrome/.test( ua ),
				firefox: /firefox/.test( ua ) ,
				chrome: /chrome/.test( ua )
			};
			var vMark="";
			for(var i in b){
				if(b[i]) vMark=i;
			}
			if(b.safari) vMark="version";
			b.version=(ua.match( new RegExp("(?:"+vMark+")[\\/: ]([\\d.]+)") ) || [])[1];
			b.ie=b.msie;
			b.ie6=b.msie && parseInt(b.version)==6;
			try{b.maxthon=b.msie && !!external.max_version;} catch(ex){}
			return b;
		}();

	var QW={
		PATH: '../../../',//(function(){var sTags=document.getElementsByTagName("script");return  sTags[sTags.length-1].src.replace(/\/[^\/]+\/[^\/]+$/,"/");})(),
		DateH:{
			/*
			* 格式化日期
			* @method format
			* @param {Date} d 日期对象
			* @param {string} pattern 日期格式(y年M月d天h时m分s秒)，默认为"yyyy-MM-dd"
			* @return {string}  返回format后的字符串
			* @example
				var d=new Date();
				alert(format(d," yyyy年M月d日\n yyyy-MM-dd\n MM-dd-yy\n yyyy-MM-dd hh:mm:ss"));
			*/
			format:function(d,pattern)
			{
				pattern=pattern||"yyyy-MM-dd";
				var y=d.getFullYear();
				var o = {
					"M" : d.getMonth()+1, //month
					"d" : d.getDate(),    //day
					"h" : d.getHours(),   //hour
					"m" : d.getMinutes(), //minute
					"s" : d.getSeconds() //second
				}
				pattern=pattern.replace(/(y+)/ig,function(a,b){var len=Math.min(4,b.length);return (y+"").substr(4-len);});
				for(var i in o){
					pattern=pattern.replace(new RegExp("("+i+"+)","g"),function(a,b){return (o[i]<10 && b.length>1 )? "0"+o[i] : o[i]});
				}
				return pattern;
			}
		},
		EventH:{
			/*
			* 获得触发事件的对象
			* @method	target
			* @optional {event}		event	event对象 默认为调用位置所在宿主的event
			* @optional {element}	element 任意element对象 element对象所在宿主的event
			* @return	{element}	node 对象
			*/
			target : function (e) {
				e = e||window.e;
				if(!e) alert(e);
				return e.target || e.srcElement;
			}

		},
		NodeH:{
			on:function(el, sEvent, observer) {
				if (el.addEventListener) {
					el.addEventListener(sEvent, observer, false);
				} else if (el.attachEvent) {
					el.attachEvent('on' + sEvent, observer);
				}
			},
			/*
			* 判断目标是否是element对象的子孙节点
			* @method	contains
			* @param	{element|string|wrap}	element		id,Element实例或wrap
			* @param	{element|string|wrap}	target		目标 id,Element实例或wrap
			* @return	{boolean}				判断结果
			*/
			contains : function (element, target) {
				return element.contains
					? element != target && element.contains(target)
					: !!(element.compareDocumentPosition(target) & 16);
			},

			/*
			* 获取element对象距离doc的xy坐标
			* @method	getXY
			* @param	{element|string|wrap}	element		id,Element实例或wrap
			* @return	{array}					x, y
			*/
			getXY : function() {
				if (document.documentElement.getBoundingClientRect && !!window.ActiveXObject) {
				// IE
					return function (element) {
						var box       = element.getBoundingClientRect()
							, offsetX = box.left - (Env.ie6 ? 0 : 2)
							, offsetY = box.top - (Env.ie6 ? 0 : 2)
							, rect    = null;

						if (Env.ie) {
							offsetX += document.documentElement.scrollLeft, offsetY += document.documentElement.scrollTop;
						}
						try {
							var f = element.ownerDocument.parentWindow.frameElement || null;
							if (f) {
								var offset = 2 - (f.frameBorder || 1) * 2;
								offsetX += offset;
								offsetY += offset;
							}
						}
						catch(exp) {}

						return [offsetX, offsetY];
					}

				} else {

					return function(element) { 
					// manually calculate by crawling up offsetParents
						var pos = [element.offsetLeft, element.offsetTop];
						var parentNode = element.offsetParent;
						var patterns = {
							HYPHEN: /(-[a-z])/i, // to normalize get/setStyle
							ROOT_TAG: /^(?:body|html)$/i, // body for quirks mode, html for standards
							OP_SCROLL:/^(?:inline|table-row)$/i
						};

						// safari: subtract body offsets if el is abs (or any offsetParent), unless body is offsetParent
						//Browser.isSafari
						var accountForBody = (Env.safari && NodeH.getCurrentStyle(element, 'position') == 'absolute' && element.offsetParent == element.ownerDocument.body);

						if (parentNode != element) {
							while (parentNode) {
								pos[0] += parentNode.offsetLeft;
								pos[1] += parentNode.offsetTop;
								if (!accountForBody && Env.safari && NodeH.getCurrentStyle(parentNode, 'position') == 'absolute') { 
									accountForBody = true;
								}
								parentNode = parentNode.offsetParent;
							}
						}

						if (accountForBody) { 
						//safari doubles in this case
							pos[0] -= element.ownerDocument.body.offsetLeft;
							pos[1] -= element.ownerDocument.body.offsetTop;
						}

						parentNode = element.parentNode;

						// account for any scrolled ancestors
						while ( parentNode.tagName && !patterns.ROOT_TAG.test(parentNode.tagName) ) {
							if (parentNode.scrollTop || parentNode.scrollLeft) {
							// work around opera inline/table scrollLeft/Top bug (false reports offset as scroll)
								if (!patterns.OP_SCROLL.test(NodeH.getCurrentStyle(parentNode, 'display'))) { 
									if (!Env.opera || NodeH.getCurrentStyle(parentNode, 'overflow') !== 'visible') { // opera inline-block misreports when visible
										pos[0] -= parentNode.scrollLeft;
										pos[1] -= parentNode.scrollTop;
									}
								}
							}
							parentNode = parentNode.parentNode; 
						}

						return pos;
					};

				}
			}()
		}
	},
	mix=function(des, src){
		for(var i in src){
			des[i] = src[i];
		}
		return des;
	},
	formatDate=QW.DateH.format,
	$=function(id){return document.getElementById(id);};

	mix(Calendar,{
		monthMsg: ["\u4E00\u6708", "\u4E8C\u6708", "\u4E09\u6708","\u56DB\u6708", "\u4E94\u6708", "\u516D\u6708", "\u4E03\u6708", "\u516B\u6708", "\u4E5D\u6708", "\u5341\u6708", "\u5341\u4E00\u6708", "\u5341\u4E8C\u6708"],
		dayMsg: ["\u65E5", "\u4E00", "\u4E8C", "\u4E09","\u56DB", "\u4E94", "\u516D"],
		firstDay: 1,//first day of week. 1: Monday is the first day; 0: Sunday is the first day
		maxDate: (new Date().getFullYear()+2)+"/12/31",
		minDate: "2008/01/01",
		_rendered:false,
		_render: function(){
			if(Calendar._rendered) return;


			var sStyle='#cal_wrap{text-align:center;background-color:#fff;border:solid #cccccc 1px;}\
#cal_hd{background-color: #F6DEA9;padding:2px 0px;}\
#cal_hd select{width:75px}\
#cal_hd map{float:left}\
#cal_bd{padding:7px 5px;}\
#cal_ft button{width:60px}\
#cal_bd table{border-collapse: collapse;width:100%;border-bottom: 1px #F6DEA9 solid;}\
#cal_bd thead tr{background-color:#F9EAC8;border-bottom: 1px #F6DEA9  solid;}\
#cal_bd thead th{padding:3px;}\
#cal_bd tbody{width:100%;}\
#cal_bd td,#cal_bd th{border:0;text-align: center;font-size: 12px;width:14%;padding:1px;}\
#cal_bd td a,#cal_bd td span{text-decoration: none;color:#333;padding:2px;display:block;zoom:1;}\
#cal_bd td.othermonthdayTd a{color:#999;}\
#cal_bd td span{color:#B5B5B5;}\
#cal_bd td a:hover{color:#fff;background-color:#76D814;}\
#cal_bd .thisdayTd a{color:#fff;background-color:#60B10D;}\
#cal_bd .sundayTd a{color:#60B10D}\
#cal_bd .saturdayTd a{color:#60B10D}';
			var oStyle=document.createElement("style");
			oStyle.type="text/css";
			if (oStyle.styleSheet) { 
				oStyle.styleSheet.cssText=sStyle;  
			}
			else {  
				oStyle.appendChild(document.createTextNode(sStyle));  
			} 
			document.getElementsByTagName("head")[0].appendChild(oStyle); 
			var html=[];
			var sSelect=['<select></select> ',
				'<img src="'+QW.PATH+'components/valid/assets/UpAndDown.gif" align="absMiddle" usemap="#year_change_map"/>',
				'<map name="year_change_map">',
				'<area shape="rect" coords="0,0,13,8" href="#"/>',
				'<area shape="rect" coords="0,10,13,17" href="#"/>',
				'</map>'
				].join("");
			html.push('<div id="cal_hd">'+sSelect+'&nbsp;&nbsp;'+sSelect.replace(/year/g,"month")+'</div>',
				'<div id="cal_bd" align=center width=100% ></div>',
				'<div id="cal_ft">',
				'<button>\u786E\u5B9A</button>&nbsp;&nbsp;',
				'<button>\u6E05\u7A7A</button>&nbsp;&nbsp;',
				'<button>\u53D6\u6D88</button>',
				'</div>');
			oWrap=$("cal_wrap");
			oWrap.innerHTML=html.join("");
			oBody=oWrap.childNodes[1];
			QW.NodeH.on(oBody,'click',function(e){
					var el=QW.EventH.target(e);
					if (el.tagName!="A" ) return ;
					var value=el.getAttribute("dateValue");
					if (value!=null){
						Calendar.backfill(value);
					}
			});
			var els=oWrap.getElementsByTagName("select");
			oYear=els[0];
			oMonth=els[1];
			oYear.onchange=oMonth.onchange=Calendar.redraw;
			els =oWrap.getElementsByTagName("area");//上下翻年月
			els[0].onclick=function(){
				if(oYear[SI]>0) {oYear[SI]-- ;Calendar.redraw();};return false;
			};
			els[1].onclick=function(){
				if(oYear[SI]<oYear.length-1) {oYear[SI]++;Calendar.redraw();};return false
			};
			els[2].onclick=function(){
				if(oMonth[SI]==0){
					if(oYear[SI]>0){
						oYear[SI]--;
						oMonth[SI]=(oMonth[SI]+oMonth.length-1)%oMonth.length;
					}
				}
				else{
					oMonth[SI]=(oMonth[SI]+oMonth.length-1)%oMonth.length;
				}
				Calendar.redraw();
				return false;
			};
			els[3].onclick=function()	{
				if(oMonth[SI]==oMonth.length-1){
					if(oYear[SI]<oYear.length-1){
						oYear[SI]++;
						oMonth[SI]=(oMonth[SI]+1)%oMonth.length;
					}
				}
				else{
					oMonth[SI]=(oMonth[SI]+1)%oMonth.length;
				}
				Calendar.redraw();
				return false;
			};
			els =oWrap.getElementsByTagName("button");
			els[0].onclick=function(){
						if(selectedDate) Calendar.backfill(formatDate(selectedDate));
			};
			els[1].onclick=function(){
						Calendar.backfill("");
			};
			els[2].onclick=function(){
						Calendar.backfill();
			};
			Calendar._rendered=true;
		},
		init:function(){
			if(!Calendar._rendered) Calendar._render();
			var el=window.latestDateInput || document.createElement("input");
			maxDate=new Date((el.getAttribute("maxValue")||Calendar.maxDate).replace(/\.|-/g,"/"));
			minDate=new Date((el.getAttribute("minValue")||Calendar.minDate).replace(/\.|-/g,"/"));
			var val=el.value;
			if(val) defaultDate=new Date(val.replace(/\.|-/g,"/"));
			if(isNaN(defaultDate) || !val) defaultDate=window.systemDate||new Date();
			var year=defaultDate.getFullYear();
			var minY=minDate.getFullYear();
			var maxY=maxDate.getFullYear();
			oYear.length=maxY-minY+1
			for(var i=0;i<=maxY-minY;i++){
				var oOption=oYear.options[i];
				oOption.value=oOption.text=i+minY;
			}
			if(year>=minY && year<= maxY) oYear.value=year;
			else oYear[SI]=0;
			var month=defaultDate.getMonth(),minM=0,maxM=11;
			if(minY==maxY){
				minM=minDate.getMonth();
				maxM=maxDate.getMonth();
			}
			oMonth.length=maxM-minM+1;
			for(var i=0;i<=maxM-minM;i++){
				var oOption=oMonth.options[i];
				oOption.value=i+minM+1;
				oOption.text=Calendar.monthMsg[i+minM];
			}
			if(month>=minM && month<= maxM) oMonth.value=month+1;
			else oMonth[SI]=0;
			Calendar.redraw();
		},
		redraw:function(){
			selectedDate=null;
			var html=['<table><thead><tr>'];
			for( var i =0 ;i< 7;i++ ) html.push('<th class="titleTd">'+Calendar.dayMsg[(i+Calendar.firstDay)%7]+'</th>');
			html.push('</tr></thead><tbody>');
			var year=oYear.value*1;
			var month=oMonth.value-1;
			var date=Math.min(defaultDate.getDate(),new Date(year,month+1,0).getDate());
			var fromDate=-(new Date(year,month,1).getDay()+7-Calendar.firstDay)%7+1;
			for(var i=0;i<42;i++){
				var d=new Date(year,month,fromDate+i);
				if(i%7==0) html.push('<tr>');
				var tdClass="commondayTd";
				if(d>maxDate || d<minDate){
					html.push('<td class=invaliddayTd><span title="\u65E5\u671F\u8D85\u51FA\u53EF\u9009\u8303\u56F4">'+d.getDate()+'</span></td>');
				}
				else{
					if( d.getMonth()==month && d.getDate()==date) {
						tdClass="thisdayTd";
						selectedDate=d;
					}
					else if(d.getDay()==0) tdClass="sundayTd";
					else if (d.getDay()==6) tdClass="saturdayTd";
					if(d.getMonth()!=month) tdClass="othermonthdayTd";
					html.push('<td class='+tdClass+'><a href="#" onclick="return false;" dateValue="'+formatDate(d)+'" title="'+formatDate(d)+'" >'+d.getDate()+'</a></td>');
				}
				if(i%7==6) {
					html.push('</tr>');
				}
			}
			html.push('</tbody></table>');
			oBody.innerHTML=html.join("");
		},
		backfill:function(d){
			if(d!=null){
				var el=window.latestDateInput;
				try{
					if(el!=null){
						setTextValue(el,d);
						el.select();
						el.focus();
					}
				}
				catch(e){;}
			}
			try{window.calendarPopup.hide();}
			catch(e){;}
		}
	});
	var oWrap,oBody,oYear,oMonth;
	var maxDate,minDate,selectedDate,defaultDate;//分别是：输入框的最大日期、最小日期、临时选中日期、默认日期（如果有值就是本身，否则就是系统时间）。
	var SI="selectedIndex";//节约点资源

	function setTextValue(obj,value) 
	{
		if(obj.createTextRange) obj.createTextRange().text=value;
		else obj.value=value;
	}

	function LayerPopup(opts){
		var me=this;
		var div=document.createElement('div');
		div.style.position='absolute';
		div.style.width='200px';
		div.style.zIndex=100;
		div.style.backgroundColor='#fff';
		div.style.border='solid #cccccc 1px';
		document.body.insertBefore(div,document.body.firstChild);
		div.innerHTML='<div></div>';
		var bdDiv=div.getElementsByTagName('div')[0];
		me.oWrap=div;
		me.hide=function(){div.style.display='none';};
		me.show=function(x,y,w,h,el){
			var style=this.oWrap.style;
			//设宽/高
			if(w!=null){
				style.width=w+"px";
			}
			if(h!=null){
				style.height=h+"px";
			}
			//设位置
			{
				x=x||0;
				y=y||0;
				if(el){
					var xy=QW.NodeH.getXY(el);
					x+=xy[0];
					y+=xy[1];
				}
				style.left=x+"px";
				style.top=y+"px";
			}
			style.display="block";
		};
		me.setContent=function(innerHtml){
			bdDiv.innerHTML=innerHtml;
		};
		var hideHdl=function(e){
			if(!QW.NodeH.contains(div,QW.EventH.target(e))) me.hide();
		}
		QW.NodeH.on(document.documentElement,'mousedown',hideHdl);
		QW.NodeH.on(document.documentElement,'keydown',hideHdl);
	}


	Calendar.getDateFromPopup=function(el){
		if(el.type!="text") el=el.previousSibling;
		window.latestDateInput=el;
		if(!window.calendarPopup){
			var popup = window.calendarPopup=new LayerPopup({
				close: false,useIframe: false,shadow:true,header:false,className:'panel-cal'
			});
			popup.setContent('<div id="cal_wrap">Calendar</div>');
		}
		Calendar.init();
		var posEl=el,calPosElId=posEl.getAttribute('calPosElId');
		if(calPosElId){
			posEl=$(calPosElId)
		}
		window.calendarPopup.show(0,posEl.offsetHeight,250,null,posEl);
	};


	return Calendar;
})();



