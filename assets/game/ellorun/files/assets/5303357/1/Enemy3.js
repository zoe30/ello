var Enemy3 = pc.createScript('Enemy3');

// initialize code called once per entity
Enemy3.prototype.initialize = function() {
   var app = this.app;

    var manager = app.root.findByName('Manager');
    this.player = app.root.findByName('player');
    this.gamemanager = manager.script.GameStateManager;
    this.boundmanager = manager.script.BoundManager;
    this.MoveSpeed = 2; 
    this.eulerY = 210;
    this.X = this.boundmanager.RightBound;
    this.Y = 0;
    this.Z = -2;
    this.canMove = false;
    
};

// update code called every frame
Enemy3.prototype.update = function(dt) {
     if(!this.gamemanager.start || !this.gamemanager.startgame)
    {
        return;
    }
    if(this.gamemanager.lose)
    {
        return;
    }
    if(!this.gamemanager.eatfirst)
    {
        return;
    }
    
    
    if(this.canMove)
    {
        this.Move(dt);
    }
    
};

// swap method called for script hot-reloading
// inherit your script state here
Enemy3.prototype.swap = function(old) {
    
};

Enemy3.prototype.Move = function(dt){
        
    var dir = this.entity.forward;
    this.X += dir.x*this.MoveSpeed*dt;
    this.Z += dir.z*this.MoveSpeed*dt;
    if(this.X < this.boundmanager.LeftBound)
    {
        this.X = this.boundmanager.RightBound;
    }
    if(this.X > this.boundmanager.RightBound)
    {
        this.X = this.boundmanager.LeftBound;
    }
    
    if(this.Z > this.boundmanager.DownBound)
    {
        this.Z = this.boundmanager.UpBound;
    }
    if(this.Z < this.boundmanager.UpBound)
    {
        this.Z = this.boundmanager.DownBound;
    }
    var pos = this.player.getPosition();
    var pos2 = this.entity.getPosition();
    var dir1 = new pc.Vec3(pos.x-pos2.x,0,pos.z-pos2.z).normalize();
    var cos = dir1.dot(dir);
    cos = pc.math.clamp(cos,-1,1);
    var angle = Math.acos(cos)*pc.math.RAD_TO_DEG;
    this.eulerY = pc.math.lerp(this.eulerY,this.eulerY+angle,dt*3);
    this.entity.setPosition(this.X,this.Y,this.Z);
    this.entity.setEulerAngles(0,this.eulerY,0);
     
};
Enemy3.prototype.Init = function(){
    
    this.eulerY = 210;
    this.X = this.boundmanager.RightBound;
    this.Y = 0;
    this.Z = -2;
    this.MoveSpeed = 2;
    this.canMove = false;
    this.entity.setPosition(-30,0,0);
    this.entity.setEulerAngles(0,this.eulerY,0);
};


