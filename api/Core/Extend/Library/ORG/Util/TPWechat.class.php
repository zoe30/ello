<?php
/**
 *  微信公众平台PHP-SDK, ThinkPHP实例
 *  @author dodgepudding@gmail.com
 *  @link https://github.com/dodgepudding/wechat-php-sdk
 *  @version 1.2
 *  usage:
 *   $options = array(
 *          'token'=>'tokenaccesskey', //填写你设定的key
 *          'encodingaeskey'=>'encodingaeskey', //填写加密用的EncodingAESKey
 *          'appid'=>'wxdk1234567890', //填写高级调用功能的app id
 *          'appsecret'=>'xxxxxxxxxxxxxxxxxxx' //填写高级调用功能的密钥
 *      );
 *   $weObj = new TPWechat($options);
 *   $weObj->valid();
 *   ...
 *
 */
include "Wechat.class.php";
class TPWechat extends Wechat
{
    private $cachedir = '';
    private $logfile = '';
    public function __construct($options)
    {
        $this->cachedir = isset($options['cachedir']) ? dirname($options['cachedir'].'/.cache') . '/' : 'cache/';
        $this->logfile = isset($options['logfile']) ? $options['logfile'] : '';
        if ($this->cachedir) $this->checkDir($this->cachedir);
        parent::__construct($options);
    }

    /**
     * log overwrite
     * @see Wechat::log()
     */
    protected function log($log){
        if ($this->debug) {
            if (function_exists($this->logcallback)) {
                if (is_array($log)) $log = print_r($log,true);
                return call_user_func($this->logcallback,$log);
            }elseif (class_exists('Log')) {
                Log::write('wechat：'.$log, Log::DEBUG);
                return true;
            }
        }
        return false;
    }
    /**
     * 重载设置缓存
     * @param string $cachename
     * @param mixed $value
     * @param int $expired 缓存秒数，如果为0则为长期缓存
     * @return boolean
     */
    protected function setCache($cachename,$value,$expired=0){
        $file = $this->cachedir . $cachename . '.cache';
        $data = array(
            'value' => $value,
            'expired' => $expired ? time() + $expired : 0
        );
        return file_put_contents( $file, serialize($data) ) ? true : false;
    }
    /**
     * 重载获取缓存
     * @param string $cachename
     * @return mixed
     */
    protected function getCache($cachename){
        $file = $this->cachedir . $cachename . '.cache';
        if (!is_file($file)) {
            return false;
        }
        $data = unserialize(file_get_contents( $file ));

        if (!is_array($data) || !isset($data['value']) || (!empty($data['value']) && $data['expired'] < time() + 1800)) {
            @unlink($file);
            return false;
        }
        return $data['value'];
    }
    /**
     * 重载清除缓存
     * @param string $cachename
     * @return boolean
     */
    protected function removeCache($cachename){
        $file = $this->cachedir . $cachename . '.cache';
        if ( is_file($file) ) {
            @unlink($file);
        }
        return true;
    }
    private function checkDir($dir, $mode=0777) {
        if (!$dir)  return false;
        if(!is_dir($dir)) {
            if (!file_exists($dir) && @mkdir($dir, $mode, true))
                return true;
            return false;
        }
        return true;
    }

}



