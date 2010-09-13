/*
 *	Copyright (c) 2010, Baidu Inc. All rights reserved.
 *	http://www.youa.com
 *	version: $version$ $release$ released
 *	author: quguangyu@baidu.com
 *  description: ��responseText��ͨ�õĴ�����
*/

if(!Ajax) {
	Ajax = {};
}
Ajax.Delay = 950;
Ajax.opResults = function(Results, url) {
	if(!Results) return false;
	if(Results.replace(/(\n|\r)+/g,"").trim().substr(0,1)!="{"){
		return Results;
	}else{
		try{
			eval("var status=" + Results);
		}
		catch(e){
			alert("���س������ص�����Ϊ��\n"+Results);
			return {"err":"inter"};
		}
 	}
	status.isop = true;
 	switch(status.err){
 		case "mcphp.ok":
 			if(url != false) {
				if(url){
					if(url === true) {
						setTimeout("window.location = window.location.href;window.location.reload(true);", Ajax.Delay);
					} else {
						setTimeout("window.location='"+url+"'",Ajax.Delay);
					}
				}
				else{
					if(status.data.url == null){
						setTimeout("window.location = window.location.href;window.location.reload(true);", Ajax.Delay);
					}
					else{
						setTimeout("window.location='"+status.data.url+"'", Ajax.Delay);
					}
				}
			} else {
				status.isop = false;
			}
		break;
		case "gmap.internal":
			alert("��֤����ڣ���ˢ��ҳ������ԣ�");
			break;
		case "mcphp.u_vcode":
			var els = document.getElementsByName('_vcode'), elKeys = document.getElementsByName('_vcode_key');
			if(els.length > 0 && elKeys.length > 0) {
				var el = els[0], elKey = elKeys[0];
				Valid.fail(el, "�������������֤�롣", true);
				if($('_vcode_img')) {
					$('_vcode_img').src = '/vcode?k=' + elKey.value + '&random='+Math.random();
				}
			}
			break;
		case "mcphp.u_input":
			for(var i in status.data) {
				var tempEl=document.getElementsByName(i);
				try{
					if(tempEl.length>0){
						var unfound = true;
						if (tempEl.length == 1) {
							Valid.fail(tempEl[0], "����������ݸ�ʽ���Ի򳬳��������Ƿ���������ַ���", true);
						}
						else{
							for(var x=0;x<tempEl.length;x++){
								if(status.fields[i]==tempEl[x].value.encode4Html()){
									Valid.fail(tempEl[x],"����������ݸ�ʽ���Ի򳬳��������Ƿ���������ַ���", true);
									unfound = false;
									break;
								};
							}
						}
					}
				}
				catch(e){
					alert("����������ݸ�ʽ���Ի򳬳��������Ƿ���������ַ���");
				}
			}
 		break;
 		case "mcphp.u_notfound":
 			alert("�������ҳ�治���ڣ�");
 		break;
 		case "mcphp.u_antispam":
 			alert("���ύ�����ݰ������дʻ㣬����������ύ��");
 		break;
		case "mcphp.u_deny":
			alert("���Ĳ���������");
		break;
		case "mcphp.u_bfilter":
			alert("���Ĳ���̫Ƶ����");
		break;
		case "login":
 		case "mcphp.u_login":
			try {
 				User.Login.show();
 				User.Login.hint("����Ҫ��¼����ܼ����ղŵĲ���");
			} catch(e) {
				try {
 					top.User.Login.show();
 					top.User.Login.hint("����Ҫ��¼����ܼ����ղŵĲ���");
				} catch(e1) {
					alert('����Ҫ��¼����ܼ����ղŵĲ�����');
				}
			}
 		break; 		
		case "mcphp.u_power":
 			window.location ="http://co.youa.baidu.com/content/misc/err/nopower/index.html";
 		break;
		case "mcphp.fatal":
		case "mar.sys_inter":
 			alert("ϵͳ�������Ժ����ԡ�");
 		break;
 		default:
			status.isop = false;
 	}
  	return status;
};

(function() {
	var QW = window.QW, 
		mix = QW.ObjectH.mix, 
		HH = QW.Helper, 
		DOM = QW.Dom,
		NodeW = QW.NodeW,
		applyTo = HH.applyTo, 
		methodizeTo = HH.methodizeTo;

	var FormH = {
		ajaxForm : function(oForm,opts) {
			oForm=$(oForm);
			if( !oForm ) return;
			var o = {
				//�Ƿ���Ҫ����֤
				validate: true,
				//�ӳ�ˢ�µ�ʱ��
				delay: 1000,
				//�����ύ������ʱ��
				freeze: 3000,
				//ҳ����ת��URL
				url: null,
				//�ύǰִ�е��û�����
				before: null,
				//���ؽ���������Լ���ʾ��Ӧ��
				errors: null,
				//�����ش�������Զ��庯��
				after: null,
				//�Զ�����������
				success: function(response){
					if( o.status ){
						setTimeout(function(){$$(o.status).hide();},o.delay);
					}
					var _delay = Ajax.Delay;
					Ajax.Delay = o.delay;
					var result = Ajax.opResults(response,o.url);
					Ajax.Delay = _delay;

					//������Զ��Ĵ���������ִ���Զ��������
					if( o.after ){
						var r = o.after( result );
						if( r === false )
							return;
					}
			
					if( result.isop ) return;
					//������Զ��������ʾ���ձ���ִ��
					if( o.errors ){
						for( var i in o.errors ){
							if( result.err == i ){
								alert( o.errors[i] );
								break;
							}
						}
					}
				}
			}
			mix(o, opts,true);
			$$(oForm).attr('data--ban',o.freeze).on('submit',function(e){
				e.preventDefault();
				//�����������Ҫ��֤������б���֤
				if( o.validate && !Valid.checkAll(this))
					return;	
				//ִ�з�������ǰ���Զ��庯�������Ҹ��ݷ��ؽ���������Ƿ���Ҫ����ִ��
				if( o.before && !o.before(this)) return;
				Ajax.post(this,o.success);
				if( o.status ){
					$$(o.status).show();
				}
			});
		}/*,
		sendForm : function(oForm,callback,opts) {
			return Ajax.post($(oForm),o.success);
		}*/
	};
	


	FormH = HH.mul(FormH);
	mix(DOM, FormH);
	FormH = HH.rwrap(FormH, NodeW, 0);
	applyTo(FormH, NodeW);
	methodizeTo(FormH, NodeW.prototype, 'core');
})();