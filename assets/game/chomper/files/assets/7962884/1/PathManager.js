var PathManager = pc.createScript('pathManager');
PathManager.attributes.add("prefab",{type:"entity",default:null});
var MIN_CHANGENUM=8;
var MAX_CHANGENUM=12;
// initialize code called once per entity
PathManager.prototype.initialize = function() {
    
    //block预设相关    
    if(this.prefab){
        this.BoxPool=this.prefab.children;
    }
    //this.manager=this.app.root.findByName("Manager");
    this.player=this.app.root.findByName("Player");
    this.playercontrol=this.player.script.playerControl;
    this.timerdeath=0;
    this.canDeathAnim=false;

    
    this.Hstep=0.8; //block宽，每次block生成时的间距
    this.Vstep=0.8; 
    
    this.ChangedNum = Math.floor(pc.math.random(MIN_CHANGENUM,MAX_CHANGENUM));  //每隔changed改变一次方向
    this.SpanIndex=0; //block位次  
    this.playerindex = 0;
    this.dropindex=0;
    this.droptimer=0;
    this.lastYdir = 0; //上一个block状态存储
    this.LastPos=new pc.Vec3(0,0,0);
   
    this.prefabsNum = this.BoxPool.length;
    //console.log(this.prefabsNum);
    
    this.everydrop = 0.8;            
    this.everySpan = 0;
    this.DropHeight = 3; //block出现，做由下到上的动画时所用，提前下降3，再由动画回到0
    this.NextDir = false;  //控制X、Z的位置
    this.ZYaw = true;  //控制X、Z的位置
    
    
    //block初始化
    this.texindex=0;//更换赛道
    this.InitSpanBox();       
};

//block初始化函数
PathManager.prototype.InitSpanBox=function(){
   for(var i=1;i<6;i++){
       this.BoxPool[this.SpanIndex].setPosition(this.LastPos.x,0,this.LastPos.z);
       if(i!==1){
           this.BoxPool[this.SpanIndex].findByName("right1").enabled=true;
           this.BoxPool[this.SpanIndex].findByName("left0").enabled=false;
           this.BoxPool[this.SpanIndex].findByName("thunder2").enabled=false;
           this.BoxPool[this.SpanIndex].findByName("boss3").enabled=false;
           
           this.BoxPool[this.SpanIndex].findByName("right1").children[0].enabled=true;
           this.BoxPool[this.SpanIndex].findByName("right1").children[1].enabled=false;
           this.BoxPool[this.SpanIndex].findByName("right1").children[2].enabled=false;
           this.BoxPool[this.SpanIndex].findByName("right1").children[3].enabled=false;
       }
       if(i===1){
           this.BoxPool[this.SpanIndex].findByName("left0").enabled=false;
           this.BoxPool[this.SpanIndex].findByName("right1").enabled=false;
           this.BoxPool[this.SpanIndex].findByName("thunder2").enabled=false; 
           this.BoxPool[this.SpanIndex].findByName("boss3").enabled=false;
       }
       
       this.everySpan++;
       this.SpanIndex++;
       this.BoxPool[this.SpanIndex].script.boxControl.XDir=0;
       this.BoxPool[this.SpanIndex].script.boxControl.YDir=1;
       this.BoxPool[this.SpanIndex].script.boxControl.ZDir=-1;
       
       this.LastPos.set(this.LastPos.x,this.LastPos.y,this.LastPos.z-this.Hstep-0.05);
   }
    //此时SpanIndex=5,everySpan=5.
    
    this.everySpan-=1;
    //console.log(this.SpanIndex);
    //此时SpanIndex=5,everySpan=5.*/
};

// update code called every frame
PathManager.prototype.update = function(dt) {
    if(STATUS==="gaming" && this.playercontrol.score>0){
        this.droptimer+=dt;
        if(this.droptimer>this.everydrop){
            if(this.dropindex===this.playerindex){
                this.playercontrol.timeoutwrong=true;               
                this.canDeathAnim=true;
                STATUS="gameover";
            }
            this.droptimer=0;
            this.BoxPool[this.dropindex].script.boxControl.Down=true;
            this.dropindex++;
            if(this.dropindex>=this.prefabsNum){
                this.dropindex=0;
                
            }
        }
    }
    
    if(this.canDeathAnim){
        this.timerdeath+=dt;
        if(this.timerdeath>0.7){            
            this.timerdeath=0;
            this.canDeathAnim=false;
        }else{
            this.BoxPool[this.dropindex].translate(0,-10*dt,0);
            this.player.translate(0,-10*dt,0);
        }
    }
};

