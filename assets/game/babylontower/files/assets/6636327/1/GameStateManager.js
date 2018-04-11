var GameStateManager = pc.createScript('GameStateManager');

// initialize code called once per entity
GameStateManager.prototype.initialize = function() {
    var app = this.app;
    
    var player =app.root.findByName('player');
    this.playercontrol = player.script.PlayerControl;
    
    this.start = false;
    this.startgame = false;
    this.lose = false;
    this.droplose = false;
    this.hitlose = false;
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
};

GameStateManager.prototype.GameStartGame = function()
{
    startHandle();
};

GameStateManager.prototype.GameEnd = function()
{
    var scoreinfo={"score":this.playercontrol.score,'usermask':parseInt(this.playtimer),"score1":(this.playercontrol.score+17),'usermask1':parseInt(this.playtimer+9)};
    gameover(scoreinfo);
    
};

GameStateManager.prototype.Init = function()
{
    resetHandle();
    this.playtimer = 0;  
    this.startgame =false;
    this.lose = false;
    this.droplose = false;
    this.hitlose = false;
};