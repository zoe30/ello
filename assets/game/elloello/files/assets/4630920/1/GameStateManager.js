var GameStateManager = pc.createScript('GameStateManager');

// initialize code called once per entity
GameStateManager.prototype.initialize = function() {
    
    var app = this.app;
    var manager = app.root.findByName('Manager');
    this.playercontrol = manager.script.PlayerControl;
    
    
    this.start = false;
    this.startgame  = false;
    this.lose = false;
    this.playtimer = 0;
    this.app.mouse.disableContextMenu();
      initHandle();
};

// update code called every frame
GameStateManager.prototype.update = function(dt) {
    
            if(!this.startgame || this.lose)
            {
                return;
            }

            this.playtimer += dt;
    
    
};

// swap method called for script hot-reloading
// inherit your script state here
GameStateManager.prototype.swap = function(old) {
    
};

GameStateManager.prototype.GameStart=function(){
   beginHandle();
    //console.log("初次开始游戏，即点击start按钮");
};

GameStateManager.prototype.GameStartGame = function()
{
    startHandle();
    console.log('GameStartGame');
};

GameStateManager.prototype.GameEnd = function(){
   console.log('GameEnd');
   var scoreinfo={"score":this.playercontrol.score,'usermask':parseInt(this.playtimer),"score1":(this.playercontrol.score+17),'usermask1':parseInt(this.playtimer+9)};
    gameover(scoreinfo);
   
};


GameStateManager.prototype.Init = function(){
     resetHandle();
  
    this.startgame = false;
    this.lose = false;
    this.playtimer = 0;
};

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/