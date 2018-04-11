var Uimanager = pc.createScript('UIManager');
Uimanager.prototype.initialize = function() {
    this.gm=this.app.root.findByName("GameController"); 
    this.gamestatemanager=this.gm.script.GameStateManager;
    this.gamemanager=this.gm.script.GameManager;
    this.changemat=this.gm.script.changematerial;
    
    this.player=this.app.root.findByName("player");
    this.players=this.app.root.findByName("players");
    this.cam=this.app.root.findByName("Camera");
    this.showEndUI = false;

    

      
    var again=document.getElementById("loadscene");
    var uistart=document.getElementById("uistart");
    var start=document.getElementById("start");
    this.uiend=document.getElementById("uiend");
    //console.log(this.uiend);
    this.scoreui=document.getElementById("score");
    var self=this;
    start.addEventListener("click",function(event){
         self.gamemanager.GameIsOver=false; 
         
         self.gamemanager.tip.enabled=true;
         
         self.gamestatemanager.GameStart();////////////////////////////////////////////////////////////gamestart
                

               
    });
    
    again.addEventListener("click",function(event){
        
                
        
                //游戏重置
                 self.showEndUI = false;
                //状态
                self.gamemanager.GameIsOver=false;
                self.gamemanager.ks=false;
                self.gamemanager.showrestart=false;
                self.gamemanager.hasParent=false;
                self.gamemanager.isOnce=false;
                self.gamemanager.isReset=false; 
                
                self.gamemanager.tip.enabled=true;
        
                
                self.gamestatemanager.Init();////////////////////////////////////////////////////////////init
        
                //位置
                self.cam.setPosition(0,1.6,2);                 
                self.players.reparent(self.player,0);
                self.players.setLocalPosition(0,-0.3,0);
                self.players.setEulerAngles(-90,0,0);
                self.players.setLocalScale(2,2,2);
                //self.players.collision.radius=0.15;
                //self.players.collision.height=0.5;
                
                //得分
                self.gamemanager.score=0;
                //转盘位次
                self.gamemanager.turnindex=5;        
                
                
                     
                self.changemat.isStartChange=true;//bg,water,ground
                self.gamemanager.isfruit0=true;//fruit
                self.gamemanager.isfruit1=true;
                self.gamemanager.isfruit2=true;
                self.gamemanager.isfruit3=true;
                self.gamemanager.isfruit4=true;
        
                self.gamemanager.isturn0=true;//fruit
                self.gamemanager.isturn1=true;
                self.gamemanager.isturn2=true;
                self.gamemanager.isturn3=true;
                self.gamemanager.isturn4=true;
                
                //场景顺次，以此改变场景
                self.gamemanager.matindex++;
                if(self.gamemanager.matindex>3){
                    self.gamemanager.matindex=0;
                }
        
                self.scoreui.innerHTML=self.gamemanager.score.toString();
                
                
                
     });
};
Uimanager.prototype.update = function(dt) {
            //this.scoreui.innerHTML=this.gamemanager.score.toString();
            //restart是否显示
            // if(this.gamemanager.showrestart){
                
            //    //----待删除代码（放入GameEnd）
            //    //this.uiend.style.display="block";
            //    //----
                
            //    this.gamestatemanager.GameEnd();////////////////////////////////////////////////////////////end
            // }    
          if(this.gamemanager.showrestart && !this.showEndUI)
           {
            this.uiend.style.display = "block";
            this.gamestatemanager.GameEnd();
            this.showEndUI = true;
           } 
};


Uimanager.prototype.Init = function(){
            this.losetimer = 0;
            this.showEndUI = false;
};

