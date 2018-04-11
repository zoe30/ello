var PlayerControl = pc.createScript('PlayerControl');
PlayerControl.attributes.add('playerrtex',{type:'asset'});
PlayerControl.attributes.add('playerltex',{type:'asset'});
// initialize code called once per entity
PlayerControl.prototype.initialize = function() {
    var app = this.app;
    this.tips = app.root.findByName('tips');
    this.tips.enabled = false;
    
    this.PlayerLTex = app.assets.get(this.playerltex.id).resource;
    this.PlayerRTex = app.assets.get(this.playerrtex.id).resource;
    this.body = this.entity.findByName('body');
    this.bodymat = this.body.model.model.meshInstances[0].material;
    this.bodymat.emissiveMap = this.PlayerRTex;
    this.bodymat.opacityMap = this.PlayerRTex;
    this.bodymat.update();
    this.runpt = this.entity.findByName('runpt');
    this.runpt.enabled = false;
    this.shadow = this.entity.findByName('shadow');
    var manager = app.root.findByName('Manager');
    this.gamemanager = manager.script.GameStateManager;
    this.pathmananger = manager.script.PathManager;
    this.camerafollow = app.root.findByName('Camera').script.CameraFollow;
    this.initPos = this.entity.getPosition().clone();    
    this.X = this.initPos.x;
    this.Y = this.initPos.y;
    this.Z = this.initPos.z;

    this.scoreui = document.getElementById('score');
    this.score = 0;
    
    this.movetime = 250;
    this.length = 2;
    
    this.movexdir = true;
    
    this.trigger = false;
    this.triggerdis = 20;
    
    this.dir = 0;
    this.lr = false;
    this.movebox = false;
    this.moving = false;
    
    var options = {
        recognizers:[
            [Hammer.Pan], 
            [Hammer.Tap]
        ]
    };
    var hammer = new Hammer(app.graphicsDevice.canvas,options);
    var startX,startY;
    hammer.on('panstart',function(e){
        if(!this.gamemanager.start || this.gamemanager.lose || !this.gamemanager.startgame)
        {
            return;
        }
        if(e){
        	e.preventDefault();
        }

        startX = e.center.x;
        startY = e.center.y;
        
    }.bind(this));
    hammer.on('panend',function(e){
        
        this.trigger = false;
    
    }.bind(this));
    hammer.on('pan',function(e){
        if(!this.gamemanager.start || this.gamemanager.lose || !this.gamemanager.startgame)
        {
            return;
        }        
        if(this.trigger)
        {
            return;
        }
        
        var dx = e.center.x - startX;
        var dy = e.center.y - startY;
        var dir = 0;
        if(Math.abs(dy) > this.triggerdis)
        {
            
            this.dir = dy > 0? 1:-1;
            this.trigger = true;
            this.movebox = true;
            this.lr = false;
        }
        else
        {
            if(Math.abs(dx) > this.triggerdis)
            {
                this.dir = dx < 0?-1:1;
                this.lr = true;
                this.trigger = true;
                this.movebox = true;
            }    
        }
        
    }.bind(this));
    hammer.on('tap',function(e){
        if(!this.gamemanager.start || this.gamemanager.lose || this.gamemanager.startgame)
        {
            return;
        }
        
        this.CheckMove();
    }.bind(this));
    
    
    
};

// update code called every frame
PlayerControl.prototype.update = function(dt) {
    
    TWEEN.update();
    
    if(!this.gamemanager.start || !this.gamemanager.startgame)
    {
            return;
    }
    if(this.gamemanager.lose)
    {
        if(this.Y > -10)
        {
            if(this.movexdir)
            {
                this.X += 8*dt;
            }
            else
            {
                this.Z += 8*dt;
            }
            
            this.Y -= 16*dt;
            this.entity.setPosition(this.X,this.Y,this.Z);
        }
        
        
        return;
    }
    if(this.movebox)
    {
         this.movebox = false;
         this.pathmananger.MoveBox(this.dir,this.lr);   
    }
    
    this.Move();
    
    
};

PlayerControl.prototype.Move = function(){
    this.entity.setPosition(this.X,this.Y,this.Z);
    this.camerafollow.Move();
    if(!this.moving)
    {
        this.CheckMove();
    }
};

