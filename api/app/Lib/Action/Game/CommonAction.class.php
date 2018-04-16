<?php
// 本类由系统自动生成，仅供测试用途
class CommonAction extends Action {

    public function _initialize(){
        header("Content-Type:text/html; charset=utf-8");
        header("Access-Control-Allow-Origin: *");
        header("Cache-Control: no-cache");
        load('extend');
    }

    /**
     * 取得用户信息
     */
    protected function _getWxOauthInfo(){
        $userModel=D('user');
        $userid = session("userid");
        
        // 存在用户
        if(!empty($userid)){
            $userinfo=$userModel->find($userid);
            if($userinfo){
                return $userinfo;
            }
        }        
        $userinfo = array();
        $userinfo=I('post.');
        if(!$userinfo['uid']){
            return null;
        }
        $isFind = $userModel->where(array('uid'=>$userinfo['uid']))->find();
        
        if($isFind){
            session("userid",$isFind['id']);
            return $isFind;
        }else{
            $data = $userModel->create($userinfo);
            $data['id'] = $userModel->add($data);
            session("userid",$data['id']);
            return $data;
        }
    }
    
    /**
     * game start 
     */
    protected function _gameStart(){

        if (!isset($_SESSION['gamestart'])) {
          $_SESSION['gamestart'] = time();
        } else {
          $_SESSION['gamestart'] = time();
        }

        $this->ajaxReturn($_SESSION['gamestart']);
    }


    /**
     * 记录游戏成绩
     * @param $model 游戏记录模型，实例化
     * @param $game_id 游戏ID
     */
    protected function _recordScore($model,$game_id){

        //记录上次游戏记录时间
        $nowtime=time();
        if(cookie("lastplaytime")) {
            $timediff=$nowtime - intval(cookie("lastplaytime"));
            cookie("lastplaytime",$nowtime);
            if($timediff < 3){
                $result['status']=0;
                $result['ranks']= -2;
                $result['info']="发送失敗404-1";
                $this->ajaxReturn($result,'JSON');
                exit;
            }
        }else{
            cookie("lastplaytime",$nowtime);
        }

        if(!$this->_chkData()) {
            $result['status'] = 0;
            $result['ranks'] = -2;
            $result['info'] = "发送失敗101";
            $this->ajaxReturn($result, 'JSON');
            exit;
        }else{
            $_POST['score']=intval($_POST['score']);
            $_POST['usermask']=intval($_POST['usermask']);
        }

        if($_POST['usermask']) $_POST['timecount']=$_POST['usermask'];
        $rankmodel=D("elloranks");

        $data=$model->create($_POST);

        $gamestart=$_SESSION['gamestart']?$_SESSION['gamestart']:I('gs');

        if ($gamestart) {
            $timediff = $nowtime - intval($gamestart);
            $_SESSION['gamestart'] = '';

            if ($timediff<=0 || ($data['score']/$timediff) > (500/60) ) {
                $result['status'] = 0;
                $result['ranks'] = -2;
                $result['info'] = "发送失敗601";
                $this->ajaxReturn($result, 'JSON');

                exit;
            }else if($nowtime<(I('usermask')+$gamestart-3)){
                $result['status'] = 0;
                $result['ranks'] = -2;
                $result['info'] = "发送失敗601";
                $this->ajaxReturn($result, 'JSON');

                exit;
            }

        } else {
            $result['status'] = 0;
            $result['ranks'] = -2;
            $result['info'] = "发送失敗602";
            $this->ajaxReturn($result, 'JSON');
            exit;
        }
        if($data){

            if($data['wxuser_id'] == 0){
                $result['status'] = 0;
                $result['ranks'] = -2;
                $result['info'] = "发送失敗401";
                $this->ajaxReturn($result, 'JSON');
                exit;
            }

            //是否超过最高记录
            $return['isTopscocre']=0;

            if(!$data['playtime']) $data['playtime']= time();
            if(!$data['ip']) $data['ip']= get_client_ip();
            //if($_REQUEST['timecount']) $data['timecount']=number_format($_REQUEST['usermask'],2);

            $result=$model->add($data);

            if($result===false){
                unset($result);
                $return['status']=0;
                $return['info']="发送失敗3";
                $this->ajaxReturn($return,'JSON');
                exit;
            }
            unset($result);

            //记录最高分及最高排名
            $recordwhere['game_id']=$game_id;
            $recordwhere['wxuser_id']=$data['wxuser_id'];
            $this->_updateWeekData($data['wxuser_id'],$game_id,$data['score']);
            if(cookie("ellorank".$game_id) > 0){
                if(intval($data['score']) > cookie("ellorank".$game_id."topscore")){
                    $userRanks['id']= intval(cookie("ellorank".$game_id));
                    $userRanks['topscore']=intval($data['score']);
                    cookie("ellorank".$game_id."topscore",$data['score']);
                    $return['isTopscocre']= 1;
                    $rankmodel->save($userRanks);
                }
                $index = $this->getMyIndex($data['score'],$game_id);
                $return['index']=$index;
                $return['status']=1;
                $return['info']="发送成功,c";
                $this->ajaxReturn($return,'JSON');
            }else{
                $userRanks=$rankmodel->cache(true)->field("id,game_id,wxuser_id,topscore,playcount")->where($recordwhere)->find();
                if($userRanks){
                    //$userRanks['playcount']=$userRanks['playcount'] + 1;
                    if(intval($data['score']) > $userRanks['topscore'] && $data['wxuser_id'] != 0){
                        $userRanks['topscore']=intval($data['score']);
                        $return['isTopscocre']= 1;
                        $rankmodel->save($userRanks);
                    }
                    cookie("ellorank".$game_id,$userRanks['id']);
                    cookie("ellorank".$game_id."topscore",$userRanks['topscore']);
                    $index = $this->getMyIndex($data['score'],$game_id);
                	$return['index']=$index;
                    $return['status']=1;
                    $return['info']="发送成功1";
                    $this->ajaxReturn($return,'JSON');
                }else{
                    //记录成绩
                    $userRanks['topscore']= $data['score'];
                    $userRanks['game_id']= $game_id;
                    $userRanks['wxuser_id']= $data['wxuser_id'];
                    $userRanks['playcount']= 1;
                    $rankmodel->add($userRanks);
                    $index = $this->getMyIndex($data['score'],$game_id);
                	$return['index']=$index;
                    $return['status']=1;
                    $return['info']="发送成功2";
                    $this->ajaxReturn($return,'JSON');
                }
            }


        }else{
            $result['status']=0;
            $result['ranks']= -1;
            $result['info']="发送失敗4";
            $this->ajaxReturn($result,'JSON');
        }

    }

