

(function(){
	/**
	* @class Tree ��
	* @constructor
	* @namespace QW
	* @param {Json} opts ���������Ŀǰ֧�����£�
		treeCtn:���������ǿգ���Ĭ��ֵ
		rootItemData:  ���ڵ����ݣ���Ĭ��ֵ��ÿһ���ڵ������Ϊһ������:[itemType,itemId,itemText,...]
				itemType: �ַ����������folder��ͷ����ʾ����һ��folder�ڵ㣬����͵���һ��Ҷ�ڵ����ݣ�Ҷ��û�С�չ�������𡱹��ܡ�
				itemId: �ַ�����item��Id����ͬһ�������������֦�ڵ��id����Ψһ�ԡ������ҪfocusItem��Ҷ�ڵ㣬��Ҷ�ڵ��idҲ��Ҫ����Ψһ�ԡ�
				itemText: ���ڸ��ڵ㣬��������ڵ��html�����������ڵ㣬��������ʹ�á�
				...: ��������ʹ������
		loadItemsData: function(id)���õ��ӽڵ����ݡ���Ĭ��ʵ�֣��������ĳ�̶���ʽ��dataSource��ʱ�򣬲μ����ӣ���<font color=red>�ڻ�ȡ���ݺ���Ҫ����setItemsData������</font>
		getItemHtml:function (itemData)�����ݽڵ����ݣ��õ��ڵ��html����Ҫʵ��
		getNoDataHtml: function(id)����֦�ڵ�û���ӽڵ����ݡ�ʱ��չ��֦�ڵ����ʾ������
	* @returns {Tree} ����һ��Tree����
	*/

	function Tree(opts){
		QW.ObjectH.mix(this,opts,true);
		if(!this.lazyRender) this.render();
	}
	var EventH=QW.EventH;
	var NodeH=QW.NodeH;
	var DomU=QW.DomU;
	//QW Base.js
	var isIe=(/msie/i).test(navigator.userAgent);
	//QW Event.js
	var target=EventH.target,observe=QW.EventTargetH.on;
	//QW Dom.js
	var createElement=DomU.createElement,hasClass=NodeH.hasClass,addClass=NodeH.addClass,removeClass=NodeH.removeClass,replaceClass=NodeH.replaceClass,show=NodeH.show,hide=NodeH.hide,ancestorNode=NodeH.ancestorNode;
	var $=NodeH.$;

	var uniqueId=0;//ÿһ��tree����һ��uniqueId

	Tree.prototype={
		/**
		 * @property {array} rootItemData ����ָ�����ڵ����Ϣ������Ԫ�������ǣ����͡�id���ڵ�html
		 */
		rootItemData:["folderRoot","0","Rootʾ��"],
		/**
		 * �õ��ӽڵ����ݡ����������п������첽�ģ�����loadItemsData��setItemsData�����������ķ���
		 * @method loadItemsData
		 * @param {String} id: folder��id
		 * @returns {void}
		 */
		loadItemsData:function(id){
			this.setItemsData(id,this.dataSource[id],true);
		},
		/**
		 * ���ݽڵ����ݣ��õ��ڵ��html��ͨ��Ҫ��д
		 * @method getItemHtml
		 * @param {Array} itemData: �ڵ�����
		 * @returns {void}
		 */
		getItemHtml:function (itemData)
		{
			return "��Ҫ��д"
		},
		/**
		 * ���itemsData�ĳ���Ϊ��ʱ����ʾ�����ݡ�
		 * @method getNoDataHtml
		 * @param {String} id: folder��id
		 * @returns {void}
		 */
		getNoDataHtml:function(id){
			return "û������";
		},
		/**
		 * �����ӽڵ����ݡ�
		 * @method setItemsData
		 * @param {String} id: folder��id
		 * @param {Array} itemsData: �ӽڵ�����
		 * @param {boolean} renderImmediately: �Ƿ�����renderItems
		 * @returns {void}
		 */
		setItemsData:function (id,itemsData,renderImmediately){
			var el=$(this._idPre+id);
			if(!el) {
				alert("������󣺽ڵ㻹û���ɣ�"+id);
				return;
			}
			el.itemsData=itemsData||[];
			el.dataIsLoading=false;
			if(renderImmediately) this._renderItems(id);
		},
		/**
		 * չ��һ��folder
		 * @method openFolder
		 * @param {String} id: folder��id
		 * @returns {void}
		 */
		openFolder:function(id) {
			var el=$(this._idPre+id);
			if(!el) {
				alert("������󣺽ڵ㻹û���ɣ�"+id);
				return;
			}
			var itemsCtn=el.childNodes[2];
			if(!itemsCtn.innerHTML){//��û��_renderItems
				if(!el.itemsData && !el.dataIsLoading) {//�����û�����ݣ�
					addClass(el.firstChild,"folder-img-loading");
					this.loadItemsData(id);
				}
				this._renderItems(id,true);
			}
			replaceClass(el,"folder-closed","folder-open");
			replaceClass(el.firstChild,"folder-img-closed","folder-img-open");
			show(itemsCtn);
		},
		/**
		 * �ر�һ��folder
		 * @method closeFolder
		 * @param {String} id: folder��id
		 * @returns {void}
		 */
		closeFolder:function(id) {
			var el=$(this._idPre+id);
			if(!el) {
				alert("������󣺽ڵ㻹û���ɣ�"+id);
				return;
			}
			replaceClass(el,"folder-open","folder-closed");
			replaceClass(el.firstChild,"folder-img-open","folder-img-closed");
			hide(el.childNodes[2]);
		},
		/**
		 * չ��һϵ��folder
		 * @method openFolders
		 * @param {Array} ids: ��Ҫչ����folder��id����
		 * @returns {void}
		 */
		openFolders:function(ids){
			for(var i=0;i<ids.length;i++){
				this.openFolder(ids[i]);
			}
		},
		/**
		 * ����һ��folder
		 * @method refreshFolder
		 * @param {String} id: folder��id
		 * @returns {void}
		 */
		refreshFolder:function(id){
			var el=$(this._idPre+id);
			if(!el) {
				alert("������󣺽ڵ㻹û���ɣ�"+id);
				return;
			}
			addClass(el.firstChild,"folder-img-loading");
			el.childNodes[2].innerHTML="";
			this.loadItemsData(id);
		},
		/**
		 * focus��ĳ���ڵ�
		 * @method focusItem
		 * @param {String} id: item������id
		 * @returns {void}
		 */
		focusItem:function(id){
			var el=$(this._idPre+id);
			if(!el) {
				alert("������󣺽ڵ㻹û���ɣ�"+id);
				return;
			}
			var links=el.getElementsByTagName("a");
			try{
				if(links.length) {
					if(this._highlightEl) {
						try{removeClass(this._highlightEl,"highlight");	}
						catch(ex){};
					}
					var aEl=links[0];
					aEl.focus();
					addClass(aEl,"highlight");
					this._highlightEl=aEl;
				}
				else el.scrollIntoView();
			}
			catch(e){;}

		},

		_highlightEl:null,//���ڸ���״̬��El
		_idPre:"",//ÿ��itemNode�ڵ��idǰ׺��
		//����folder���ӽڵ�
		_renderItems:function(id, ignoreDataNull) {
			var el=$(this._idPre+id);
			var itemsData=el.itemsData;
			if(!itemsData){
				if(!ignoreDataNull) alert("��û��load����������!");
				return false;
			}
			var itemsCtn=el.childNodes[2];
			if(itemsData.length){
				var html=[];
				for(var i=0;i<itemsData.length;i++){
					var d=itemsData[i];
					var str=this.getItemHtml(d);
					if(d[0].toLowerCase().indexOf('folder')>-1){
						html[i]='<li id="'+this._idPre+d[1]+'" class="folder-closed '+d[0]+'"><span class="folder-img-closed '+d[0]+'">&nbsp;</span><div class="node-ctn">'+str+'</div><ul style="display:none"></ul></li>';
					}
					else{
						html[i]='<li id="'+this._idPre+d[1]+'" class="folder-closed '+d[0]+'"><div class="node-ctn">'+str+'</div></li>';
					}
				}
				itemsCtn.innerHTML=html.join("");
			}
			else{
				itemsCtn.innerHTML="<li>"+this.getNoDataHtml(id)+"</li>";
			}
			removeClass(el.firstChild,"folder-img-loading");
		},
		//����ƽ�
		_mouseover:function(e){
			var el=target(e);
			if (el.tagName=="UL") return;
			if (el.tagName!="LI") el=ancestorNode(el,"LI");
			var div=el.getElementsByTagName("div")[0];
			if (div) addClass(div,"ms-over");
		},
		//����Ƴ�
		_mouseout:function(e){
			var el=target(e);
			if (el.tagName=="UL") return;
			if (el.tagName!="LI") el=ancestorNode(el,"LI");
			var div=el.getElementsByTagName("div")[0];
			if (div) removeClass(div,"ms-over");
		},
		//�����
		_click:function(e){
			var el=target(e);
			if(hasClass(el,"folder-img-closed")) this.openFolder(el.parentNode.id.substr(this._idPre.length));
			else if(hasClass(el,"folder-img-open")) this.closeFolder(el.parentNode.id.substr(this._idPre.length));
		},
		/**
		 * ��ȾTree
		 * @method render
		 * @returns {void}
		 */
		render:function(){
			var me=this;
			if(me._rendered) return ;
			me._rendered=true;
			this._idPre="tree"+(++uniqueId)+"_";
			var d=me.rootItemData;
			me.treeCtn.innerHTML='<ul class="tree-wrap"><li id="'+this._idPre+d[1]+'"><span class="folder-img-root '+d[0]+'">&nbsp;</span><div class="node-ctn">'+d[2]+'</div><ul style="display:none" class="tree-wrap-inner"></ul></li></ul>';
			var treeWrap=this.treeCtn.firstChild;
			observe(treeWrap,"mouseover",function(e){me._mouseover(e);});
			observe(treeWrap,"mouseout",function(e){me._mouseout(e);});
			observe(treeWrap,"click",function(e){me._click(e);});
			me.openFolder(d[1]);
		}
	};

	window.Tree=QW.Tree=Tree;
})();

