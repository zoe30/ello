var Hit2Control = pc.createScript('Hit2Control');

// initialize code called once per entity
Hit2Control.prototype.initialize = function() {
    var app = this.app;
    var manager = app.root.findByName('Manager');
    this.gamemanager = manager.script.GameStateManager;
    this.pathmanager = manager.script.PathManager;
    this.player = app.root.findByName('player');
    this.moveobj = this.entity.findByName('movebox');    
    
    this.index = 0;
    
    this.state = {idle:0,downanim:1,upanim:2};
    this.curstate = this.state.idle;
    this.active = false;
    this.delay = 1;
    this.movespeed = 4;
    this.maxY = 0.7;
    this.minY = -0.75;
    this.localY = 0.7;
};

// update code called every frame
Hit2Control.prototype.update = function(dt) {
    
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
                this.curstate = this.state.downanim;
                this.delay = 1;
            }
            break;
        case 1:
            this.localY -= this.movespeed*dt;
            if(this.localY < this.minY)
            {
                this.localY = this.minY;
                this.curstate = this.state.upanim;
            }
            this.moveobj.setLocalPosition(0,this.localY,0);
            break;
        case 2:
            this.localY += this.movespeed*dt;
            if(this.localY>this.maxY)
            {
                this.localY = this.maxY;
                this.curstate = this.state.idle;
            }
            this.moveobj.setLocalPosition(0,this.localY,0);
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
        var d = Math.pow(mpos.x-ppos.x,2)+Math.pow(mpos.y-ppos.y,2)+Math.pow(mpos.z-ppos.z,2);
        if(d < 0.25)
        {
            this.player.script.PlayerControl.Hit();
            this.active = false;
            this.gamemanager.lose = true;
            this.gamemanager.hitlose = true;
        }
    
  
};


Hit2Control.prototype.Init = function(){
    
    this.active = true;
    this.curstate = this.state.idle;
    this.localY = 0.7;
    this.moveobj.setLocalPosition(0,0.7,0);
};
