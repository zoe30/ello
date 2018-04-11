var PlayerControl = pc.createScript('PlayerControl');


PlayerControl.attributes.add("playermaterial",{type:'asset',array:false});
PlayerControl.attributes.add("lefttexs",{type:'asset',array:true});
PlayerControl.attributes.add("righttexs",{type:'asset',array:true});


PlayerControl.prototype.initialize =  function () {
            
            var app = this.app;
            
            var pos = this.entity.getPosition();
            this.InitPos = new pc.Vec3(pos.x,pos.y,pos.z);

            var manager = app.root.findByName('Manager');
            this.pathmanager = manager.script.PathManager;
            this.gamemanager = manager.script.GameStateManager;
            
            this.LeftTexs = [];
            this.RightTexs = [];
            for(var i = 0;i<this.lefttexs.length;i++)
            {
                var ltex =  app.assets.get(this.lefttexs[i].id).resource;
                this.LeftTexs.push(ltex);
                
                var rtex =  app.assets.get(this.righttexs[i].id).resource;
                this.RightTexs.push(rtex);
            }
            
            this.index = 0;
                
            this.PlayerMat = app.assets.get(this.playermaterial.id).resource;
            this.LeftTex = this.LeftTexs[this.index];
            this.RightTex = this.RightTexs[this.index];

            this.PlayerMat.emissiveMap = this.RightTex;
            this.PlayerMat.opacityMap = this.RightTex;
            this.PlayerMat.update();
            
            this.body = this.entity.findByName('body');
            this.shadow = app.root.findByName('shadow');
            this.shadowscale = 0.7;
            this.shadowinitpos = new pc.Vec3(0,0.22,0);
            
            this.bloodpt = app.root.findByName('bloodpt');
            this.leftoffset = new pc.Vec3(-0.5,0.5,0);
            this.rightoffset = new pc.Vec3(0.1,0.5,-0.5);
            this.tips = app.root.findByName('tips');
            this.tips.enabled = false;
            

            this.halfscreenwidth = window.innerWidth/2;
            this.Hstep = 0.8;
            this.Vstep = 0.4;
            this.JumpTime = 0.2;
            
            this.NextXDir = this.pathmanager.BoxPool[1].script.BoxControl.spanXdir;
            
            this.jptimer = 0;
            this.jumpup = false;
            this.score = 0;
            this.nextHit = false;
            this.nextPos = new pc.Vec3(0,0,0);
            this.nohitanim = false;
            this.loseanimtimer = 0;

            var self = this;
            
            if(app.touch)
            {
                app.touch.on(pc.EVENT_TOUCHSTART,function(event){
                  
                  if(!self.gamemanager.start || self.gamemanager.lose)
                  {
                      return;
                  }
                  if(!self.gamemanager.startgame)
                  {
                      self.tips.enabled = false;
                      self.gamemanager.startgame = true;
                      self.gamemanager.GameStartGame();
                  }  


                  var touches = event.changedTouches;
                  var Ldir = false;
                    
                  if(self.jumpup) 
                  {
                      self.jumpup = false;
                      self.jptimer = 0;
                      self.entity.setPosition(self.nextPos.x,self.nextPos.y,self.nextPos.z);
                      
                      self.pathmanager.playerindex = (self.pathmanager.playerindex+1)%self.pathmanager.prefabsNum;
                      
                      /*var boxcontrol = self.pathmanager.BoxPool[self.pathmanager.playerindex].script.BoxControl;
                          if(boxcontrol.hascoin)
                          {
                              self.PlaySound('eat');
                              boxcontrol.hascoin = false;
                              self.pathmanager.coinprop.enabled = false;
                              self.coins ++;  
                          } */
                      
                      var nextIndex = (self.pathmanager.playerindex +1)%self.pathmanager.prefabsNum;

                      self.nextHit = self.pathmanager.BoxPool[nextIndex].script.BoxControl.hit;
                      self.NextXDir = self.pathmanager.BoxPool[nextIndex].script.BoxControl.spanXdir;
    
                      self.shadow.setPosition(self.nextDir ?self.nextPos.x+self.Hstep+self.shadowinitpos.x:self.nextPos.x+self.shadowinitpos.x,self.nextPos.y-self.Vstep+self.shadowinitpos.y,self.nextDir ?self.nextPos.z+self.shadowinitpos.z:self.nextPos.z+self.Hstep+self.shadowinitpos.z);
                      self.shadow.setLocalScale(self.shadowscale,1,self.shadowscale);
                  }

                  if(touches[0].x < self.halfscreenwidth)
                  {
                      Ldir = true;
                      self.PlayerMat.emissiveMap = self.LeftTex;
                      self.PlayerMat.opacityMap = self.LeftTex;
                      self.PlayerMat.update();
                      //self.shadow.setEulerAngles(0,-45,0);
                  }
                  else
                  {
                      Ldir = false;
                      self.PlayerMat.emissiveMap = self.RightTex;
                      self.PlayerMat.opacityMap = self.RightTex;
                      self.PlayerMat.update();
                      //self.shadow.setEulerAngles(0,45,0);
                  }


                  if((!self.NextXDir && !Ldir ) || (self.NextXDir && Ldir))   
                  {
                        self.score ++;
                        var score = document.getElementById("score");
                        score.innerHTML = self.score.toString();
                        self.jumpup = true;
                        self.nextPos.set(self.NextXDir?self.nextPos.x-self.Hstep:self.nextPos.x,self.nextPos.y+self.Vstep,self.NextXDir?self.nextPos.z:self.nextPos.z-self.Hstep);
             
                        self.pathmanager.SpanBox();
                        if(self.score%50 === 0)
                        {
                            self.PlaySound('change');
                        }
                  }  
                  else
                  {
                        self.gamemanager.lose = true;
                        self.gamemanager.taplose = true;
                       
                      
                        if(self.nextHit)
                        {
                            if(Ldir)
                            {
                                self.bloodpt.setLocalPosition(self.leftoffset.x,self.leftoffset.y,self.leftoffset.z);
                            }
                            else
                            {
                                self.bloodpt.setLocalPosition(self.rightoffset.x,self.rightoffset.y,self.rightoffset.z);
                            }
                            self.bloodpt.particlesystem.reset();
                            self.bloodpt.particlesystem.play();
                            self.PlaySound('hit');
                            console.log('hitlose');
                        }
                        else
                        {
                            self.PlaySound('drop');
                            self.nohitanim = true;
                            self.shadow.enabled = false;
                        }

                        console.log("Your Score is  "+ self.score +'  Your coins is '+self.coins);
                  }

                    
                },false);
            }
            else
            {
                app.mouse.on(pc.EVENT_MOUSEDOWN,function(event){
                  
                  if(!self.gamemanager.start || self.gamemanager.lose)
                  {
                      return;
                  }
                  if(!self.gamemanager.startgame)
                  {
                      self.tips.enabled = false;
                      self.gamemanager.startgame = true;
                      self.gamemanager.GameStartGame();
                  }  
                    
                  var Ldir = false;
                    
                  if(self.jumpup) 
                  {
                      self.jumpup = false;
                      self.jptimer = 0;
                      self.entity.setPosition(self.nextPos.x,self.nextPos.y,self.nextPos.z);
                      
                      self.pathmanager.playerindex = (self.pathmanager.playerindex+1)%self.pathmanager.prefabsNum;
                      
                      /*var boxcontrol = self.pathmanager.BoxPool[self.pathmanager.playerindex].script.BoxControl;
                          if(boxcontrol.hascoin)
                          {
                              self.PlaySound('eat');
                              boxcontrol.hascoin = false;
                              self.pathmanager.coinprop.enabled = false;
                              self.coins ++;
                              var coins = document.getElementById('coins');
                              coins.innerHTML = self.coins.toString();
                          } */
                      
                      
                      var nextIndex = (self.pathmanager.playerindex +1)%self.pathmanager.prefabsNum;
                      self.nextHit = self.pathmanager.BoxPool[nextIndex].script.BoxControl.hit;
                      self.NextXDir = self.pathmanager.BoxPool[nextIndex].script.BoxControl.spanXdir;
                      self.shadow.setPosition(self.nextDir ?self.nextPos.x+self.Hstep+self.shadowinitpos.x:self.nextPos.x+self.shadowinitpos.x,self.nextPos.y-self.Vstep+self.shadowinitpos.y,self.nextDir ?self.nextPos.z+self.shadowinitpos.z:self.nextPos.z+self.Hstep+self.shadowinitpos.z);
                      self.shadow.setLocalScale(self.shadowscale,1,self.shadowscale);
                  }

                  if(event.x < self.halfscreenwidth)
                  {
                      Ldir = true;
                      self.PlayerMat.emissiveMap = self.LeftTex;
                      self.PlayerMat.opacityMap = self.LeftTex;
                      self.PlayerMat.update();
                      //self.shadow.setEulerAngles(0,-45,0);
                  }
                  else
                  {
                      Ldir = false;
                      self.PlayerMat.emissiveMap = self.RightTex;
                      self.PlayerMat.opacityMap = self.RightTex;
                      self.PlayerMat.update();
                      //self.shadow.setEulerAngles(0,45,0);
                  }
  
                    
                  if((!self.NextXDir && !Ldir ) || (self.NextXDir && Ldir))   
                  {
                        self.score ++;
                        var score = document.getElementById("score");
                        score.innerHTML = self.score.toString();
                        self.jumpup = true;
                        self.nextPos.set(self.NextXDir?self.nextPos.x-self.Hstep:self.nextPos.x,self.nextPos.y+self.Vstep,self.NextXDir?self.nextPos.z:self.nextPos.z-self.Hstep);
             
                        self.pathmanager.SpanBox();
                        if(self.score%50 === 0)
                        {
                            self.PlaySound('change');
                        }
                  }  
                  else
                  {
                       

                      
                      
                        self.gamemanager.lose = true;
                        self.gamemanager.taplose = true;
                        if(self.nextHit)
                        {
                            if(Ldir)
                            {
                                self.bloodpt.setLocalPosition(self.leftoffset.x,self.leftoffset.y,self.leftoffset.z);
                            }
                            else
                            {
                                self.bloodpt.setLocalPosition(self.rightoffset.x,self.rightoffset.y,self.rightoffset.z);
                            }
                            self.bloodpt.particlesystem.reset();
                            self.bloodpt.particlesystem.play();
                            self.PlaySound('hit');
                            console.log('hitlose');
                        }
                        else
                        {
                            self.shadow.enabled = false;
                            self.nohitanim = true;
                            self.PlaySound('drop');
                        }
                        
                        console.log("Your Score is  "+ self.score +'  Your coins is '+self.coins);
                  }
                    
                },false);
            }
 
};

        
PlayerControl.prototype.update = function (dt) {
           
            if(!this.gamemanager.start)
            {
                return;
            }
            if(!this.gamemanager.startgame)
            {
                return;
            }
            if(this.gamemanager.lose)
            {
                
                if(this.gamemanager.taplose)
                {
                     
                    this.TapLoseAnim(dt);

                    return;
                }
                if(this.gamemanager.timeoutlose)
                {
                    this.loseanimtimer += dt;
                    if(this.loseanimtimer > 0.1)
                    {
                        this.entity.translate(0,-8*dt,0); 
                    }
                    else
                    {
                       this.shadow.enabled = false;
                    }
                    
                    return;
                }
                return;
            }

            this.Jump(dt);

};
        
