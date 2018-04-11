var BoundManager = pc.createScript('BoundManager');

// initialize code called once per entity
BoundManager.prototype.initialize = function() {
    var app = this.app;
    this.curcamera = app.root.findByName('Camera');
    var zoffset = 2;
    var xoffset = 0.5;
    var theta = Math.abs(this.curcamera.getEulerAngles().x);
    var height = this.curcamera.getPosition().y;
    var camerazoffset = height/Math.tan(theta*pc.math.DEG_TO_RAD);
    var HalfBoundHeight = this.curcamera.camera.orthoHeight/Math.sin(theta*pc.math.DEG_TO_RAD);
    var screenheight = window.innerHeight;
    var screenwidth = window.innerWidth;
    this.UpBound = -HalfBoundHeight - zoffset;
    this.DownBound = HalfBoundHeight +zoffset;
    var HalfBoundWidth = this.curcamera.camera.orthoHeight*screenwidth/screenheight;
    this.LeftBound = -HalfBoundWidth-xoffset;
    this.RightBound = HalfBoundWidth+xoffset;
    this.curcamera.setPosition(0,height,camerazoffset);
    console.log("LeftBound:"+this.LeftBound);
    console.log("RightBound:"+this.RightBound);
    console.log("UpBound:"+this.UpBound);
    console.log("DownBound:"+this.DownBound);
    
    
    
};

// update code called every frame
BoundManager.prototype.update = function(dt) {
    
};

// swap method called for script hot-reloading
// inherit your script state here
BoundManager.prototype.swap = function(old) {
    
};

