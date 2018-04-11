var CameraFollow = pc.createScript('CameraFollow');

// initialize code called once per entity
CameraFollow.prototype.initialize = function() {
    
    var app = this.app;
    var player = app.root.findByName('player');
    this.playercontrol = player.script.PlayerControl;
    var manager = app.root.findByName('Manager');
    this.gamemanager = manager.script.GameStateManager;
    this.InitPos = this.entity.getPosition().clone();
    
    
    this.scale = 1;
    this.changespeed = 2;
    this.X = this.InitPos.x;
    this.Y = this.InitPos.y;
    this.Z = this.InitPos.z;
    
};

CameraFollow.prototype.update = function(dt) {
    
    
    if(this.gamemanager.lose)
    {
        return;
    }
    if(!this.gamemanager.start || !this.gamemanager.startgame)
    {
        return;
    }
    
    var dx = this.playercontrol.X > this.scale ? (this.playercontrol.X - this.scale):(this.playercontrol.X<-this.scale?(this.scale+this.playercontrol.X):0);
    this.X = pc.math.lerp(this.X,dx,this.changespeed*dt);
    this.Z = pc.math.lerp(this.Z,this.playercontrol.Z+6,this.changespeed*dt);
    this.entity.setPosition(this.X,this.Y,this.Z);
  
};

CameraFollow.prototype.Init = function(){
    this.X = this.InitPos.x;
    this.Y = this.InitPos.y;
    this.Z = this.InitPos.z;
    this.entity.setPosition(this.X,this.Y,this.Z);
    
};

