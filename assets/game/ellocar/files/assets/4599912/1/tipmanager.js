var Tipmanager = pc.createScript('tipmanager');

// initialize code called once per entity
Tipmanager.prototype.initialize = function() {
    
};

// update code called every frame
Tipmanager.prototype.update = function(dt) {
    this.entity.rotateLocal(0,2,0);
};

// swap method called for script hot-reloading
// inherit your script state here
Tipmanager.prototype.swap = function(old) {
    
};

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/