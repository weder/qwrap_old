<?php
	$timeout = 0;
	$dataType = '';
	if( isset($_GET['timeout']) or isset($_POST['timeout']) )
		$timeout = isset($_GET['timeout']) ? $_GET['timeout'] : $_POST['timeout'];
	if( isset($_GET['type']) or isset($_POST['type']) )
		$dataType  = isset($_GET['type']) ? $_GET['type'] : $_POST['type'];
	sleep($timeout);
	if( $dataType == "json" ){
		echo '{"content":"Hello,I\'m the data from Server!"}';
	}
	else if( $dataType == "jsonp" ){
		sleep(2);
		$cb = $_GET["callback"];
		echo $cb.'({"content":"Hello,I\'m the data from Server!"})';
	}
	else{
		echo('$_GET: ');
		var_dump($_GET);
		echo('<br>');
		echo('$_POST: ');
		var_dump($_POST);
	}
?>