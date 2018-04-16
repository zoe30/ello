<?php
function url_format($url) {
    if(substr($url,0,4)=='http'){
		return $url;
	}
    if(substr($url,0,1)=='/'){
		return  __APP__.$url;
	}
	if(trim($url)==""){
		return __APP__.'/Public/Img/nopic.png';
	}
    return __APP__.'/'.$url;
}
//删除所有空格
function trimall($str)
{
	$qian=array(" ","　","\t","\n","\r");$hou=array("","","","","");
	return str_replace($qian,$hou,$str);
}
?>