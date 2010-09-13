/*
 * @fileoverview Encapsulates common operations of Ajax
 * @author��JK ,���󲿷ִ�������QWLib/util/QWAjax(1.0��),������Ϊ��chen.minliang@gmail.com����л
 * @version 0.1
 * @create-date : 2009-02-20
 * @last-modified : 2009-02-20
 */


(function(){
	var mix=QW.ObjectH.mix,
		CustEvent=QW.CustEvent;

	/**
	* @class Ajax Ajax��Ĺ��캯��
	* @param {json} options: �������
		*------------------------------------------------------------------------------------
		*| options����		|		˵��				|	Ĭ��ֵ							|
		*------------------------------------------------------------------------------------
		*| url: 			|	�����·��			    |	���ַ���						|
		*| method: 			|	����ķ���				|	post							|
		*| async: 			|	�Ƿ��첽����			|	true							|
		*| user:			|	�û���				    |	���ַ���						|
		*| pwd:				|	����					|	���ַ���						|
		*| requestHeaders:	|	����ͷ����			    |	{}								|
		*| data:			|	���͵�����			    |	���ַ���						|
		*| useLock:			|	�Ƿ�ʹ��������			|	0								|
		*| timeout:			|	��������ʱ��ʱ�䣨ms��|	30000							|
		*------------------------------------------------------------------------------------
	* @return {Ajax} : 
	* @constructor
	*/
	function Ajax( options ){
		this.options = options;
		this._initialize();
	};
	var versions=['MSXML2.XMLHttp.6.0', 'MSXML2.XMLHttp.3.0', 'MSXML2.XMLHttp.5.0', 'MSXML2.XMLHttp.4.0', 'Msxml2.XMLHTTP','MSXML.XMLHttp','Microsoft.XMLHTTP'];
	mix(Ajax,{
		/*
		* ����״̬
		*/
		STATE_INIT:     0,
		STATE_REQUEST:  1,
		STATE_SUCCESS:  2,
		STATE_ERROR:    3,
		STATE_TIMEOUT:  4,
		STATE_CANCEL:   5,
		/** 
		* defaultHeaders: Ĭ�ϵ�requestHeader��Ϣ
		*/
		defaultHeaders:{
			'Content-type':'application/x-www-form-urlencoded UTF-8',//�������
			'com-info-1':'QW'//������Ӧ���йص�header��Ϣ
		},
		/** 
		* EVENTS: Ajax��CustEvents
		*/
		EVENTS:['send','succeed','error','cancel','complete'],
		/**
		*XHRVersions: IE��XMLHttpRequest�İ汾
		*/
		XHRVersions:['MSXML2.XMLHttp.6.0', 'MSXML2.XMLHttp.3.0', 'MSXML2.XMLHttp.5.0', 'MSXML2.XMLHttp.4.0', 'Msxml2.XMLHTTP','MSXML.XMLHttp','Microsoft.XMLHTTP'],
		/** 
		* getXHR(): �õ�һ��XMLHttpRequest����
		* @returns {XMLHttpRequest} : ����һ��XMLHttpRequest����
		*/
		getXHR: function () {
			var versions=Ajax.XHRVersions;
			if(window.ActiveXObject){
				while( versions.length > 0 ){
					try{
						return new ActiveXObject(versions[0]);
					}
					catch(ex){
						versions.shift();
					}
				}
			}
			else if(window.XMLHttpRequest){
				return new XMLHttpRequest();
			}
			return null;
		},
		/** 
		* encodeURIJson(data): encodeURIһ��Json����
		* @param {Json} data: Json����
		* @returns {string} : ���ر�encodeURI�˵�Json��
		*/
		encodeURIJson: function(data){
			var s = [];
			for( var p in data ){
				if(data[p]==null) continue;
				if(data[p].constructor==Array)
				{
					for (var i=0;i<data[p].length;i++) s.push( p + '=' + encodeURIComponent(data[p][i]));
				}
				else
					s.push( p + '=' + encodeURIComponent(data[p]));
			}
			return s.join('&');
		}
	});

	mix(Ajax.prototype,{
		//����
		url:			'',
		method:			'post',
		async:			true,
		user:			'',
		pwd:			'',
		requestHeaders:	null,//��һ��json����
		data:			'',
		/*
		* �Ƿ�������������������������֮ǰ��������ɺ���ܽ�����һ������
		* Ĭ�ϲ�������
		*/
		useLock:       0,
		timeout:		 30000,			//��ʱʱ��

		//˽�б�����readOnly����
		isLocked :	0,	//��������״̬
		state :	Ajax.STATE_INIT,	//��������״̬
		/** 
		* send( url, method, data ): ��������
		* @param {string} url: �����url
		* @param {string} method: ���ͷ�����get/post
		* @param {string|jason|FormElement} data: �������ַ�����Ҳ������Json����Ҳ������FormElement
		* @returns {void} : ��
		*/
		send : function( url, method, data ){
			var me=this;
			if( me.isLocked ) throw new Error('Locked.');
			else if(me.isProcessing()) {me.cancel();}
			var requester=me.requester;
			if(!requester){
				requester=me.requester = Ajax.getXHR();
				if( !requester ){
					throw new Error('�޷��õ�HTTPRequester.'+versions);
				}
			}
			url = url || me.url;
			method = (method || me.method).toLowerCase();
			data = data || me.data;
			
			if( typeof data == 'object' )	{
				if(data.tagName='FORM') data=Dom.encodeURIForm(data); //data��Form HTMLElement
				else data = Ajax.encodeURIJson(data); //data��Json����
			}

			//�����get��ʽ������������ݱ�����'key1=value1&key2=value2'��ʽ�ġ�
			if(data && method == 'get')
					url += (url.indexOf('?') != -1?'&':'?') + data ;
			if( me.user)		
				requester.open(method,url,me.async,me.user,me.pwd );
			else
				requester.open(method,url,me.async);
			//��������ͷ
			for(var i in me.requestHeaders){
				requester.setRequestHeader( i, me.requestHeaders[i] );
			}
			//����
			me.isLocked=0;
			me.state=Ajax.STATE_INIT;
			//send�¼�
			if(me.async) {
				me._sendTime=new Date();
				if(me.useLock) me.isLocked=1;
				this.requester.onreadystatechange = function(){
					var state = me.requester.readyState;
					if( state == 4 ) {
						me._execComplete();
					}
				};
				me._checkTimeout();
			}
			if( method == 'post' ){
				if( !data )	data = ' ';
				requester.send(data);
			}
			else
				requester.send(null);
		},
		/** 
		* isSuccess(): �ж����ڵ�״̬�Ƿ��ǡ�������ɹ���
		* @returns {boolean} : ����XMLHttpRequest�Ƿ�ɹ�����
		*/
		isSuccess: function(){
            var status = this.requester.status;
            return !status || (status >= 200 && status < 300) || status == 304;
		},
		/** 
		* isProcessing(): �ж����ڵ�״̬�Ƿ��ǡ����������С�
		* @returns {boolean} : ����XMLHttpRequest�Ƿ���������
		*/
		isProcessing: function(){
			var state = this.requester?this.requester.readyState:0;
			return state > 0 && state < 4;
		},
		/** 
		* get(url,data): ��get��ʽ��������
		* @param {string} url: �����url
		* @param {string|jason|FormElement} data: �������ַ�����Ҳ������Json����Ҳ������FormElement
		* @returns {void} : ��
		* @see : send ��
		*/
		get: function(url,data){
			this.send(url,'get',data);
		},
		/** 
		* get(url,data): ��post��ʽ��������
		* @param {string} url: �����url
		* @param {string|jason|FormElement} data: �������ַ�����Ҳ������Json����Ҳ������FormElement
		* @returns {void} : ��
		* @see : send ��
		*/
		post: function(url,data){
			this.send(url,'post',data);
		},
		/** 
		* cancel(): ȡ������
		* @returns {boolean}: �Ƿ���ȡ��������������Ϊ��ʱ�����Ѿ��������������Ѿ��ɹ���
		*/
		cancel: function(){
			var me=this;
			if( me.requester && me.isProcessing() ) {
				me.state = Ajax.STATE_CANCEL;
				me.requester.abort();
				me._execComplete();
				me.fire('cancel');
				return true;
			}
			return false;
		 },
		/** 
		* _initialize(): ��һ��Ajax���г�ʼ��
		* @returns {void}: 
		*/
		_initialize: function(){
			var me=this;
			CustEvent.createEvents(me,Ajax.EVENTS);
			mix(me,me.options,1);
			me.requestHeaders=mix(me.requestHeaders||{},Ajax.defaultHeaders);

		},
		/** 
		* _checkTimeout(): ����Ƿ�����ʱ
		* @returns {void}: 
		*/
		_checkTimeout: function(){
			var me = this;
			if(me.async){
				clearTimeout(me._timer);
				this._timer = setTimeout(function(){
					// Check to see if the request is still happening
					if (me.requester && !me.isProcessing() ) {
						// Cancel the request
						me.state=Ajax.STATE_TIMEOUT;
						me.requester.abort();//Firefoxִ�и÷�����ᴥ��onreadystatechange�¼�������state=4;���Իᴥ��oncomplete�¼�����IE��Safari����
						me._execComplete('timeout');
					}
				}, me.timeout);
			}
		},
		/** 
		* _execComplete(): ִ��������ɵĲ���
		* @returns {void}: 
		*/
		_execComplete: function(){
			var me=this;
			var requester = me.requester;
			requester.onreadystatechange=new Function;//��ֹIE6�µ��ڴ�й©
			me.isLocked = 0;//����
			clearTimeout( this._timer );
			if( me.state==Ajax.STATE_CANCEL || me.state==Ajax.STATE_TIMEOUT ){
				//do nothing. ����Ǳ�ȡ��������ִ�лص�
			}
			else if( me.isSuccess()) {
				me.state=Ajax.STATE_SUCCESS;
				me.fire('succeed');
			}
			else {
				me.state=Ajax.STATE_ERROR;
				me.fire('error');
			}
			me.fire('complete');
		}
	});

	QW.provide('Ajax',Ajax);
})();

