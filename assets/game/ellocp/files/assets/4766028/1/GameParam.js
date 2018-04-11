var GameParam = pc.createScript('GameParam');

GameParam.prototype.initialize = function() 
{
    var app = this.app;
    
    var playerscalepercent = 1/10;
    var boundscalepercent = 1/25;
   
    var curcamera = app.root.findByName('Camera');
    var screenfov = window.innerWidth/window.innerHeight;
    var cameraeulerangle = curcamera.getEulerAngles();
    var camerapos = curcamera.getPosition();
    var cameraangleX = cameraeulerangle.x*pc.math.DEG_TO_RAD;
    var cameraangleZ = cameraeulerangle.z*pc.math.DEG_TO_RAD;
    var cameraheight = 5;
    var yscale = 100;
    
    
    this.worldheight = curcamera.camera.orthoHeight * 2;
    this.worldwidth = this.worldheight*screenfov/Math.cos(cameraangleZ);

    this.playerscale = this.worldwidth*playerscalepercent;
    this.boundscale = this.worldwidth*boundscalepercent;
    
    this.lrboundposx = this.worldwidth/2 - this.boundscale/2;
    
    this.lrupboundscalex = this.worldwidth/2-this.boundscale*2;
    this.lrupboundposx = this.lrupboundscalex/2 + this.boundscale;
    this.lrupboundposz = -this.worldheight/2-0.1;
    
    
    this.cameraposX = -cameraheight*Math.sin(cameraangleZ); 
     
    curcamera.setPosition(this.cameraposX,camerapos.y,camerapos.z);
    
    var lupbound = app.root.findByName('lupbound');
    var rupbound = app.root.findByName('rupbound');
    lupbound.setPosition(-this.lrupboundposx,0,this.lrupboundposz);
    rupbound.setPosition(this.lrupboundposx,0,this.lrupboundposz);
    
    var lrenderupbound = lupbound.findByName('lupBound');
    var logo = lupbound.findByName('logo');
    lrenderupbound.setLocalScale(this.lrupboundscalex,yscale,this.boundscale*2);
    logo.setLocalPosition(-(this.lrupboundscalex+this.boundscale-1.07)+this.lrupboundposx,5.01,0.25);                             
    
    var rrenderupbound = rupbound.findByName('rupBound');
    rrenderupbound.setLocalScale(this.lrupboundscalex,yscale,this.boundscale*2);
    
    
    var leftbound = app.root.findByName('leftBound');
    var rightbound = app.root.findByName('rightBound');
    leftbound.setPosition(-this.lrboundposx,0,0);
    rightbound.setPosition(this.lrboundposx,0,0);
    
    
    var lrenderbound = leftbound.findByName('lbound');
    lrenderbound.setLocalScale(this.boundscale,yscale,18);

    var rrenderbound = rightbound.findByName('rbound');
    rrenderbound.setLocalScale(this.boundscale,yscale,18);
    
    var mleftbound = app.root.findByName('mleftBound');
    var mrightbound = app.root.findByName('mrightBound');
    mleftbound.setPosition(-this.boundscale/2,0,0);
    mrightbound.setPosition(this.boundscale/2,0,0);

    var mlrenderbound = mleftbound.findByName('mlbound');  
    mlrenderbound.setLocalScale(this.boundscale,yscale,18);                            
    
    var mrrenderbound = mrightbound.findByName('mrbound');
    mrrenderbound.setLocalScale(this.boundscale,yscale,18);
   
    
    var lefteye = app.root.findByName('lefteye');
    var righteye= app.root.findByName('righteye');
    lefteye.setPosition(-this.boundscale-this.playerscale/2,0,-2);
    righteye.setPosition(this.boundscale+this.playerscale/2,0,-2);
    
    
    var lrendereye = lefteye.findByName('leye');
    var leye = lefteye.findByName('left');
    lrendereye.setLocalScale(this.playerscale,yscale,this.playerscale);                            
    leye.setLocalScale(this.playerscale,1,this.playerscale);
        
    var rrendereye = righteye.findByName('reye');
    var reye = righteye.findByName('right');
    rrendereye.setLocalScale(this.playerscale,yscale,this.playerscale);
    reye.setLocalScale(this.playerscale,1,this.playerscale);
    
    this.lefteyeInitPos = new pc.Vec3(-this.boundscale-this.playerscale/2,0,-2);
    this.righteyeInitPos = new pc.Vec3(this.boundscale+this.playerscale/2,0,-2);


};


GameParam.prototype.update = function(dt) {
    
};


GameParam.prototype.swap = function(old) {
    
};

