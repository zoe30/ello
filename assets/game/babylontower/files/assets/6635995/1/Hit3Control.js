var Hit3Control = pc.createScript('Hit3Control');

// initialize code called once per entity
Hit3Control.prototype.initialize = function() {
    var app = this.app;
    var manager = app.root.findByName('Manager');
    this.gamemanager = manager.script.GameStateManager;
    this.pathmanager = manager.script.PathManager;
    this.player = app.root.findByName('player');
    this.moveobj = this.entity.children[0];    
    
    this.index = 0;
    
    this.state = {idle:0,showanim:1,hideanim:2};
    this.curstate = this.state.idle;
    this.active = false;
    this.delay = 1;
    this.movespeed = 4;
    this.maxX = 0;
    this.minX = -0.9;
    this.localX = -0.9;
};

// update code called every frame
Hit3Control.prototype.update = function(dt) {
    
    if(!this.active)
    {
        return;
    }
    

    switch(this.curstate)
    {
        case 0:
            this.delay -= dt;
            if(this.delay < 0)
            {
                this.curstate = this.state.showanim;
                this.delay = 1;
            }
            break;
        case 1:
            this.localX += this.movespeed*dt;
            if(this.localX > this.maxX)
            {
                this.curstate = this.state.hideanim;
                this.localX = this.maxX;
            }
            this.moveobj.setLocalPosition(this.localX,0,0);
            
            break;
        case 2:
            this.localX -= this.movespeed*dt;
            if(this.localX < this.minX)
            {
                this.curstate = this.state.idle;
                this.localX = this.minX;
            }
            this.moveobj.setLocalPosition(this.localX,0,0);
            
            break;
        default:
            break;
    }
        var dropindex = this.pathmanager.dropindex-1<0?this.pathmanager.count-1:this.pathmanager.dropindex-1;
        if( this.index === dropindex)
        {
           this.active = false;
           return; 
        }
        var mpos = this.moveobj.getPosition().clone();
        var ppos = this.player.getPosition().clone();
        if( Math.abs(mpos.y-ppos.y) <=0.2 && Math.abs(mpos.x-ppos.x)+Math.abs(mpos.z-ppos.z)<0.7)
        {
            this.player.script.PlayerControl.Hit();
            this.active = false;
            this.gamemanager.lose = true;
            this.gamemanager.hitlose = true;
        }
    
  
};


Hit3Control.prototype.Init = function(){
    
    this.active = true;
    this.curstate = this.state.idle;
    this.localX = -0.9;
    this.moveobj.setLocalPosition(-0.9,0,0);
};
