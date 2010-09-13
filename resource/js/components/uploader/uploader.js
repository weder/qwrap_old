/**
 * @class UPLoader ������ˢ���ļ��ϴ������ʵ�ֵľ���ԭ��Ϊ�������ڳ�ʼ����ʱ����Ҫ�ύ�ı���target��������Ϊiframe(������Զ�����)��name�������ύ���㲻��ˢ��ҳ�棻��Σ�����������Ӧ�����redirect����ǰҳ���������µ�һ����̬ҳURL������URL�Ĳ�����Я����������������ǰҳ��Ϳ��Զ�ȡ����������������Ӧ��
 * @namespace QW
 * @singleton
 * @cfg {Array|FORM|String} forms �����ϴ�ͼƬ�ı������һ��ҳ���а�������ϴ�ͼƬ������Դ���һ�������飬�����ÿ����Ԫ������Ǳ�Ԫ�ػ����Ǳ�ID�����ֻ��һ���������ֱ�Ӵ����Ԫ�ػ��ID��
 * @cfg {Function} onbefore ͼƬ��ʽ�ϴ�֮ǰ�����Ļص�����������Ϊ��Ӧ��formԪ�ز����ݻص��ķ��ؾ����Ƿ�����ϴ���
 * @cfg {Function} oncomplete ͼƬ�ϴ���ɺ�Ļص�����������Ϊ����������ֵ�Լ���Ӧ�ı�Ԫ�ء�
 * @cfg {Boolean} jsonverify �Ƿ�Է��������ؽ������JSON��飬���Ϊtrue�򵱷��������طǷ�JSON��ʽʱ��Դ˽��м�鲢����һ��������״̬��JSON�ṹ������ֱ�ӷ��ط����������ݣ��ڸ�����������oncomplete��ʹ��json����Ҫ���н���try/catch����Ĭ��Ϊtrue��
 */
 (function(){
	var UPLoader = (function(){
		var D = QW.DomU,N = QW.NodeH,A = QW.ArrayH,$ = N.$,E = QW.EventTargetH, EH= QW.EventH, O = QW.ObjectH;
			/*�����ύIFRAME*/
		var iframe = null, 
			/*��ǰ�����ύ�ı�Ԫ��*/
			activeForm = null,
			/*�Ƿ��ڵȴ���Ӧ��״̬���ύ�������ᱻ����Ϊtrue����������Ӧ��ᱻ����Ϊfalse����������hack iframe�ķ���������onload�¼�*/
			waiting = false,
			/*iframe name prefix*/
			iframeNamePrefix = 'cdc_upload_iframe_bridge',
			iframeCounter = 0,
			cdcFormData = [];

		return {
			jsonverify: true,
			/**
			 * ��ʼ��
			 * @method 
			 * @static
			 * @param {JSON} options ��ʼ������
			 */
			init: function(options){
				O.mix(this, options || {}, true);
				/*��ȡforms*/
				var o = options,
					forms = o.forms,
					me = this;
				//form��ǩ��form ID
				if( forms.tagName || typeof forms == 'string' ) forms = [$(forms)];	
				_forms = forms;
				//����form target
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
				/*����iframes*/
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
							/*�����Ƿ���ȷJSON�ṹ*/
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
