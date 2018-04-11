var PlayerControl = pc.createScript('PlayerControl');

PlayerControl.prototype.initialize = function() {
    var app = this.app;
    
    var manager = app.root.findByName('Manager');
    this.gamemanager = manager.script.GameStateManager;
    this.gameparam = manager.script.GameParam;
    this.pathmanager = manager.script.PathManager;
    this.lefteye = app.root.findByName('lefteye');
    this.righteye = app.root.findByName('righteye');
    this.tips = app.root.findByName('tips');
    this.tips.enabled = false;
    
    this.UpBound = app.root.findByName('UpBound');
    
    this.halfscreenwidth = window.innerWidth/2;
    this.lrspeed = 20;

    this.score = 0;
    
    
    this.downmaxspeed = 10;
    this.lefteyedownspeed = this.downmaxspeed;
    this.righteyedownspeed = this.downmaxspeed;
    
    this.lefteyelrspeed = 0;
    this.righteyelrspeed = 0;

    this.lefteyemaxdis = -(this.gameparam.playerscale/2+this.gameparam.boundscale);
    this.lefteyemindis = -(this.gameparam.worldwidth/2-this.gameparam.playerscale/2-this.gameparam.boundscale);
    this.righteyemindis = this.gameparam.playerscale/2+this.gameparam.boundscale;
    this.righteyemaxdis =  this.gameparam.worldwidth/2-this.gameparam.playerscale/2-this.gameparam.boundscale;   
    
    this.lcolliderindex = 0;
    this.rcolliderindex = 0;
    
    var self = this;
    if(app.touch)
    {
       
        app.touch.on(pc.EVENT_TOUCHSTART,function(event){
            
            if(!self.gamemanager.start || this.gamemanager.lose)
            {
                return;
            }
            
            if(!self.gamemanager.startgame)
            {
                self.gamemanager.startgame = true;
                self.gamemanager.GameStartGame();
                self.PlaySound('startgame');
                self.tips.enabled = false;
            }
            var touches = event.touches;
            var lefteyehover= false;
            var righteyehover = false;
            for(var i = 0;i<touches.length;i++)
            {
                if(touches[i].x < self.halfscreenwidth)
                {
                   lefteyehover = true;
                }
                else
                {
                   righteyehover = true;
                }
            }
            
            if(lefteyehover )
            {
                self.lefteyelrspeed = -self.lrspeed;
            }
            else
            {
                self.lefteyelrspeed = self.lrspeed;
            }

            if(righteyehover)
            {
                self.righteyelrspeed = self.lrspeed;
            }
            else
            {
                self.righteyelrspeed = -self.lrspeed;
            }
           
        },this);

        app.touch.on(pc.EVENT_TOUCHMOVE,function(event){
            var touches = event.touches;
            var lefteyehover= false;
            var righteyehover = false;
            for(var i = 0;i<touches.length;i++)
            {
                if(touches[i].x < self.halfscreenwidth)
                {
                   lefteyehover = true;
                }
                else
                {
                   righteyehover = true;
                }
            }
            
            if(lefteyehover )
            {
                self.lefteyelrspeed = -self.lrspeed;
            }
            else
            {
                self.lefteyelrspeed = self.lrspeed;
            }

            if(righteyehover)
            {
                self.righteyelrspeed = self.lrspeed;
            }
            else
            {
                self.righteyelrspeed = -self.lrspeed;
            }


        },this);
        
         app.touch.on(pc.EVENT_TOUCHEND,function(event){
            var touches = event.touches;

            if(touches.length === 0)
            {
                 self.lefteyelrspeed = self.lrspeed;
                 self.righteyelrspeed = -self.lrspeed;
            }
            else
            {
                var lefteyehover= false;
                var righteyehover = false;
                for(var i = 0;i<touches.length;i++)
                {
                    if(touches[i].x < self.halfscreenwidth)
                    {
                       lefteyehover = true;
                    }
                    else
                    {
                       righteyehover = true;
                    }
                }
            
                if(lefteyehover )
                {
                    self.lefteyelrspeed = -self.lrspeed;
                }
                else
                {
                    self.lefteyelrspeed = self.lrspeed;
                }

                if(righteyehover)
                {
                    self.righteyelrspeed = self.lrspeed;
                }
                else
                {
                    self.righteyelrspeed = -self.lrspeed;
                }

            }

        },this);
        
    }

};

