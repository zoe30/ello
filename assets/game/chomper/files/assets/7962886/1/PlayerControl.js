var PlayerControl = pc.createScript('playerControl');
PlayerControl.attributes.add("PlayerMat",{type:"asset",default:null});
PlayerControl.attributes.add("ztex1",{type:"asset",default:null});
PlayerControl.attributes.add("ztex2",{type:"asset",default:null});
PlayerControl.attributes.add("xtex1",{type:"asset",default:null});
PlayerControl.attributes.add("xtex2",{type:"asset",default:null});
PlayerControl.attributes.add("prefab",{type:"entity",default:null});

var idle=0;
var jumpup=1;
var jumpdown=2;
var walk=3;

// initialize code called once per entity
PlayerControl.prototype.initialize = function() {
    this.bossStatus=1;
    
    this.playerpt_right=this.app.root.findByName("playerpt_purple");
    this.playerpt_left=this.app.root.findByName("playerpt_blue");
    this.playerpt_player=this.app.root.findByName("playerpt_red");
    this.shadow=this.app.root.findByName("Shadow");
    //this.death=this.app.root.findByName("death");
    //this.deathscript=this.death.script.death;
    
    
    //转向时player切换贴图
    this.playermat=this.PlayerMat.resource;
    this.ZTex1=this.ztex1.resource;
    this.ZTex2=this.ztex2.resource;
    this.XTex1=this.xtex1.resource;
    this.XTex2=this.xtex2.resource;
    
    this.shadowscale=0.45;
    this.shadowPos=new pc.Vec3(0.05,0.21,0.05);
    
    
    
    if(this.prefab){
        this.BoxPool=this.prefab.children;
    }
    this.manager=this.app.root.findByName("Manager");
    if(this.manager){
        this.pathmanager=this.manager.script.pathManager;
        this.gamemanager=this.manager.script.gameStateManager;
    }
    
    this.Hstep = 0.8;
    this.Vstep = 0.3;
    this.score=0;
    this.halfwidth=window.innerWidth/2; //判断点击左右时使用    
    var pos=this.entity.getPosition();
    this.InitPos=new pc.Vec3(pos.x,pos.y,pos.z); //重置位置时使用，记录player初始位置
    this.nextPos=new pc.Vec3(0,0,0);
    this.tapwrong=false; //左右是否点击错
    this.timeoutwrong=false; //是否过时
    this.tapwrongindex = 0;
    
    this.hasplay=false;
    this.hasplaytimer=0;
    this.waittimer=0;
    
    //player前进时的动画相关变量
    this.state=idle;
    this.timer=0;
    this.statechangeTime = 0.2; //跳动动画在此时间内执行
    
    //下一个block的状态
    this.nextXDir=this.BoxPool[1].script.boxControl.XDir;
    this.nextYDir=this.BoxPool[1].script.boxControl.YDir;
    this.nextZDir=this.BoxPool[1].script.boxControl.ZDir;
    
    
    //闪电控制
    this.autojump=false;
    this.jumpnum=0;   
    
    //点击事件检测
    if(this.app.touch){
        this.app.touch.on(pc.EVENT_TOUCHSTART,this.onTouchStart,this);
    }else{
        this.app.mouse.on(pc.EVENT_MOUSEDOWN,this.onTouchStart,this);
    }
    var self=this;
    //横竖屏转换时，重新获取innerWidth/2
    window.addEventListener("resize",function(e){
        self.halfwidth=window.innerWidth/2;
    });
    
    
};

// update code called every frame
PlayerControl.prototype.update = function(dt) {    
    if(this.hasplay){        
            STATUS="gameover";
            this.waittimer=0;
            var ps=this.entity.getPosition();
            this.playerpt_player.setPosition(ps.x,0.4,ps.z);
            this.playerpt_player.particlesystem.reset();
            this.playerpt_player.particlesystem.play();
            this.entity.enabled=false;
            
            this.hasplaytimer=0;
            this.hasplay=false;               
    }
    
    
    if(this.autojump){
        this.AutoJump(dt);
        return;
    }    
    
    this.BackToIdle(dt);
    
    
};

