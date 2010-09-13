/*
 *	Copyright (c) 2009, Baidu Inc. All rights reserved.
 *	http://www.youa.com
 *	version: $version$ $release$ released
 *	author: chenminliang@baidu.com
*/

/**
 * @class Ajax Ajax类
 * @namespace QW
 * @cfg {String} url 请求的发送地址。
 * @cfg {String} method 请求方式（GET或POST)，默认为"GET"。
 * @cfg {Boolean} async 是否使用异步请求，默认为true。
 * @cfg {Boolean} cache 是否使用浏览器Cache，如果设置为false则会给每个请求添加随机数，默认为true。
 * @cfg {String} username 向需要验证的服务发送请求时设置的用户名。
 * @cfg {String} password 向需要验证的服务发送请求时设置的密码。
 * @cfg {String} contentType 请求的内容类型，默认为"application/x-www-form-urlencoded"。
 * @cfg {String} charset 请求的编码类型，默认为"UTF-8"。
 * @cfg {String} scriptCharset 请求script时的编码类型。
 * @cfg {Object|String} data 请求发送的数据，可以是简单名值对组成的Object或者查询串。
 * @cfg {Number} timeout 请求超时时间。
 * @cfg {String} jsonp callback请求时的参数名，例如"http://url.com?jsonp=myCallback"
 * @cfg {String} dataType 数据类型，可以是以下类型：<br>
 * text - 返回文本类型的数据；<br>
 * json - 返回对象；<br>
 * jsonp - 执行jsonp请求；<br>
 * script - 请求script
 * @cfg {String} label 当dataType为script时用于判断请求是否出错。由于在请求script时，无法通过状态或内容判断来确定请求是否出错，因此需要使用者提供一个label，这个label是脚本在加载完成后会注册在window上的变量。如果不提供label或加载的script不会添加新的变量则无法捕获错误。
 * @cfg {Object} headers 设置请求头，由键值对组成的对象。
 */