PlayerControl.prototype.update = function(dt) {
    
    if(this.app.mouse.wasPressed(pc.MOUSEBUTTON_LEFT))
    {
        if(!this.gamemanager.startgame)
        {
            this.PlaySound('startgame');
            this.gamemanager.startgame = true;
            this.tips.enabled = false;
            this.gamemanager.GameStartGame();
        }
    }
    
    
    if(!this.gamemanager.start || !this.gamemanager.startgame)
    {
        return;
    }
    
    if(this.gamemanager.lose)
    {
        return;
    }
    
    this.PCControl();
    
    this.LeftEyeMove(dt);
    this.RightEyeMove(dt);
    
    this.EyeSpeedUp(dt);
    this.LimitXY(dt);
};

PlayerControl.prototype.PCControl = function()
{
    if(this.app.keyboard.isPressed(pc.KEY_A))
    {

          this.lefteyelrspeed = -this.lrspeed;
   
    }
    
    if(this.app.keyboard.wasReleased(pc.KEY_A))
    {
         this.lefteyelrspeed = this.lrspeed;
               
    }
    
   if(this.app.keyboard.isPressed(pc.KEY_D))
    {

        this.righteyelrspeed = this.lrspeed;
  
    }
    
    if(this.app.keyboard.wasReleased(pc.KEY_D))
    {

         this.righteyelrspeed = -this.lrspeed;
           
    } 

};


PlayerControl.prototype.swap = function(old) {
    
};

PlayerControl.prototype.Init = function()
{
    this.lefteye.enabled = true;
    this.righteye.enabled = true;
    this.lefteye.setPosition(this.gameparam.lefteyeInitPos.x,this.gameparam.lefteyeInitPos.y,this.gameparam.lefteyeInitPos.z);
    this.righteye.setPosition(this.gameparam.righteyeInitPos.x,this.gameparam.righteyeInitPos.y,this.gameparam.righteyeInitPos.z);
    this.score = 0;

    this.downmaxspeed = 10;
    this.lefteyedownspeed = this.downmaxspeed;
    this.righteyedownspeed = this.downmaxspeed;
    this.lefteyelrspeed = 0;
    this.righteyelrspeed = 0;
    this.lcolliderindex = 0;
    this.rcolliderindex = 0;
};

PlayerControl.prototype.LeftEyeMove = function(dt)
{
    this.lefteye.translate(this.lefteyelrspeed*dt,0,this.lefteyedownspeed*dt);                       
};


PlayerControl.prototype.RightEyeMove = function(dt)
{
    this.righteye.translate(this.righteyelrspeed*dt,0,this.righteyedownspeed*dt);   
};


PlayerControl.prototype.EyeSpeedUp = function(dt)
{
    
    var UBPosz = this.UpBound.getPosition().z;
    var LPosz = this.lefteye.getPosition().z;
    var RPosz =  this.righteye.getPosition().z; 

    this.lefteyedownspeed = this.downmaxspeed;
    var leftdis = Math.abs(UBPosz - LPosz);
    if( leftdis > 2)
    {
         this.lefteye.translate(0,0,0.5*this.lefteyedownspeed*dt);
    }

    this.righteyedownspeed = this.downmaxspeed;
    var rightdis = Math.abs(UBPosz - RPosz);
    if( rightdis > 2)
    {
        this.righteye.translate(0,0,0.5*this.righteyedownspeed*dt);
    }

    
};

