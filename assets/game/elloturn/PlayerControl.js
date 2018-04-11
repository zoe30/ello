pc.script.attribute('boxmat','asset',null,{max:1});
pc.script.attribute('playermat','asset',null,{max:1});
pc.script.attribute('lefttex','asset',null,{max:1});
pc.script.attribute('righttex','asset',null,{max:1});

pc.script.attribute('boxtex1','asset',null,{max:1});
pc.script.attribute('boxtex2','asset',null,{max:1});
pc.script.attribute('boxtex3','asset',null,{max:1});
pc.script.attribute('boxtex4','asset',null,{max:1});
pc.script.attribute('boxtex5','asset',null,{max:1});
pc.script.attribute('boxtex6','asset',null,{max:1});

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
            this.pathmanager = manager.script.PathManager;
            this.gamemanager = manager.script.GameStateManager;
            
            
            this.bgcolors = ['#98c2ee','#003f5a','#d86c6d','#a6daed','#4f424e','#010f34'];
            this.bgc = new pc.Color();
            
            this.curcamera = app.root.findByName('Camera').camera;
            this.bgc.fromString(this.bgcolors[0]);
            this.curcamera.clearColor = this.bgc;
            
            this.shadow = app.root.findByName('shadow');
            this.shadowscale = 0.7;
            this.shadowpos = new pc.Vec3(0,0.21,0);
            
            this.halfscreenwidth = window.innerWidth/2;
            this.statechangeTime = 0.3;
            this.Hstep = 0.85;
            this.Vstep = 0.2;
            
            var pos = this.entity.getPosition();
            this.InitPos = new pc.Vec3(pos.x,pos.y,pos.z);
            
            this.PlayerMat = app.assets.get(this.playermat).resource;
            this.LeftTex = app.assets.get(this.lefttex).resource;
            this.RightTex = app.assets.get(this.righttex).resource;
            
            this.BoxMat = app.assets.get(this.boxmat).resource;
            this.BoxTex1 = app.assets.get(this.boxtex1).resource;
            this.BoxTex2 = app.assets.get(this.boxtex2).resource;
            this.BoxTex3 = app.assets.get(this.boxtex3).resource;
            this.BoxTex4 = app.assets.get(this.boxtex4).resource;
            this.BoxTex5 = app.assets.get(this.boxtex5).resource;
            this.BoxTex6 = app.assets.get(this.boxtex6).resource;
            
            this.autostate = app.root.findByName('autostate');
            this.automat = this.autostate.model.model.meshInstances[0].material;
            this.autostate.enabled = false;
            
            this.speeddownstate = app.root.findByName('speeddownstate');
            this.speeddownmat = this.speeddownstate.model.model.meshInstances[0].material;
            this.speeddownstate.enabled = false;
            
            this.tips = app.root.findByName('tips');
            this.tips.enabled = false;
            
            this.proppt = app.root.findByName('proppt');
            
            
            this.nextPos = new pc.Vec3(0,0,0);
            this.score = 0;

            this.timer = 0;

            this.losetimer = 0;
            this.autorun = false;
            this.autorunnum = 0;
            this.speeddown = false;
            this.changelong = false;
            this.changeshort = false;
            this.laststatetime = 0;
            this.boxtexindex = 1;
            
            
            this.ZYaw = true;
            
            
            
            
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
                    
                    if(self.autorun)
                    {
                        return;
                    }
                    
                    var touches = event.changedTouches;
                    if(touches[0].x < self.halfscreenwidth)
                    {
                        self.ZYaw = false;
               
                        //console.log('XXXX');
                    }
                    else
                    {
                        self.ZYaw = true;
 
                        //console.log('ZZZZ');
                    }     
  
                    if(!self.gamemanager.startgame && self.ZYaw)
                    {
                        
                        self.gamemanager.startgame = true;
                        self.nextPos.set(self.nextPos.x,self.nextPos.y,self.nextPos.z-self.Hstep);
                        self.tips.enabled = false;
                        self.gamemanager.GameStartGame();
                    }
    
                    
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
                    
                    if(self.autorun)
                    {
                        return;
                    }
                    if(event.x < self.halfscreenwidth)
                    {
                        //console.log('XXXX');
                        self.ZYaw = false;
                       
                    }
                    else
                    {
                        //console.log('ZZZZ');
                        self.ZYaw = true;
                        
                    }
                    
                    if(!self.gamemanager.startgame && self.ZYaw)
                    {
                        self.gamemanager.startgame = true;
                        self.tips.enabled = false;
                        self.nextPos.set(self.nextPos.x,self.nextPos.y,self.nextPos.z-self.Hstep);
                        self.gamemanager.GameStartGame();
                    }

                },false);
            }

        

        },

        update: function (dt) 
        {
            
            if(!this.gamemanager.start || !this.gamemanager.startgame)
            {
                return;
            }
 
            if(this.gamemanager.lose )
            {
                this.losetimer += dt;
                if(this.losetimer < this.statechangeTime)
                {
 
                    var x = this.ZYaw?0:-1;
                    var z = this.ZYaw?-1:0;   
                    this.entity.translate(this.Hstep/this.statechangeTime*dt*x,0,this.Hstep/this.statechangeTime*dt*z);
                
                    if(this.losetimer < this.statechangeTime/2)
                    {
                       this.entity.translate(0,this.Vstep*2/this.statechangeTime*dt,0);
                    }
                    else
                    {
                       this.entity.translate(0,-this.Vstep*2/this.statechangeTime*dt,0);
                    }

                }
                
                if(this.losetimer <1)                
                {
                    this.PlayerMat.opacity = 1-this.losetimer;
                    this.PlayerMat.update();
                }
                
                
                return;
            }
            
            this.Run(dt);
            

        },
        
        Run:function(dt)
        {
            this.timer += dt;
            if(this.timer > this.statechangeTime)
            {

                this.entity.setPosition(this.nextPos.x,this.nextPos.y,this.nextPos.z);
                this.shadow.setPosition(this.nextPos.x+this.shadowpos.x,this.nextPos.y+this.shadowpos.y,this.nextPos.z+this.shadowpos.z);
                
                this.pathmanager.playerindex ++;
                this.pathmanager.playerindex %= this.pathmanager.prefabsNum;

                this.pathmanager.BoxPool[this.pathmanager.playerindex].script.BoxControl.UpDownAnim = true;
                this.timer = 0;  
                
                this.score ++;
                var scoreui = document.getElementById('score');
                score.innerHTML = this.score.toString();
                
                if(this.score % 20 === 0)
                {
                    if(!this.autorun && !this.speeddown)
                    {
                        if(this.statechangeTime > 0.151)
                        {
                            this.statechangeTime -= 0.02;
                        }
                    }
 
                }

                var a = 0;
                if(this.autorun)
                {
                    this.statechangeTime = 0.15;
                    this.autorunnum --;
                    this.ZYaw = this.pathmanager.BoxPool[this.pathmanager.playerindex].script.BoxControl.ZYaw;
                    
                    if(this.autorunnum <= 3)
                    {
                      a = this.automat.opacity;
                      a -= 0.3;
                      this.automat.opacity = a;
                      this.automat.update();
                    }
                    
                    if(this.autorunnum === 0)
                    {
                       
                        this.autorun = false;
                        this.automat.opacity = 1;
                        this.automat.update();
                        this.autostate.enabled = false;
                        this.statechangeTime = this.laststatetime;
                        this.proppt.particlesystem.reset();
                        this.proppt.particlesystem.play();
                    }
                }
                
                if(this.changelong)
                {
                    this.pathmanager.ChangedNum = 8;
                    this.autorunnum --;

  
                    if(this.autorunnum === 0)
                    {
                      
                        this.changelong = false;
                        
                    }
                }
                
                
                if(this.changeshort)
                {
                    this.pathmanager.ChangedNum = 2;
                    this.autorunnum --;
                
  
                    if(this.autorunnum === 0)
                    {
                        
                        this.changeshort = false;
                        
                    }
                }
                
                
                if(this.speeddown)
                {
                    this.statechangeTime = 0.3;
                    this.autorunnum --;
                    
                    
                    if(this.autorunnum <=3)
                    {
                       a = this.speeddownmat.opacity;
                       a -= 0.3;
                       this.speeddownmat.opacity  = a; 
                       this.speeddownmat.update(); 
                    }
                    if(this.autorunnum === 0)
                    {
                        
                        this.speeddown = false;
                        this.statechangeTime = this.laststatetime;
                        
                        this.speeddownmat.opacity  = 1; 
                        this.speeddownmat.update(); 
                        this.speeddownstate.enabled = false;
                        this.proppt.particlesystem.reset();
                        this.proppt.particlesystem.play();
                    }
                }
                


                if(this.pathmanager.BoxPool[this.pathmanager.playerindex].script.BoxControl.speeddown)
                {
                    this.speeddown = true;
                    this.pathmanager.speeddownprop.enabled = false;
                    this.laststatetime = this.statechangeTime;
                    this.autorunnum = 15;
                   
                    this.PlaySound('speeddown');
                    this.speeddownstate.enabled = true;
                }
                if(this.pathmanager.BoxPool[this.pathmanager.playerindex].script.BoxControl.changelong)
                {
                    this.changelong = true;
                    this.autorunnum = 10;
                   
                }
                if(this.pathmanager.BoxPool[this.pathmanager.playerindex].script.BoxControl.changeshort)
                {
                    this.changeshort = true;
                    this.autorunnum = 10;
                    
                }
                
                
                if(this.pathmanager.BoxPool[this.pathmanager.playerindex].script.BoxControl.autorun)
                {
                    this.autorun = true;
                    this.pathmanager.autoprop.enabled = false;
                    this.laststatetime = this.statechangeTime;
                    this.autorunnum = 15;
                    
                    this.ZYaw = this.pathmanager.BoxPool[this.pathmanager.playerindex].script.BoxControl.ZYaw;
                    this.PlaySound('auto');
                    this.autostate.enabled = true;
                }
                
                //console.log("Index:"+this.pathmanager.playerindex+"   "+this.pathmanager.BoxPool[this.pathmanager.playerindex].script.BoxControl.ZYaw);

                
                if(this.pathmanager.BoxPool[this.pathmanager.playerindex].script.BoxControl.ZYaw !== this.ZYaw)
                {
                    this.gamemanager.lose = true;
                    this.shadow.enabled = false;
                    this.autostate.enabled = false;
                    this.speeddownstate.enabled = false;
                    this.PlaySound('fail');
                    
                }
                
                if(this.ZYaw)
                {
                    this.PlayerMat.opacityMap = this.RightTex;
                    this.PlayerMat.emissiveMap = this.RightTex;
                    this.PlayerMat.update();
                }
                else
                {
                    this.PlayerMat.opacityMap = this.LeftTex;
                    this.PlayerMat.emissiveMap = this.LeftTex;
                    this.PlayerMat.update();
                }
                
                this.nextPos.set(this.ZYaw?this.nextPos.x:this.nextPos.x-this.Hstep,this.nextPos.y,this.ZYaw?this.nextPos.z-this.Hstep:this.nextPos.z);
                
                this.pathmanager.SpanBox();
                
            }
            else
            {
               
                var dir = this.pathmanager.BoxPool[this.pathmanager.playerindex].script.BoxControl.ZYaw;
                var x = dir?0:-1;
                var z = dir?-1:0;   
                this.entity.translate(this.Hstep/this.statechangeTime*dt*x,0,this.Hstep/this.statechangeTime*dt*z);
                this.shadow.translate(this.Hstep/this.statechangeTime*dt*x,0,this.Hstep/this.statechangeTime*dt*z);
                
                if(this.timer < this.statechangeTime/2)
                {
                   this.entity.translate(0,this.Vstep*2/this.statechangeTime*dt,0);
                   var scale1 = 0.3 +(this.shadowscale-0.3)*(this.statechangeTime/2-this.timer)*2/this.statechangeTime;
                   this.shadow.setLocalScale(scale1,scale1,scale1);
                }
                else
                {
                   this.entity.translate(0,-this.Vstep*2/this.statechangeTime*dt,0);
                   var scale2 = 0.3 +(this.shadowscale-0.3)*(this.timer - this.statechangeTime/2)*2/this.statechangeTime;
                   this.shadow.setLocalScale(scale2,scale2,scale2);
                }
                
            }
        },
        
    
        
        PlaySound:function(name)
        {
            this.entity.sound.slot(name).play();
        },

        
        Init:function()
        {
            
            this.boxtexindex ++;
            if(this.boxtexindex > 6)
            {
                this.boxtexindex = 1;
            }
            
            this.bgc.fromString(this.bgcolors[this.boxtexindex-1]);
            this.curcamera.clearColor = this.bgc;
            
            
            switch(this.boxtexindex)
               {
                   case 1:
                       this.BoxMat.diffuseMap = this.BoxTex1;
                       this.BoxMat.update();
                       break;
                   case 2:
                       this.BoxMat.diffuseMap = this.BoxTex2;
                       this.BoxMat.update();
                       break;
                   case 3:
                       this.BoxMat.diffuseMap = this.BoxTex3;
                       this.BoxMat.update();
                       break;
                   case 4:
                       this.BoxMat.diffuseMap = this.BoxTex4;
                       this.BoxMat.update();
                       break;
                   case 5:
                       this.BoxMat.diffuseMap = this.BoxTex5;
                       this.BoxMat.update();
                       break;
                   case 6:
                       this.BoxMat.diffuseMap = this.BoxTex6;
                       this.BoxMat.update();
                       break;
    
                   default:
                       break;
               }
            
            
            this.entity.setPosition(this.InitPos.x,this.InitPos.y,this.InitPos.z);
            
            this.PlayerMat.opacity = 1;
            this.PlayerMat.opacityMap = this.RightTex;
            this.PlayerMat.emissiveMap = this.RightTex;
            this.PlayerMat.update();
            
            this.shadow.enabled = true;
            this.shadow.setLocalScale(this.shadowscale,this.shadowscale,this.shadowscale);
            this.shadow.setPosition(this.shadowpos.x,this.shadowpos.y,this.shadowpos.z);
            

            
            this.nextPos = new pc.Vec3(0,0,0);
            this.score = 0;
            this.timer = 0;
            this.statechangeTime = 0.3;
            this.losetimer = 0;
            
            this.ZYaw = true; 
            
            this.autorun = false;
            this.autorunnum = 0;
            this.speeddown = false;
            this.changelong = false;
            this.changeshort = false;
            this.laststatetime = 0;
        }
  
        
    };

    return PlayerControl;
});