pc.script.attribute("playermat","asset",null,{max:1});
pc.script.attribute("ztex1","asset",null,{max:1});
pc.script.attribute("ztex2","asset",null,{max:1});
pc.script.attribute("xtex1","asset",null,{max:1});
pc.script.attribute("xtex2","asset",null,{max:1});


pc.script.create('PlayerControl', function (app) {
    // Creates a new PlayerControl instance
    var PlayerControl = function (entity) 
    {
        this.entity = entity;
    };
    
    var idle = 0;
    var jumpup = 1;
    var jumpdown = 2;
    var walk = 3;
    
    PlayerControl.prototype = {
        // Called once after all resources are loaded and before the first update

        
        initialize: function () 
        {
  
            
            var manager = app.root.findByName("Manager");
            this.pathmanager = manager.script.PathManager;
            this.gamemanager = manager.script.AppStateManager;
            
            this.shadow = app.root.findByName("shadow");
            
            
            this.tips = app.root.findByName("tips");
            this.tips.enabled = false;
            
            
            this.halfscreenwidth = window.innerWidth/2;
            this.statechangeTime = 0.2;
            this.Hstep = 0.6;
            this.Vstep = 0.3;
            var pos = this.entity.getPosition();
            this.InitPos = new pc.Vec3(pos.x,pos.y,pos.z);
            //this.tapwrongui = document.getElementById("tapwrong");
            
            this.soundon = true;
            
            
            this.PlayerMat = app.assets.get(this.playermat).resource;
            this.ZTex1 = app.assets.get(this.ztex1).resource;
            this.ZTex2 = app.assets.get(this.ztex2).resource;
            this.XTex1 = app.assets.get(this.xtex1).resource;
            this.XTex2 = app.assets.get(this.xtex2).resource;
            
            this.shadowscale = 0.65;
            this.shadowpos = new pc.Vec3(0.05,0.2,0.05);
            
            var self = this;
            
            window.addEventListener('deviceorientation',function(event){self.halfscreenwidth = window.innerWidth/2;});
            
            
            
            
            if(app.touch)
            {
                app.touch.on(pc.EVENT_TOUCHSTART,function(event)
                {
                              

                   if(self.gamemanager.lose || !self.gamemanager.start)
                    {
                        return;
                    }
                    
                    if(!self.pathmanager.startgame)
                    {
                        self.tips.enabled = false;
                        self.pathmanager.startgame = true;
                        self.gamemanager.GameStartGame();
                    }
                    
                    if(self.autorun)
                    {
                        return;
                    }
                    
                    var jump = false;
                    
                    var touches = event.touches;
                    
                    
                    if(touches[0].x > self.halfscreenwidth)
                    {
                        
                    }
                    else
                    {
                        jump = true;
                    }
                    
                    self.timer = 0;
                    self.state = idle;
                    self.entity.setPosition(self.nextPos.x,self.nextPos.y,self.nextPos.z);
                    self.shadow.setPosition(self.nextPos.x+self.shadowpos.x,self.nextPos.y+self.shadowpos.y,self.nextPos.z+self.shadowpos.z);
                    self.shadow.setLocalScale(self.shadowscale,self.shadowscale,self.shadowscale);
                    self.pathmanager.playerindex = self.score % self.pathmanager.prefabsNum;
                   
                    var nextIndex = self.pathmanager.playerindex +1;
                    if(nextIndex >= self.pathmanager.prefabsNum)
                    {
                        nextIndex = 0;
                    }
                    self.nextXDir = self.pathmanager.BoxPool[nextIndex].script.BoxControl.XDir;
                    self.nextYDir = self.pathmanager.BoxPool[nextIndex].script.BoxControl.YDir;
                    self.nextZDir = self.pathmanager.BoxPool[nextIndex].script.BoxControl.ZDir;
                    
                  
                    
                    
                    
                    if(self.nextXDir > 0)
                    {
                        self.PlayerMat.emissiveMap = self.XTex1;
                        self.PlayerMat.opacityMap = self.XTex1;
                        self.PlayerMat.update();
                        self.shadow.setEulerAngles(0,-45,0);
                    }
                    
                    if(self.nextXDir < 0)
                    {
                        self.PlayerMat.emissiveMap = self.XTex2;
                        self.PlayerMat.opacityMap = self.XTex2;
                        self.PlayerMat.update();
                        self.shadow.setEulerAngles(0,-45,0);
                    }
                    
                    if(self.nextZDir > 0)
                    {
                        self.PlayerMat.emissiveMap = self.ZTex1;
                        self.PlayerMat.opacityMap = self.ZTex1;
                        self.PlayerMat.update();
                        self.shadow.setEulerAngles(0,45,0);
                    }
                    
                    if(self.nextZDir < 0)
                    {
                        self.PlayerMat.emissiveMap = self.ZTex2;
                        self.PlayerMat.opacityMap = self.ZTex2;
                        self.PlayerMat.update();
                        self.shadow.setEulerAngles(0,45,0);
                    }
                    
                   
                    
                    
                    
                    if((!jump && self.nextYDir !== 0) || (jump && self.nextYDir === 0) )
                    {
                        self.gamemanager.lose = true;
                        self.tapwrong = true;
                        
                       //self.tapwrongui.style.display = "block";
                        console.log("Your score is "+self.score);
                        self.tapwrongindex = nextIndex;
                        self.PlaySound("tapwrong");
                        return;
                    }
                    
                    if(self.pathmanager.BoxPool[nextIndex].script.BoxControl.autorun)
                    {
                        
                        self.pathmanager.thunder.enabled = false;
                        self.PlaySound("eat");
                        self.autorun = true;
                        self.autorunnum = 10;
                    }
                    

                    
                    if(self.nextYDir > 0)
                    {
                         self.state = jumpup;
                    }
                    else
                    {
                       if(self.nextYDir < 0)
                       {
                           self.state = jumpdown;
                       }
                       else
                       {
                           self.state = walk;
                       }
                    }
                    self.score++;
                    var scoreui = document.getElementById("score");
                    scoreui.innerHTML = self.score.toString();
                    self.nextPos.set(self.nextPos.x + self.nextXDir*self.Hstep,self.nextPos.y+self.nextYDir*self.Vstep,self.nextPos.z+self.nextZDir*self.Hstep);
                    self.pathmanager.SpanBox();
                    
                    
                },false);  
            }
            else
            {
                app.mouse.on(pc.EVENT_MOUSEDOWN,function(event)
                {
                   if(self.gamemanager.lose || !self.gamemanager.start)
                    {
                        return;
                    }
                    
                    if(!self.pathmanager.startgame)
                    {
                        self.pathmanager.startgame = true;
                        self.tips.enabled = false;
                        self.gamemanager.GameStartGame();
                    }
                    
                    if(self.autorun)
                    {
                        return;
                    }
                    
                    var jump = false;

                    if(event.x > self.halfscreenwidth)
                    {
                        
                    }
                    else
                    {
                        jump = true;
                    }
                    
                    
                    self.timer = 0;
                    self.state = idle;
                    self.entity.setPosition(self.nextPos.x,self.nextPos.y,self.nextPos.z);
                    self.shadow.setPosition(self.nextPos.x+self.shadowpos.x,self.nextPos.y+self.shadowpos.y,self.nextPos.z+self.shadowpos.z);
                    self.shadow.setLocalScale(self.shadowscale,self.shadowscale,self.shadowscale);
                    self.pathmanager.playerindex = self.score % self.pathmanager.prefabsNum;
                
                    
                    var nextIndex = self.pathmanager.playerindex +1;
                    if(nextIndex >= self.pathmanager.prefabsNum)
                    {
                        nextIndex = 0;
                    }
                    self.nextXDir = self.pathmanager.BoxPool[nextIndex].script.BoxControl.XDir;
                    self.nextYDir = self.pathmanager.BoxPool[nextIndex].script.BoxControl.YDir;
                    self.nextZDir = self.pathmanager.BoxPool[nextIndex].script.BoxControl.ZDir;
 
                    if(self.nextXDir > 0)
                    {
                        self.PlayerMat.emissiveMap = self.XTex1;
                        self.PlayerMat.opacityMap = self.XTex1;
                        self.PlayerMat.update();
                        self.shadow.setEulerAngles(0,-45,0);
                    }
                    
                    if(self.nextXDir < 0)
                    {
                        self.PlayerMat.emissiveMap = self.XTex2;
                        self.PlayerMat.opacityMap = self.XTex2;
                        self.PlayerMat.update();
                        self.shadow.setEulerAngles(0,-45,0);
                    }
                    
                    if(self.nextZDir > 0)
                    {
                        self.PlayerMat.emissiveMap = self.ZTex1;
                        self.PlayerMat.opacityMap = self.ZTex1;
                        self.PlayerMat.update();
                        self.shadow.setEulerAngles(0,45,0);
                    }
                    
                    if(self.nextZDir < 0)
                    {
                        self.PlayerMat.emissiveMap = self.ZTex2;
                        self.PlayerMat.opacityMap = self.ZTex2;
                        self.PlayerMat.update();
                        self.shadow.setEulerAngles(0,45,0);
                    }

                    
                    if((!jump && self.nextYDir !== 0) || (jump && self.nextYDir === 0))
                    {
                        self.gamemanager.lose = true;
                        self.tapwrong = true;
                        //self.tapwrongui.style.display = "block";
                        console.log("Your score is "+self.score);
                        
                        
                        self.tapwrongindex = nextIndex; 
                        self.PlaySound("tapwrong");
                        return;
                    }
                    
                    
                    if(self.pathmanager.BoxPool[nextIndex].script.BoxControl.autorun)
                    {
                        
                        self.pathmanager.thunder.enabled = false;
                        self.PlaySound("eat");
                        self.autorun = true;
                        self.autorunnum = 10;
                    }
                    
                    
                    
                    
                    if(self.nextYDir > 0)
                    {
                         self.state = jumpup;
                    }
                    else
                    {
                       if(self.nextYDir < 0)
                       {
                           self.state = jumpdown;
                       }
                       else
                       {
                           self.state = walk;
                       }
                    }
                    self.score++;
                    var scoreui = document.getElementById("score");
                    scoreui.innerHTML = self.score.toString();
                    self.nextPos.set(self.nextPos.x + self.nextXDir*self.Hstep,self.nextPos.y+self.nextYDir*self.Vstep,self.nextPos.z+self.nextZDir*self.Hstep);
                    self.pathmanager.SpanBox();
                    
                },false);
            }
            
            
            this.nextPos = new pc.Vec3(0,0,0);
            this.score = 0;
            this.tapwrong = false;
            this.timeoutwrong = false; 
            this.state = idle;
            this.timer = 0;
            this.nextXDir = this.pathmanager.BoxPool[1].script.BoxControl.XDir;
            this.nextYDir = this.pathmanager.BoxPool[1].script.BoxControl.YDir;
            this.nextZDir = this.pathmanager.BoxPool[1].script.BoxControl.ZDir;
            this.losetimer = 0;
            
            this.autorun = false;
            this.autorunnum = 0;
            
            this.rotatedir = 1;
            this.tapwrongindex = 0;
            this.playlosesound = true;
            
        },

        update: function (dt) 
        {
            
            if(this.gamemanager.lose)
            {
                
                if(this.timeoutwrong)
                {
                    this.losetimer += dt;
                    if(this.losetimer >0.5 && this.losetimer < 2)
                    {
                        if(this.playlosesound)
                        {
                            this.PlaySound("lose");
                            this.playlosesound = false;
                        }
                        this.entity.translate(0,-10*dt,0);
                    }
                }
                if(this.tapwrong)
                {
                    this.losetimer += dt;
                    if(this.losetimer < 0.8)
                    {    
                        
                        var di = this.losetimer / 0.2;
                        di = di - Math.floor(di);
                        
                        if(this.nextXDir !== 0)
                        {
                            
                            if(  di < 0.5)
                            {
                                this.rotatedir = 1;
                                
                            }
                            else
                            {
                               this.rotatedir = -1;
                               
                            }
                            this.pathmanager.BoxPool[this.tapwrongindex].rotate(240*this.rotatedir*dt,0,0);
                        }
                        if(this.nextZDir !== 0)
                        {
                             
                            if(di < 0.5)
                            {
                                this.rotatedir = 1;
                                
                            }
                            else
                            {
                               this.rotatedir = -1;
                            }
                            this.pathmanager.BoxPool[this.tapwrongindex].rotate(0,0,240*this.rotatedir*dt);
                        }
                        
                    }
                    
                    if(this.losetimer >0.8 && this.losetimer < 2)
                    {
                        if(this.playlosesound)
                        {
                            this.PlaySound("lose");
                            this.playlosesound = false;
                        }
                        this.pathmanager.BoxPool[this.tapwrongindex].script.BoxControl.Down = true;
                        this.pathmanager.BoxPool[this.tapwrongindex].setEulerAngles(0,0,0);

                        this.entity.translate(0,-10*dt,0);
                    }
                }
          
                return;
            }
            if(this.autorun)
            {
                this.AutoJump(dt);
                return;
            }
            
            this.BackToIdle(dt);
            
        },
        
        BackToIdle:function(dt)
        {
            if(this.state !== idle)
            {
                this.timer+=dt;
                if(this.timer > this.statechangeTime)
                {
                    this.timer = 0;
                    this.state = idle;
                    this.entity.setPosition(this.nextPos.x,this.nextPos.y,this.nextPos.z);
                    this.shadow.setPosition(this.nextPos.x+this.shadowpos.x,this.nextPos.y+this.shadowpos.y,this.nextPos.z+this.shadowpos.z);
                    this.shadow.setLocalScale(this.shadowscale,this.shadowscale,this.shadowscale);
                    
                    this.pathmanager.playerindex = this.score % this.pathmanager.prefabsNum;
                    
                   
                    
                    
                    var nextIndex = this.pathmanager.playerindex +1;
                    if(nextIndex >= this.pathmanager.prefabsNum)
                    {
                        nextIndex = 0;
                    }
                    this.nextXDir = this.pathmanager.BoxPool[nextIndex].script.BoxControl.XDir;
                    this.nextYDir = this.pathmanager.BoxPool[nextIndex].script.BoxControl.YDir;
                    this.nextZDir = this.pathmanager.BoxPool[nextIndex].script.BoxControl.ZDir;
                    if(this.nextXDir > 0)
                    {
                        this.PlayerMat.emissiveMap = this.XTex1;
                        this.PlayerMat.opacityMap = this.XTex1;
                        this.PlayerMat.update();
                        this.shadow.setEulerAngles(0,-45,0);
                    }
                    
                    if(this.nextXDir < 0)
                    {
                        this.PlayerMat.emissiveMap = this.XTex2;
                        this.PlayerMat.opacityMap = this.XTex2;
                        this.PlayerMat.update();
                        this.shadow.setEulerAngles(0,-45,0);
                    }
                    
                    if(this.nextZDir > 0)
                    {
                        this.PlayerMat.emissiveMap = this.ZTex1;
                        this.PlayerMat.opacityMap = this.ZTex1;
                        this.PlayerMat.update();
                        this.shadow.setEulerAngles(0,45,0);
                    }
                    
                    if(this.nextZDir < 0)
                    {
                        this.PlayerMat.emissiveMap = this.ZTex2;
                        this.PlayerMat.opacityMap = this.ZTex2;
                        this.PlayerMat.update();
                        this.shadow.setEulerAngles(0,45,0);
                    }
                    
                    
                    if(this.pathmanager.BoxPool[this.pathmanager.playerindex].script.BoxControl.autorun)
                    {

                        this.pathmanager.thunder.enabled = false;
                        
                        this.PlaySound("eat");
                        
                        this.autorun = true;
                        this.autorunnum = 10;
                         if(this.nextYDir > 0)
                        {
                             this.state = jumpup;
                        }
                        else
                        {
                           if(self.nextYDir < 0)
                           {
                               this.state = jumpdown;
                           }
                           else
                           {
                               this.state = walk;
                           }
                        }
                        
                        this.score++;
                        var scoreui = document.getElementById("score");
                        scoreui.innerHTML = this.score.toString();
                        this.nextPos.set(this.nextPos.x + this.nextXDir*this.Hstep,this.nextPos.y+this.nextYDir*this.Vstep,this.nextPos.z+this.nextZDir*this.Hstep);
                    
                        this.pathmanager.SpanBox();
                        
                    }
                    
                    
                }
                else
                {
            
                    if(this.timer < this.statechangeTime/2)
                    {
                        var percent1 = (this.statechangeTime/2 -this.timer)/this.statechangeTime*2;
                        if(this.state === walk)
                        {
                           this.entity.translate(this.nextXDir*(this.Hstep/this.statechangeTime)*dt,(0.3/this.statechangeTime)*dt,this.nextZDir*(this.Hstep/this.statechangeTime)*dt);
                           this.shadow.translate(this.nextXDir*(this.Hstep/this.statechangeTime)*dt,0,this.nextZDir*(this.Hstep/this.statechangeTime)*dt); 
                           this.shadow.setLocalScale(0.4+0.25*percent1,0.4+0.25*percent1,0.4+0.25*percent1);
                        }
                        
                        if(this.state === jumpup)
                        {
                           this.entity.translate(this.nextXDir*(this.Hstep/this.statechangeTime)*dt,((0.4+this.Vstep*2)/this.statechangeTime)*dt,this.nextZDir*(this.Hstep/this.statechangeTime)*dt);  
                           this.shadow.translate(this.nextXDir*(this.Hstep/this.statechangeTime)*dt,0,this.nextZDir*(this.Hstep/this.statechangeTime)*dt); 
                           this.shadow.setLocalScale(0.35+0.3*percent1,0.35+0.3*percent1,0.35+0.3*percent1);
                        }
                        
                        if(this.state === jumpdown)
                        {
                            this.entity.translate(this.nextXDir*(this.Hstep/this.statechangeTime)*dt,(0.4/this.statechangeTime)*dt,this.nextZDir*(this.Hstep/this.statechangeTime)*dt);
                            this.shadow.translate(this.nextXDir*(this.Hstep/this.statechangeTime)*dt,0,this.nextZDir*(this.Hstep/this.statechangeTime)*dt); 
                            this.shadow.setLocalScale(0.35+0.3*percent1,0.35+0.3*percent1,0.35+0.3*percent1);
                        }
                    }
                    else
                    {
                        var percent2 = (this.timer - this.statechangeTime/2)/this.statechangeTime*2;
                        if(this.state === walk)
                        {
                           this.entity.translate(this.nextXDir*(this.Hstep/this.statechangeTime)*dt,-(0.3/this.statechangeTime)*dt,this.nextZDir*(this.Hstep/this.statechangeTime)*dt); 
                           this.shadow.translate(this.nextXDir*(this.Hstep/this.statechangeTime)*dt,0,this.nextZDir*(this.Hstep/this.statechangeTime)*dt); 
                           this.shadow.setLocalScale(0.4+0.25*percent2,0.4+0.02*percent2,0.4+0.25*percent2);
                        }
                        if(this.state === jumpup)
                        {
                           this.entity.translate(this.nextXDir*(this.Hstep/this.statechangeTime)*dt,-(0.4/this.statechangeTime)*dt,this.nextZDir*(this.Hstep/this.statechangeTime)*dt); 
                           this.shadow.setPosition(this.nextPos.x+this.shadowpos.x,this.nextPos.y+this.shadowpos.y,this.nextPos.z+this.shadowpos.z);
                           this.shadow.setLocalScale(0.35+0.3*percent2,0.35+0.3*percent2,0.35+0.3*percent2);
                        }
                        if(this.state === jumpdown)
                        {
                            this.entity.translate(this.nextXDir*(this.Hstep/this.statechangeTime)*dt,-((0.4+this.Vstep*2)/this.statechangeTime)*dt,this.nextZDir*(this.Hstep/this.statechangeTime)*dt);  
                            this.shadow.setPosition(this.nextPos.x+this.shadowpos.x,this.nextPos.y+this.shadowpos.y,this.nextPos.z+this.shadowpos.z);
                           this.shadow.setLocalScale(0.35+0.3*percent2,0.35+0.3*percent2,0.35+0.3*percent2);
                        }
                        
                    }
                }
               
            }
            
        },
        
        
        AutoJump:function(dt)
        {
                this.timer+=dt;
                if(this.timer > this.statechangeTime/2)
                {
                    this.timer = 0;
                    
                    this.entity.setPosition(this.nextPos.x,this.nextPos.y,this.nextPos.z);
                    this.shadow.setPosition(this.nextPos.x+this.shadowpos.x,this.nextPos.y+this.shadowpos.y,this.nextPos.z+this.shadowpos.z);
                    this.shadow.setLocalScale(this.shadowscale,this.shadowscale,this.shadowscale);
                    this.pathmanager.playerindex = this.score % this.pathmanager.prefabsNum;
                   
                    var nextIndex = this.pathmanager.playerindex +1;
                    if(nextIndex >= this.pathmanager.prefabsNum)
                    {
                        nextIndex = 0;
                    }
                    this.nextXDir = this.pathmanager.BoxPool[nextIndex].script.BoxControl.XDir;
                    this.nextYDir = this.pathmanager.BoxPool[nextIndex].script.BoxControl.YDir;
                    this.nextZDir = this.pathmanager.BoxPool[nextIndex].script.BoxControl.ZDir;
                    if(this.nextXDir > 0)
                    {
                        this.PlayerMat.emissiveMap = this.XTex1;
                        this.PlayerMat.opacityMap = this.XTex1;
                        this.PlayerMat.update();
                        this.shadow.setEulerAngles(0,-45,0);
                    }
                    
                    if(this.nextXDir < 0)
                    {
                        this.PlayerMat.emissiveMap = this.XTex2;
                        this.PlayerMat.opacityMap = this.XTex2;
                        this.PlayerMat.update();
                        this.shadow.setEulerAngles(0,-45,0);
                    }
                    
                    if(this.nextZDir > 0)
                    {
                        this.PlayerMat.emissiveMap = this.ZTex1;
                        this.PlayerMat.opacityMap = this.ZTex1;
                        this.PlayerMat.update();
                        this.shadow.setEulerAngles(0,45,0);
                    }
                    
                    if(this.nextZDir < 0)
                    {
                        this.PlayerMat.emissiveMap = this.ZTex2;
                        this.PlayerMat.opacityMap = this.ZTex2;
                        this.PlayerMat.update();
                        this.shadow.setEulerAngles(0,45,0);
                    }
                    
                    if(this.pathmanager.BoxPool[this.pathmanager.playerindex].script.BoxControl.autorun)
                    {
                        
                        this.pathmanager.thunder.enabled = false;
                        this.PlaySound("eat");
                        this.autorun = true;
                        this.autorunnum = 10;
                    }
                    if(this.nextYDir > 0)
                    {
                         this.state = jumpup;
                    }
                    else
                    {
                       if(self.nextYDir < 0)
                       {
                           this.state = jumpdown;
                       }
                       else
                       {
                           this.state = walk;
                       }
                    }
                    this.autorunnum --;
                    if(this.autorunnum <= 0)
                    {
                        this.autorun = false;
                    }
                    
                    
                    this.score++;
                    var scoreui = document.getElementById("score");
                    scoreui.innerHTML = this.score.toString();
                    this.nextPos.set(this.nextPos.x + this.nextXDir*this.Hstep,this.nextPos.y+this.nextYDir*this.Vstep,this.nextPos.z+this.nextZDir*this.Hstep);
                    
                    this.pathmanager.SpanBox();
                }
                else
                {
                    if(this.timer < this.statechangeTime/4)
                    {
                        var percent1 = (this.statechangeTime/4 -this.timer)/this.statechangeTime*4;
                        if(this.state === walk)
                        {
                           this.entity.translate(this.nextXDir*(2*this.Hstep/this.statechangeTime)*dt,0,this.nextZDir*(2*this.Hstep/this.statechangeTime)*dt); 
                           this.shadow.translate(this.nextXDir*(2*this.Hstep/this.statechangeTime)*dt,0,this.nextZDir*(2*this.Hstep/this.statechangeTime)*dt);
                        }
                        
                        if(this.state === jumpup)
                        {
                           this.entity.translate(this.nextXDir*(2*this.Hstep/this.statechangeTime)*dt,((0.8+this.Vstep*4)/this.statechangeTime)*dt,this.nextZDir*(2*this.Hstep/this.statechangeTime)*dt);  
                           this.shadow.translate(this.nextXDir*(this.Hstep/this.statechangeTime)*dt,0,this.nextZDir*(this.Hstep/this.statechangeTime)*dt); 
                           this.shadow.setLocalScale(0.35+0.3*percent1,0.35+0.3*percent1,0.35+0.3*percent1);
                        }
                        
                        if(this.state === jumpdown)
                        {
                            this.entity.translate(this.nextXDir*(2*this.Hstep/this.statechangeTime)*dt,(0.8/this.statechangeTime)*dt,this.nextZDir*(2*this.Hstep/this.statechangeTime)*dt);  
                            this.shadow.translate(this.nextXDir*(this.Hstep/this.statechangeTime)*dt,0,this.nextZDir*(this.Hstep/this.statechangeTime)*dt); 
                            this.shadow.setLocalScale(0.35+0.3*percent1,0.35+0.3*percent1,0.35+0.3*percent1);
                        }
                    }
                    else
                    {
                        var percent2 = (this.timer - this.statechangeTime/4)/this.statechangeTime*4;
                        if(this.state === walk)
                        {
                           this.entity.translate(this.nextXDir*(2*this.Hstep/this.statechangeTime)*dt,0,this.nextZDir*(2*this.Hstep/this.statechangeTime)*dt); 
                           this.shadow.translate(this.nextXDir*(2*this.Hstep/this.statechangeTime)*dt,0,this.nextZDir*(2*this.Hstep/this.statechangeTime)*dt);
                           
                        }
                        if(this.state === jumpup)
                        {
                           this.entity.translate(this.nextXDir*(2*this.Hstep/this.statechangeTime)*dt,-(0.8/this.statechangeTime)*dt,this.nextZDir*(2*this.Hstep/this.statechangeTime)*dt); 
                           this.shadow.setPosition(this.nextPos.x+this.shadowpos.x,this.nextPos.y+this.shadowpos.y,this.nextPos.z+this.shadowpos.z);
                           this.shadow.setLocalScale(0.35+0.3*percent2,0.35+0.3*percent2,0.35+0.3*percent2);
                        }
                        if(this.state === jumpdown)
                        {
                            this.entity.translate(this.nextXDir*(2*this.Hstep/this.statechangeTime)*dt,-((0.8+this.Vstep*4)/this.statechangeTime)*dt,this.nextZDir*(2*this.Hstep/this.statechangeTime)*dt);  
                            this.shadow.setPosition(this.nextPos.x+this.shadowpos.x,this.nextPos.y+this.shadowpos.y,this.nextPos.z+this.shadowpos.z);
                            this.shadow.setLocalScale(0.35+0.3*percent2,0.35+0.3*percent2,0.35+0.3*percent2);
                        }
                        
                    }
                }
        },
        
        PlaySound:function(name)
        {
            if(!this.soundon)
            {
                return;
            }
            this.entity.sound.slot(name).play();
        },

        
        Init:function()
        {
            this.entity.setPosition(this.InitPos.x,this.InitPos.y,this.InitPos.z);
            
            this.shadow.enabled = true;
            this.shadow.setPosition(this.InitPos.x+this.shadowpos.x,this.InitPos.y+this.shadowpos.y,this.InitPos.z+this.shadowpos.z);
            this.shadow.setLocalScale(this.shadowscale,this.shadowscale,this.shadowscale);
            this.shadow.setEulerAngles(0,45,0);
            
            this.nextPos = new pc.Vec3(0,0,0);
            this.score = 0;
            this.tapwrong = false;
            this.timeoutwrong = false; 
            this.state = idle;
            this.timer = 0;
            this.nextXDir = this.pathmanager.BoxPool[1].script.BoxControl.XDir;
            this.nextYDir = this.pathmanager.BoxPool[1].script.BoxControl.YDir;
            this.nextZDir = this.pathmanager.BoxPool[1].script.BoxControl.ZDir;
            this.losetimer = 0;
            this.PlayerMat.emissiveMap = this.ZTex2;
            this.PlayerMat.opacityMap = this.ZTex2;
            this.PlayerMat.update();
            this.autorun = false;
            this.playlosesound = true;
        }
        
        
        
       
        
        
        
       
        
        
        
    };

    return PlayerControl;
});