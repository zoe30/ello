var Camera = pc.createScript('camera');

Camera.attributes.add('rotX',{type:'number',default:-20});
Camera.attributes.add('height',{type:'number'});
Camera.attributes.add('distance',{type:'number',default:20});

Camera.prototype.initialize = function() {
    
    var app = this.app;
    var manager = app.root.findByName('Manager');
    this.gamemanager = manager.script.GameStateManager;
    this.rotY = 45;
    this.targetrotY = 45;
    this.targetheight = 0;
    this.rotatespeed = 5;
    this.entity.setEulerAngles(this.rotX,this.rotY,0);
    this.entity.setPosition(0,this.height,0);
    this.entity.translateLocal(0,0,this.distance);
    
};

Camera.prototype.update = function(dt) {
    
    if(!this.gamemanager.start || !this.gamemanager.startgame)
    {
        return;
    }
    if(this.gamemanager.lose)
    {
        return;
    }
    this.rotY = pc.math.lerp(this.rotY,this.targetrotY,this.rotatespeed*dt);
    this.height = pc.math.lerp(this.height,this.targetheight,this.rotatespeed*dt);
    this.entity.setEulerAngles(this.rotX,this.rotY,0);
    this.entity.setPosition(0,this.height,0);
    this.entity.translateLocal(0,0,this.distance);
       
};

Camera.prototype.Init = function(){
    this.rotY = 45;
    this.targetrotY = 45;
    this.height = 0;
    this.targetheight = 0;
    this.entity.setEulerAngles(this.rotX,this.rotY,0);
    this.entity.setPosition(0,this.height,0);
    this.entity.translateLocal(0,0,this.distance);
};