(function(){
    /**
     * 构造函数
     * @param {Object} options OPTIONS配置
     * @constructor Ajax
     */
    function Ajax( options ){
        this.ops = {
            url:			null,
            method:			'GET',
            async:			true,
			cache:			true,
            username:		null,
            password:		null,
            contentType:	'application/x-www-form-urlencoded',
            charset:		'UTF-8',
			scriptCharset:	null,
            data:			null,
            timeout:		null,
			jsonp:			'callback',
			dataType:		'text',
			label:			null,
			headers:		null,
			/**
			 * @event onbefore
			 * 发送请求前触发的事件，并根据事件的返回值决定是否继续执行请求
			 * @param {Object} option Ajax实例的option对象
			 */
			onbefore:		null,
			/**
			 * @event onsuccess
			 * 请求成功时触发
			 * @param {String|JSON} data 请求得到的响应数据，根据不同dataType会获取到不同类型的值
			 * @param {Object} option Ajax实例的option对象
			 */
			onsuccess:		null,
			/**
			 * @event oncomplete
			 * 请求完成时触发
			 * @param {XMLHTTPRequest} xhr XHR实例
			 * @param {Object} option Ajax实例的option对象
			 */
			oncomplete:		null,
			/**
			 * @event onerror
			 * 请求出错时触发
			 * @param {XMLHTTPRequest} xhr XHR实例，获取script和jsonp时为null
			 * @param {Object} option Ajax实例的option对象
			 * @param {String} type 错误类型：script、jsonp、timeout、status
			 */
			onerror:		null,
			/**
			 * @event oncancel
			 * 请求被取消时触发
			 * @param {XMLHTTPRequest} xhr XHR实例
			 * @param {Object} option Ajax实例的option对象
			 */
			oncancel:		null
        };
        QW.ObjectH.mix(this.ops,Ajax.options,true);
        QW.ObjectH.mix(this.ops,options,true);
		this._xhr = null;
		this.completed = null;
		QW.CustEvent.createEvents(this, Ajax.EVENTS);
    }

    /*
     * 静态成员
     */
    QW.ObjectH.mix( Ajax, {
        versions: ['MSXML2.XMLHttp.6.0', 'MSXML2.XMLHttp.3.0', 'MSXML2.XMLHttp.5.0', 'MSXML2.XMLHttp.4.0', 'Msxml2.XMLHTTP','MSXML.XMLHttp','Microsoft.XMLHTTP'],
		EVENTS:[
			'before',
			'success',
			'complete',
			'error',
			'cancel'
		],
        /*
         * 请求状态
         */
        STATE_JSPERROR:  1,
        STATE_JSERROR:  2,
        STATE_JSSUCCESS:  3,
        STATE_TIMEOUT:  4,
        STATE_CANCEL:   5,
        /*
         * 存储空闲的XHR对象
		 */
		_xhrPool: [],
		/**
		 * @property options 静态全局配置
		 * @type Object
		 */
		options: {			
			useXHRPool:	false
		},
        /**
         * 获取XMLHttpRequest对象
		 * @method 
		 * @static
		 * @return {XMLHTTPRequest}
         */
		getXHR: function(){
			if( Ajax.options.useXHRPool && Ajax._xhrPool.length > 0 ){
				return Ajax._xhrPool.shift();
			}
            if(window.ActiveXObject){
		        while( Ajax.versions.length > 0 ){
			        try{
			        	return new ActiveXObject(Ajax.versions[0]);
		        	}
		        	catch(e){
		        		Ajax.versions.shift();
		        		continue;
		        	}
	        	}
        	}
        	else if(window.XMLHttpRequest){
	         	return new XMLHttpRequest();
        	}
        },
		/**
         * 静态get方法
		 * @method
		 * @static
         * @param {String} url 请求的地址
         * @param {Object|String} data 发送的数据
         * @param {Function} callback 请求成功后的回调
		 * @example
			QW.Ajax.get('http://demo.com',{key: 'value'},function(data){});
         */
        get: function( url, data, callback){
			if( url && QW.Dom.isElement(url) && url.tagName.toLowerCase() == 'form' ){
				var form = url;
				url = form.action;
				callback = data;
				data = form;
			}
			if( typeof data == 'function' ){
				callback = data;
				data = '';
			}
			var a = new Ajax({
				url:	url,
				method:	'get',
				data:	data,
				onsuccess:callback
			});
			a.request();
			return a;
        },
		/**
         * 静态post方法
		 * @method
		 * @static
         * @param {String} url 请求的地址
         * @param {Object|String} data 发送的数据
         * @param {Function} callback 请求成功后的回调
         */
        post: function( url, data, callback){
			if( url && QW.Dom.isElement(url) && url.tagName.toLowerCase() == 'form' ){
				var form = url;
				url = form.action;
				callback = data;
				data = form;
			}
			if( typeof data == 'function' ){
				callback = data;
				data = '';
			}
			var a = new Ajax({
				url:	url,
				method:	'post',
				data:	data,
				onsuccess: callback
			});
			a.request();
			return a;
        },
		/**
         * 静态加载Javascript脚本的方法
		 * @method
		 * @static
         * @param {String} url 请求的地址
         * @param {Object|String} data 发送的数据
         * @param {Function} callback 请求成功后的回调
         */
        getScript: function( url, data, callback){
			var a = new Ajax({
				url:	url,
				data:	data,
				dataType: 'script',
				onsuccess:callback
			});
			a.request();
			return a;
        },
		/**
         * 静态获取JSON对象的方法
		 * @method
		 * @static
         * @param {String} url 请求的地址
         * @param {Object|String} data 发送的数据
         * @param {Function} callback 请求成功后的回调
         */
        getJSON: function( url, data, callback){
			var a = new Ajax({
				url:	url,
				method: 'get',
				data:	data,
				dataType: 'json',
				onsuccess:callback
			});
			a.request();
			return a;
        },
		/**
         * 静态JSONP方法
		 * @method
		 * @static
         * @param {String} url 请求的地址
         * @param {Object|String} data 发送的数据
         * @param {Function} callback 请求成功后的回调
         */
        getJSONP: function( url, data, callback){
			var a = new Ajax({
				url:	url,
				method: 'get',
				data:	data,
				dataType: 'jsonp',
				onsuccess:callback
			});
			a.request();
			return a;
        },
        /**
         * 判断一个请求是否成功
		 * @method
		 * @static
         * @param {XMLHTTPRequest} xhr XMLHttpRequest对象
         * @return {Boolean} true-成功；false-失败
         */
        isSuccess: function( xhr ){
            var status = xhr.status;
            return !status || (status >= 200 && status < 300) || status == 304;           
        },
        /**
         * 判断一个请求是否是否正在请求中
		 * @method
		 * @static
         * @param {XMLHTTPRequest} xhr XMLHttpRequest对象
         * @return {Boolean} true-请求中；false-非请求中
         */
        isProcessing: function( xhr ){
            var state = xhr.readyState;
            return state > 0 && state < 4;           
        },
        /**
         * 序列化一个JSON对象
		 * @method
		 * @static
		 * @private
         * @param {Object|String|FORMElement } param 需要序列化的JSON对象或者字符串、或者表单元素
         * @return {String} 序列化后的结果
         */
		_stringify: function( param ){
			if( param == null || typeof param == 'undefined' ) return '';
			if( typeof param == 'string' ) return param;
			if( QW.Dom.isElement(param) && param.tagName.toLowerCase() == 'form' ){
				return QW.Dom.encodeURIForm(param);
			}
			if( typeof param == 'object' ){
            	var tdata = [];
		    	for( var p in param ){
			    	if(param[p] == null) continue;
			    	if(param[p].constructor == Array) 
			    	{
				    	for (var i=0;i < param[p].length;i++) 
							tdata.push( encodeURIComponent(p) + "=" + encodeURIComponent(param[p][i]));
			    	}
			    	else 
				    	tdata.push( encodeURIComponent(p) + "=" + encodeURIComponent(param[p]));
		    	}
				return tdata.join("&");
			}
			return '';
        }       
    } );
    /*
     * 成员方法
     */
    QW.ObjectH.mix( Ajax.prototype, {
		_jsonp_num: 0,
        /*
         * 设置请求头
         * @private
         */   
        _setRequestHeaders:  function(){
            var headers = {"x-baidu-ie":"utf-8","x-baidu-rf":"json"};
	        //设置Content Type以及charset
	        headers['Content-type'] = this.ops.contentType +
                (this.ops.charset ? '; charset=' + this.ops.charset : '');
	        //设置用户配置的Request header,使用JSON的形式存放
	        var userHeaders = this.ops.headers;
	        //Object
	        if( typeof(userHeaders) == 'object' )
		        QW.ObjectH.mix( headers,userHeaders,true );
	        for(var i in headers){
		        this._xhr.setRequestHeader( i, headers[i] );
	        }
        },
        /** 
         * 发送请求
         * @method
         * @param {String} url 请求的地址
         * @param {String} method 请求方法
         * @param {Object|String|FORMElement } data 发送的数据,data可以是一个表单元素，此时将会以表单的action作为url，method作为ajax的method，除非未设置表单的属性则会以options中为准。
         */
        request: function(url,method,data){
			this.completed = false;
            //设置请求参数和数据
			var ops = this.ops,me=this;
            if( (ops.onbefore && ops.onbefore.call(this,ops) === false) || this.fire('before') === false){
				return;
			}
			//如果只有一个参数或者第一个参数为Dom Node或者对象，则把第一个参数作为data
            if( arguments.length == 1 || QW.Dom.isElement(url) || typeof url == 'object' ){
                data = url;
                url = ops.url;
                method = ops.method;
            }
            else{
			    url = url || ops.url;
                method = method || ops.method;
			    data = data || ops.data;
            }
			//如果是发送表单数据则根据form的action以及method来设置url和method
			if( QW.Dom.isElement(data) && data.tagName.toLowerCase() == 'form' ){
				url = data.action || url;
				method = data.method || method;
			}
            data = Ajax._stringify( data );

			function addParam(url,param){
				url = url.indexOf('?') != -1 ? url + '&' + param : url + '?' + param;
				return url;
			}
            
            if(data && method.toLowerCase() == 'get'){
		    	url = addParam(url,data);
			}

			if( !ops.cache && method.toLowerCase() == 'get' ){
				var t = +new Date,ts = t + '=' + t;
				url = addParam(url,ts);
			}

            var me = this;
			var type = ops.dataType,head,script;
			if( type == 'jsonp' ){
				var jsonp = 'jsonp' + this._jsonp_num++,jsonpstr = ops.jsonp + '=' + jsonp;
				url = url.indexOf('?') != -1 ? url + '&' + jsonpstr : url + '?' + jsonpstr;
				this._setupJSONP(url,ops,jsonp);
				/*
				window[jsonp] = function(data){
					if( me._timer )
						clearTimeout(me._timer);
					ops.onsuccess && ops.onsuccess(data,ops);
					ops.oncomplete && ops.oncomplete(data,ops);
					window[jsonp] = undefined;
					try{
						delete window[jsonp];
					}catch(e){};
					if( head && script )
						head.removeChild(script);
				}
				*/
				return;
			}

			if( type == 'script' ){
				head = document.getElementsByTagName('head')[0];
				script = document.createElement('script');
				script.src = url;
				if( ops.scriptCharset )
					script.charset = ops.scriptCharset;
				//jsonp不需要if块中的步骤
				if( ops.dataType == 'script' ){
					var done = false;
					script.onerror = script.onload = script.onreadystatechange = function(){
						if ( !done && (!this.readyState ||
								this.readyState == "loaded" || this.readyState == "complete") ) {
							if( me._timer )
								clearTimeout(me._timer);
							done = true;
							if( ops.label && ops.onerror ){
								try{	
									QW.StringH.evalJs(ops.label);
									me._handleComplete( Ajax.STATE_JSSUCCESS );
								}
								catch(e){
									me._handleComplete( Ajax.STATE_JSERROR );
								}
							}
							else
								me._handleComplete( Ajax.STATE_JSSUCCESS );

							// Handle memory leak in IE
							script.onerror = script.onload = script.onreadystatechange = null;
							head.removeChild( script );
						}
					};
				}
				head.appendChild(script);
				if( ops.onerror && ops.timeout > 0 ){
					this._timer = setTimeout(function(){
					   me._handleComplete( Ajax.STATE_TIMEOUT );
					}
					,this.ops.timeout);
				}
				return;
			}

            //获取XMLHttpRequest对象
            this._xhr = Ajax.getXHR();
            //设置回调
			var xhr = this._xhr;
			//如果是异步调用则设置回调
			if( this.ops.async )
            	this._xhr.onreadystatechange = function(){

                	if( xhr.readyState == 4 ){
                    	me._handleComplete();
                    	//终止闭包，防止内存泄露
						xhr.onreadystatechange = new Function();
						if( Ajax.options.useXHRPool )
							Ajax._xhrPool.push(xhr);
                	}
            	}
            //Open
			if( ops.username )
				this._xhr.open( method.toUpperCase(),url,ops.async,ops.username,ops.password);
			else
				this._xhr.open( method.toUpperCase(),url,ops.async);

            //设置请求头
            this._setRequestHeaders();

            if( data && method.toLowerCase() == "post" )	
		        this._xhr.send( data );
	        else
		        this._xhr.send( null );	
            if( ops.timeout > 0 && ops.async )
                this._checkTimeout();
			//如果是同步调用则在send完成后调用_handleComplete进行处理
			if( !this.ops.async ){
				this._handleComplete();
			}
        },
        /*
         * 请求完成后的回调处理
         * @private
         * @param { Integer } state: 需要进行处理的状态
         */   
        _handleComplete: function( state,data ){
			this.completed = true;
            var ops = this.ops;
            var xhr = this._xhr;
            switch( state ){
                case Ajax.STATE_JSSUCCESS:
					ops.onsuccess && ops.onsuccess.call(this,data,ops);
					this.fire('success');
					break;
                case Ajax.STATE_JSERROR:
					ops.onerror && ops.onerror.call(this,null,ops,'script');
					this.fire('error');
					break;
                case Ajax.STATE_JSPERROR:
					ops.onerror && ops.onerror.call(this,null,ops,'jsonp');
					this.fire('error');
					break;
                case Ajax.STATE_TIMEOUT:
                    if( ops.onerror )
                        ops.onerror.call(this, xhr, ops, 'timeout' );
                    if( this._timer )
                        clearTimeout( this._timer );
					this.fire('error');
                    break;
                case Ajax.STATE_CANCEL:
                    if( ops.oncancel )
                        ops.oncancel.call(this, xhr, ops );
					this.fire('cancel');
                    break;
                default:
					/* Gecko中，调用abort会触发onreadystatechange执行
				 	 * 如果是由于abort触发的则直接忽略
				 	 */
					if( this._byCanceled ){
						this._byCanceled = false;
						return;
					}
                    if( Ajax.isSuccess( xhr ) && ops.onsuccess ){
						//检测服务器响应头是否返回XML内容，如果指定dataType为"xml"或未指定dataType但是返回头中包含xml信息则使用responseXML
						var ct = xhr.getResponseHeader("content-type"),
						dataType = ops.dataType,
						useXML = dataType == "xml" || !dataType && ct && ct.indexOf("xml") >= 0,
						result = useXML ? xhr.responseXML : xhr.responseText;
						if( dataType == 'json' ){
							result = new Function( 'return ' + result )();
						}
                        ops.onsuccess.call(this, result, ops );
                    }
                    if( !Ajax.isSuccess( xhr ) && ops.onerror ){
                        ops.onerror.call(this, xhr, ops, 'status');
                    }
					if( Ajax.isSuccess( xhr ) )
						this.fire('success');
					else
						this.fire('error');
            }
			if( ops.oncomplete ) ops.oncomplete.call(this, xhr, ops );
			this.fire('complete');
        },
        /*
         * 检验超时
         * @private
         */
        _checkTimeout: function(){
           if( this.ops.timeout > 0 ){
               var me = this;
               this._timer = setTimeout(function(){
                   if( Ajax.isProcessing( me._xhr ) ){
                        me._abortXHR();
                        me._handleComplete( Ajax.STATE_TIMEOUT );
                   }        
                }
                ,this.ops.timeout);
            }
        },
        /*
         * 取消请求
         * @private
         */
        _abortXHR: function(){
            if( this._xhr ){
                this._byCanceled = true;
                this._xhr.abort();
                this._handleComplete( Ajax.STATE_CANCEL );
            }           
        },
        /**
         * 取消请求
         * @method
         */
        cancel: function(){
            this._abortXHR();
        },
		_setupJSONP: function(url,ops,jsonp){
			var me = this;
			if( ops.onerror && ops.timeout > 0 ){
				this._timer = setTimeout(function(){
				   me._handleComplete( Ajax.STATE_TIMEOUT );
				}
				,ops.timeout);
			}
			if( QW.Env.ie ){
				var frag = document.createDocumentFragment(), 
					script = document.createElement('script');
				function clearIE(){
					frag = script = script.onreadystatechange = frag[jsonp] = null;
				}
				if( ops.scriptCharset )
					script.charset = ops.scriptCharset;
				frag[jsonp] = function (data) {
					if( me._timer )
						clearTimeout(me._timer);
					/*调用用户传入的callback*/					
					me._handleComplete( Ajax.STATE_JSSUCCESS,data );
					/*使用完成后清除垃圾信息*/
					clearIE();
				};
				script.onreadystatechange = function () {
					if (script.readyState == 'loaded') {
						me._handleComplete( Ajax.STATE_JSPERROR );
						clearIE();
					}
				};
				script.src = url;
				frag.appendChild(script);
			}
			else{
				/*采用iframe可以对错误进行响应*/
				var iframe = document.createElement('iframe');
				iframe.style.display = 'none';
				/*清除，防止内存泄露*/
				function clear(){
					iframe.callback = iframe.errorcallback = null;
					iframe.src = 'about:blank', iframe.parentNode.removeChild(iframe), iframe = null;
				}
				var charset = ops.scriptCharset;
				
				/*在iframe的frameElement上定义callback*/
				iframe.callback = function (data) {
					if( me._timer )
						clearTimeout(me._timer);
					me._handleComplete( Ajax.STATE_JSSUCCESS,data );
					clear();
				};
				iframe.errorcallback = function () {
					me._handleComplete( Ajax.STATE_JSPERROR );
					clear();
				};
				try {
					document.body.appendChild(iframe);
					var doc = iframe.contentWindow.document;
					
					/*在iframe内容中定义真是的callback函数，以供正确请求到数据后进行响应，如果正确地请求到数据则会执行success回调并删除对错误的响应函数*/
					var content = 
						'<script type="text\/javascript">function ' + jsonp + '(data) { window.frameElement.callback(data); }<\/script>';
					/*写入script标签请求数据*/
					if( charset )
						content += 
						'<script type="text\/javascript" src="' + url + '" charset="' + charset + '"><\/script>';
					else						
						content += 
						'<script type="text\/javascript" src="' + url + '"><\/script>';
					content += 
						'<script type="text\/javascript">window.setTimeout("try { window.frameElement.errorcallback(); } catch (exp) {}", 1)<\/script>';
					doc.open();
					doc.write(content);
					doc.close();
				} catch (e) {}
			}
		}
    });
    QW.provide('Ajax', Ajax);
 })();