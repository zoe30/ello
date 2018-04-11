var AnimationControl = pc.createScript('AnimationControl');
AnimationControl.attributes.add('animspeed',{type:'number'});
// initialize code called once per entity
AnimationControl.prototype.initialize = function() {
    var app = this.app;
    var manager = app.root.findByName('Manager');
    this.gamemanger = manager.script.GameStateManager;
    this.animduration = this.entity.animation.getAnimation("SimpleCitizens.json").duration;
    this.walkstart = 52/320*this.animduration;
    this.walkend = 78/320*this.animduration;
    this.timer = 52/320*this.animduration;
    this.entity.animation.play("SimpleCitizens.json");
    
};

// update code called every frame
AnimationControl.prototype.update = function(dt) {
    
    if(!this.gamemanger.start || !this.gamemanger.startgame)
    {
        this.timer = this.walkstart;
        this.entity.animation.currentTime = this.timer;
        return;
    }
    if(this.gamemanger.lose)
    {
        this.timer = this.walkstart;
        this.entity.animation.currentTime = this.timer;
        return;
    }
    
    this.WalkAnim(dt);
};

// swap method called for script hot-reloading
// inherit your script state here
AnimationControl.prototype.swap = function(old) {
    
};

AnimationControl.prototype.WalkAnim = function(dt)
{
    this.timer += dt*this.animspeed;
    if(this.timer >= this.walkend)
    {
        this.timer = this.walkstart;
    }
    this.entity.animation.currentTime = this.timer;
};
