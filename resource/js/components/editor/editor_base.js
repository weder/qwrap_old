/*
Editor�İ�˵��(2008-12-03)��
1.��Ӷ�Safari,Opera,Chrome��֧��
2.ǿ��tab�����ã�ǿ��toobaritem������
3.����editor��html dom�ṹ���޸Ĳ���className
4.ȥ��popupLayer������Panel.js���LayerPopup
5.���ִ������
6.����
*/



(function(){

	/**
	* @class Editor �༭��
	* @constructor
	* @namespace QW
	* @param  {Json} opts, �༭���������������ԣ�Ŀǰֻ֧�֣�
				container: {HTMLElement}, �༭�����ⲿ����
				textarea: {Textarea HTMLElement} �༭����Դ�ļ�textarea, ������ʼ������ʾ�༭���ݵ�Դ����
				height: {int} �߶�pxֵ.
				insertImgUrl,ָ�����ͼƬ�ĶԻ���URL��Ĭ��Ϊ�գ�Ϊ��ʱֻ������ͼƬ;
				tiConfig,������ַ������������ñ༭���Ĺ��ܰ�ť��������ַ������������key������Editor.tiConfigs��ȡ��Ӧ��tiConfig������;
	* @return {Editor} ����Editorʵ��
	*/

	function Editor(options){
		this.options=options;
		if(!this.lazyRender) this.render();
	}

	/**
	* @static
	* @property {Editor} activeInstance ��ǰ��Ծ�ĸ��ı�ʵ����
	*/
	Editor.activeInstance=null;
	/**
	* @static
	* @property {string} editorPath editor��js·����
	*/
	Editor.editorPath=QW.PATH+'components/editor/';
	/**
	* @static
	* @property {Array} EVENTS �¼����ܡ�
	*/
	Editor.EVENTS=[
			/**
			* @event switchmode �л��༭״̬�¼���
			*/
			'switchmode'
		];

	var Browser=QW.Browser,
		fire=function(el,sEvent){
			if(el.fireEvent) {   
				el.fireEvent('on'+sEvent);   
			}else{  
				if(sEvent.indexOf("mouse")>-1 || ",click,dblclick".indexOf(","+sEvent)>-1){
					var evt = el.ownerDocument.createEvent('MouseEvents');
					evt.initMouseEvent(sEvent, true, true, el.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false, false,false, 0, null);
				}
				else{
					var evt = el.ownerDocument.createEvent('Events');
					evt.initEvent(sEvent, true, true, el.ownerDocument.defaultView);
				}
				el.dispatchEvent(evt);
			} 
		},
		on=function(el, sEvent, fn) {
			if (el.addEventListener) {
				el.addEventListener(sEvent, fn, false);
			} else if (el.attachEvent) {
				el.attachEvent('on' + sEvent, fn);
			}
		},
		un=function(el, sEvent, observer){
			if (el.removeEventListener) {
				el.removeEventListener(sEvent, observer, false);
			} else if (el.detachEvent) {
				el.detachEvent('on' + sEvent, observer);
			}
		},
		EventH=QW.EventH,
		target=EventH.target,
		preventDefault = EventH.preventDefault,
		keyCode=EventH.keyCode;

	//var Editor=QW.Event;
	var DomU=QW.DomU,
		createElement=DomU.create;

	var NodeH=QW.NodeH,
		$=NodeH.$,
		_byCN=NodeH.getElementsByClass,
		_hc=NodeH.hasClass,
		_ac=NodeH.addClass,
		_rc=NodeH.removeClass,
		_hide=NodeH.hide,
		_show=NodeH.show;
		_enable=function(el){_rc(el,"disabled");},
		_disable=function(el){_rc(el,"active"); _rc(el,"mouseover"); _ac(el,"disabled");},
		_activate=function(el){_ac(el,"active");},
		_deactivate=function(el){_rc(el,"active");},
		_tiUp=function(e,el){el=el||this; _rc(el,"mousedown");},
		_tiDown=function(e,el){el=el||this;if(!_hc(el,"disabled")) _ac(el,"mousedown");},
		_tiOut=function(e,el){el=el||this;_rc(el,"mouseover"); _rc(el,"mousedown");},
		_tiOver=function(e,el){el=el||this;if(!_hc(el,"disabled")) _ac(el,"mouseover");},
		_tiClick=function(e,el,editor){
			Editor.activeInstance=editor;
			if(!_hc(el,"disabled")){
				var tiKey=el.getAttribute("tiKey");
				Editor.EditorCmd["ti"+tiKey](e,el,editor);
			}
		};
	/**
	* @property {Array} TiConfigs һЩ���õ�toolitem�����顣
	* @static
	*/
	Editor.TiConfigs={
		full:'Undo,Redo,,Bold,Italic,Underline,FontName,FontSize,ForeColor,BackColor,RemoveFormat,,JustifyLeft,JustifyCenter,JustifyRight,,OrderedList,UnorderedList,,Link,UnLink,Image,Face,Character',
		youa:'Undo,Redo,,Bold,Italic,Underline,FontName,FontSize,ForeColor,BackColor,RemoveFormat,,JustifyLeft,JustifyCenter,JustifyRight,,OrderedList,UnorderedList,,Image,Face,Character',
		mini:'Image2,Face2'
	};

	/**
	* @property {string} _editorHeadHtml �༭�������header����.
	*/
	//Editor._editorHeadHtml='<head><style type="text/css">body{background-color:#FFFFFF; font:16px Geneva,Arial,sans-serif; margin:2px;} p{margin:0px;}</style></head>';
	Editor._editorHeadHtml='<head><style type="text/css">body{background-color:#FFFFFF; font:16px Geneva,Arial,sans-serif; margin:2px;} p{margin:0px;}blockquote {margin:10px;background-color:#f1f0f8;padding:5px 10px;line-height:22px;border:1px solid #e5e4ed;}</style></head>';
	

	/**
	* @property {Json} ToolbarItems �༭��������ToobarItem.
	* @static
	*/
	Editor.ToolbarItems={
		//["className","title",disabled,"innerHTML",accessKey,needCtrlStatus]
		Undo:["Undo","����",1,,"z",1],
		Redo:["Redo","����",1,,"y",1],
		Bold:["Bold","�Ӵ�",,,"b",1],
		Italic:["Italic","б��",,,"i",1],
		Underline:["Underline","�»���",,,"u",1],
		FontName:["FontName","����",,"<span class=img>����</span>",,1],
		FontSize:["FontSize","�ֺ�",,"<div class=img>�ֺ�</div>",,1],
		ForeColor:["ForeColor","�ı���ɫ"],
		BackColor:["BackColor","������ɫ"],
		RemoveFormat:["RemoveFormat","�����ʽ"],
		JustifyLeft:["AlignLeft","�����",,,,1],
		JustifyCenter:["AlignCenter","���ж���",,,,1],
		JustifyRight:["AlignRight","�Ҷ���",,,,1],
		OrderedList:["NList","����б�",,,,1],
		UnorderedList:["BList","�����б�",,,,1],
		Link:["Link","���/�޸ĳ�����"],
		UnLink:["UnLink","ɾ��������",1,,,1],
		Image:["Image","����/�༭ͼƬ"],
		Face:["Face","�������"],
		Image2:["UserDfd","����/�༭ͼƬ",,'<span class="img img-image">����ͼƬ</span>'],
		Face2:["UserDfd","�������",,'<span class="img img-face">�������</span>'],
		Character:["Character","���������ַ�"]
	};
	var _tiHtml=function(key){
		if(!key) return '<div class="divider"><div class="img">&nbsp;</div></div>';
		var ti=Editor.ToolbarItems[key];
		return '<div title="'+ti[1]+'" class="ti '+ti[0]+(ti[2]?' disabled':'')+'" tiKey="'+key+'" >'+(ti[3]||'<div class="img">&nbsp;</div>')+'</div>';
	};
	
	Editor.prototype= {
		/*
		* @property {HTMLElement} oCtn �༭�����ڵ�����Ԫ�ء�
		*/
		oCtn: null,
		/*
		* @property {HTMLElement} oTxt �༭����Դ�ļ�TextareaElement��
		*/
		oTxt: null,
		/*
		* @property {HTMLElement} oIfm �༭�������ģʽ�༭IframeElement��
		*/
		oIfm: null,
		/*
		* @property {HTMLElement} oTabCtn ��ǩ���ڵ�����Ԫ�ء�
		*/
		oTabCtn:null,
		/*
		* @property {HTMLElement} oSrcCtn Դ�ļ�ģʽ������
		*/
		oSrcCtn:null,
		/*
		* @property {HTMLElement} oDsnCtn ���ģʽ������
		*/
		oDsnCtn:null,
		/*
		* @property {HTMLElement} oToolbarCtn ToolbarItem����
		*/
		oToolbarCtn:null,
		/*
		* @property {Json} tiMap ��¼��ǰEditorʵ��֧����ЩtiKey
		*/
		tiMap:{},
		/*
		* @property {Json} accessKeyMap ��ݼ����ϣ���ʵ�Ͽ���ͨ�������õ�������ΪЧ�ʿ����ǣ�������һ��map��
		*/
		accessKeyMap:{},
		/*
		* @property {Array} statusTis ��¼��ЩtoolbarItem��Ҫ״̬����
		*/
		statusTis:[],
		_curMode:"design",
		/** 
		* �л��༭״̬
		* @method switchMode
		* @param {string} mode �л�����״̬������ֵΪ��design/source
		* @return {void} 
		*/
		switchMode:function (mode)
		{
			var me=this;
			var doc=me.doc
			if(mode==me._curMode) return;
			var tabs=this.oTabCtn.childNodes;
			if(mode=="design"){
				doc.body.innerHTML=me.oTxt.value || Browser.firefox && "<br/>" || "";
				_hide(me.oSrcCtn);
				_show(me.oDsnCtn);
				_ac(tabs[0],"selected");
				_rc(tabs[1],"selected");
			}
			else{
				var val=doc.body.innerHTML
				if((/^(((<p|<\/p|<br)[^>]*>)*(&nbsp;)*)*$/).test(val.replace(/&nbsp;\s*/,""))) val="";//'<p></p>'��ʵ�ǿ�
				me.oTxt.value=val;
				_hide(me.oDsnCtn);
				_show(me.oSrcCtn);
				_ac(tabs[1],"selected");
				_rc(tabs[0],"selected");
			}
			window.setTimeout(function(){me._focus();},10);
			me._curMode=mode;
		},
		/* 
		* Ԥ��
		* @method _preview
		* @return {void} 
		*/
		_preview:function ()
		{
			var me=this;
			me.prepare4Submit();
			var win = window.open('about:blank');
			var doc=win.document;
			doc.open();
			var html = "<html>"+Editor._editorHeadHtml+"<body >"+me.oTxt.value+"</body></html>";
			doc.write(html);
			doc.close();
		},
		/** 
		* ��ȾEditor
		* @method render
		* @return {void} 
		*/
		render: function() {
			var me=this;
			var opts=me.options;
			if(me._rendered) return ;
			//render editor structure
			{
				var oCtn=me.oCtn=$(opts.container);
				var oTxt=me.oTxt=$(opts.textarea);
				if(NodeH.contains(oCtn,oTxt)) oCtn.parentNode.insertBefore(oTxt,oCtn);//���ctn����txt�����Ȱ�txt�Ƶ�����ȥ;
				var html=[
					'<div class="js-editor">',
						'<div class="ctn-tab">',
							'<div class="designTab tab selected">�༭�ı�</div>',
							'<div class="sourceTab tab">�༭Դ�ļ�</div>',
							'<div class="tab-preview">Ԥ��</div>',
						'</div>',
						'<div class="ctn-src" style="display:none">',
							'<div class="ctn-src-hd">',
								'<a class="back">���ر༭�ı�</a>',
							'</div>',
							'<div class="ctn-src-bd">',
							'</div>',
						'</div>',
						'<div class="ctn-dsn">',
							'<div class="ctn-dsn-hd">',
							'</div>',
							'<div class="ctn-dsn-bd">',
							'</div>',
						'</div>',
					'</div>'].join("").replace(/(<\w+)/ig,'$1  unselectable="on"');
				oCtn.innerHTML=html;
				me.oWrap=oCtn.childNodes[0];
				var els=me.oWrap.childNodes;
				me.oTabCtn=els[0];
				me.oSrcCtn=els[1];
				me.oDsnCtn=els[2];
			}
			//��ʼ��iframe��textarea
			{
				me.oIfm=createElement('<iframe frameBorder=no/>');
				me.oDsnCtn.childNodes[1].appendChild(me.oIfm);
				me.win=me.oIfm.contentWindow;
				var doc=me.doc=me.win.document;
				doc.designMode="on";
				doc.write("<html>"+Editor._editorHeadHtml+"<body ></body></html>");
				doc.close();
				me.oSrcCtn.childNodes[1].appendChild(me.oTxt);
				_show(me.oTxt);
				me.oIfm.style.height=me.oTxt.style.height=(me.options.height||300)+"px";
				doc.body.innerHTML=me.oTxt.value|| (Browser.firefox && "<br/>") || "";//���FF�¹���ʼλ�ò���ȷ��bug;
				me.prepare4Submit();
				me.defaultEditorHtml=me.oTxt.defaultValue=me.oTxt.value;//���³�ʼֵ��
			}
			//��ʼ�� tabs
			{
				var tabs=me.oTabCtn.childNodes;
				tabs[0].onclick=function(e){me.switchMode("design");};
				tabs[1].onclick=function(e){me.switchMode("source");};
				tabs[2].onclick=function(e){me._preview();};
				_byCN(me.oSrcCtn,"back")[0].onclick=function(e){me.switchMode("design");};
			}
			//��ʼ��ToolbarItems
			{
				var tiKeys=(me.options.tiConfig||Editor.TiConfigs.full).split(",");
				var html=['<div class="js-editor-toolbar">'];
				for(var i=0;i<tiKeys.length;i++){
					html.push(_tiHtml(tiKeys[i]));
				}
				html.push("</div>");
				me.oDsnCtn.childNodes[0].innerHTML=html.join("").replace(/(<\w+)/ig,'$1  unselectable="on"');
				var tiEls=_byCN(me.oDsnCtn,"ti");
				me.tiMap={};
				me.accessKeyMap={};
				me.statusTis=[];
				for(var i=0;i<tiEls.length;i++){
					var el=tiEls[i];
					el.onmousedown=_tiDown;
					el.onmouseup=_tiUp;
					el.onmouseover=_tiOver;
					el.onmouseout=_tiOut;
					el.onclick=function(e){_tiClick(e,this,me);};
					var tiKey=el.getAttribute("tiKey");
					var ti=Editor.ToolbarItems[tiKey];
					if(ti[4]) me.accessKeyMap[ti[4]]=tiKey;
					if(ti[5]) me.statusTis.push(tiKey);
					me.tiMap[tiKey]={tiKey:tiKey,tiEl:el};
				}
			}

			//��ʼ��History,KeyDown�¼���
			{
				me.editorHistory=new Editor.EditorHistory(me);
				me.editorHistory.saveUndoStep();
				initDomEvents(me);
			}
			me._rendered=true;
		},
		/** 
		* ����selectionchange�¼����Է���toolbaritem��״̬
		* @method fireSelectionChange
		* @return {void} 
		*/
		fireSelectionChange:function(){
			fire(this.doc.documentElement,"mouseup");
		},
		_focus:function(){
			//try{
				var me=this;
				if(me._curMode=="design") me.win.focus();
				else me.oTxt.focus();
			//}
			//catch(e){};
		},
		/** 
		* focus��Editor��
		* @method focus
		* @return {void} 
		*/
		focus:function(){
			//try{
				var me=this;
				me._focus();
				var p = NodeH.getRect(me.oWrap);
				var rect = DomU.getDocRect();
				if (p.top<rect.scrollY || p.bottom>rect.height+rect.scrollY) {
					this.oWrap.scrollIntoView();
				}
			//}
			//catch(e){}
		},
		/** 
		* ���ύǰ�������ģʽ��Դ�ļ�ģʽ�����ݵ�һ�»�
		* @method prepare4Submit
		* @return {void} 
		*/
		prepare4Submit:function ()
		{
			var me=this;
			if(me._curMode!="design"){
				me.doc.body.innerHTML=me.oTxt.value;
			}
			var val=me.doc.body.innerHTML
			if((/^((<p|<\/p|<br)[^>]*>)*$/i).test(val.replace(/&nbsp;\s*/,""))) val="";
			me.oTxt.value=val;
		},
		/** 
		* ����һ��Editor������
		* @method setInnerHTML
		* @return {void} 
		*/
		setInnerHTML:function(s){
			this.oTxt.value=s;
			this.doc.body.innerHTML=s;
		},
		/** 
		* ���ı������Ƿ��Ѿ��ı�
		* @method isChanged
		* @return {void} 
		*/
		isChanged:function(s){
			this.prepare4Submit();
			return this.defaultEditorHtml!=this.oTxt.value;
		},
		/**
		* ִ�б༭��execCommand
		* @method exec
		* @param {string} sCommand - ��������
		* @param {string} vValue - ����ֵ��
		* @param {boolean} ignoreBeginHistory - �Ƿ����ִ������ǰһ�̵���ʷ������ʱ�������ɼ�����϶���ʱ���õ���
		* @param {boolean} ignoreEndHistory - �Ƿ����ִ�������һ�̵���ʷ��
		* @return void 
		*/
		exec:function(sCommand,vValue,ignoreBeginHistory,ignoreEndHistory)
		{
			this._focus();
			if(!ignoreBeginHistory) this.editorHistory.saveUndoStep();
			if(sCommand) this.doc.execCommand(sCommand, false, vValue);
			if(!ignoreEndHistory) this.editorHistory.saveUndoStep();
			this.fireSelectionChange();
		},
		/**
		* ���༭������һ��HTML
		* @method pasteHTML
		* @param {string} htmlStr - HTML�ַ�����
		* @param {boolean} ignoreBeginHistory - �Ƿ����ִ������ǰһ�̵���ʷ������ʱ�������ɼ�����϶���ʱ���õ���
		* @param {boolean} ignoreEndHistory - �Ƿ����ִ�������һ�̵���ʷ��
		* @return void 
		*/
		pasteHTML:function(htmlStr,ignoreBeginHistory,ignoreEndHistory,sWhere)
		{
			this._focus();
			if(!ignoreBeginHistory) this.editorHistory.saveUndoStep();
			var doc=this.doc;
			if(sWhere == 'begin'){
				var el=doc.createElement('span');
				el.innerHTML=htmlStr;
				doc.body.insertBefore(el.firstChild,doc.body.firstChild);
			}
			else{
				if(Browser.ie){
					var range= doc.selection.createRange();//��ѡ���ı���ֵ��SelTxt��
					if(doc.selection.type=="Control") {//JK: controlRange����ִ��pasteHTML
						var range2=doc.body.createTextRange();
						range2.moveToElementText(range.item(0));
						range2.select();
						range=range2;
					}
					range.pasteHTML(htmlStr);
				}
				else{
					doc.execCommand("insertHTML", false, htmlStr);
				}
			}
			if(!ignoreEndHistory) this.editorHistory.saveUndoStep();
			this.fireSelectionChange();
		}
	};

	/*
	*���Editor��ļ���/����¼�
	*/
	var initDomEvents=(function(){
		var CTRL	= 1000,
			CTRL_X  = CTRL + 88,
			CTRL_C  = CTRL + 67,
			CTRL_A  = CTRL + 65,
			KEY_TAB		 = 9,
			KEY_BACKSPACE   = 8,
			KEY_ENTER	   = 13;

		var _keyDown=function(e,editor){
			e=e||editor.win.event;
			// Get the key code.
			var keyCombination = keyCode(e);
			var ctrlKey=e.ctrlKey||e.metaKey;
			if(ctrlKey){
				var sKey=String.fromCharCode(keyCombination).toLowerCase();
				var tiKey=editor.accessKeyMap[sKey];
				if(tiKey){
					Editor.EditorCmd["ti"+tiKey](e,editor.tiMap[tiKey].tiEl,editor);
					preventDefault(e);
					return ;
				}
				keyCombination+=CTRL;
			}
			switch(keyCombination){
				case KEY_TAB :
					editor.pasteHTML("&nbsp;&nbsp;&nbsp;&nbsp;");
					preventDefault(e);
					return ;
				case KEY_BACKSPACE :
					if(Browser.ie){//JK��IE�£���backspace����ɾ��controlѡ��״̬�µ�img��
						var oImg = Editor.EditorSelection.getCtrlElement(editor);
						if (oImg && oImg.tagName){
							editor.exec('Delete');
							preventDefault(e);
						}
					}
					break;
				case KEY_ENTER :
				case CTRL_X :
				case CTRL_C :
				case CTRL_A :
				case KEY_ENTER :
					if(Browser.ie){
						editor.editorHistory.saveUndoStep();
						editor.fireSelectionChange();
					}
					break;
				default:
					if(Browser.ie) {
						var ti=editor.tiMap["Undo"];
						if(ti) _rc(ti.tiEl,"disabled");
					}
			}
		};
		var _selectionChange=function(e,editor){
			var tiMap=editor.tiMap,
				statusTis=editor.statusTis;
				oCtrl=Editor.EditorSelection.getCtrlElement(editor);
			for(var i=0;i<statusTis.length;i++){
				var tiKey=statusTis[i];
				Editor.EditorCmd["tistatus"+tiKey](e,tiMap[tiKey].tiEl,editor,oCtrl)
			}
			fire(document.body,"keyup");//JK�������ⲿdocument���¼�����ʹpopup�رա�opera�£���mousedown��Ӱ���ⲿ���Ժ��mousedown��������keyup.
		}
		
		/*
		* ��ʼ��Editorʵ����dom������¼�
		*/
		return function (editor){
			var doc=editor.doc;
			var keydownHdl=function(e){_keyDown(e,editor); };
			var selectionChangeHdl=function(e){
				Editor.activeInstance=editor;
				_selectionChange(e,editor);
			};
			on(doc,"keydown",keydownHdl);
			on(doc,"keyup",selectionChangeHdl);
			on(doc,"mouseup",selectionChangeHdl);
			if(Browser.ie){
				var beforedeactivateHdl=function(e){
					var el=target(e);
					if(el && el.tagName=="MARQUEE") return ;//��ֹIE�µ���ѭ��:<marquee><marquee>a</marquee></marquee><marquee><marquee>a</marquee></marquee>
					var selection = doc.selection;
					var range = selection.createRange();
					var selectionType = selection.type.toLowerCase();
					if("control" == selectionType){
						doc.ieSelectionControl = range(0);
					}else{
						doc.ieSelectionBookmark = range.getBookmark();
					}
					doc.ieSelectionType=selectionType;
				};
				on(doc,"beforedeactivate",beforedeactivateHdl);
				var activateHdl=function(e){
					var range;
					try{
						if("control" == doc.ieSelectionType){
							range = doc.body.createControlRange();
							range.add(doc.ieSelectionControl);
						}else{
							range = doc.body.createTextRange();
							range.moveToBookmark(doc.ieSelectionBookmark);
						}
						range.select();
						doc.ieSelectionControl = doc.ieSelectionBookmark = null;
					}catch(e){}
				};
				on(doc,"activate",activateHdl);
				var unloadHdl=function(){//ȥ���¼����Խ��IE�µ��ڴ�й©����
					un(doc,"keydown",keydownHdl);
					un(doc,"mouseup",selectionChangeHdl);
					un(doc,"keyup",selectionChangeHdl);
					un(doc,"beforedeactivate",beforedeactivateHdl);
					un(doc,"activate",activateHdl);
					un(window,"unload",unloadHdl);
					doc=null;
				};
				on(window,"unload",unloadHdl);
			}
		};
	})();


	QW.provide('Editor',Editor);

})();





