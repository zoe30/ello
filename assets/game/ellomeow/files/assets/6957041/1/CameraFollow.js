var CameraFollow = pc.createScript('CameraFollow');

CameraFollow.prototype.initialize = function() {
    
    var app = this.app;
    var manager = app.root.findByName('Manager');
    this.gamemanager = manager.script.GameStateManager;
    
    this.initPos = this.entity.getPosition().clone();
    this.Y = this.initPos.y;
    this.X = this.initPos.x;
    this.Z = this.initPos.z;
    this.changespeed = 10;
    
};

// update code called every frame
CameraFollow.prototype.update = function(dt) {
    
    if(this.gamemanager.lose || !this.gamemanager.start || !this.gamemanager.startgame)
    {
        return;
    }
    
};
CameraFollow.prototype.Move = function(){
    this.entity.setPosition(this.X,this.Y,this.Z);
};

CameraFollow.prototype.Init = function(){

    this.X = this.initPos.x;
    this.Z = this.initPos.z;
    this.entity.setPosition(this.initPos.x,this.initPos.y,this.initPos.z);  
};