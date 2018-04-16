<?php
class IndexAction extends CommonAction{
    public function _initialize(){
        header("Content-Type:text/html; charset=utf-8");
        load('extend');
        date_default_timezone_set('PRC');
    }

    function get_real_ip(){
        static $realip;
        if(isset($_SERVER)){
            if(isset($_SERVER['HTTP_X_FORWARDED_FOR'])){
                $realip=$_SERVER['HTTP_X_FORWARDED_FOR'];
            }else if(isset($_SERVER['HTTP_CLIENT_IP'])){
                $realip=$_SERVER['HTTP_CLIENT_IP'];
            }else{
                $realip=$_SERVER['REMOTE_ADDR'];
            }
        }else{
            if(getenv('HTTP_X_FORWARDED_FOR')){
                $realip=getenv('HTTP_X_FORWARDED_FOR');
            }else if(getenv('HTTP_CLIENT_IP')){
                $realip=getenv('HTTP_CLIENT_IP');
            }else{
                $realip=getenv('REMOTE_ADDR');
            }
        }
        return $realip;
    }

    /**
     * game start
     */
    public function gamestart(){

        $this->_gameStart();
    }
    /**
     * 游戏页获取游戏和用户信息
     * @return [type] [description]
     */
    public function getGameInfo(){
        $user=$this->_getWxOauthInfo();
        if($user){
            $gname=I("post.gname");
            if($gname){
                $ellogame = D('ellogame');
                $game = $ellogame->where("gamename='$gname'")->find();
                $user['topscore']=$this->_getTopscore($user['id'],$game['id']);
                $user['gameid']=$game['id'];
            }else{
                $user['topscore']=0;
                $user['gameid']=0;
            }
            $return = array('sta'=>1,'data'=>$user);
        }else{
            $return = array('sta'=>0,'msg'=>'没有授权');
        }
        $this->ajaxReturn($return);
    }

    /**
     * 进入游戏列表页时候 保存用户信息
     * @return [type] [description]
     */
    public function saveUserInfo(){
        $userModel=D('user');
        $userinfo=I('post.');
        if(!$userinfo['uid']){
            echo '';
        }
        $isFind = $userModel->where(array('uid'=>$userinfo['uid']))->find();
        if($isFind){
            $userdata = $isFind;
        }else{
            $data = $userModel->create($userinfo);
            $userModel->add($data);
            $userdata = $userModel;
        }

        echo json_encode($userdata);
    }
    /**
     * 通用记录部分
     *
     */
    public function getrank(){
        $gameid=intval(I("gameid"));
        if($gameid){
            $this->_getRanks($gameid);
        }else{
            $this->error("id miss");
        }

    }

    /**
     * 获取周排行
     * @return [type] [description]
     */
    public function getweekrank(){
        $gameid=intval(I("gameid"));
        if($gameid){
            $this->_getWeekRanks($gameid);
        }else{
            $this->error("id miss");
        }

    }
    /**
     * 成绩记录
     */
    public function recordScore(){
        $gameid=intval(I("gameid"));
        if($gameid){
            $gameModel=D("ellogame");
            $gameinfo=$gameModel->field("id,gamename,tablename")->getById($gameid);

            $this->_recordScore(D($gameinfo["tablename"]),$gameid);
        }else{

        }
    }

}
?>