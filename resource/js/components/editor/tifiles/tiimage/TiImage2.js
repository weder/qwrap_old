
(function (){


$('editor_image_wraper').innerHTML='\
<form id="editor_img_form" action="'+BB.Editor.img_upload_url+'" method="post" enctype="multipart/form-data" >\
<div id="editor_img_tabs"><span class="selected_tab tab" tab_id="1">添加网上图片</span><span class="tab" tab_id="2">添加本机图片</span></div>\
<div id="editor_img_tabContainer">\
	<div class="tab_body">\
		<div id="editor_img_tab1">\
			<b class="title">网址：</b>\
			<div>\
				<input type="text" value="http://" id="editor_img_url" size="40">\
			</div>\
			<div class="tip"><em>&nbsp;</em></div>\
		</div>\
		<div id="editor_img_tab2" style="display:none">\
			<b class="title">选择文件：</b>\
			<div>\
				<input type="file" id="uploadFile" name="userfile[]" size="40" dataType="imgfile" class="bb-file-uploader">\
				<input type=hidden name=fr value="http://'+location.host+'"/>\
			</div>\
			<div class="tip"><em>不超过512K，支持JPG/JPEG/GIF/TIF/PNG格式。</em></div>\
		</div>\
		<b class="title">图片位置</b><br />\
		<table width="100%" cellpadding="0" cellspacing="0" border="0">\
		<tr>\
			<td width="24.9%" align="left">\
				<label for="float_default" class="img_pos" style="background:url('+Editor.editorPath+'tifiles/tiimage/float-default.gif) no-repeat;"></label>&nbsp;&nbsp;&nbsp;<input id="float_default" name="editor_img_align" type="radio" checked="checked"><label for="float_default">默认</label>\
			</td>\
			<td width="24.9%" align="left">\
				<label for="float_left" class="img_pos" style="background:url('+Editor.editorPath+'tifiles/tiimage/float-left.gif) no-repeat;"></label>&nbsp;&nbsp;&nbsp;<input id="float_left" name="editor_img_align" type="radio"><label for="float_left">居左</label>\
			</td>\
			<td width="24.9%" align="left">\
				<label for="float_center" class="img_pos" style="background:url('+Editor.editorPath+'tifiles/tiimage/float-center.gif) no-repeat;"></label>&nbsp;&nbsp;&nbsp;<input id="float_center" name="editor_img_align" type="radio"><label for="float_center">居中</label>\
			</td>\
			<td width="24.9%" align="left">\
				<label for="float_right" class="img_pos" style="background:url('+Editor.editorPath+'tifiles/tiimage/float-right.gif) no-repeat;"></label>&nbsp;&nbsp;&nbsp;<input id="float_right" name="editor_img_align" type="radio"><label for="float_right">居右</label>\
			</td>\
		</tr>\
		</table><br/>\
	</div>\
</div>\
<div id="editor_img_btn_ctn" >\
	<input type="submit" class="ok" value="确认" >\
	<input type="button" class="cancel" value="取消" onclick="BB.Editor.EditorCmd._tiImageDialog.hide();">\
</div>\
</form>';


function okFun(isNetImage)
{
	var oForm=$('editor_img_form'),
		isNetImage = isNetImage || $('editor_img_url').offsetWidth,
		spImgAlign = oForm.editor_img_align, 
		imgFloat = spImgAlign[0].checked ? '' : (
			spImgAlign[1].checked ? 'left' : (
				spImgAlign[2].checked ? 'center' : (
					spImgAlign[3].checked ? 'right' : ''
				)
			)
		);
	if(!isNetImage){   // 添加本机图片
		alert('添加本机图片');
	}
	else{  // 添加网上图片
		// 检查是否输入的图片地址
		var imgUrl = $('editor_img_url').value;
		setTimeout(function(){BB.Editor.EditorCmd._tiImageExec(imgUrl, imgFloat);},10);
	}
}


var currentSelectedTab;
function selectThisTab(a){
	Dom.hide(['editor_img_tab1','editor_img_tab2']);
	Dom.show('editor_img_tab' + a.getAttribute('tab_id'));
	Dom.removeClass(currentSelectedTab,'selected_tab');
	Dom.addClass(a,'selected_tab');
	currentSelectedTab = a;
}

var tabHdls=$('editor_img_tabs').childNodes;
for(var i=0;i<tabHdls.length;i++) tabHdls[i].onclick=function(){selectThisTab(this);};

currentSelectedTab = $('editor_img_tabs').firstChild;

function uploaderInit(){
	BB.UPLoader.init({
		/*jsonverify: false,*/
		forms: 'editor_img_form',
		onbefore: function(form){
			if($('editor_img_url').offsetWidth){
				okFun(true);
				return false;
			}
			return true;
		},
		oncomplete: function(responseText,form){
			//alert(responseText);
			var res = ('(' + responseText + ')').evalExp();
			if( res.err != 'ok' ){
				alert('上传图片失败。');
				return;
			}
			$('editor_img_url').value=site.img_url+'/pic/item/' + res.ids[0] + '.jpg';
			okFun(true);
		}
	});	
}
if(!BB.UPLoader){
	BB.getScript(BB.PATH+'components/uploader/uploader.js?1.2.js',uploaderInit)
}
else{
	uploaderInit();
}
})();



