<?php
	/*�����Ҫֱ��redirect��ָ��host*/
	if(isset($_POST['xshost']) && $_POST['xshost'] != 'local'){ 
		header("location:".$_POST['xshost']);
		break;
	}
	/*�����Ҫ�򷵻ش���JSON�ṹ*/
	if( isset($_POST['json']) && $_POST['json'] != 'ok'){ 
		echo 'xxx';
	}

	function uploadfile($tmp_name,$targetname,$upload_dir)
	{
		$file_path = $upload_dir.$targetname;
	   
		if(!is_dir($upload_dir))
		{
			if(!mkdir($upload_dir))
				die("�ļ��ϴ�Ŀ¼�����ڲ����޷������ļ��ϴ�Ŀ¼");
			if(!chmod($upload_dir,0755))
				die("�ļ��ϴ�Ŀ¼��Ȩ���޷��趨Ϊ�ɶ���д");
		}
		if(!move_uploaded_file($tmp_name, $file_path))
			die("�����ļ�ʧ�ܣ��������ϴ�");
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