PlayerControl.prototype.onTouchStart=function(e){   
    if(STATUS==="tipshow"){
        //调用函数
        this.gamemanager.GameStartGame();
        
        //场景状态相关
        STATUS="gaming";
    }    
    if(STATUS==="gaming"){
        e.event.preventDefault();
    }
    if(STATUS==="gaming" || STATUS==="tipshow"){
        
        if(this.autojump){
            return;
        }
        
        //e.event.preventDefault();
        this.waittimer=0;
        var clickLeft=false;
        if(this.app.touch){
            var touches=e.changedTouches;
            if(touches[0].x>this.halfwidth){
                //点击了右边
            }else{
                //点击了左边
                clickLeft=true;
            }
        }else{
            if(e.x>this.halfwidth){
                //点击了右边
            }else{
                //点击了左边
                clickLeft=true;
            }
        }
        
        this.timer=0;
        this.state=idle;
        this.entity.setPosition(this.nextPos.x,0,this.nextPos.z);
        this.shadow.setPosition(this.nextPos.x+this.shadowPos.x,this.nextPos.y+this.shadowPos.y,this.nextPos.z+this.shadowPos.z);
        this.pathmanager.playerindex=this.score%this.pathmanager.prefabsNum;
        
        var nextIndex=this.pathmanager.playerindex+1;
        if(nextIndex>=this.pathmanager.prefabsNum){
            nextIndex=0;
        }
        this.nextXDir=this.BoxPool[nextIndex].script.boxControl.XDir;
        this.nextYDir=this.BoxPool[nextIndex].script.boxControl.YDir;
        this.nextZDir=this.BoxPool[nextIndex].script.boxControl.ZDir;
        
        //转向时切换图片
        if(this.nextXDir>0){
            this.playermat.emissiveMap=this.XTex1;
            this.playermat.opacityMap=this.XTex1;
            this.playermat.update();
            this.shadow.setEulerAngles(0,-45,0);
        }
        if(this.nextXDir<0){
            this.playermat.emissiveMap=this.XTex2;
            this.playermat.opacityMap=this.XTex2;
            this.playermat.update();
            this.shadow.setEulerAngles(0,-45,0);
        }        
        if(this.nextZDir>0){
            this.playermat.emissiveMap=this.ZTex1;
            this.playermat.opacityMap=this.ZTex1;
            this.playermat.update();
            this.shadow.setEulerAngles(0,45,0);
        }        
        if(this.nextZDir<0){
            this.playermat.emissiveMap=this.ZTex2;
            this.playermat.opacityMap=this.ZTex2;
            this.playermat.update();
            this.shadow.setEulerAngles(0,45,0);
        }
        
        if(this.BoxPool[nextIndex].script.boxControl.autorun){
            //console.log("222");
            this.autojump=true;
            this.autojump=10;
        }        
        
        
        //是否结束判断
        //clickLeft=true时，说明点击了左边，false时点击了右边   
        //
        //     
         if(this.nextYDir===3){
             if(this.bossStatus===1){
                 //遇到Boss后，还未有任何操作
                 if((!clickLeft && this.BoxPool[nextIndex].script.boxControl.Boss1===0) || (clickLeft && this.BoxPool[nextIndex].script.boxControl.Boss1===1)){
                     //游戏失败
                     this.gameOver(nextIndex);
                     this.bossStatus=1;
                 }else{
                     //第一个提示，按对了
                     //第一个提示隐藏，bossStatus=2
                     this.BoxPool[nextIndex].findByName("boss3").findByName("turn").children[0].enabled=false;
                     this.bossStatus=2;
                     this.manager.sound.slot("hitboss").play();
                 }                 
             }else{
                 if(this.bossStatus===2){
                     if((!clickLeft && this.BoxPool[nextIndex].script.boxControl.Boss2===0) || (clickLeft && this.BoxPool[nextIndex].script.boxControl.Boss2===1)){
                        //游戏失败
                         this.gameOver(nextIndex);
                         this.bossStatus=1;
                         this.BoxPool[nextIndex].findByName("boss3").findByName("turn").children[0].enabled=true;                         
                     }else{
                         //第二个提示，按对了
                         //第二个提示隐藏，bossStatus=3
                         this.BoxPool[nextIndex].findByName("boss3").findByName("turn").children[1].enabled=false;
                         this.manager.sound.slot("hitboss").play();
                         this.bossStatus=3;
                     }   
                 }else{
                     if((!clickLeft && this.BoxPool[nextIndex].script.boxControl.Boss3===0) || (clickLeft && this.BoxPool[nextIndex].script.boxControl.Boss3===1)){
                        //游戏失败
                         this.gameOver(nextIndex);
                         this.bossStatus=1;
                         this.BoxPool[nextIndex].findByName("boss3").findByName("turn").children[0].enabled=true;
                         this.BoxPool[nextIndex].findByName("boss3").findByName("turn").children[1].enabled=true;                         
                     }else{
                         //第三个提示，按对了
                         //第三个提示隐藏，boss消失，bossStatus===1   
                         this.clickRight(nextIndex);                      
                         this.bossStatus=1;
                         this.BoxPool[nextIndex].findByName("boss3").findByName("turn").children[0].enabled=true;
                         this.BoxPool[nextIndex].findByName("boss3").findByName("turn").children[1].enabled=true;
                         this.BoxPool[nextIndex].findByName("boss3").findByName("turn").children[2].enabled=true;
                         this.manager.sound.slot("hitboss").play();
                     }   
                 }
             }
         }else{
            if((!clickLeft && this.nextYDir===0) || (clickLeft && this.nextYDir===1)){
                 this.gameOver(nextIndex);      
            }else{
                this.clickRight(nextIndex);
                if(this.nextYDir===2){
                    this.manager.sound.slot("eat").play();
                }
                var ps=this.BoxPool[nextIndex].getPosition();
                if(this.nextYDir===0){
                    this.playerpt_left.setPosition(ps.x,0.4,ps.z);
                    this.playerpt_left.particlesystem.reset();
                    this.playerpt_left.particlesystem.play(); 
                    
                    /*this.death.setPosition(ps.x,0.55,ps.z);
                    
                    this.deathscript.canPlay=true;
                    this.deathscript.timer=0;
                    //this.death.enabled=false;*/
                }
                if(this.nextYDir===1){
                    this.playerpt_right.setPosition(ps.x,0.4,ps.z);
                    this.playerpt_right.particlesystem.reset();
                    this.playerpt_right.particlesystem.play();  
                    
                    /*this.death.setPosition(ps.x,0.65,ps.z);
                    //this.death.setLocalScale(0,1,0);
                    this.deathscript.canPlay=true;
                    this.deathscript.timer=0;*/
                    
                    
                    //this.death.enabled=false;
                }
                
            }        
         }
    }    
};