    public function getMyIndex($score,$gameId=1){
        $rankModel=D("elloranks");

        $where = "topscore <$score and game_id=$gameId";
        $ranks=$rankModel->where($where)->count();
       	$where2 = "game_id=".$gameId."";
        $totalNum=$rankModel->where($where2)->count();
        $index = (int)$ranks/(int)$totalNum*100;
        if((int)$index==100){
        	$index=99;
        }
        return (int)$index; 
    }

    private function _updateWeekData($userid,$game_id,$score){
        $dataModel=M('weekrecords');
        $curtime = time();
        if((int)date('w',$curtime) == 0 ){
            $edate = $curtime-((int)date('w',$curtime)+6)*86400;
        }else{
            $edate = $curtime-((int)date('w',$curtime)-1)*86400;
        }
        $startTime = date('Y-m-d',$edate);

        $map='userid='.$userid.' and gameid='.$game_id." and weektime='".$startTime."'";
        $weekData = $dataModel->where($map)->find();
        
        if($weekData){
            if($weekData['score']<$score){
                $dataModel->where(array('id'=>$weekData['id'],'weektime'=>$startTime))->save(array('score'=>$score,'createtime'=>time()));
            }
        }else{
            $dataModel->add(array('userid'=>$userid,'gameid'=>$game_id,'score'=>$score,'createtime'=>time(),'weektime'=>$startTime));
        }
    }

    public function getMyRank()
    {
        $userid=intval(I("userid"));
        $gameid=intval(I("gameid"));
        if(empty($userid) ||empty($gameid)){
            $this->ajaxReturn('-1');
        }
        self::_getMyRank($userid, $gameid);
    }
    public function getMyWeekRank()
    {
        $userid=intval(I("userid"));
        $gameid=intval(I("gameid"));
        if(empty($userid) ||empty($gameid)){
            $this->ajaxReturn('-1');
        }
        self::_getMyWeekRank($userid, $gameid);
    }