PlayerControl.prototype.Jump = function(dt){
            
            if(this.jumpup)
            {
                 this.jptimer += dt;
                  if(this.jptimer > this.JumpTime)
                  {
                      
                      this.entity.setPosition(this.nextPos.x,this.nextPos.y,this.nextPos.z);
                     
                      this.jptimer = 0;
                      this.jumpup = false;
                      this.pathmanager.playerindex = (this.pathmanager.playerindex+1)%this.pathmanager.prefabsNum;
                      
                      var nextIndex = (this.pathmanager.playerindex +1)%this.pathmanager.prefabsNum;
                      
                      this.NextXDir = this.pathmanager.BoxPool[nextIndex].script.BoxControl.spanXdir;
                      this.nextHit = this.pathmanager.BoxPool[nextIndex].script.BoxControl.hit;
                      this.shadow.setLocalScale(this.shadowscale,1,this.shadowscale);
                     
                  }
                 else
                 {

                     if(this.jptimer < this.JumpTime/2)   
                     {
                         this.entity.translate(-(this.NextXDir?this.Hstep/this.JumpTime*dt:0),(this.Vstep+0.3)*2/this.JumpTime*dt,-(this.NextXDir?0:this.Hstep/this.JumpTime*dt));
                         this.shadow.setPosition(this.NextXDir ?(this.nextPos.x+this.Hstep+this.shadowinitpos.x):(this.nextPos.x+this.shadowinitpos.x),this.nextPos.y-this.Vstep+this.shadowinitpos.y,this.NextXDir ?(this.nextPos.z+this.shadowinitpos.z):(this.nextPos.z+this.Hstep+this.shadowinitpos.z));
                         this.shadow.setLocalScale(0.4+2*(this.shadowscale-0.4)*(this.JumpTime/2-this.jptimer)/this.JumpTime,1,0.4+2*(this.shadowscale-0.4)*(this.JumpTime/2-this.jptimer)/this.JumpTime);
                     }
                     else
                     {
                         this.entity.translate(-(this.NextXDir?this.Hstep/this.JumpTime*dt:0),-0.6/this.JumpTime*dt,-(this.NextXDir?0:this.Hstep/this.JumpTime*dt));
                         this.shadow.setPosition(this.nextPos.x+this.shadowinitpos.x,this.nextPos.y+this.shadowinitpos.y,this.nextPos.z+this.shadowinitpos.z);
                         this.shadow.setLocalScale(0.4+2*(this.shadowscale-0.4)*(this.jptimer-this.JumpTime/2)/this.JumpTime,1,0.4+2*(this.shadowscale-0.4)*(this.jptimer-this.JumpTime/2)/this.JumpTime);
                     }
                    
                 }
            } 
            
};
        