PlayerControl.prototype.gameOver=function(nextIndex){
    this.hasplay=true;
    //点击了右边，但y!=0  或者  点击了左边但y=0,这两种情况说明点击错误，结束游戏   

    //STATUS="gameover";
    this.tapwrong=true; 
    this.shadow.enabled=false;
    this.manager.sound.slot("lose").play();
    return;     
};
PlayerControl.prototype.clickRight=function(nextIndex){
    this.BoxPool[nextIndex].findByName("left0").enabled=false;            
    this.BoxPool[nextIndex].findByName("right1").enabled=false;
    this.BoxPool[nextIndex].findByName("thunder2").enabled=false;
    this.BoxPool[nextIndex].findByName("boss3").enabled=false;
                
    if(this.nextYDir>0){
        this.state=jumpup; 
    }else{
        this.state=walk; 
    }
    this.score++;
    var scoreui=document.getElementById("score");
    scoreui.innerHTML=this.score.toString();
    this.nextPos.set(this.nextPos.x+this.nextXDir*(this.Hstep+0.05),0,this.nextPos.z+this.nextZDir*(this.Hstep+0.05));
    this.pathmanager.SpanBox();   
};


PlayerControl.prototype.BackToIdle=function(dt){
    if(this.state!==idle){
        this.timer+=dt;
        if(this.timer>this.statechangeTime){
            //player跳动动画执行完后
            this.timer=0;
            this.state=idle;
            this.entity.setPosition(this.nextPos.x,0,this.nextPos.z);
            this.shadow.setPosition(this.nextPos.x+this.shadowPos.x,this.nextPos.y+this.shadowPos.y,this.nextPos.z+this.shadowPos.z);
            this.shadow.setLocalScale(this.shadowscale,this.shadowscale,this.shadowscale);
            
            var nextIndex=this.pathmanager.playerindex+1;
            if(nextIndex>=this.pathmanager.prefabsNum){
                nextIndex=0;
            }
            this.nextXDir=this.BoxPool[nextIndex].script.boxControl.XDir;
            this.nextYDir=this.BoxPool[nextIndex].script.boxControl.YDir;
            this.nextZDir=this.BoxPool[nextIndex].script.boxControl.ZDir;
            
            if(this.BoxPool[this.pathmanager.playerindex].script.boxControl.autorun){
                this.autojump=true;
                this.jumpnum=10;
            }
        }else{
            //跳动动画执行
            if(this.timer < this.statechangeTime/2)
            {
                var percent1 = (this.statechangeTime/2 -this.timer)/this.statechangeTime*2;
                this.entity.translate(this.nextXDir*(this.Hstep/this.statechangeTime)*dt,(0.3/this.statechangeTime)*dt,this.nextZDir*(this.Hstep/this.statechangeTime)*dt);  
                this.shadow.translate(this.nextXDir*(this.Hstep/this.statechangeTime)*dt,0,this.nextZDir*(this.Hstep/this.statechangeTime)*dt); 
                this.shadow.setLocalScale(0.3+0.24*percent1,0.3+0.24*percent1,0.3+0.24*percent1);
            }else{
                var percent2 = (this.timer - this.statechangeTime/2)/this.statechangeTime*2;
                this.entity.translate(this.nextXDir*(this.Hstep/this.statechangeTime)*dt,-(0.3/this.statechangeTime)*dt,this.nextZDir*(this.Hstep/this.statechangeTime)*dt);
                this.shadow.translate(this.nextXDir*(this.Hstep/this.statechangeTime)*dt,0,this.nextZDir*(this.Hstep/this.statechangeTime)*dt); 
                this.shadow.setLocalScale(0.3+0.24*percent2,0.3+0.02*percent2,0.3+0.24*percent2);
            }
        }
    }
};

