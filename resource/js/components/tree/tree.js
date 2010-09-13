

(function(){
	/**
	* @class Tree 树
	* @constructor
	* @namespace QW
	* @param {Json} opts 构造参数，目前支持以下：
		treeCtn:树容器，非空，无默认值
		rootItemData:  根节点数据，有默认值。每一个节点的数据为一个数组:[itemType,itemId,itemText,...]
				itemType: 字符串，如果以folder打头，表示它是一个folder节点，否则就当作一个叶节点数据，叶节没有“展开／收起”功能。
				itemId: 字符串，item的Id，在同一棵树里，至少所有枝节点的id具有唯一性。如果需要focusItem到叶节点，则叶节点的id也需要具有唯一性。
				itemText: 对于根节点，则把它当节点的html；对于其它节点，可以自由使用。
				...: 其它自由使用数据
		loadItemsData: function(id)，得到子节点数据。有默认实现（仅针对有某固定格式的dataSource的时候，参见例子）。<font color=red>在获取数据后需要调用setItemsData方法。</font>
		getItemHtml:function (itemData)，根据节点数据，得到节点的html，需要实现
		getNoDataHtml: function(id)，“枝节点没有子节点数据”时，展开枝节点后显示的内容
	* @returns {Tree} 返回一个Tree对象。
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

	var uniqueId=0;//每一个tree都有一个uniqueId

	Tree.prototype={
		/**
		 * @property {array} rootItemData 用来指定根节点的信息，三个元素依次是：类型、id、节点html
		 */
		rootItemData:["folderRoot","0","Root示例"],
		/**
		 * 得到子节点数据。由于数据有可能是异步的，所以loadItemsData和setItemsData是两个独立的方法
		 * @method loadItemsData
		 * @param {String} id: folder的id
		 * @returns {void}
		 */
		loadItemsData:function(id){
			this.setItemsData(id,this.dataSource[id],true);
		},
		/**
		 * 根据节点数据，得到节点的html，通常要重写
		 * @method getItemHtml
		 * @param {Array} itemData: 节点数据
		 * @returns {void}
		 */
		getItemHtml:function (itemData)
		{
			return "需要重写"
		},
		/**
		 * 如果itemsData的长度为空时，显示的内容。
		 * @method getNoDataHtml
		 * @param {String} id: folder的id
		 * @returns {void}
		 */
		getNoDataHtml:function(id){
			return "没有数据";
		},
		/**
		 * 设置子节点数据。
		 * @method setItemsData
		 * @param {String} id: folder的id
		 * @param {Array} itemsData: 子节点数据
		 * @param {boolean} renderImmediately: 是否立即renderItems
		 * @returns {void}
		 */
		setItemsData:function (id,itemsData,renderImmediately){
			var el=$(this._idPre+id);
			if(!el) {
				alert("程序错误：节点还没生成："+id);
				return;
			}
			el.itemsData=itemsData||[];
			el.dataIsLoading=false;
			if(renderImmediately) this._renderItems(id);
		},
		/**
		 * 展开一个folder
		 * @method openFolder
		 * @param {String} id: folder的id
		 * @returns {void}
		 */
		openFolder:function(id) {
			var el=$(this._idPre+id);
			if(!el) {
				alert("程序错误：节点还没生成："+id);
				return;
			}
			var itemsCtn=el.childNodes[2];
			if(!itemsCtn.innerHTML){//还没有_renderItems
				if(!el.itemsData && !el.dataIsLoading) {//如果还没有数据，
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
		 * 关闭一个folder
		 * @method closeFolder
		 * @param {String} id: folder的id
		 * @returns {void}
		 */
		closeFolder:function(id) {
			var el=$(this._idPre+id);
			if(!el) {
				alert("程序错误：节点还没生成："+id);
				return;
			}
			replaceClass(el,"folder-open","folder-closed");
			replaceClass(el.firstChild,"folder-img-open","folder-img-closed");
			hide(el.childNodes[2]);
		},
		/**
		 * 展开一系列folder
		 * @method openFolders
		 * @param {Array} ids: 需要展开的folder的id数组
		 * @returns {void}
		 */
		openFolders:function(ids){
			for(var i=0;i<ids.length;i++){
				this.openFolder(ids[i]);
			}
		},
		/**
		 * 更新一个folder
		 * @method refreshFolder
		 * @param {String} id: folder的id
		 * @returns {void}
		 */
		refreshFolder:function(id){
			var el=$(this._idPre+id);
			if(!el) {
				alert("程序错误：节点还没生成："+id);
				return;
			}
			addClass(el.firstChild,"folder-img-loading");
			el.childNodes[2].innerHTML="";
			this.loadItemsData(id);
		},
		/**
		 * focus到某个节点
		 * @method focusItem
		 * @param {String} id: item的数据id
		 * @returns {void}
		 */
		focusItem:function(id){
			var el=$(this._idPre+id);
			if(!el) {
				alert("程序错误：节点还没生成："+id);
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

		_highlightEl:null,//处于高亮状态的El
		_idPre:"",//每个itemNode节点的id前缀。
		//生成folder的子节点
		_renderItems:function(id, ignoreDataNull) {
			var el=$(this._idPre+id);
			var itemsData=el.itemsData;
			if(!itemsData){
				if(!ignoreDataNull) alert("还没有load出数据来呢!");
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
		//鼠标移进
		_mouseover:function(e){
			var el=target(e);
			if (el.tagName=="UL") return;
			if (el.tagName!="LI") el=ancestorNode(el,"LI");
			var div=el.getElementsByTagName("div")[0];
			if (div) addClass(div,"ms-over");
		},
		//鼠标移出
		_mouseout:function(e){
			var el=target(e);
			if (el.tagName=="UL") return;
			if (el.tagName!="LI") el=ancestorNode(el,"LI");
			var div=el.getElementsByTagName("div")[0];
			if (div) removeClass(div,"ms-over");
		},
		//鼠标点击
		_click:function(e){
			var el=target(e);
			if(hasClass(el,"folder-img-closed")) this.openFolder(el.parentNode.id.substr(this._idPre.length));
			else if(hasClass(el,"folder-img-open")) this.closeFolder(el.parentNode.id.substr(this._idPre.length));
		},
		/**
		 * 渲染Tree
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

