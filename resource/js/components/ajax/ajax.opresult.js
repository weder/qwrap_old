/*
 *	Copyright (c) 2010, Baidu Inc. All rights reserved.
 *	http://www.youa.com
 *	version: $version$ $release$ released
 *	author: quguangyu@baidu.com
 *  description: 对responseText的通用的处理函数
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
			alert("返回出错，返回的内容为：\n"+Results);
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
			alert("验证码过期，请刷新页面后重试！");
			break;
		case "mcphp.u_vcode":
			var els = document.getElementsByName('_vcode'), elKeys = document.getElementsByName('_vcode_key');
			if(els.length > 0 && elKeys.length > 0) {
				var el = els[0], elKey = elKeys[0];
				Valid.fail(el, "请检查您输入的验证码。", true);
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
							Valid.fail(tempEl[0], "您输入的内容格式不对或超长，请检查是否包含特殊字符。", true);
						}
						else{
							for(var x=0;x<tempEl.length;x++){
								if(status.fields[i]==tempEl[x].value.encode4Html()){
									Valid.fail(tempEl[x],"您输入的内容格式不对或超长，请检查是否包含特殊字符。", true);
									unfound = false;
									break;
								};
							}
						}
					}
				}
				catch(e){
					alert("您输入的内容格式不对或超长，请检查是否包含特殊字符。");
				}
			}
 		break;
 		case "mcphp.u_notfound":
 			alert("您请求的页面不存在！");
 		break;
 		case "mcphp.u_antispam":
 			alert("您提交的内容包含敏感词汇，请检查后重新提交！");
 		break;
		case "mcphp.u_deny":
			alert("您的操作不允许！");
		break;
		case "mcphp.u_bfilter":
			alert("您的操作太频繁！");
		break;
		case "login":
 		case "mcphp.u_login":
			try {
 				User.Login.show();
 				User.Login.hint("您需要登录后才能继续刚才的操作");
			} catch(e) {
				try {
 					top.User.Login.show();
 					top.User.Login.hint("您需要登录后才能继续刚才的操作");
				} catch(e1) {
					alert('您需要登录后才能继续刚才的操作！');
				}
			}
 		break; 		
		case "mcphp.u_power":
 			window.location ="http://co.youa.baidu.com/content/misc/err/nopower/index.html";
 		break;
		case "mcphp.fatal":
		case "mar.sys_inter":
 			alert("系统错误，请稍后再试。");
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
				//是否需要表单验证
				validate: true,
				//延迟刷新的时间
				delay: 1000,
				//冻结提交操作的时间
				freeze: 3000,
				//页面跳转的URL
				url: null,
				//提交前执行的用户函数
				before: null,
				//返回结果错误码以及提示对应表
				errors: null,
				//处理返回错误码的自定义函数
				after: null,
				//自定义结果处理函数
				success: function(response){
					if( o.status ){
						setTimeout(function(){$$(o.status).hide();},o.delay);
					}
					var _delay = Ajax.Delay;
					Ajax.Delay = o.delay;
					var result = Ajax.opResults(response,o.url);
					Ajax.Delay = _delay;

					//如果有自定的错误处理函数则执行自定义错误处理
					if( o.after ){
						var r = o.after( result );
						if( r === false )
							return;
					}
			
					if( result.isop ) return;
					//如果有自定义错误、提示对照表，则执行
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
				//如果设置了需要验证，则进行表单验证
				if( o.validate && !Valid.checkAll(this))
					return;	
				//执行发送请求前的自定义函数，并且根据返回结果来决定是否需要继续执行
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