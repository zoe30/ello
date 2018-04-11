var Bgmcontrol = pc.createScript('bgmcontrol');

// initialize code called once per entity
Bgmcontrol.prototype.initialize = function() {
  
    this.playtimer = 0
    this.bgm0length = 31.1;
    this.bgm1length = 58.07;
    
    this.firstbgm = pc.math.random(0,1)>0.5;
    this.bgmlength = this.firstbgm?this.bgm0length:this.bgm1length;
    if(this.firstbgm)
    {
        this.entity.sound.slot('bgm').play();
    }
    else
    {
        this.entity.sound.slot('bgm1').play();
    }
};

// update code called every frame
Bgmcontrol.prototype.update = function(dt) {
    
    this.playtimer += dt;
    if(this.playtimer > this.bgmlength)
    {
        console.log(this.firstbgm);
        this.playtimer = 0;
        if(this.firstbgm)
        {
            this.entity.sound.slot('bgm').play();
        }
        else
        {
            this.entity.sound.slot('bgm1').play();
        }
    }
    
};

// swap method called for script hot-reloading
// inherit your script state here
Bgmcontrol.prototype.swap = function(old) {
    
};

Bgmcontrol.prototype.Init = function(){
     this.firstbgm = !this.firstbgm;
     this.bgmlength = this.firstbgm?this.bgm0length:this.bgm1length;
     this.playtimer = 0;
     if(this.firstbgm)
     {
        this.entity.sound.slot('bgm').play();
        this.entity.sound.slot('bgm1').stop();
     }
     else
     {
        this.entity.sound.slot('bgm1').play();
        this.entity.sound.slot('bgm').stop();
     }
    
};
// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/