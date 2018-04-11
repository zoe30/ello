var TrailRender = pc.createScript('TrailRender');

// initialize code called once per entity
TrailRender.prototype.initialize = function() {
   
    var app = this.app;
    var manager = app.root.findByName('Manager');
    this.gamemanager = manager.script.GameStateManager; 
    this.player = app.root.findByName('player');
    this.scale = 0.3;
    this.delay = 0.1;
    this.trails = [];
    this.count = 15;
    
    this.index = 0;
    this.timer = 0;
    var obj = this.entity.children[0];
    obj.setLocalScale(0,0,0);
    this.trails.push(obj);
    for(var i =0;i<this.count;i++)
    {
        var clone = obj.clone();
        this.entity.addChild(clone);
        clone.setLocalScale(0,0,0);
        this.trails.push(clone);
    }
    
};

// update code called every frame
TrailRender.prototype.update = function(dt) {
    if(!this.gamemanager.start || !this.gamemanager.startgame)
    {
        return;
    }
    if(this.gamemanager.lose)
    {
        return;
    }
    this.timer += dt;
    if(this.timer > this.delay)
    {
        this.timer = 0;
        this.SetTrail();
    }

};

// swap method called for script hot-reloading
// inherit your script state here
TrailRender.prototype.swap = function(old) {
    
};

TrailRender.prototype.SetTrail = function(){
  
    
    var pos = this.player.getPosition();
    var eulerY = this.player.getEulerAngles().y;
    this.trails[this.index].setLocalScale(this.scale,this.scale,this.scale);
    this.trails[this.index].setPosition(pos.x,0.01,pos.z);
    this.trails[this.index].setEulerAngles(0,eulerY+45,0);
    this.trails[this.index].script.SingleTrail.Init();
    this.index ++;
    if(this.index > this.count)
    {
        this.index = 0;
    }
};

TrailRender.prototype.Init = function(){
    this.index = 0;
    this.timer = 0;
    for(var i =0;i<this.count+1;i++)
    {
        this.trails[i].setLocalScale(0,0,0);
    }
};