PlayerControl.prototype.LimitXY = function(dt)
{
    var lpos = this.lefteye.getPosition();
    var rpos = this.righteye.getPosition();
    var upboundpos = this.UpBound.getPosition();
    var upbounddz = upboundpos.z + this.gameparam.boundscale+this.gameparam.lrupboundposz;
    
    var LPosx = lpos.x;
    var RPosx = rpos.x;
    var LPosz = lpos.z;
    var RPosz = rpos.z;
    
    var ubound = this.pathmanager.lcolliderpool[this.lcolliderindex].ubound;
    var dbound = this.pathmanager.lcolliderpool[this.lcolliderindex].dbound;
    var lrbound = this.pathmanager.lcolliderpool[this.lcolliderindex].lrbound;
    var min = this.pathmanager.lcolliderpool[this.lcolliderindex].min;
    
    var Ldbound = LPosz + this.gameparam.playerscale/2;
    var Lubound = LPosz - this.gameparam.playerscale/2;

    if(min)
    {
        if(LPosx < lrbound )
        {
            if(Ldbound > ubound && Ldbound < ubound+this.downmaxspeed*3*dt)
            {
                LPosz = ubound - this.gameparam.playerscale/2;  
                
            }
        }

    }
    else
    {
         if(LPosx > lrbound)
         {
            if(Ldbound > ubound && Ldbound < ubound+this.downmaxspeed*3*dt)
            {
                LPosz = ubound - this.gameparam.playerscale/2; 
                
            }
            
         }

    }
    

     if(LPosx < this.lefteyemindis)
     {
                LPosx = this.lefteyemindis;
      }
      if(LPosx > this.lefteyemaxdis)
      {
                LPosx = this.lefteyemaxdis;
      }

    
    
    
        
    if(Lubound > dbound)
    {
        this.lcolliderindex ++;
        this.lcolliderindex = this.lcolliderindex % this.pathmanager.collidernum;
    }

    ubound = this.pathmanager.rcolliderpool[this.rcolliderindex].ubound;
    dbound = this.pathmanager.rcolliderpool[this.rcolliderindex].dbound;
    lrbound = this.pathmanager.rcolliderpool[this.rcolliderindex].lrbound;
    min = this.pathmanager.rcolliderpool[this.rcolliderindex].min;
    
    var Rdbound = RPosz + this.gameparam.playerscale/2;
    var Rubound = RPosz - this.gameparam.playerscale/2;
    
    if(min)
    {
        if(RPosx < lrbound)
        {
            if(Rdbound > ubound  && Rdbound < ubound+this.downmaxspeed*3*dt)
            {
                RPosz = ubound - this.gameparam.playerscale/2;
            }
            
        }

                
    }
    else
    {
         if(RPosx > lrbound)
        {
            if(Rdbound > ubound && Rdbound < ubound+this.downmaxspeed*3*dt)
            {
                RPosz = ubound - this.gameparam.playerscale/2;

            }
            
        }

    }

      if(RPosx < this.righteyemindis)
      {
            RPosx = this.righteyemindis;
      }
      if(RPosx > this.righteyemaxdis)
      {
            RPosx = this.righteyemaxdis;
      }
     
    if(Rubound > dbound)
    {
        this.rcolliderindex ++;
        this.rcolliderindex = this.rcolliderindex%this.pathmanager.collidernum;
    }

    this.lefteye.setPosition(LPosx,lpos.y,LPosz);
    this.righteye.setPosition(RPosx,rpos.y,RPosz);
    
    
    if(upbounddz > Lubound )
    {
        this.lefteye.enabled = false;
        this.gamemanager.lose = true;
        this.PlaySound('lose');
        
    }
    if( upbounddz > Rubound)
    {
        this.gamemanager.lose = true;
        this.righteye.enabled = false;
        this.PlaySound('lose');
        
    }
};

PlayerControl.prototype.PlaySound = function(name){
  
    this.entity.sound.slot(name).play();
};



