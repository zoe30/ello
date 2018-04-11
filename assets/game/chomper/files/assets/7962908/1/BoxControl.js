var BoxControl = pc.createScript('boxControl');
BoxControl.attributes.add("leftMat",{type:"asset",assetType:"material"});
BoxControl.attributes.add("rightMat",{type:"asset",assetType:"material"});
// initialize code called once per entity
BoxControl.prototype.initialize = function() {
    //记录每个block的信息
    this.XDir = 0; //0表示在x方向不动，1表示x加上1，-1表示。。。
    this.YDir = 0; //0表示方块，1表示球；（0表示需要按右边，1表示需要按左边）
    this.ZDir = 0; //同xDir
    
    //遇到Boss时，需要按下的按键
    this.Boss1=0;
    this.Boss2=1;
    this.Boss3=0;
    
    
    
    this.Up = false; //block生成时，从下升起的动画。 true时执行动画
    this.Down = false; //block自动掉落时的动画。true时执行动画
    this.DownSpeed = 12; //下路速度
    this.UpSpeed = 15; //上升速度
    this.DownTime = 1; //总下落时间
    this.UpTime = 0.2; //总上升时间
    this.timer = 0; //计时器
    this.NextPos = new pc.Vec3(0,0,0); //执行完动画，block最终位置。生成路径时会进行设置
    
    this.autorun=false;   
    
    this.turn=this.entity.findByName("boss3").children[4];
};

// update code called every frame
BoxControl.prototype.update = function(dt) {
    /*if(this.YDir===3){
        console.log("BossBossBossBoss");
    }*/
    
    if(this.Boss1===0){
        this.entity.findByName("boss3").findByName("turn").children[0].model.meshInstances[0].material=this.leftMat.resource;
    }else{
        this.entity.findByName("boss3").findByName("turn").children[0].model.meshInstances[0].material=this.rightMat.resource;
    }
    
    if(this.Boss2===0){
        this.entity.findByName("boss3").findByName("turn").children[1].model.meshInstances[0].material=this.leftMat.resource;
    }else{
        this.entity.findByName("boss3").findByName("turn").children[1].model.meshInstances[0].material=this.rightMat.resource;
    }
    
    if(this.Boss3===0){
        this.entity.findByName("boss3").findByName("turn").children[2].model.meshInstances[0].material=this.leftMat.resource;
    }else{
        this.entity.findByName("boss3").findByName("turn").children[2].model.meshInstances[0].material=this.rightMat.resource;
    }
    
    
    if(this.turn){
        this.turn.setEulerAngles(0,45,0);
    }
    
    
    if(this.Down){
        this.timer+=dt;
        if(this.timer>this.DownTime){
            //若执行完动画，重置参数
            this.timer=0;
            this.Down=false;
        }else{
            //若未执行完动画，继续执行
            this.entity.translate(0,-this.DownSpeed*dt,0);            
        }
    }
    
    
    if(this.Up){
        this.timer+=dt;
        if(this.timer>this.UpTime){
            this.timer=0;
            this.Up=false;
            this.entity.setPosition(this.NextPos.x,this.NextPos.y,this.NextPos.z);
        }else{
            this.entity.translate(0,this.UpSpeed*dt,0);
        }
    }
};