PlayerControl.prototype.AutoJump=function(dt){
    this.timer+=dt; 
    if(this.timer>this.statechangeTime/2){
        this.timer=0;        
        this.entity.setPosition(this.nextPos.x,0,this.nextPos.z);
        this.shadow.setPosition(this.nextPos.x+this.shadowPos.x,this.nextPos.y+this.shadowPos.y,this.nextPos.z+this.shadowPos.z);
        this.shadow.setLocalScale(this.shadowscale,this.shadowscale,this.shadowscale);
        this.pathmanager.playerindex=this.score%this.pathmanager.prefabsNum;
        
        
        
        var nextIndex=this.pathmanager.playerindex+1;
        if(nextIndex>=this.pathmanager.prefabsNum){
            nextIndex=0;
        }
        this.nextXDir=this.BoxPool[nextIndex].script.boxControl.XDir;
        this.nextYDir=this.BoxPool[nextIndex].script.boxControl.YDir;
        this.nextZDir=this.BoxPool[nextIndex].script.boxControl.ZDir;
        this.BoxPool[nextIndex].findByName("left0").enabled=false;
        this.BoxPool[nextIndex].findByName("right1").enabled=false;
        this.BoxPool[nextIndex].findByName("thunder2").enabled=false;        
        
        //转向时切换图片
        if(this.nextXDir>0){
            this.playermat.emissiveMap=this.XTex1;
            this.playermat.opacityMap=this.XTex1;
            this.playermat.update();
            this.shadow.setEulerAngles(0,-45,0);
        }
        if(this.nextXDir<0){
            this.playermat.emissiveMap=this.XTex2;
            this.playermat.opacityMap=this.XTex2;
            this.playermat.update();
            this.shadow.setEulerAngles(0,-45,0);
        }        
        if(this.nextZDir>0){
            this.playermat.emissiveMap=this.ZTex1;
            this.playermat.opacityMap=this.ZTex1;
            this.playermat.update();
            this.shadow.setEulerAngles(0,45,0);
        }        
        if(this.nextZDir<0){
            this.playermat.emissiveMap=this.ZTex2;
            this.playermat.opacityMap=this.ZTex2;
            this.playermat.update();
            this.shadow.setEulerAngles(0,45,0);
        }
        
        if(this.BoxPool[this.pathmanager.playerindex].script.boxControl.autorun){
            this.autojump=true;
            this.jumpnum=10;
        }
        
        if(this.nextYDir>0){
           this.state=jumpup; 
        }else{
           this.state=walk; 
        }
        this.jumpnum--;
        if(this.jumpnum<=0){
            this.autojump=false;
        }
        
        this.score++;
        var scoreui=document.getElementById("score");
        scoreui.innerHTML=this.score.toString();
        this.nextPos.set(this.nextPos.x + this.nextXDir*(this.Hstep+0.05),0,this.nextPos.z+this.nextZDir*(this.Hstep+0.05));
        
        this.pathmanager.SpanBox();
    }else{
        if(this.timer < this.statechangeTime/4){
            var percent1 = (this.statechangeTime/4 -this.timer)/this.statechangeTime*4;
            this.entity.translate(this.nextXDir*(2*this.Hstep/this.statechangeTime)*dt,0,this.nextZDir*(2*this.Hstep/this.statechangeTime)*dt); 
            this.shadow.translate(this.nextXDir*(2*this.Hstep/this.statechangeTime)*dt,0,this.nextZDir*(2*this.Hstep/this.statechangeTime)*dt);
        }else{
            var percent2 = (this.timer - this.statechangeTime/4)/this.statechangeTime*4;
            this.entity.translate(this.nextXDir*(2*this.Hstep/this.statechangeTime)*dt,0,this.nextZDir*(2*this.Hstep/this.statechangeTime)*dt); 
            this.shadow.translate(this.nextXDir*(2*this.Hstep/this.statechangeTime)*dt,0,this.nextZDir*(2*this.Hstep/this.statechangeTime)*dt);
        }
    }
};

PlayerControl.prototype.Init=function(){
    this.shadow.enabled = true;
    this.shadow.setPosition(this.InitPos.x+this.shadowPos.x,this.InitPos.y+this.shadowPos.y,this.InitPos.z+this.shadowPos.z);
    this.shadow.setLocalScale(this.shadowscale,this.shadowscale,this.shadowscale);
    this.shadow.setEulerAngles(0,45,0);
    
    
    this.waittimer=0;
    this.entity.setPosition(this.InitPos.x,0,this.InitPos.z);
    this.nextPos=new pc.Vec3(0,0,0);
    this.score=0;   
    
    this.tapwrong=false;
    this.timeoutwrong=false;
    
    
    this.state=idle;
    this.timer=0;
    this.nextXDir=this.BoxPool[1].script.boxControl.XDir;
    this.nextYDir=this.BoxPool[1].script.boxControl.YDir;
    this.nextZDir=this.BoxPool[1].script.boxControl.ZDir;
    this.playermat.emissiveMap=this.ZTex2;
    this.playermat.opacityMap=this.ZTex2;
    this.playermat.update();
};

