var Enemy4 = pc.createScript('Enemy4');

// initialize code called once per entity
Enemy4.prototype.initialize = function() {
    var app = this.app;
    var manager = app.root.findByName('Manager');
    this.gamemanager = manager.script.GameStateManager;
    this.boundmanager = manager.script.BoundManager;
    this.MoveSpeed = 2;
    this.changespeed = 360;
    
    this.changetimer = 0;
    this.RotateTime = pc.math.random(0.2,0.7);
    this.ChangeTime = pc.math.random(2,4);
    this.dir = pc.math.random(0,1) >0.5?-1:1;
    this.delay = 1;
    this.eulerY =0;
    this.X = 0;
    this.Y = 0;
    this.Z = this.boundmanager.UpBound;
    this.canMove = false;
    
    
    
};

// update code called every frame
Enemy4.prototype.update = function(dt) {
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
    else
    {
        this.delay -= dt;
        if(this.delay <0)
        {
            this.canMove = true;
        }
    }
};

// swap method called for script hot-reloading
// inherit your script state here
Enemy4.prototype.swap = function(old) {
    
};

Enemy4.prototype.Move = function(dt){
    
    this.changetimer += dt;
    if(this.changetimer > this.ChangeTime)
    { 
        if(this.changetimer < this.ChangeTime+this.RotateTime)
        {
            this.eulerY += this.dir*this.changespeed*dt;
        }
        else
        {
            this.changetimer = 0;
            this.dir = pc.math.random(0,1) >0.5?-1:1;
            this.RotateTime = pc.math.random(0.2,0.7);
            this.ChangeTime = pc.math.random(2,4);
        }
        
    }
        
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
    this.entity.setPosition(this.X,this.Y,this.Z);
    this.entity.setEulerAngles(0,this.eulerY,0);
};
Enemy4.prototype.Init = function(){
    this.changetimer = 0;
    this.RotateTime = pc.math.random(0.2,0.7);
    this.ChangeTime = pc.math.random(2,4);
    this.dir = pc.math.random(0,1) >0.5?-1:1;
    this.delay = 1;
    this.eulerY =0;
    this.X = 0;
    this.Y = 0;
    this.Z = this.boundmanager.UpBound;
    this.MoveSpeed = 2;
    this.canMove = false;
    this.entity.setPosition(-30,0,0);
};