    public function _getMyRank($userid,$gameId=1){
        $rankModel=D("elloranks");

        $where = "topscore >( select topscore from wm_elloranks where wxuser_id=".$userid." and game_id=".$gameId.")  and game_id=".$gameId."";
        $ranks=$rankModel->where($where)->count();

        $this->ajaxReturn($ranks,'JSON');
    }
    public function _getMyWeekRank($userid,$gameId=1){

        $rankModel=D("weekrecords");
        $curtime = time();
        if((int)date('w',$curtime) == 0 ){
            $edate = $curtime-((int)date('w',$curtime)+6)*86400;
        }else{
            $edate = $curtime-((int)date('w',$curtime)-1)*86400;
        }
        $startTime = date('Y-m-d',$edate);
        $startTimestamp = mktime(0,00,00,date('m',$edate),date('d',$edate),date('Y',$edate));
        $lastWeek =date('Y-m-d',$startTimestamp-7*86400);

        $where = "score >( select score from wm_weekrecords where userid=".$userid." and gameid=".$gameId." and weektime ='".$lastWeek."') and gameid=".$gameId." and weektime ='".$lastWeek."'";
        // echo $where;
        $ranks1=$rankModel->where($where)->count();
        $where2 = "score >( select score from wm_weekrecords where userid=".$userid." and gameid=".$gameId." and weektime ='".$startTime."') and gameid=".$gameId." and weektime ='".$startTime."'";
        $ranks2=$rankModel->where($where2)->count();
        $where3 = "userid=".$userid." and gameid=".$gameId." and weektime ='".$startTime."'";
        $score2=$rankModel->where($where3)->find();
        $where4 = "userid=".$userid." and gameid=".$gameId." and weektime ='".$lastWeek."'";
        $score1=$rankModel->where($where4)->find();
        
        $this->ajaxReturn(array('sta'=>1,'lastRank'=>($ranks1+1),'weekrank'=>($ranks2+1),'score1'=>$score1,'score2'=>$score2),'JSON');
    }

    private function _getRankData($game_id){
        $userModel=D("wxuser");
        $rankModel=D("elloranks");

        $ranks=$rankModel->field("wxuser_id,topscore,topranks")->where("game_id=".$game_id)->order("topscore desc")->limit(10)->select();

        foreach($ranks as &$value){
            $value["userinfo"]['nickname']="ElloGamePlayer";
            $value["userinfo"]['headimgurl']="http://www.ileou.com/images/logo3.png";
            if($value['wxuser_id']!=0){
                $userinfo=$userModel->field("nickname,headimgurl")->getById($value['wxuser_id']);
                if($userinfo){
                    $value["userinfo"]=$userinfo;
                    if($userinfo['nickname']=="")  $value["userinfo"]['nickname']="ElloGamePlayer";
                    if($userinfo['headimgurl']=="") $value["userinfo"]['headimgurl']="http://www.ileou.com/images/logo3.png";
                }

            }
        }

        return $ranks;
    }

    protected function _getRanks($game_id){

        $rankModel=D("elloranks");

        $where = "a.game_id=".$game_id;

        $ranks=$rankModel->alias('a')->join(' wm_user b ON a.wxuser_id = b.id')->field('a.wxuser_id,a.topscore,a.topranks,b.nick as nickname,b.avatar as headimgurl')->where($where)->order('topscore desc')->limit(50)->select();

        foreach ($ranks as $key => $value) {
            $ranks[$key]['userinfo']=array('nickname'=>$value['nickname'],'headimgurl'=>$value['headimgurl'],);
        }


        $this->ajaxReturn($ranks,'JSON');
    }

    protected function _getWeekRanks($game_id){
        $rankModel=D("weekrecords");
        $curtime = time();
        if((int)date('w',$curtime) == 0 ){
            $edate = $curtime-((int)date('w',$curtime)+6)*86400;
        }else{
            $edate = $curtime-((int)date('w',$curtime)-1)*86400;
        }
        $startTime = date('Y-m-d',$edate);
        $where = "a.gameid=".$game_id." and weektime='".$startTime."'";

        $ranks=$rankModel->alias('a')->join(' wm_user b ON a.userid = b.id')->field('a.userid,a.score as topscore,b.nick as nickname,b.avatar as headimgurl')->where($where)->order('score desc')->limit(50)->select();

        foreach ($ranks as $key => $value) {
            $ranks[$key]['userinfo']=array('nickname'=>$value['nickname'],'headimgurl'=>$value['headimgurl'],);
        }

        $this->ajaxReturn($ranks,'JSON');
    }
    protected function _getTopscore($userid,$game_id){
        $ellorankModel=D("elloranks");
        $where['wxuser_id']=$userid;
        $where['game_id']=$game_id;
        $score=$ellorankModel->field("topscore")->where($where)->find();
        if($score){
            return $score['topscore'];
        }else{
            return 0;
        }
    }

    /***
     * 防作弊混淆方案
     *
     */
    protected function _chkData($diff1=17,$diff2=9){
        $score=(intval($_POST['score']));
        $score1=(intval($_POST['score1'])) - $diff1;
        $usermask=(intval($_POST['usermask']));
        $usermask1=(intval($_POST['usermask1'])) - $diff2;
        if($score == $score1 && $usermask == $usermask1){
            return true;
        }else{
            return false;
        }
    }
}