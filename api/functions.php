<?php 
	 function verifyUser($postFields){
	 	if(empty($postFields)){
	 		return null;
	 	}
	 	$url = $_SERVER['HTTP_HOST'];
	 	if($_SERVER['PHP_SELF']=='/index.php'){
	 		$url.='/api/index.php/game/index/saveUserInfo';
	 	}else{
	 		$url.=dirname($_SERVER['PHP_SELF']).'/api/index.php/game/index/saveUserInfo';
	 	}
        $postFields = http_build_query($postFields);
        $ch = curl_init ();
        curl_setopt ( $ch, CURLOPT_POST, 1 );
        curl_setopt ( $ch, CURLOPT_HEADER, 0 );
        curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 1 );
        curl_setopt ( $ch, CURLOPT_URL, $url );
        curl_setopt ( $ch, CURLOPT_POSTFIELDS, $postFields );
        $result = curl_exec ( $ch );
        curl_close ( $ch );
        $data=json_decode($result);
        setcookie("userid_c", $data->id, time()+3600);
    }
 ?>