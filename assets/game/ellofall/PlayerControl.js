pc.script.attribute('playerlefttex','asset',null,{max:1});
pc.script.attribute('playerrighttex','asset',null,{max:1});
pc.script.attribute('playermat','asset',null,{max:1});

pc.script.create('PlayerControl', function (app) {
    // Creates a new PlayerControl instance
    var PlayerControl = function (entity) 
    {
        this.entity = entity;
    };

    PlayerControl.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () 
        {
            var manager = app.root.findByName("Manager");
            this.gamemanager = manager.script.GameStateManager;
            this.pathmanager = manager.script.PathManager;
            this.JumpTime = 0.25;
            this.Hstep = 1 ;
            this.Vstep = 1;
            var pos = this.entity.getPosition();
            this.InitPos = new pc.Vec3(pos.x,pos.y,pos.z);
            this.Body = this.entity.findByName("body");
            this.hitpt = this.entity.findByName("hit");
            
            this.playerLeftTex = app.assets.get(this.playerlefttex).resource;
            this.playerRightTex = app.assets.get(this.playerrighttex).resource;
            this.playermat = app.assets.get(this.playermat).resource;
            this.soundon = true;
            
            
            this.shadow = app.root.findByName('shadow');
            var pos1 = this.shadow.getPosition();
            this.shadowInitPos = new pc.Vec3(pos1.x,pos1.y,pos1.z);
            
            this.tips = app.root.findByName('tips');
            this.tips.enabled = false;
            this.halfscreenwidth = window.innerWidth/2;
            
            
            
            var self = this;
            
            if(app.touch)
            {
                app.touch.on(pc.EVENT_TOUCHSTART,function(event){
                    if(!self.gamemanager.start || self.gamemanager.lose)
                    {
                        return;
                    }

                    var touches = event.changedTouches;
                    if(touches[0].x < self.halfscreenwidth)
                    {
                        self.XYaw = false;
                    }
                    else
                    {
                        self.XYaw = true;
                    }
                             
                    
                    if(!self.startgame)
                    {

                        self.gamemanager.GameStartGame();

                        self.startgame = true; 
                        self.MoveDir = self.XYaw;
                        self.NextPos.set(self.XYaw?1:0,-1,self.XYaw?0:1);
                        self.tips.enabled  = false;
                        self.pathmanager.playerrow = 0;
                        
                        
                        if(self.MoveDir)
                        {
                            self.playermat.emissiveMap = self.playerRightTex;
                            self.playermat.opacityMap = self.playerRightTex;
                            self.playermat.update();
                            self.pathmanager.playercol = 2;
                        }
                        else
                        {
                            self.playermat.emissiveMap = self.playerLeftTex;
                            self.playermat.opacityMap = self.playerLeftTex;
                            self.playermat.update();
                            self.pathmanager.playercol = 1;
                        }
                        
                        
                    }
                    
                   
                    
                   // self.XYaw = !self.XYaw;
                    
                },false);
            }
            else
            {
                app.mouse.on(pc.EVENT_MOUSEDOWN,function(event){
                    if(!self.gamemanager.start || self.gamemanager.lose)
                    {
                        return;
                    }
                    
                    if(event.x < self.halfscreenwidth)
                    {
                        self.XYaw = false;
                    }
                    else
                    {
                        self.XYaw = true;
                    }
                    
                    
                    if(!self.startgame)
                    {
                        self.MoveDir = self.XYaw;
                        self.startgame = true;
                        self.NextPos.set(self.XYaw?1:0,-1,self.XYaw?0:1);
                        self.tips.enabled = false;
                        
                        self.pathmanager.playerrow = 0;
                       
                        
                         if(self.MoveDir)
                        {
                            self.playermat.emissiveMap = self.playerRightTex;
                            self.playermat.opacityMap = self.playerRightTex;
                            self.playermat.update();
                            self.pathmanager.playercol = 2;
                        }
                        else
                        {
                            self.playermat.emissiveMap = self.playerLeftTex;
                            self.playermat.opacityMap = self.playerLeftTex;
                            self.playermat.update(); 
                            self.pathmanager.playercol = 1;
                        }
                        
                    }
                    
                  
                    //self.XYaw = !self.XYaw;
                    
                },false);
            }
            
            this.scoreui = document.getElementById("score");
            
            this.XYaw = true;
            this.startgame = false;
            this.timer = 0;
            this.MoveDir = this.XYaw;
            this.NextPos = new pc.Vec3(1,-1,0);
            this.score = 0;
            this.hitlose = false;
            this.droplose = false;
            this.onlyonce = true;
            this.onlyplayonce = true;
            
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) 
        {
            
            if(!this.gamemanager.start )
            {
                 return;
            }
            
            if(this.gamemanager.lose)
            {
                if(this.droplose)
                {
                   this.LoseAnim(dt); 
                }
                
                if(this.hitlose)
                {
                    this.HitAnim(dt);
                }

                return;
            }
            
            if(!this.startgame)
            {
                return;
            }

            this.JumpDown(dt);
            
   
        },
        
        
        JumpDown:function(dt)
        {
            this.timer += dt;
             
            if(this.timer > this.JumpTime)
            {
                this.timer =0;
                this.MoveDir = this.XYaw;
                
                if(this.MoveDir)
                {
                    this.playermat.emissiveMap = this.playerRightTex;
                    this.playermat.opacityMap = this.playerRightTex;
                    this.playermat.update();
                       
                }
                else
                {
                    this.playermat.emissiveMap = this.playerLeftTex;
                    this.playermat.opacityMap = this.playerLeftTex;
                    this.playermat.update(); 
                }
                
                this.entity.setPosition(this.NextPos.x,this.NextPos.y,this.NextPos.z);
                this.score++;
                this.scoreui.innerHTML = this.score.toString();
               
                var playercurindex =  Math.round(this.pathmanager.playerrow/2)*4 + Math.floor(this.pathmanager.playerrow/2)*5+ this.pathmanager.playercol;
                playercurindex = playercurindex % this.pathmanager.prefabsnum;
                this.pathmanager.BoxPool[playercurindex].script.BoxState.UpDown();
                
                if(this.pathmanager.playerrow%2 === 0 )
                {
                    if(this.MoveDir)
                    {
                         this.pathmanager.playercol ++;
                    }     
                }
                else
                {
                    if(this.MoveDir)
                    {
                         if(this.pathmanager.playercol === 4)
                         {
                             this.shadow.enabled = false;
                             
                             this.gamemanager.lose = true;
                             this.droplose = true;
                             console.log("You Lose    "+  this.pathmanager.playerrow+"  "+this.pathmanager.playercol);
                             return;
                         }
                    }
                    else
                    {
                        if(this.pathmanager.playercol === 0)
                        {
                            this.shadow.enabled = false;
                            
                             this.gamemanager.lose = true;
                             this.droplose = true;
                             console.log("You Lose    "+  this.pathmanager.playerrow+"  "+this.pathmanager.playercol);
                             return;
                        }
                        else
                        {
                            this.pathmanager.playercol --;
                        }
                    }
                }
                this.pathmanager.playerrow++;
                
                var index = Math.round(this.pathmanager.playerrow/2)*4 + Math.floor(this.pathmanager.playerrow/2)*5+ this.pathmanager.playercol;
                index = index % this.pathmanager.prefabsnum;
                
                if(this.pathmanager.BoxPool[index].script.BoxState.hide)
                {
                    this.shadow.enabled = false;
                    
                    this.gamemanager.lose = true;
                    this.hitlose = true;
                    console.log("You Lose    "+  this.pathmanager.playerrow+"  "+this.pathmanager.playercol);
                    return; 
                }
                
                this.pathmanager.SpanBox();

                var x = this.MoveDir ? (this.NextPos.x+1) : this.NextPos.x;
                var z = !this.MoveDir ? (this.NextPos.z+1) : this.NextPos.z;
                this.NextPos.set(x,this.NextPos.y - 1,z);
            }
            else
            {
                if(this.timer < this.JumpTime/2)
                {
                    this.entity.translate(this.MoveDir?(this.Hstep/this.JumpTime)*dt:0,0,!this.MoveDir?(this.Hstep/this.JumpTime)*dt:0);
                    this.shadow.setLocalScale(0.8+0.6*(this.JumpTime/2 - this.timer)/this.JumpTime*2,0.8+0.6*(this.JumpTime/2 - this.timer)/this.JumpTime*2,0.8+0.6*(this.JumpTime/2 - this.timer)/this.JumpTime*2);
                }
                else
                {
                    this.entity.translate(this.MoveDir?(this.Hstep/this.JumpTime)*dt:0,-this.Vstep*2/this.JumpTime*dt,!this.MoveDir?(this.Hstep/this.JumpTime)*dt:0);
                    this.shadow.setPosition(this.shadowInitPos.x+this.NextPos.x,this.shadowInitPos.y+this.NextPos.y,this.shadowInitPos.z+this.NextPos.z);
                    this.shadow.setLocalScale(0.8+0.6*(this.timer -this.JumpTime/2)/this.JumpTime*2,0.8+0.6*(this.timer -this.JumpTime/2)/this.JumpTime*2,0.8+0.6*(this.timer -this.JumpTime/2)/this.JumpTime*2);
                }
                
            }
        },
        
        LoseAnim:function(dt)
        {
            if(this.onlyonce)
            {
                   this.PlaySound('fall');
                   this.onlyonce = false;
            }
            this.timer += dt;
            if(this.timer > this.JumpTime)
            {

                this.entity.translate(0,-15*dt,0); 
            }
            else
            {
                if(this.timer < this.JumpTime/2)
                {
                    this.entity.translate(this.MoveDir?(this.Hstep/this.JumpTime)*dt:0,0.8/this.JumpTime*dt,!this.MoveDir?(this.Hstep/this.JumpTime)*dt:0);
                }
                else
                {
                    this.entity.translate(this.MoveDir?(this.Hstep/this.JumpTime)*dt:0,-(0.8+this.Vstep*2)/this.JumpTime*dt,!this.MoveDir?(this.Hstep/this.JumpTime)*dt:0);
                }
                
            }
        },
        
        HitAnim:function(dt)
        {
            
             if(this.onlyonce)
             {
                     this.onlyonce = false;
                     this.PlaySound('hit');
             }
            this.timer += dt;
            if(this.timer > this.JumpTime)
            {  
                if(this.onlyplayonce)
                {
                     this.Body.enabled = false;
                     this.hitpt.particlesystem.reset();
                     this.hitpt.particlesystem.play();
                    this.onlyplayonce = false;
                }
  
            }
            else
            {
                 if(this.timer < this.JumpTime/2)
                {
                    this.entity.translate(this.MoveDir?(this.Hstep/this.JumpTime)*dt:0,0.8/this.JumpTime*dt,!this.MoveDir?(this.Hstep/this.JumpTime)*dt:0);
                }
                else
                {
                    this.entity.translate(this.MoveDir?(this.Hstep/this.JumpTime)*dt:0,-(0.8+this.Vstep*2)/this.JumpTime*dt,!this.MoveDir?(this.Hstep/this.JumpTime)*dt:0);
                }
            }
        },
        
        PlaySound:function(name)
        {
          
            if(!this.soundon)
            {
                return;
            }
            else
            {
                this.entity.sound.slot(name).play();
            }
        },
        
        Init:function()
        {
            this.XYaw = true;
            this.startgame = false;
            
            this.timer = 0;
            this.MoveDir = this.XYaw;
            this.NextPos = new pc.Vec3(1,-1,0);
            this.score = 0;
            this.droplose = false;
            this.hitlose = false;
            this.Body.enabled = true;
            this.entity.setPosition(this.InitPos.x,this.InitPos.y,this.InitPos.z);
            this.onlyonce = true;
            this.onlyplayonce = true;
            
            this.playermat.emissiveMap = this.playerRightTex;
            this.playermat.opacityMap = this.playerRightTex;
            this.playermat.update();
            this.shadow.enabled = true;
            this.shadow.setLocalScale(1.4,1.4,1.4);
            this.shadow.setPosition(this.shadowInitPos.x,this.shadowInitPos.y,this.shadowInitPos.z);
        }
        
    };

    return PlayerControl;
});