//路径生成
PathManager.prototype.SpanBox=function(){
    if(this.BoxPool[this.SpanIndex].script.boxControl.YDir===0){        
        this.BoxPool[this.SpanIndex].findByName("left0").enabled=true;
        this.BoxPool[this.SpanIndex].findByName("right1").enabled=false;
        this.BoxPool[this.SpanIndex].findByName("thunder2").enabled=false; 
        this.BoxPool[this.SpanIndex].findByName("boss3").enabled=false;
        this.BoxPool[this.SpanIndex].script.boxControl.autorun=false;        
    }
    if(this.BoxPool[this.SpanIndex].script.boxControl.YDir===1){
        this.BoxPool[this.SpanIndex].findByName("left0").enabled=false;
        this.BoxPool[this.SpanIndex].findByName("right1").enabled=true;
        this.BoxPool[this.SpanIndex].findByName("thunder2").enabled=false;
        this.BoxPool[this.SpanIndex].findByName("boss3").enabled=false;
        this.BoxPool[this.SpanIndex].script.boxControl.autorun=false;
        
    }    
    if(this.BoxPool[this.SpanIndex].script.boxControl.YDir===2){        
        this.BoxPool[this.SpanIndex].findByName("left0").enabled=false;
        this.BoxPool[this.SpanIndex].findByName("right1").enabled=false; 
        this.BoxPool[this.SpanIndex].findByName("thunder2").enabled=true;
        this.BoxPool[this.SpanIndex].findByName("boss3").enabled=false;
        this.BoxPool[this.SpanIndex].script.boxControl.autorun=true;
    }
    if(this.BoxPool[this.SpanIndex].script.boxControl.YDir===3){        
        this.BoxPool[this.SpanIndex].findByName("left0").enabled=false;
        this.BoxPool[this.SpanIndex].findByName("right1").enabled=false; 
        this.BoxPool[this.SpanIndex].findByName("thunder2").enabled=false;
        this.BoxPool[this.SpanIndex].findByName("boss3").enabled=true;
        this.BoxPool[this.SpanIndex].script.boxControl.autorun=false;
    }
    
    
    this.BoxPool[this.SpanIndex].setPosition(this.LastPos.x,-this.DropHeight,this.LastPos.z);
    this.BoxPool[this.SpanIndex].script.boxControl.Up=true;    
    this.BoxPool[this.SpanIndex].script.boxControl.NextPos.set(this.LastPos.x,0,this.LastPos.z);
    
    //判断生成几块block后转弯
    var num=0;
    if(this.playercontrol.score>0 && this.playerindex>=this.dropindex){
        num=this.playerindex-this.dropindex;
    }else{
        num=this.playerindex+this.prefabsNum-this.dropindex;
    }
    
    if(num>5){
        this.BoxPool[this.dropindex].script.boxControl.Down=true;
        this.dropindex++;
        if(this.dropindex>=this.prefabsNum){
            this.dropindex=0;
        }
    }
    
    this.everySpan++;
    this.SpanIndex++;
    
    if(this.SpanIndex>=this.prefabsNum){
        this.SpanIndex=0;
    }
    //判断结束
    
    if(this.everySpan>=this.ChangedNum){
        this.ChangedNum=Math.floor(pc.math.random(MIN_CHANGENUM,MAX_CHANGENUM));
        this.everySpan=0;
        this.ZYaw=!this.ZYaw;
        this.NextDir=pc.math.random(0,1)>0.5;
    }
    
    
    //闪电生成几率1%
    
    var result=0;
    
    //console.log(this.playercontrol.score);
    if(this.playercontrol.score>0 && this.playercontrol.score%100===0){
        //console.log("hahahaa");
        result=3;
        this.BoxPool[this.SpanIndex].script.boxControl.Boss1=pc.math.random(0,1)>0.5?0:1;
        this.BoxPool[this.SpanIndex].script.boxControl.Boss2=pc.math.random(0,1)>0.5?0:1;
        this.BoxPool[this.SpanIndex].script.boxControl.Boss3=pc.math.random(0,1)>0.5?0:1;        
    }else{
        var pathnum=pc.math.random(0,100);
        if(pathnum<=65){
            result=1; 
        }else{
            if(pathnum>65 && pathnum<=98.8){
                result=0; 
            }else{
                if(this.playercontrol.score<89){
                    result=2; //闪电显示 
                }else{
                    result=1;
                }    
            }
        } 
    }
    
      
    
    var XDir=this.ZYaw?0:(this.NextDir?1:-1);
    var YDir=result; //左右记录,闪电或Boss记录下状态
    var ZDir=this.ZYaw?(this.NextDir?1:-1):0;
    
    
    //转向时切换图片
    var left0=this.BoxPool[this.SpanIndex].findByName("left0");
    var right1=this.BoxPool[this.SpanIndex].findByName("right1");
    var boss3=this.BoxPool[this.SpanIndex].findByName("boss3");
    //console.log("left0="+left0.name+";"+"right1="+right1.name);
        if(XDir>0){            
            for(i=0;i<4;i++){
                if(left0.children[i].name==="xbig"){
                    left0.children[i].enabled=true;                    
                }else{                    
                    left0.children[i].enabled=false;                    
                }
                
                if(right1.children[i].name==="xbig"){                    
                    right1.children[i].enabled=true;                    
                }else{
                    right1.children[i].enabled=false;
                }
                
                if(boss3.children[i].name==="xbig"){
                    boss3.children[i].enabled=true;
                }else{
                    if(boss3.children[i].name!=="turn"){
                        boss3.children[i].enabled=false;
                    }
                }
            }
        }
        if(XDir<0){            
            for(i=0;i<4;i++){
                if(left0.children[i].name==="xsmall"){
                    left0.children[i].enabled=true;                    
                }else{                    
                    left0.children[i].enabled=false;                    
                }
                
                if(right1.children[i].name==="xsmall"){                    
                    right1.children[i].enabled=true;                    
                }else{
                    right1.children[i].enabled=false;
                }
                
                if(boss3.children[i].name==="xsmall"){
                    boss3.children[i].enabled=true;
                }else{
                    if(boss3.children[i].name!=="turn"){
                        boss3.children[i].enabled=false;
                    }
                }
            }
        }        
        if(ZDir>0){
            for(i=0;i<4;i++){
                if(left0.children[i].name==="zbig"){
                    left0.children[i].enabled=true;                    
                }else{                    
                    left0.children[i].enabled=false;                    
                }
                
                if(right1.children[i].name==="zbig"){                    
                    right1.children[i].enabled=true;                    
                }else{
                    right1.children[i].enabled=false;
                }
                
                if(boss3.children[i].name==="zbig"){
                    boss3.children[i].enabled=true;
                }else{
                    if(boss3.children[i].name!=="turn"){
                        boss3.children[i].enabled=false;
                    }
                }
            }            
        }      
        if(ZDir<0){
            for(i=0;i<4;i++){
                if(left0.children[i].name==="zsmall"){
                    left0.children[i].enabled=true;                    
                }else{                    
                    left0.children[i].enabled=false;                    
                }
                
                if(right1.children[i].name==="zsmall"){                    
                    right1.children[i].enabled=true;                    
                }else{
                    right1.children[i].enabled=false;
                }
                
                if(boss3.children[i].name==="zsmall"){
                    boss3.children[i].enabled=true;
                }else{
                    if(boss3.children[i].name!=="turn"){
                        boss3.children[i].enabled=false;
                    }
                }
            }            
        }
    
    this.LastPos.set(this.LastPos.x+XDir*(this.Hstep+0.05),0,this.LastPos.z+ZDir*(this.Hstep+0.05));
    this.BoxPool[this.SpanIndex].script.boxControl.XDir=XDir;
    this.BoxPool[this.SpanIndex].script.boxControl.YDir=YDir;
    this.BoxPool[this.SpanIndex].script.boxControl.ZDir=ZDir;
    
    this.lastYdir=YDir;
    
    //根据分数增加难度
    if(this.playercontrol.score>0){
        if(this.playercontrol.score%50===0){
            if(this.everydrop>0.1){
                this.everydrop-=0.1;
            } 
        }
    }
};
PathManager.prototype.Init=function(){
    
    for(var i =0;i<this.prefabsNum;i++)
    {
        this.BoxPool[i].setPosition(0,-100,0);     
        this.BoxPool[i].findByName("left0").enabled=false;
        this.BoxPool[i].findByName("right1").enabled=false;
        this.BoxPool[i].findByName("thunder2").enabled=false;
        this.BoxPool[i].findByName("boss3").enabled=false;
        
        this.BoxPool[i].findByName("right1").children[0].enabled=true;
        this.BoxPool[i].findByName("right1").children[1].enabled=false;
        this.BoxPool[i].findByName("right1").children[2].enabled=false;
        this.BoxPool[i].findByName("right1").children[3].enabled=false;
        this.BoxPool[i].script.boxControl.Up = false;
        this.BoxPool[i].script.boxControl.Down = false;
        this.BoxPool[i].script.boxControl.autorun = false;        
        this.BoxPool[i].script.boxControl.timer = 0;
    }
    this.player.enabled=true;
    this.dropindex=0;
    this.everydrop=0.8;
    this.droptimer=0;
    this.LastPos=new pc.Vec3(0,0,0);
    this.YDir=0;
    this.lastYdir=0;
    this.ChangedNum = Math.floor(pc.math.random(MIN_CHANGENUM,MAX_CHANGENUM));
    this.NextDir = false;
    this.ZYaw = true; 
    this.everySpan = 0;
    this.SpanIndex = 0;
    this.playerindex = 0;    
    
    this.InitSpanBox();
};





