<?php
	/*如果需要直接redirect到指定host*/
	if(isset($_POST['xshost']) && $_POST['xshost'] != 'local'){ 
		header("location:".$_POST['xshost']);
		break;
	}
	/*如果需要则返回错误JSON结构*/
	if( isset($_POST['json']) && $_POST['json'] != 'ok'){ 
		echo 'xxx';
	}

	function uploadfile($tmp_name,$targetname,$upload_dir)
	{
		$file_path = $upload_dir.$targetname;
	   
		if(!is_dir($upload_dir))
		{
			if(!mkdir($upload_dir))
				die("文件上传目录不存在并且无法创建文件上传目录");
			if(!chmod($upload_dir,0755))
				die("文件上传目录的权限无法设定为可读可写");
		}
		if(!move_uploaded_file($tmp_name, $file_path))
			die("复制文件失败，请重新上传");
		else
			return $file_path;
	}
	$upload_dir = 'uploads/';
	$files = array();
	$status = 'ok';
	if( isset($_POST['state']) )
		$status = $_POST['state'];
	$result = array(
		'err' => $status
	);
	for( $i = 0; $i < count($_FILES[files][name]); $i++){
		$tmp_name = $_FILES[files][tmp_name][$i];
		$target_name = $_FILES[files][name][$i];
		$size = $_FILES[files][size][$i];
		if( $size > 0 )
			$files[] = uploadfile($tmp_name,$target_name,$upload_dir);
	}
	$result['files'] = $files;
	echo json_encode($result);
?>