PlayerControl.prototype.TapLoseAnim = function(dt){
                   
                    this.loseanimtimer += dt;
                    if(this.loseanimtimer < this.JumpTime/2)
                      {  
                         this.entity.translate(-(!this.NextXDir?this.Hstep/this.JumpTime*dt:0),(this.Vstep+0.1)*2/this.JumpTime*dt,-(!this.NextXDir?0:this.Hstep/this.JumpTime*dt));
                      }
                      else
                      {
                          if(!this.nohitanim)
                          {
                              this.body.enabled = false;
                              this.shadow.enabled = false;
                              return;
                          }
                          else
                          {
                               if(this.loseanimtimer <this.JumpTime)
                               {
                                 this.entity.translate(-(!this.NextXDir?this.Hstep/this.JumpTime*dt:0),-0.2/this.JumpTime*dt,-(!this.NextXDir?0:this.Hstep/this.JumpTime*dt));  
                               }
                               else
                               {
                                  this.entity.translate(0,-10*dt,0); 
                               }
                               
                          }
                          
                      }
};
        
PlayerControl.prototype.PlaySound = function(name){

            this.entity.sound.slot(name).play();     
  
};
        
        
PlayerControl.prototype.Init = function(){
            this.body.enabled = true;
            this.shadow.enabled = true;
            this.shadow.setLocalScale(this.shadowscale,1,this.shadowscale);
            this.shadow.setPosition(this.shadowinitpos.x,this.shadowinitpos.y,this.shadowinitpos.z);

            this.NextXDir = this.pathmanager.BoxPool[1].script.BoxControl.spanXdir;
            
            this.index ++;
            this.index %= 3;
            this.LeftTex = this.LeftTexs[this.index];
            this.RightTex = this.RightTexs[this.index];
            this.PlayerMat.emissiveMap = this.RightTex;
            this.PlayerMat.opacityMap = this.RightTex;
            this.PlayerMat.update();
            
            this.jptimer = 0;
            this.jumpup = false;
            this.score = 0;
            this.nextHit = false;
            this.nextPos.set(0,0,0);
            this.nohitanim = false;
            this.loseanimtimer = 0;
            this.entity.setPosition(this.InitPos.x,this.InitPos.y,this.InitPos.z);
};
        
