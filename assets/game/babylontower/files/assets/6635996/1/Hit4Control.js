var Hit4Control = pc.createScript('Hit4Control');

// initialize code called once per entity
Hit4Control.prototype.initialize = function() {
    var app = this.app;
    var manager = app.root.findByName('Manager');
    this.gamemanager = manager.script.GameStateManager;
    this.pathmanager = manager.script.PathManager;
    this.player = app.root.findByName('player');
    this.moveobj = this.entity.children[0];    
    
    this.index = 0;
    
    this.state = {downanim:0,upanim:1};
    this.curstate = this.state.downanim;
    this.active = false;
    this.gravity = 20;
    this.movespeed = 0;
    this.maxY = 2.5;
    this.minY = 0;
    this.localY = 2.5;
    this.candrop = false;
};

// update code called every frame
Hit4Control.prototype.update = function(dt) {
    
    if(!this.active)
    {
        return;
    }
    
    var mpos = this.moveobj.getPosition().clone();
    var ppos = this.player.getPosition().clone();
    switch(this.curstate)
    {

        case 0:
            this.movespeed += this.gravity*dt;
            this.localY -= this.movespeed*dt;
            if(this.candrop)
            {
                this.moveobj.setLocalPosition(0,this.localY,0);
                if(this.localY < -5)
                {
                    this.active = false;
                    this.moveobj.enabled = false;
                }   
                return;
            }
            else
            {
                if(this.localY <= this.minY)
                {   
                    this.localY = this.minY;
                    this.movespeed = 11;
                    this.curstate = this.state.upanim;
                }
                this.moveobj.setLocalPosition(0,this.localY,0);
            }

            
            break;
        case 1:
            this.movespeed -= this.gravity*dt;
            this.localY += this.movespeed*dt;
            this.moveobj.setLocalPosition(0,this.localY,0);
            if(this.movespeed <= 0)
            {
                this.movespeed = 0;
                this.curstate = this.state.downanim;
            }
            break;
        default:
            break;
    }
        var dropindex = this.pathmanager.dropindex-1<0?this.pathmanager.count-1:this.pathmanager.dropindex-1;
        if( this.index === dropindex)
        {
           this.candrop = true;
        }
        
        var d = Math.pow(mpos.x-ppos.x,2)+Math.pow(mpos.y-ppos.y,2)+Math.pow(mpos.z-ppos.z,2);
        if(d < 0.31)
        {
            this.player.script.PlayerControl.Hit();
            this.active = false;
            this.gamemanager.lose = true;
            this.gamemanager.hitlose = true;
        }
    
  
};


Hit4Control.prototype.Init = function(){
    
    this.active = true;
    this.moveobj.enabled = true;
    this.curstate = this.state.downanim;
    this.localY = 2.5;
    this.movespeed = 0;
    this.moveobj.setLocalPosition(0,2.5,0);
    this.candrop = false;
};
