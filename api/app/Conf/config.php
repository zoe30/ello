<?php
$config =  require 'config.ini.php';
$primary_config = array(
	'APP_GROUP_LIST'	=>'Home,Admin,Thirdpart,Payment,Game,Pay',
	'DEFAULT_GROUP'	=>'Home',
	'TMPL_ACTION_SUCCESS'	=>'Public:success',
	'TMPL_ACTION_ERROR'	=>'Public:error',
    //'TMPL_EXCEPTION_FILE' => './Public/system/error.html',
	'URL_MODEL'=>2,
	'URL_ROUTER_ON'   => true,
	//***********************************SESSION设置**********************************
    'SESSION_OPTIONS'         =>  array(
	'name'                =>  'ELLOSESSION',                    //设置session名
	'expire'              =>  24*3600*15,                      //SESSION保存15天
	'use_trans_sid'       =>  1,                               //跨页传递
	'use_only_cookies'    =>  0,                               //是否只开启基于cookies的session的会话方式
)
);
return array_merge($config,$primary_config);
//return $primary_config;
?>