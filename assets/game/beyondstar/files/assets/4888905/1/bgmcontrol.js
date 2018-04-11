var Bgmcontrol = pc.createScript('bgmcontrol');

// initialize code called once per entity
Bgmcontrol.prototype.initialize = function() {
  
    this.playtimer = 0

    this.bgmlength = this.entity.sound.slot('bgm1').duration;
    
    this.entity.sound.slot('bgm1').play();

    
};

// update code called every frame
Bgmcontrol.prototype.update = function(dt) {
    
    this.playtimer += dt;
    if(this.playtimer > this.bgmlength)
    {
        
        this.playtimer = 0;

        this.entity.sound.slot('bgm1').play();


    }
    
};

// swap method called for script hot-reloading
// inherit your script state here
Bgmcontrol.prototype.swap = function(old) {
    
};


// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/