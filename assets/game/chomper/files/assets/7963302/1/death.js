var Death = pc.createScript('death');

// initialize code called once per entity
Death.prototype.initialize = function() {
    this.canPlay=false;
    this.timer=0;
};

// update code called every frame
Death.prototype.update = function(dt) {
    if(this.canPlay){
        this.entity.enabled=true;
        console.log("yuyu");
        if(this.timer<0.1){
            
        }else{
            this.canPlay=false;
            this.timer=0;
            this.entity.enabled=false;
        }
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// Death.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/