var Playermanager = pc.createScript('playermanager');

// initialize code called once per entity
Playermanager.prototype.initialize = function() {
    //this.isIOS = /iPad|iPhone|iPod/.test(navigator.platform); //IOS终端
    this.gm=this.app.root.findByName("GameController");
    this.player=this.app.root.findByName("player");
    this.players=this.app.root.findByName("players");
    this.gamestatemanager=this.gm.script.GameStateManager;
    this.gamemanager=this.gm.script.GameManager;
    
    /*
    //ios初始bug修复
    this.timess=0;
    this.st=false;*/
    
    if(this.app.touch){        
          this.app.touch.on(pc.EVENT_TOUCHSTART,this.onMouseDown,this);
    }else{
          this.app.mouse.on(pc.EVENT_MOUSEDOWN,this.onMouseDown,this);
    }
};

// update code called every frame
Playermanager.prototype.update = function(dt) {
    //bug修复
    var e01=this.players.getEulerAngles();            
    if(e01.y>0){
        this.players.setEulerAngles(e01.x,90,0);
    }else{
        this.players.setEulerAngles(e01.x,-90,0);
    }
    
    
    
    if(!this.gamemanager.GameIsOver && this.gamemanager.ks){
            //
            this.gamestatemanager.GameStartGame();/////////////////////////////////////////////////
            
            this.gamemanager.tip.enabled=false; 
            
            if(this.gamemanager.isMove){
                //this.player.sound.slot("run").play();
                
                if(this.gamemanager.isOnce){
                    this.entity.translateLocal(0,0,-this.gamemanager.movespeed);
                }else{
                    this.entity.translateLocal(0,0,this.gamemanager.movespeed);
                }
            }
    }
};

Playermanager.prototype.onMouseDown=function(e){
    if(!this.gamemanager.GameIsOver){
        if(!this.gamemanager.ks){
            this.gamemanager.ks=true;
            this.gamemanager.isMove=true;
        }else{                                     
                       if(!this.gamemanager.isMove){
                            if(this.gamemanager.hasParent){
                                var pos=this.entity.getPosition();
                               var euler=this.entity.getEulerAngles();
                               this.entity.reparent(this.player,0);
                               this.gamemanager.hasParent=false;
                               this.entity.setPosition(pos.x,pos.y,pos.z);
                               this.entity.setEulerAngles(euler.x,euler.y,euler.z);
                               this.entity.setLocalScale(2,2,2);
                               this.entity.collision.radius=0.15;
                               this.entity.collision.height=0.5;
                               
                            }
                                this.gamemanager.isMove=true;  
                                this.gamemanager.inOnce=!this.gamemanager.inOnce;
                                this.gamemanager.isReset=false;
                       }           
        }
    }   
};