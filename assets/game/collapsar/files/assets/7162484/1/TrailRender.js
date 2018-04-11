 var TrailRender = pc.createScript('TrailRender');

// initialize code called once per entity
TrailRender.prototype.initialize = function() {
   
    var app = this.app;
    var manager = app.root.findByName('Manager');
    this.gamemanager = manager.script.GameStateManager;
    this.player = app.root.findByName('player');
    this.scale = 0.5;
    this.delay = 0.08;
    this.trails = [];
    this.count = 8;
    
    this.index = 0;
    this.timer = 0;
    var obj = this.entity.children[0];
    obj.setLocalScale(0.001,0.001,0.001);
    this.trails.push(obj);
    for(var i =0;i<this.count;i++)
    {
        var clone = obj.clone();
        this.entity.addChild(clone);
        clone.setLocalScale(0.001,0.001,0.001);
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


TrailRender.prototype.SetTrail = function(){
  
    var pos = this.player.getPosition();
    var eulerz = this.player.getEulerAngles().z;
    this.trails[this.index].setLocalScale(this.scale,this.scale,this.scale);
    this.trails[this.index].setPosition(pos.x,pos.y,0);
    this.trails[this.index].setEulerAngles(90,0,eulerz);
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
        this.trails[i].setLocalScale(0.001,0.001,0.001);
    }
};