PlayerControl.prototype.CheckMove = function(){
 
    this.moving = true;
    var state = this.pathmananger.Check();
    var tween=null,tween1=null,tween2=null;
    var nextx = this.X,nextz=this.Z,nextcamerax=this.camerafollow.X,nextcameraz=this.camerafollow.Z;
    var self = this;
    switch(state)
    {
        case -1:
            this.runpt.enabled   = false;
            this.shadow.enabled = false;
            this.gamemanager.lose = true;
            this.PlaySound('lose');
            break;
        case 0: 
            if(self.movexdir)
            {
                nextx += 0.25*this.length;
                nextcamerax += 0.25*this.length*0.5;
                nextcameraz += 0.25*this.length*0.5;
            }
            else
            {
                nextz += 0.25*this.length;
                nextcamerax += 0.25*this.length*0.5;
                nextcameraz += 0.25*this.length*0.5;
            }
            tween = new TWEEN.Tween({x:this.X,z:this.Z,camerax:this.camerafollow.X,cameraz:this.camerafollow.Z})
                             .to({x:nextx,z:nextz,camerax:nextcamerax,cameraz:nextcameraz},0.25*self.movetime)
                             .onUpdate(function(){
                                    
                                    self.X = this.x;
                                    self.Z = this.z;
                                    self.camerafollow.X = this.camerax;
                                    self.camerafollow.Z = this.cameraz;
                            })
                            .onComplete(function(){
                                self.movexdir = !self.movexdir;
                                self.shadow.setLocalEulerAngles(0,self.movexdir?0:90,0);
                                self.bodymat.emissiveMap = self.movexdir ?self.PlayerRTex:self.PlayerLTex;
                                self.bodymat.opacityMap = self.movexdir ?self.PlayerRTex:self.PlayerLTex;
                                self.bodymat.update();
                                var x = nextx,z = nextz,camerax=nextcamerax,cameraz = nextcameraz;
                                if(self.movexdir)
                                {
                                     nextx += 0.75*self.length;
                                     nextcamerax += 0.75*self.length; 
                                }
                                else
                                {
                                    nextz += 0.75*self.length;
                                    nextcameraz += 0.75*self.length;
                                }
                                tween1 = new TWEEN.Tween({x:x,z:z,camerax:camerax,cameraz:cameraz})
                                                        .to({x:nextx,z:nextz,camerax:nextcamerax,cameraz:nextcameraz},0.75*self.movetime)
                                                        .onUpdate(function(){
                                                            self.X = this.x;
                                                            self.Z = this.z;
                                                            self.camerafollow.X = this.camerax;
                                                            self.camerafollow.Z = this.cameraz;
                                                            
                                                        })
                                                        .onComplete(function(){
                                                            self.moving = false;
                                                        });
                
                                tween1.start();
                
                            });
                tween.start();
                                
            break;
        case 1:
        case 2:
        case 3:
            if(self.movexdir)
            {
                nextx += this.length;
                nextcamerax += this.length*0.5;
                nextcameraz += this.length*0.5;
            }
            else
            {
                nextz += this.length;
                nextcamerax += this.length*0.5;
                nextcameraz += this.length*0.5;
            }
            tween = new TWEEN.Tween({x:this.X,z:this.Z,camerax:this.camerafollow.X,cameraz:this.camerafollow.Z})
                             .to({x:nextx,z:nextz,camerax:nextcamerax,cameraz:nextcameraz},self.movetime)
                             .onUpdate(function(){
                                    self.X = this.x;
                                    self.Z = this.z;
                                    self.camerafollow.X = this.camerax;
                                    self.camerafollow.Z = this.cameraz;
                                    
                                })
                            .onComplete(function(){
                                self.moving = false;
                            });
            tween.start();
            break;
        default:
            var percent = 1;
            if(!this.gamemanager.startgame)
            {
                this.tips.enabled = false;
                this.runpt.enabled = true;
                percent = 0.5;
                this.gamemanager.startgame = true;
                this.gamemanager.GameStartGame();
            }
            if(self.movexdir)
            {
                nextx += this.length*percent;
                nextcamerax += this.length*percent;
            }
            else
            {
                nextz += this.length*percent;
                nextcameraz += this.length*percent;
            }
            tween = new TWEEN.Tween({x:this.X,z:this.Z,camerax:this.camerafollow.X,cameraz:this.camerafollow.Z})
                             .to({x:nextx,z:nextz,camerax:nextcamerax,cameraz:nextcameraz},self.movetime*percent)
                             .onUpdate(function(){
                                    self.X = this.x;
                                    self.Z = this.z;
                                    self.camerafollow.X = this.camerax;
                                    self.camerafollow.Z = this.cameraz;
                                })
                            .onComplete(function(){
                                
                                self.moving = false;
                            });
            tween.start();
            break;
            
            
    }
    
};
PlayerControl.prototype.PlaySound = function(name){
    this.entity.sound.slot(name).play();
};

PlayerControl.prototype.AddScore = function(){
    var index = pc.math.random(0,1)>0.5?1:2;
    this.PlaySound('hit'+index);
    this.score ++;
    if(this.score %25 === 0)
    {
        this.PlaySound('change');
        this.movetime = this.movetime < 200?200:this.movetime-10;
    }
    this.scoreui.innerHTML = this.score.toString();
    
};


PlayerControl.prototype.Init = function(){
    this.bodymat.emissiveMap = this.PlayerRTex;
    this.bodymat.opacityMap = this.PlayerRTex;
    this.bodymat.update();
    this.shadow.setLocalEulerAngles(0,0,0);
    this.shadow.enabled = true;
    this.moving = false;
    this.movetime = 250;
    this.dir = 0;
    this.lr = false;
    this.movebox = false;
    this.trigger = false;
    this.score = 0;
    this.movexdir = true;
    this.X = this.initPos.x;
    this.Y = this.initPos.y;
    this.Z = this.initPos.z;
    this.entity.setPosition(this.initPos.x,this.initPos.y,this.initPos.z);
};