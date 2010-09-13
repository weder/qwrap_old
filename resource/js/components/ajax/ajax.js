/*
 *	Copyright (c) 2009, Baidu Inc. All rights reserved.
 *	http://www.youa.com
 *	version: $version$ $release$ released
 *	author: chenminliang@baidu.com
*/

/**
 * @class Ajax Ajax��
 * @namespace QW
 * @cfg {String} url ����ķ��͵�ַ��
 * @cfg {String} method ����ʽ��GET��POST)��Ĭ��Ϊ"GET"��
 * @cfg {Boolean} async �Ƿ�ʹ���첽����Ĭ��Ϊtrue��
 * @cfg {Boolean} cache �Ƿ�ʹ�������Cache���������Ϊfalse����ÿ����������������Ĭ��Ϊtrue��
 * @cfg {String} username ����Ҫ��֤�ķ���������ʱ���õ��û�����
 * @cfg {String} password ����Ҫ��֤�ķ���������ʱ���õ����롣
 * @cfg {String} contentType ������������ͣ�Ĭ��Ϊ"application/x-www-form-urlencoded"��
 * @cfg {String} charset ����ı������ͣ�Ĭ��Ϊ"UTF-8"��
 * @cfg {String} scriptCharset ����scriptʱ�ı������͡�
 * @cfg {Object|String} data �����͵����ݣ������Ǽ���ֵ����ɵ�Object���߲�ѯ����
 * @cfg {Number} timeout ����ʱʱ�䡣
 * @cfg {String} jsonp callback����ʱ�Ĳ�����������"http://url.com?jsonp=myCallback"
 * @cfg {String} dataType �������ͣ��������������ͣ�<br>
 * text - �����ı����͵����ݣ�<br>
 * json - ���ض���<br>
 * jsonp - ִ��jsonp����<br>
 * script - ����script
 * @cfg {String} label ��dataTypeΪscriptʱ�����ж������Ƿ��������������scriptʱ���޷�ͨ��״̬�������ж���ȷ�������Ƿ���������Ҫʹ�����ṩһ��label�����label�ǽű��ڼ�����ɺ��ע����window�ϵı�����������ṩlabel����ص�script��������µı������޷��������
 * @cfg {Object} headers ��������ͷ���ɼ�ֵ����ɵĶ���
 */

