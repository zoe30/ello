var CoinManager = pc.createScript('CoinManager');

// initialize code called once per entity
CoinManager.prototype.initialize = function() {
    var app = this.app;
    var manager = app.root.findByName('Manager');
    this.gamemanager = manager.script.GameStateManager;
    this.player = app.root.findByName('player');
    this.playercontrol = this.player.script.ControlPlayer;
    this.boundmanager = manager.script.BoundManager;
    this.coin = app.root.findByName('coin');
    this.cpt = app.root.findByName('pt');
    this.radius = 0.7;
    this.X = 0;
    this.Y = 0.2;
    this.Z = 0;
    this.getcoin = false;
    this.delay = 0.5;
};

// update code called every frame
CoinManager.prototype.update = function(dt) {
    
    this.coin.rotate(0,60*dt,0);
    if(!this.gamemanager.start || !this.gamemanager.startgame)
    {
        return;
    }
    if(this.gamemanager.lose)
    {
        return;
    }
    
    if(this.getcoin)
    {
        this.SpawnCoin(dt);
    }
    else
    {
        this.GetCoin();
    }
};

CoinManager.prototype.swap = function(old) {
    
};

CoinManager.prototype.GetCoin = function(){
      
    var pos =this.player.getPosition();
    var x = pos.x;
    var z = pos.z;
    var d = Math.sqrt((pos.x-this.X)*(pos.x-this.X)+(pos.z-this.Z)*(pos.z-this.Z));
    if(d < this.radius)
    {
        this.cpt.setPosition(this.X,this.Y,this.Z);
        this.cpt.particlesystem.reset();
        this.cpt.particlesystem.play();
        this.coin.enabled = false;
        this.getcoin = true;
        this.playercontrol.AddScore();
        if(!this.gamemanager.eatfirst)
        {
            this.playercontrol.tips.enabled = false;
            this.gamemanager.eatfirst = true;
        }
    }
};
CoinManager.prototype.SpawnCoin = function(dt){
      
    this.delay -= dt;
    if(this.delay < 0)
    {
        this.delay = 0.5;
        this.coin.enabled = true;
        this.getcoin = false;
        this.X = pc.math.random(this.boundmanager.LeftBound+1,this.boundmanager.RightBound-1);
        this.Z = pc.math.random(this.boundmanager.UpBound+3,this.boundmanager.DownBound-3);
        this.coin.setPosition(this.X,this.Y,this.Z);
    }
};
CoinManager.prototype.Init = function(){
    this.X = 0;
    this.Y = 0.2;
    this.Z = 0;
    this.getcoin = false;
    this.delay = 0.5;
    this.coin.enabled = true;
    this.coin.setPosition(this.X,this.Y,this.Z);
};
