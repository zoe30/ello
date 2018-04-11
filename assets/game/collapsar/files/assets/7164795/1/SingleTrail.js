var SingleTrail = pc.createScript('SingleTrail');

// initialize code called once per entity
SingleTrail.prototype.initialize = function() {
    
    this.animtimer = 0;
    this.AnimTime = 0.6;
    this.canAnim  = false;
    this.scale = 0.5;
    
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
            var scale = 0.001+this.scale*(this.AnimTime-this.animtimer)/this.AnimTime;
            this.entity.setLocalScale(scale,scale,scale);
        }
    }
    
};

SingleTrail.prototype.Init = function(){
    
    this.canAnim = true;
    this.animtimer = 0;

};