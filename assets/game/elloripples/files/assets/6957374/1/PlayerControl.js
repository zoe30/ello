var PlayerControl = pc.createScript('PlayerControl');

// initialize code called once per entity
PlayerControl.prototype.initialize = function() {
    
    var app = this.app;
    var manager = app.root.findByName('Manager');
    this.gamemanager = manager.script.GameStateManager;
    this.pathmanager = manager.script.PathManager;
    this.tips = app.root.findByName('tips');
    this.tips.enabled = false;
    this.pt = app.root.findByName('playerpt');
    this.hit = false;
    this.body = this.entity.findByName('body');
    
    
    this.scale = 1;
    this.jumpheight = 1;
    this.jumpdis = 2.5*this.scale;
    
    this.screenmaxwidth = window.innerWidth/2;
    window.addEventListener('resize',function(){
                                this.screenmaxwidth = window.innerWidth/2;
                            }.bind(this));
    
    this.Xspeed = 3;
    
    this.jumponcetime = 0.65;
    this.jumptimer = 0;
    this.Zspeed = this.jumpdis/this.jumponcetime;
    this.Ygspeedup = 2*this.jumpheight/(this.jumponcetime/2*this.jumponcetime/2);
    this.Yspeed = this.Ygspeedup*this.jumponcetime/2;
    this.Ymaxspeed = this.Ygspeedup*this.jumponcetime/2;
    
    this.Y = 0.25;
    this.X = 0;
    this.Z = 0;
    this.targetX = 0; 
    this.score = 0;
    this.scoreui = document.getElementById('score');
    
    var startx = 0;    
    if(app.touch)
    {
        app.touch.on(pc.EVENT_TOUCHSTART,function(e){
            if(!this.gamemanager.start || this.gamemanager.lose)
            {
               return; 
            }

            if(e){
            	e.event.preventDefault();
            }
            if(!this.gamemanager.startgame)
            {
                this.gamemanager.GameStartGame();
                this.tips.enabled = false;
                this.gamemanager.startgame = true;
            }
            var touch = e.touches[0];
            startx = touch.x;
        }.bind(this),this);
        app.touch.on(pc.EVENT_TOUCHMOVE,function(e){
            if(!this.gamemanager.start || this.gamemanager.lose || !this.gamemanager.startgame)
            {
               return; 
            }
            
            var touch = e.touches[0];
            var dx = touch.x - startx;
            this.targetX += dx/this.screenmaxwidth*this.scale*5; 
            startx = touch.x;
            
        }.bind(this),this);
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
                this.gamemanager.GameStartGame();
                this.tips.enabled = false;
                this.gamemanager.startgame = true;
            }
            if(!e.buttons[pc.MOUSEBUTTON_LEFT])
            {
                return;
            }
            startx = e.x;
        }.bind(this),this);
        app.mouse.on(pc.EVENT_MOUSEMOVE,function(e){
            if(!this.gamemanager.start || this.gamemanager.lose || !this.gamemanager.startgame)
            {
               return; 
            }
            if(!e.buttons[pc.MOUSEBUTTON_LEFT])
            {
                return;
            }
            var dx = e.x-startx;
            this.targetX += dx/this.screenmaxwidth*this.scale*5; 
            startx = e.x;
            
        }.bind(this),this);
    }

    app.mouse.disableContextMenu();

    
};

PlayerControl.prototype.update = function(dt) {
    if(!this.gamemanager.start  || !this.gamemanager.startgame)
    {
        return; 
    }
    if(this.gamemanager.lose)
    {
        if(this.Y > -0.3)
        {
             this.Z -= this.Zspeed*dt;
             this.Y -= this.Yspeed*dt;
             this.entity.setPosition(this.X,this.Y,this.Z);
        }
        else
        {
           if(!this.hit)
           {
               
               this.hit = true;
               this.pt.setPosition(this.X,this.Y,this.Z);
               this.pt.particlesystem.reset();
               this.pt.particlesystem.play();
               this.body.enabled = false;
               this.PlaySound('lose');
           }
        }
        return;
    }
    
    this.SlideMove(dt);
    this.Jump(dt); 
};

PlayerControl.prototype.PlaySound = function(name){
    
    this.entity.sound.slot(name).play();
};

PlayerControl.prototype.SlideMove = function(dt){
    this.X = pc.math.lerp(this.X,this.targetX,this.Xspeed*dt);
};

PlayerControl.prototype.Jump  = function(dt){
    this.jumptimer += dt;
    if(this.jumptimer > this.jumponcetime)
    {
       
       if(this.Check())
       {
           this.Y = 0.25;
           this.Z = -this.jumpdis*(this.score+1); 
           this.jumptimer = 0;

           this.pathmanager.SpanBox();

           this.score++;
           this.scoreui.innerHTML = this.score.toString();
           if(this.score % 20 === 0)
           {
                
           }
           if(this.score % 30 === 0)
           {
               if(this.jumponcetime > 0.56)
               {
                   this.jumponcetime -= 0.05;
                   this.Zspeed = this.jumpdis/this.jumponcetime;
                   this.Ygspeedup = 2*this.jumpheight/(this.jumponcetime/2*this.jumponcetime/2);
                   this.Yspeed = this.Ygspeedup*this.jumponcetime/2;
                   this.Ymaxspeed = this.Ygspeedup*this.jumponcetime/2;
               }  
           }
           this.PlaySound('jump');
           
       } 
       else
       {
            this.gamemanager.lose = true;   
       }
    }
    else
    {
        if(this.jumptimer > this.jumponcetime/2)
        {
            this.Yspeed += this.Ygspeedup*dt;
            this.Yspeed = pc.math.clamp(this.Yspeed,0,this.Ymaxspeed);
            this.Y -= this.Yspeed*dt;
            this.Y = pc.math.clamp(this.Y,0.25,this.jumpheight+0.25);
            this.Z -= this.Zspeed*dt;
        }
        else
        {
            this.Yspeed -= this.Ygspeedup*dt;
            this.Yspeed = pc.math.clamp(this.Yspeed,0,this.Ymaxspeed);
            this.Y += this.Yspeed*dt;
            this.Y = pc.math.clamp(this.Y,0.25,this.jumpheight+0.25);
            this.Z -= this.Zspeed*dt;
        }
    }
    this.entity.setPosition(this.X,this.Y,this.Z);
       
};
PlayerControl.prototype.Check = function(){
    return this.pathmanager.Check(this.X);
};




PlayerControl.prototype.Init = function(){
    this.hit = false;
    this.body.enabled = true;
    this.jumponcetime = 0.65;
    this.jumptimer = 0;
    this.Zspeed = this.jumpdis/this.jumponcetime;
    this.Ygspeedup = 2*this.jumpheight/(this.jumponcetime/2*this.jumponcetime/2);
    this.Yspeed = this.Ygspeedup*this.jumponcetime/2;
    this.Ymaxspeed = this.Ygspeedup*this.jumponcetime/2;
    this.Y = 0.25;
    this.X = 0;
    this.Z = 0;
    this.targetX = 0; 
    this.score = 0;
    this.entity.setPosition(this.X,this.Y,this.Z);
};