(function(){
    /**
     * ���캯��
     * @param {Object} options OPTIONS����
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
			 * ��������ǰ�������¼����������¼��ķ���ֵ�����Ƿ����ִ������
			 * @param {Object} option Ajaxʵ����option����
			 */
			onbefore:		null,
			/**
			 * @event onsuccess
			 * ����ɹ�ʱ����
			 * @param {String|JSON} data ����õ�����Ӧ���ݣ����ݲ�ͬdataType���ȡ����ͬ���͵�ֵ
			 * @param {Object} option Ajaxʵ����option����
			 */
			onsuccess:		null,
			/**
			 * @event oncomplete
			 * �������ʱ����
			 * @param {XMLHTTPRequest} xhr XHRʵ��
			 * @param {Object} option Ajaxʵ����option����
			 */
			oncomplete:		null,
			/**
			 * @event onerror
			 * �������ʱ����
			 * @param {XMLHTTPRequest} xhr XHRʵ������ȡscript��jsonpʱΪnull
			 * @param {Object} option Ajaxʵ����option����
			 * @param {String} type �������ͣ�script��jsonp��timeout��status
			 */
			onerror:		null,
			/**
			 * @event oncancel
			 * ����ȡ��ʱ����
			 * @param {XMLHTTPRequest} xhr XHRʵ��
			 * @param {Object} option Ajaxʵ����option����
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
     * ��̬��Ա
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
         * ����״̬
         */
        STATE_JSPERROR:  1,
        STATE_JSERROR:  2,
        STATE_JSSUCCESS:  3,
        STATE_TIMEOUT:  4,
        STATE_CANCEL:   5,
        /*
         * �洢���е�XHR����
		 */
		_xhrPool: [],
		/**
		 * @property options ��̬ȫ������
		 * @type Object
		 */
		options: {			
			useXHRPool:	false
		},
        /**
         * ��ȡXMLHttpRequest����
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
         * ��̬get����
		 * @method
		 * @static
         * @param {String} url ����ĵ�ַ
         * @param {Object|String} data ���͵�����
         * @param {Function} callback ����ɹ���Ļص�
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
         * ��̬post����
		 * @method
		 * @static
         * @param {String} url ����ĵ�ַ
         * @param {Object|String} data ���͵�����
         * @param {Function} callback ����ɹ���Ļص�
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
         * ��̬����Javascript�ű��ķ���
		 * @method
		 * @static
         * @param {String} url ����ĵ�ַ
         * @param {Object|String} data ���͵�����
         * @param {Function} callback ����ɹ���Ļص�
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
         * ��̬��ȡJSON����ķ���
		 * @method
		 * @static
         * @param {String} url ����ĵ�ַ
         * @param {Object|String} data ���͵�����
         * @param {Function} callback ����ɹ���Ļص�
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
         * ��̬JSONP����
		 * @method
		 * @static
         * @param {String} url ����ĵ�ַ
         * @param {Object|String} data ���͵�����
         * @param {Function} callback ����ɹ���Ļص�
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
         * �ж�һ�������Ƿ�ɹ�
		 * @method
		 * @static
         * @param {XMLHTTPRequest} xhr XMLHttpRequest����
         * @return {Boolean} true-�ɹ���false-ʧ��
         */
        isSuccess: function( xhr ){
            var status = xhr.status;
            return !status || (status >= 200 && status < 300) || status == 304;           
        },
        /**
         * �ж�һ�������Ƿ��Ƿ�����������
		 * @method
		 * @static
         * @param {XMLHTTPRequest} xhr XMLHttpRequest����
         * @return {Boolean} true-�����У�false-��������
         */
        isProcessing: function( xhr ){
            var state = xhr.readyState;
            return state > 0 && state < 4;           
        },
        /**
         * ���л�һ��JSON����
		 * @method
		 * @static
		 * @private
         * @param {Object|String|FORMElement } param ��Ҫ���л���JSON��������ַ��������߱�Ԫ��
         * @return {String} ���л���Ľ��
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
     * ��Ա����
     */
    QW.ObjectH.mix( Ajax.prototype, {
		_jsonp_num: 0,
        /*
         * ��������ͷ
         * @private
         */   
        _setRequestHeaders:  function(){
            var headers = {"x-baidu-ie":"utf-8","x-baidu-rf":"json"};
	        //����Content Type�Լ�charset
	        headers['Content-type'] = this.ops.contentType +
                (this.ops.charset ? '; charset=' + this.ops.charset : '');
	        //�����û����õ�Request header,ʹ��JSON����ʽ���
	        var userHeaders = this.ops.headers;
	        //Object
	        if( typeof(userHeaders) == 'object' )
		        QW.ObjectH.mix( headers,userHeaders,true );
	        for(var i in headers){
		        this._xhr.setRequestHeader( i, headers[i] );
	        }
        },
        /** 
         * ��������
         * @method
         * @param {String} url ����ĵ�ַ
         * @param {String} method ���󷽷�
         * @param {Object|String|FORMElement } data ���͵�����,data������һ����Ԫ�أ���ʱ�����Ա���action��Ϊurl��method��Ϊajax��method������δ���ñ������������options��Ϊ׼��
         */
        request: function(url,method,data){
			this.completed = false;
            //�����������������
			var ops = this.ops,me=this;
            if( (ops.onbefore && ops.onbefore.call(this,ops) === false) || this.fire('before') === false){
				return;
			}
			//���ֻ��һ���������ߵ�һ������ΪDom Node���߶�����ѵ�һ��������Ϊdata
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
			//����Ƿ��ͱ����������form��action�Լ�method������url��method
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
				//jsonp����Ҫif���еĲ���
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

            //��ȡXMLHttpRequest����
            this._xhr = Ajax.getXHR();
            //���ûص�
			var xhr = this._xhr;
			//������첽���������ûص�
			if( this.ops.async )
            	this._xhr.onreadystatechange = function(){

                	if( xhr.readyState == 4 ){
                    	me._handleComplete();
                    	//��ֹ�հ�����ֹ�ڴ�й¶
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

            //��������ͷ
            this._setRequestHeaders();

            if( data && method.toLowerCase() == "post" )	
		        this._xhr.send( data );
	        else
		        this._xhr.send( null );	
            if( ops.timeout > 0 && ops.async )
                this._checkTimeout();
			//�����ͬ����������send��ɺ����_handleComplete���д���
			if( !this.ops.async ){
				this._handleComplete();
			}
        },
        /*
         * ������ɺ�Ļص�����
         * @private
         * @param { Integer } state: ��Ҫ���д����״̬
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
					/* Gecko�У�����abort�ᴥ��onreadystatechangeִ��
				 	 * ���������abort��������ֱ�Ӻ���
				 	 */
					if( this._byCanceled ){
						this._byCanceled = false;
						return;
					}
                    if( Ajax.isSuccess( xhr ) && ops.onsuccess ){
						//����������Ӧͷ�Ƿ񷵻�XML���ݣ����ָ��dataTypeΪ"xml"��δָ��dataType���Ƿ���ͷ�а���xml��Ϣ��ʹ��responseXML
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
         * ���鳬ʱ
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
         * ȡ������
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
         * ȡ������
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
					/*�����û������callback*/					
					me._handleComplete( Ajax.STATE_JSSUCCESS,data );
					/*ʹ����ɺ����������Ϣ*/
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
				/*����iframe���ԶԴ��������Ӧ*/
				var iframe = document.createElement('iframe');
				iframe.style.display = 'none';
				/*�������ֹ�ڴ�й¶*/
				function clear(){
					iframe.callback = iframe.errorcallback = null;
					iframe.src = 'about:blank', iframe.parentNode.removeChild(iframe), iframe = null;
				}
				var charset = ops.scriptCharset;
				
				/*��iframe��frameElement�϶���callback*/
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
					
					/*��iframe�����ж������ǵ�callback�������Թ���ȷ�������ݺ������Ӧ�������ȷ�������������ִ��success�ص���ɾ���Դ������Ӧ����*/
					var content = 
						'<script type="text\/javascript">function ' + jsonp + '(data) { window.frameElement.callback(data); }<\/script>';
					/*д��script��ǩ��������*/
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