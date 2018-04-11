var Uimanager = pc.createScript('UIManager');

Uimanager.attributes.add("player",{type:"entity",default:null});
Uimanager.attributes.add("enemy",{type:"entity",default:null});
// initialize code called once per entity
Uimanager.prototype.initialize = function() {
    this.gm=this.app.root.findByName("GameController");
    this.gamestatemanager=this.gm.script.GameStateManager;
    //this.player=this.app.root.findByName("player");
    //this.enemy=this.app.root.findByName("enemy");
    
    
    
    //----待删除代码
    // var div=document.createElement("div");
    //         div.innerHTML="<div id='uistart'>"+
    //                       "<img id='start' src='http://blog.ileou.com/webvr/start.png'>"+
    //                       "</div>"+
    //                       "<div id='uiend'>"+
    //                       "<img id='loadscene' src='http://blog.ileou.com/webvr/start.png'>"+"</div>"+
    //                       "<p id='score'>0</p>";
                          
    //         document.body.appendChild(div);
            
    //         var style=document.createElement("style");
    //         style.innerHTML="#start{position:absolute;left:40%;top:40%;width:30%;height:auto;display:block;}"+
    //                         "#uiend{display:none}"+
    //                         "#loadscene{position:absolute;left:5%;bottom:5%;width:18%;height:auto;display:block;}"+
    //                         "#score{position:absolute;right:5%;top:40%;-webkit-transform: rotate(90deg);font-size:40px;color:white;display:none;}";
    //         document.head.appendChild(style);
    //----
    
    
    var again=document.getElementById("loadscene");
    var uistart=document.getElementById("uistart");
    var start=document.getElementById("start");
    this.uiend=document.getElementById("uiend");
    //console.log(this.uiend);
    this.scoreui=document.getElementById("score");
    var self=this;
    start.addEventListener("click",function(event){
         self.gm.script.GameManager.GameIsOver=false; 
         self.gm.script.CreateFood.createFoodAllowed=true;
         self.gm.script.GameManager.tip.enabled=true;
         self.gm.script.GameManager.tip2.enabled=true;
         self.gamestatemanager.GameStart(); 
                
         //----待删除代码
         self.scoreui.style.display="block";               
         uistart.style.display="none";
         //----
               
    });
    
    again.addEventListener("click",function(event){
                //----待删除代码
                self.uiend.style.display="none";
                //----
                
                self.gm.script.GameManager.GameIsOver=false;
                self.gm.script.GameManager.ks=false;
                self.gm.script.GameManager.showrestart=false;
                self.gm.script.CreateFood.createFoodAllowed=true;
                
                self.player.script.waypoint.isDisapper=false;
                self.gm.script.GameManager.tip.enabled=true;
                self.gm.script.GameManager.tip2.enabled=true;
        
                self.gamestatemanager.Init();
                
                self.player.setPosition(2.74,-0.1,-15.47);
                self.player.setEulerAngles(0,-90,0);
                
                self.enemy.setPosition(2.556,-0.1,2.537);
                self.enemy.setEulerAngles(0,-90,0);
                
                self.gm.script.GameManager.speed=16;
                self.gm.script.GameManager.score=0;
        
                self.gm.script.GameManager.modelindex++;
                if(self.gm.script.GameManager.modelindex>3){
                    self.gm.script.GameManager.modelindex=0;
                }
        
     });
};

// update code called every frame
Uimanager.prototype.update = function(dt) {
    this.scoreui.innerHTML=this.gm.script.GameManager.score.toString();
    //restart是否显示，根据showrestart定
            if(this.gm.script.GameManager.showrestart){
                
               //----待删除代码（放入GameEnd）
               //this.uiend.style.display="block";
               //----
               
                
               this.gamestatemanager.GameEnd(this.uiend);
            }
    
};

// swap method called for script hot-reloading
// inherit your script state here
Uimanager.prototype.swap = function(old) {
    
};

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/