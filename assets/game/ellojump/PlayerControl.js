pc.script.attribute("playermaterial","asset",null,{max:1});
pc.script.attribute("lefttex","asset",null,{max:1});
pc.script.attribute("righttex","asset",null,{max:1});

pc.script.create('PlayerControl', function (app) {
    // Creates a new PlayerControl instance
    var PlayerControl = function (entity) {
        this.entity = entity;
    };

    PlayerControl.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () 
        {
            var manager = app.root.findByName("Manager");
            this.gamemanager = manager.script.GameStateManager;
            this.pathmanager = manager.script.PathManager;
            this.uimanager = manager.script.UIManaegr;
            this.haflscreenwidth = window.innerWidth/2.0;
            this.JumpTime = 0.2;
            this.Hstep = 0.5;
            this.Vstep = 0.25;
            this.body = this.entity.findByName("body");
            this.shadow = app.root.findByName("shadow");
            this.blood = app.root.findByName("blood");
            this.playermat = app.assets.get(this.playermaterial).resource;
            this.Ltex = app.assets.get(this.lefttex).resource;
            this.Rtex = app.assets.get(this.righttex).resource;
            this.tips = app.root.findByName("tips");
            this.soundon = true;
            
            this.jumpaudio = document.createElement("audio");
            //this.jumpaudio.src = "http://newello.ileou.com/ecms/Tpl/Home/Ellojump/files/3966831/1/jump.mp3";
            
            var pos = this.entity.getPosition();
            this.InitPos = new pc.Vec3(pos.x,pos.y,pos.z);
            
            var self = this;
            initHandle();
            
            if(app.touch)
            {
                app.touch.on(pc.EVENT_TOUCHSTART,function(event){
                    
                    if(!self.gamemanager.start)
                    {       
                       return; 
                    }
                    
                    if(!self.pathmanager.startgame)
                    {
                        self.tips.enabled = false;
                        self.pathmanager.startgame = true;
                        self.gamemanager.GameStartGame();
                    }
                    
                    
                    if(self.gamemanager.lose)
                    {
                        return;
                    }
                    
                    var touches = event.touches;

                    var Ldir = false;
                    if(touches[0].x < self.haflscreenwidth)
                    {
                       Ldir = true;
                       self.playermat.emissiveMap = self.Ltex;
                       self.playermat.opacityMap = self.Ltex;
                       self.playermat.update();
                       self.shadow.setEulerAngles(0,-45,0);
                    }
                    else
                    {
                       self.playermat.emissiveMap = self.Rtex;
                       self.playermat.opacityMap = self.Rtex;
                       self.playermat.update();
                       self.shadow.setEulerAngles(0,45,0);
                    }
                     if(self.jumpup)
                     {
                          self.entity.setPosition(self.nextPos.x,self.nextPos.y,self.nextPos.z);
                          self.jptimer = 0;
                          self.jumpup = false;
                          self.pathmanager.playerindex = Math.round(self.score % self.pathmanager.prefabsNum);
                          self.shadow.setPosition(self.nextDir ?self.nextPos.x+self.Hstep:self.nextPos.x,self.nextPos.y-self.Vstep,self.nextDir ?self.nextPos.z:self.nextPos.z+self.Hstep);
                          self.shadow.setLocalScale(0.3,0.3,0.3); 
                         
                          var nextIndex = 0;
                          if(self.pathmanager.playerindex < self.pathmanager.prefabsNum-1)
                          {
                         
                             nextIndex = self.pathmanager.playerindex +1;
                      
                          }
                          self.nextDir = self.pathmanager.BoxPool[ nextIndex].script.BoxControl.spanXDir;
                          self.nextHasChildren = self.pathmanager.BoxPool[ nextIndex].script.BoxControl.hasChildren;
                     }
                     
                   
                    
                   if((self.nextDir && Ldir) || (!self.nextDir && !Ldir))
                   {
                        self.score ++;
                        var score = document.getElementById("score");
                        score.innerHTML = self.score.toString();
                        //self.PlaySound("jump");
                        self.jumpup = true;
                        self.nextPos.set(self.nextDir?self.nextPos.x-self.Hstep:self.nextPos.x,self.nextPos.y+self.Vstep,self.nextDir?self.nextPos.z:self.nextPos.z-self.Hstep); 
                        self.pathmanager.SpanBox();
                   }
                   else
                  {
                      self.gamemanager.lose = true;
                      if(self.nextHasChildren)
                      {
                          self.hitlose = true;
                          if(Ldir)
                          {
                              self.blood.setLocalPosition(-0.2,0.6,0.2);
                          }
                          else
                          {
                              self.blood.setLocalPosition(0.5,0.8,0.2);                            
                          }
                                                           
                          self.blood.particlesystem.enabled = true;
                          self.blood.particlesystem.reset();
                          self.blood.particlesystem.play();
                          self.PlaySound("hit");
                      }
                      else
                      {
                          self.shadow.model.enabled = false;
                          self.PlaySound("lose");
                      }
                      console.log("game over");
                      console.log("Your Score is  "+ self.score);
                  }
                });
            }
            else
            {
                  app.mouse.on(pc.EVENT_MOUSEDOWN,function(event){
                    if(!self.gamemanager.start)
                    {       
                       return; 
                    }
                    
                    if(!self.pathmanager.startgame)
                    {
                        self.tips.enabled = false;
                        self.pathmanager.startgame = true;
                        self.gamemanager.GameStartGame();
                    }
                    
                    
                    if(self.gamemanager.lose)
                    {
                        return;
                    }

                    var Ldir = false;
                    if(event.x < self.haflscreenwidth)
                    {
                       Ldir = true;
                       self.playermat.emissiveMap = self.Ltex;
                       self.playermat.opacityMap = self.Ltex;
                       self.playermat.update();
                       self.shadow.setEulerAngles(0,-45,0);
                    }
                    else
                    {
                       self.playermat.emissiveMap = self.Rtex;
                       self.playermat.opacityMap = self.Rtex;
                       self.playermat.update();
                       self.shadow.setEulerAngles(0,45,0);
                    }
                      if(self.jumpup)
                      {
                          self.entity.setPosition(self.nextPos.x,self.nextPos.y,self.nextPos.z);
                          self.jptimer = 0;
                          self.jumpup = false;
                          self.pathmanager.playerindex = Math.round(self.score % self.pathmanager.prefabsNum);
                          self.shadow.setPosition(self.nextDir ?self.nextPos.x+self.Hstep:self.nextPos.x,self.nextPos.y-self.Vstep,self.nextDir ?self.nextPos.z:self.nextPos.z+self.Hstep);
                          self.shadow.setLocalScale(0.3,0.3,0.3);
                          
                          var nextIndex = 0;
                          if(self.pathmanager.playerindex < self.pathmanager.prefabsNum-1)
                          {
                         
                             nextIndex = self.pathmanager.playerindex +1;
                      
                          }
                          self.nextDir = self.pathmanager.BoxPool[ nextIndex].script.BoxControl.spanXDir;
                          self.nextHasChildren = self.pathmanager.BoxPool[ nextIndex].script.BoxControl.hasChildren;
                     }
                      
                      
                    if((self.nextDir && Ldir) || (!self.nextDir && !Ldir))
                   {
                        self.score ++;
                        var score = document.getElementById("score");
                        score.innerHTML = self.score.toString();
                        //self.PlaySound("jump");
                        self.jumpup = true;
                        self.nextPos.set(self.nextDir?self.nextPos.x-self.Hstep:self.nextPos.x,self.nextPos.y+self.Vstep,self.nextDir?self.nextPos.z:self.nextPos.z-self.Hstep);
             
                        self.pathmanager.SpanBox();
                   }
                   else
                  {
                      self.gamemanager.lose = true;
                      if(self.nextHasChildren)
                      {
                          self.hitlose = true;
                          if(Ldir)
                          {
                              self.blood.setLocalPosition(0,0.6,0.2);
                          }
                          else
                          {
                              self.blood.setLocalPosition(0.5,0.8,0.2);                            
                          }
                          self.blood.particlesystem.enabled = true;
                          self.blood.particlesystem.reset();
                          self.blood.particlesystem.play();
                          self.PlaySound("hit");
                      }
                      else
                      {
                          self.shadow.model.enabled = false;
                          self.PlaySound("lose");
                      }
                      console.log("game over");
                      console.log("Your Score is  "+ self.score);
                  }
                });
            }
            //needInit
            this.nextDir = this.pathmanager.BoxPool[1].script.BoxControl.spanXDir;
            this.nextHasChildren = false;
            this.nextPos = new pc.Vec3(0,0,0);
            this.jumpup = false;
            this.score = 0;
            this.jptimer = 0;
            this.timeoutlose = false;
            this.hitlose = false;
            
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) 
        {
            if(!this.gamemanager.start)
            {
                return;
            }
            
            if(this.gamemanager.lose)
            {
                if(!this.timeoutlose)
                {
                    this.shadow.model.enabled = false;
                    this.ApplyGravity(dt);
                }
                else
                {
                    this.jptimer += dt;
                    if(this.jptimer > 0.1)
                    {
                        this.entity.translate(0,-8*dt,0); 
                    }
                    else
                    {
                        this.shadow.model.enabled = false;
                    }
                }
                return;
            }

            this.Jump(dt);
        },
        
        Jump:function(dt)
        {
            if(this.jumpup)
            {
                 this.jptimer += dt;
                  if(this.jptimer > this.JumpTime)
                  {
                      
                      this.entity.setPosition(this.nextPos.x,this.nextPos.y,this.nextPos.z);
                     
                      this.jptimer = 0;
                      this.jumpup = false;
                      this.pathmanager.playerindex = Math.round(this.score % this.pathmanager.prefabsNum);
                      
                      var nextIndex = 0;
                      if(this.pathmanager.playerindex < this.pathmanager.prefabsNum-1)
                      {
                         
                         nextIndex = this.pathmanager.playerindex +1;
                      
                      }
                      this.nextDir = this.pathmanager.BoxPool[ nextIndex].script.BoxControl.spanXDir;
                      this.nextHasChildren = this.pathmanager.BoxPool[ nextIndex].script.BoxControl.hasChildren;
                      this.shadow.setLocalScale(0.3,0.3,0.3);
                  }
                 else
                 {
                     if(this.gamemanager.lose)
                     {
                         this.shadow.model.enabled = false;
                     }
                     if(this.jptimer < this.JumpTime/2)   
                     {
                         this.entity.translate(-(this.nextDir?this.Hstep/this.JumpTime*dt:0),(this.Vstep+0.2)*2/this.JumpTime*dt,-(this.nextDir?0:this.Hstep/this.JumpTime*dt));
                         this.shadow.setPosition(this.nextDir ?(this.nextPos.x+this.Hstep+0.02):(this.nextPos.x+0.02),this.nextPos.y-this.Vstep+0.13,this.nextDir ?(this.nextPos.z+0.05):(this.nextPos.z+this.Hstep+0.05));
                         this.shadow.setLocalScale(0.6*(this.JumpTime/2-this.jptimer)/this.JumpTime,0.6*(this.JumpTime/2-this.jptimer)/this.JumpTime,0.6*(this.JumpTime/2-this.jptimer)/this.JumpTime);
                     }
                     else
                     {
                         this.entity.translate(-(this.nextDir?this.Hstep/this.JumpTime*dt:0),-0.4/this.JumpTime*dt,-(this.nextDir?0:this.Hstep/this.JumpTime*dt));
                         this.shadow.setPosition(this.nextPos.x+0.02,this.nextPos.y+0.13,this.nextPos.z+0.05);
                         this.shadow.setLocalScale(0.6*(this.jptimer-this.JumpTime/2)/this.JumpTime,0.6*(this.jptimer-this.JumpTime/2)/this.JumpTime,0.6*(this.jptimer-this.JumpTime/2)/this.JumpTime);
                     }
                    
                 }
            }
          
            
        },
        
        ApplyGravity:function(dt)
        {
            
                  this.jptimer += dt;

                     if(this.jptimer < this.JumpTime/2)
                      {  
                         this.entity.translate(-(!this.nextDir?this.Hstep/this.JumpTime*dt:0),(this.Vstep+0.1)*2/this.JumpTime*dt,-(!this.nextDir?0:this.Hstep/this.JumpTime*dt));
                      }
                      else
                      {
                          if(this.hitlose)
                          {
                              this.body.model.enabled = false;
                              this.shadow.model.enabled = false;
                              return;
                          }
                          else
                          {
                               if(this.jptimer <this.JumpTime)
                               {
                                 this.entity.translate(-(!this.nextDir?this.Hstep/this.JumpTime*dt:0),-0.2/this.JumpTime*dt,-(!this.nextDir?0:this.Hstep/this.JumpTime*dt));  
                               }
                               else
                               {
                                  this.entity.translate(0,-10*dt,0); 
                               }
                               
                          }
                          
                      }
                 
                  
                  
                    
       
        },
        
        PlaySound:function(name)
        {
            if(!this.soundon)
                return;
            
           
            this.entity.sound.slot(name).play();     
   
            
        },
        
        Init:function()
        {
            this.nextDir = this.pathmanager.BoxPool[1].script.BoxControl.spanXDir;
            this.nextHasChildren = false;
            this.nextPos.set(0,0,0);
            this.jumpup = false;
            this.score = 0;
            this.jptimer = 0;
            this.timeoutlose = false;
            this.hitlose = false;
            this.body.model.enabled = true;
            this.shadow.model.enabled = true;
            this.shadow.setPosition(0.02,0.13,0.05);
            this.shadow.setLocalScale(0.3,0.3,0.3);
            this.entity.setPosition(this.InitPos.x,this.InitPos.y,this.InitPos.z);
            this.blood.particlesystem.enabled = false;
            this.playermat.emissiveMap = this.Rtex;
            this.playermat.opacityMap = this.Rtex;
            this.playermat.update();
            this.shadow.setEulerAngles(0,45,0);
        }
        
        
    };

    return PlayerControl;
});