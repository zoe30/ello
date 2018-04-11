var PlayerControl = pc.createScript('PlayerControl');

// initialize code called once per entity
PlayerControl.prototype.initialize = function() {
    
    var app = this.app;
    var manager = app.root.findByName('Manager');
    this.pathmanager = manager.script.PathManager;
    this.gamemanager = manager.script.GameStateManager;
    var camera = app.root.findByName('Camera');
    this.cameracontrol = camera.script.camera;
    this.body = this.entity.findByName('body');
    this.pt = this.entity.findByName('pt');
    this.initPos = this.entity.getPosition().clone();
    
    this.scale = 0.5;
    this.height = 0.2;
    this.width = 0.5;
    this.everysteprot = 90/12;
    this.rotateoncetime = 150;
    
    this.press = false;
    this.rotatenext = false;
    this.XDir = 0;
    this.YDir = 1;
    this.ZDir = -1;
    
    this.rotX = 0;
    this.rotZ = 0;
    this.stepsindex = 12;
    this.floorindex = 0;
    this.score = 0;
    this.scoreui = document.getElementById('score');
    if(app.touch)
    {
        app.touch.on(pc.EVENT_TOUCHSTART,function(e){
            if(!this.gamemanager.start || this.gamemanager.lose)
            {
                return;
            }
            if(!this.gamemanager.startgame)
            {
                this.gamemanager.startgame = true;
            }

            if(e){
            	e.event.preventDefault();
            }
            this.press = true;
        }.bind(this));
        
        app.touch.on(pc.EVENT_TOUCHEND,function(e){
            if(e.touches.length === 0)
            {
                this.press = false;
            }
        }.bind(this));
        
    }
    else
    {
        app.mouse.on(pc.EVENT_MOUSEDOWN,function(e){
            if(!this.gamemanager.start || this.gamemanager.lose)
            {
                return;
            }
            if(!this.gamemanager.startgame)
            {
                this.gamemanager.startgame = true;
            }

            this.press = true;
        }.bind(this));
        
        app.mouse.on(pc.EVENT_MOUSEUP,function(e){

            this.press = false;

        }.bind(this));
    }
    
    app.mouse.disableContextMenu();
    
};

PlayerControl.prototype.update = function(dt) {
    
    TWEEN.update();
    if(!this.gamemanager.start || !this.gamemanager.startgame)
    {
        return;
    }
    
    if(this.gamemanager.lose)
    {
        if(this.gamemanager.droplose)
        {
            this.entity.translate(0,-5*dt,0);
            if(this.entity.getPosition().y<0.25)
            {
                this.gamemanager.droplose = false;
                this.Hit();
            }
        }
        return;
    }
    
    this.Move();
};

PlayerControl.prototype.Move = function(){
    
    if(!this.rotatenext  && this.press)
    {
        this.stepsindex--;
        if(this.stepsindex === 0)
        {
            this.YDir = 0;
        }
        this.rotatenext = true;
        this.rotX = this.rotX%360;
        this.rotZ = this.rotZ%360;
        var pos = this.entity.getPosition().clone();
        var self = this;
        var tween = new TWEEN.Tween({rotX:this.rotX,rotZ:this.rotZ,x:pos.x,z:pos.z,y:pos.y})
                    .to({rotX:this.rotX+this.ZDir*90,rotZ:this.rotZ-this.XDir*90,x:pos.x+this.XDir*this.width,z:pos.z+this.ZDir*this.width,y:pos.y+ this.YDir*this.height},this.rotateoncetime)
                    .onUpdate(function(){
                        self.rotX = this.rotX;
                        self.rotZ = this.rotZ;
                        self.body.setEulerAngles(self.rotX,0,self.rotZ);
                        self.entity.setPosition(this.x,this.y,this.z);
                    })
                    .onComplete(function(){
                        if(self.stepsindex === 0)
                        {
                            self.floorindex++;
                            self.floorindex = self.floorindex ===4?0:self.floorindex;
                            switch(self.floorindex)
                            {
                                case 0:
                                    self.XDir = 0;
                                    self.ZDir = -1;
                                    break;
                                case 1:
                                    self.XDir = -1;
                                    self.ZDir = 0;
                                    break;
                                case 2:
                                    self.XDir = 0;
                                    self.ZDir = 1;
                                    break;
                                case 3:
                                    self.XDir = 1;
                                    self.ZDir = 0;
                                    break;
                                default:
                                    break;
                            }
                            self.YDir = 1;
                            self.stepsindex = 12;
                            
                        }
                        else
                        {
                            self.cameracontrol.targetheight += self.height;
                            self.pathmanager.AddStep();
                        }
                        self.rotatenext = false;
                        self.cameracontrol.targetrotY += self.everysteprot;
                        self.score ++;
                        if(self.score%50 === 0)
                        {
                            self.pathmanager.droptime = self.pathmanager.droptime >0.26 ? self.pathmanager.droptime-0.05:0.25;
                        }
                        self.scoreui.innerHTML = self.score.toString();
                    });
        tween.start();
    }
    
    
};

PlayerControl.prototype.Hit = function(){
    
    this.PlaySound('lose');
    this.body.enabled = false;
    this.pt.particlesystem.reset();
    this.pt.particlesystem.play();
};

PlayerControl.prototype.PlaySound = function(name){
    
    this.entity.sound.slot(name).play();
};

PlayerControl.prototype.Init = function(){
    this.press = false;
    this.rotatenext = false;
    this.XDir = 0;
    this.YDir = 1;
    this.ZDir = -1;
    
    this.rotX = 0;
    this.rotZ = 0;
    this.stepsindex = 12;
    this.floorindex = 0;
    this.body.enabled = true;
    this.entity.setPosition(this.initPos.x,this.initPos.y,this.initPos.z);
    this.body.setEulerAngles(0,0,0);
    this.score = 0;
};