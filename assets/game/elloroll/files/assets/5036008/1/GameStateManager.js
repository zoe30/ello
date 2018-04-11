var GameStateManager = pc.createScript('GameStateManager');

// initialize code called once per entity
GameStateManager.prototype.initialize = function() {
    var app = this.app;
    
    var player =app.root.findByName('player');
    this.playercontrol = player.script.PlayerControl;
    
    this.start = false;
    this.startgame = false;
    this.lose = false;
    
    this.playtimer = 0.3;
   
      initHandle();
};

GameStateManager.prototype.update = function(dt) {
    if(!this.start || !this.startgame)
    {
        return;
    }
    if(this.lose)
    {
        return;
    }
    
    this.playtimer += dt;
    
};

GameStateManager.prototype.swap = function(old) {
    
};

GameStateManager.prototype.GameStart = function()
{
  beginHandle();
    console.log('Game Start');
};

GameStateManager.prototype.GameStartGame = function()
{
    startHandle();
    console.log('GameStartGame');
};

GameStateManager.prototype.GameEnd = function()
{
    
     var scoreinfo={"score":this.playercontrol.currow,'usermask':parseInt(this.playtimer),"score1":(this.playercontrol.currow+17),'usermask1':parseInt(this.playtimer+9)};
     //console.log(JSON.stringify(scoreinfo));
     gameover(scoreinfo);
    
};

GameStateManager.prototype.Init = function()
{
  resetHandle();
    this.playtimer = 0;  
    this.startgame =false;
    this.lose = false;
};