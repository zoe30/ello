var SingleTrail = pc.createScript('SingleTrail');

// initialize code called once per entity
SingleTrail.prototype.initialize = function() {
    
    this.animtimer = 0;
    this.AnimTime = 1.5;
    this.canAnim  = false;
    this.scale = 0.25;
    
};

// update code called every frame
SingleTrail.prototype.update = function(dt) {
    
    if(this.canAnim)
    {
        this.animtimer += dt;
        if(this.animtimer > this.AnimTime)
        {
            this.canAnim = false;
        }
        else
        {
            var scale = this.scale*(this.AnimTime-this.animtimer)/this.AnimTime;
            this.entity.setLocalScale(scale,scale,scale);
        }
    }
    
};

// swap method called for script hot-reloading
// inherit your script state here
SingleTrail.prototype.swap = function(old) {
    
};

SingleTrail.prototype.Init = function(){
    
    this.canAnim = true;
    this.animtimer = 0;

};