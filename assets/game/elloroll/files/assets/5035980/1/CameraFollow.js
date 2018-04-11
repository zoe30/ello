var CameraFollow = pc.createScript('CameraFollow');

// initialize code called once per entity
CameraFollow.prototype.initialize = function() {
    
    var app = this.app;
    
    var manager = app.root.findByName('Manager');
    this.gamemanager = manager.script.GameStateManager;
    this.player = app.root.findByName('player');
    this.cameraoffset = new pc.Vec3(0,7.9,-10);
    
    this.changespeed = 3;
    this.InitPos = this.entity.getPosition().clone();
    
    
};


CameraFollow.prototype.update = function(dt) {
    
    if(!this.gamemanager.start || !this.gamemanager.startgame)
    {
        return;
    }
    
    if(this.gamemanager.lose)
    {
        return;
    }
    
    var pos = this.entity.getPosition();
    var pos1 = this.player.getPosition();
    var y = pc.math.lerp(pos.y,pos1.y+this.cameraoffset.y,this.changespeed*dt);
    var z = pc.math.lerp(pos.z,pos1.z+this.cameraoffset.z,this.changespeed*dt);
    this.entity.setPosition(pos.x,y,z);
};

CameraFollow.prototype.swap = function(old) {
 
};

CameraFollow.prototype.Init = function(){
  
    this.entity.setPosition(this.InitPos.x,this.InitPos.y,this.InitPos.z);
};