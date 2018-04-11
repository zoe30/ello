var GameManager = pc.createScript('GameManager');
//GameManager.attributes.add("GameIsOver",{type:"boolean",default:true});
//GameManager.attributes.add("ks",{type:"boolean",default:false});//是否正式开始游戏
//GameManager.attributes.add("showrestart",{type:"boolean",default:false});
//GameManager.attributes.add("isMove",{type:"boolean",default:false});//手否处于可移动状态
//GameManager.attributes.add("isOnce",{type:"boolean",default:false});//true第奇数次，false第偶数次（临时）
//GameManager.attributes.add("isReset",{type:"boolean",default:false});//检测到碰撞后，将player设置为turntable的子物体后，是否已经重置过player的位置
//GameManager.attributes.add("hasParent",{type:"boolean",default:false});//再次切换到isMove状态时，需要先移除player与turntable的父子关系
//GameManager.attributes.add("createTurnAllowed",{type:"boolean",default:false});//是否可以创建转盘
//GameManager.attributes.add("score",{type:"number",default:0});//得分
//GameManager.attributes.add("movespeed",{type:"number",default:0.1});//player移动速度
//GameManager.attributes.add("turnindex",{type:"number",default:5});//转盘
//GameManager.attributes.add("matindex",{type:"number"});//材质切换，顺序


GameManager.attributes.add("tip",{type:"entity",default:null});

GameManager.attributes.add("bg2matasset",{type:"asset"});//bg2的背景材质
GameManager.attributes.add("bgspeed",{type:"vec2"});//材质动画速度以及方向


GameManager.tmp=new pc.Vec2();



// initialize code called once per entity
GameManager.prototype.initialize = function() {
    this.GameIsOver=true;
    this.ks=false;
    this.showrestart=false;
    this.isMove=false;
    this.isOnce=false;
    this.isReset=false;
    this.hasParent=false;
    this.createTurnAllowed=false;
    this.isfruit0=false;
    this.isfruit1=false;
    this.isfruit2=false;
    this.isfruit3=false;
    this.isfruit4=false;
    this.isturn0=false;
    this.isturn1=false;
    this.isturn2=false;
    this.isturn3=false;
    this.isturn4=false;
    this.score=0;
    this.turnindex=5;
    this.matindex=0;
    this.movespeed=0.12;
    
    this.app.mouse.disableContextMenu();
    
    //camera 移动
    this.cam=this.app.root.findByName("Camera");
    this.camspeed=25;
    
    //bg2 动画
    if(this.bg2matasset){
      this.mat=this.bg2matasset.resource;  
    }
    this.tmp=GameManager.tmp;
    
};

// update code called every frame
GameManager.prototype.update = function(dt) {
    //camera上移
    this.camspeed=30+this.score*0.125;
    
    if(!this.GameIsOver && this.ks){
        //相机移动
        this.cam.translate(0,this.camspeed/1000,0);
        
        
        //bg2 动画
        this.bgspeed.y=0.12+this.score*0.0005;
        this.tmp.set(this.bgspeed.x,this.bgspeed.y);
        this.tmp.scale(dt);
        this.mat.emissiveMapOffset.add(this.tmp);
        this.mat.opacityMapOffset.add(this.tmp);
        this.mat.update();
        
    }
    
};