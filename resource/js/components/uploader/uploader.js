/**
 * @class UPLoader 跨域无刷新文件上传组件。实现的具体原理为：首先在初始化的时候将需要提交的表单的target属性设置为iframe(由组件自动创建)的name，这样提交表单便不会刷新页面；其次，服务器在响应请求后redirect到当前页面所在域下的一个静态页URL，并在URL的参数中携带处理结果，这样当前页面就可以读取到处理结果并作出响应。
 * @namespace QW
 * @singleton
 * @cfg {Array|FORM|String} forms 用于上传图片的表单，如果一个页面中包含多个上传图片表单则可以传入一个表单数组，数组的每个单元则可以是表单元素或者是表单ID；如果只有一个表单则可以直接传入表单元素或表单ID。
 * @cfg {Function} onbefore 图片正式上传之前触发的回调函数，参数为对应的form元素并根据回调的返回决定是否继续上传。
 * @cfg {Function} oncomplete 图片上传完成后的回调函数，参数为服务器返回值以及对应的表单元素。
 * @cfg {Boolean} jsonverify 是否对服务器返回结果进行JSON检查，如果为true则当服务器返回非法JSON格式时会对此进行检查并返回一个带错误状态的JSON结构；否则直接返回服务器的内容，在该情况下如果在oncomplete中使用json则需要自行进行try/catch。（默认为true）
 */
 (function(){
	var UPLoader = (function(){
		var D = QW.DomU,N = QW.NodeH,A = QW.ArrayH,$ = N.$,E = QW.EventTargetH, EH= QW.EventH, O = QW.ObjectH;
			/*跨域提交IFRAME*/
		var iframe = null, 
			/*当前发起提交的表单元素*/
			activeForm = null,
			/*是否处于等待响应的状态，提交被发起后会被设置为true，服务器响应后会被设置为false。作用在于hack iframe的非正常触发onload事件*/
			waiting = false,
			/*iframe name prefix*/
			iframeNamePrefix = 'cdc_upload_iframe_bridge',
			iframeCounter = 0,
			cdcFormData = [];

		return {
			jsonverify: true,
			/**
			 * 初始化
			 * @method 
			 * @static
			 * @param {JSON} options 初始化配置
			 */
			init: function(options){
				O.mix(this, options || {}, true);
				/*获取forms*/
				var o = options,
					forms = o.forms,
					me = this;
				//form标签或form ID
				if( forms.tagName || typeof forms == 'string' ) forms = [$(forms)];	
				_forms = forms;
				//设置form target
				forms.forEach(function(form,idx){
					iframeCounter++;
					var f = $(form),
						iframeName = iframeNamePrefix + '_' + iframeCounter + '_' + idx;
					cdcFormData[idx] = {
						form: f,
						iframeName: iframeName,
						iframe: null,
						waiting: false
					};
					f.target = iframeName;
					E.on(f,'submit',function(e){
						if( me.onbefore && !me.onbefore( f ) )
							e.preventDefault();
						cdcFormData[idx].waiting = true;
					});
				});
				/*创建iframes*/
				this._createIframe();				
			},
			_createIframe: function(){
				var me = this;
				cdcFormData.forEach(function(d,idx){					
					d.iframe = D.create('<iframe name="' + d.iframeName + '" src="about:blank" style="display:none"></iframe>');
					N.insertAdjacentElement(document.body,'afterbegin',d.iframe);
					E.on(d.iframe,'load',function(){
						if( !d.waiting ) return;
						try{
							var responseText = d.iframe.contentWindow.document.body.innerHTML;
							/*测试是否正确JSON结构*/
							if( me.jsonverify ){
								try{
									responseText.evalExp();
								}
								catch(e){
									responseText = '{err:"bad_json"}';
								}
							}
						}
						catch(e){
							var responseText = '{err:"iframe_access"}';
						}
						d.waiting = false;
						me.oncomplete && me.oncomplete(responseText,d.form);
					});
				});
			}
		};
	})();
    QW.provide('UPLoader', UPLoader);
 })();
