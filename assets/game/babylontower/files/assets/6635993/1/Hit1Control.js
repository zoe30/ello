var Hit1Control = pc.createScript('Hit1Control');

// initialize code called once per entity
Hit1Control.prototype.initialize = function() {
    var app = this.app;
    var manager = app.root.findByName('Manager');
    this.gamemanager = manager.script.GameStateManager;
    this.pathmanager = manager.script.PathManager;
    this.player = app.root.findByName('player');
    this.obj = this.entity.findByName('box');   
    this.pt = this.entity.findByName('pt');
    this.active = true;
    this.index = 0;
    this.ZDir = 0;
    this.XDir = 0;
    this.rotX = 0;
    this.rotZ = 0;
    this.X = 0;
    this.Y = 0;
    this.Z = 0;
    this.limitY = 0;
    this.delay = 0;
    this.movespeed = 4.8;
    this.rotatespeed = 1080;
    this.move = false;
    
};

// update code called every frame
Hit1Control.prototype.update = function(dt) {
    
    if(!this.active)
    {
        var num = this.index >= this.pathmanager.playerindex ?(this.index -this.pathmanager.playerindex):(this.pathmanager.count-this.pathmanager.playerindex+this.index);
        if(num < this.delay)
        {
            this.obj.enabled = true;
            this.active = true;
            this.move = true;   
        }
        return;
    }
    
    if(this.move)
    {
        this.rotX += this.XDir*this.rotatespeed*dt;
        this.rotZ += this.ZDir*this.rotatespeed*dt;
        this.Y -= this.movespeed*dt;
        this.entity.setPosition(this.X,this.Y,this.Z);
        this.entity.setEulerAngles(this.rotX,0,this.rotZ);
        
        var dropindex = this.pathmanager.dropindex-1<0?this.pathmanager.count-1:this.pathmanager.dropindex-1;
        if( this.index === dropindex)
        {
            this.limitY = 0.2;
        }
        if(this.Y < this.limitY)
        {
            this.pt.particlesystem.reset();
            this.pt.particlesystem.play();
            this.move = false;
            this.obj.enabled = false;
            return;
        }
        
        var ppos = this.player.getPosition().clone();
        var d = Math.pow(this.X-ppos.x,2)+Math.pow(this.Y-ppos.y,2)+Math.pow(this.Z-ppos.z,2);
        if(d < 0.2)
        {
            this.player.script.PlayerControl.Hit();
            this.move = false;
            this.gamemanager.lose = true;
            this.gamemanager.hitlose = true;
        }
    }
  
};


Hit1Control.prototype.Init = function(){
    this.active = false;
    this.obj.enabled = false;
    this.move = false;
    this.entity.setPosition(this.X,this.Y,this.Z);
    this.rotX = 0;
    this.rotZ = 0;
    this.entity.setEulerAngles(0,0,0);
};

