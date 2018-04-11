var PlayerControl = pc.createScript('PlayerControl');

// initialize code called once per entity
PlayerControl.prototype.initialize = function() {
    
    var app = this.app;
    var manager = app.root.findByName('Manager');
    this.gamemanager = manager.script.GameStateManager;
    this.pathmanager = manager.script.PathManager;
    this.tips = app.root.findByName('tips');
    this.tips.enabled = false;
    this.body = this.entity.findByName('body');
    this.pt = this.entity.findByName('pt');
    this.rmax = 4.785;
    this.rmiddle = 3.613;
    this.rmin = 2.441;
    this.changespeed = 20;
    this.halfscreenwidth = window.innerWidth*0.5;
    this.scoreui = null;
    
    this.score = 0;
    this.rtarget = this.rmiddle;
    this.r = this.rmiddle;
    this.posindex = 1;
    this.angle = 0;
    this.rotatespeed = 120;
    
    
    if(this.app.touch)
    {
        app.touch.on(pc.EVENT_TOUCHSTART,function(e){
            if(!this.gamemanager.start  || this.gamemanager.lose)
            {
                return;
            }
            if(!this.gamemanager.startgame)
            {
                this.gamemanager.GameStartGame();
                this.gamemanager.startgame = true;
                this.tips.enabled = false;
            }

            if(e){
            	e.event.preventDefault();
            }
            var touches = e.touches;
            for(var i=0;i<touches.length;i++)
            {
                var touch = touches[i];
                if(touch.x < this.halfscreenwidth)
                {
                    this.posindex = 0;
                    this.rtarget = this.rmin;
                }
                else
                {
                    this.posindex = 2;
                    this.rtarget = this.rmax;
                }
            }
        }.bind(this));
        
        app.touch.on(pc.EVENT_TOUCHMOVE,function(e){
            if(!this.gamemanager.start || !this.gamemanager.startgame || this.gamemanager.lose)
            {
                return;
            }
            var touches = e.touches;
            for(var i=0;i<touches.length;i++)
            {
                var touch = touches[i];
                if(touch.x < this.halfscreenwidth)
                {
                    this.posindex = 0;
                    this.rtarget = this.rmin;
                }
                else
                {
                    this.posindex = 2;
                    this.rtarget = this.rmax;
                }
            }
        }.bind(this));
        app.touch.on(pc.EVENT_TOUCHEND,function(e){
            if(!this.gamemanager.start || !this.gamemanager.startgame || this.gamemanager.lose)
            {
                return;
            }
            var touches = e.touches;
            if(touches.length === 0)
            {
                this.posindex = 1;
                this.rtarget = this.rmiddle;
            }
            else
            {
                for(var i=0;i<touches.length;i++)
                {
                    var touch = touches[i];
                    if(touch.x < this.halfscreenwidth)
                    {
                        this.posindex = 0;
                        this.rtarget = this.rmin;
                    }
                    else
                    {
                        this.posindex = 2;
                        this.rtarget = this.rmax;
                    }
                }
            }
        }.bind(this));
    }
    else
    {
        app.mouse.on(pc.EVENT_MOUSEDOWN,function(e){
            if(!this.gamemanager.start  || this.gamemanager.lose)
            {
                return;
            }
            if(!this.gamemanager.startgame)
            {
                this.gamemanager.startgame = true;
                this.tips.enabled = false;
                this.gamemanager.GameStartGame();
            }
            if(e.x < this.halfscreenwidth)
            {
                this.posindex = 0;
               this.rtarget = this.rmin;
            }
            else
            {
                this.posindex = 2;
                this.rtarget = this.rmax;
            }
        }.bind(this));
        
        app.mouse.on(pc.EVENT_MOUSEMOVE,function(e){
            if(!this.gamemanager.start || !this.gamemanager.startgame || this.gamemanager.lose)
            {
                return;
            }
            if(!e.buttons[pc.MOUSEBUTTON_LEFT])
            {
               return; 
            }
           if(e.x < this.halfscreenwidth)
            {
                this.posindex = 0;
               this.rtarget = this.rmin;
            }
            else
            {
                this.posindex = 2;
                this.rtarget = this.rmax;
            }
        }.bind(this));
        app.mouse.on(pc.EVENT_MOUSEUP,function(e){
            if(!this.gamemanager.start || !this.gamemanager.startgame || this.gamemanager.lose)
            {
                return;
            }
            this.rtarget = this.rmiddle;
            this.posindex = 1;
        }.bind(this));
    }
    
    app.mouse.disableContextMenu();
    
};

// update code called every frame
PlayerControl.prototype.update = function(dt) {
    if(!this.gamemanager.start || !this.gamemanager.startgame || this.gamemanager.lose)
    {
        return;
    }
    
    this.r = pc.math.lerp(this.r,this.rtarget,this.changespeed*dt);
    
    this.angle += this.rotatespeed*dt;
    this.angle %= 360;
    var rangle = this.angle*pc.math.DEG_TO_RAD;
    var x = this.r*Math.cos(rangle),
        y = this.r*Math.sin(rangle);
    this.entity.setEulerAngles(0,0,this.angle);
    this.entity.setPosition(x,y,0);
    
};

PlayerControl.prototype.LoseGame = function(){
    this.PlaySound('hit');
    this.gamemanager.lose = true;
    this.body.enabled = false;
    this.pt.particlesystem.reset();
    this.pt.particlesystem.play();
};

PlayerControl.prototype.AddScore = function(){
    if(!this.scoreui)
    {
       this.scoreui = document.getElementById('score');
    }
    this.score++;
    this.scoreui.innerHTML = this.score;
    if( this.score === 5  || this.score %10 === 0 )
    {
        return true;
    }
    return false;
};

PlayerControl.prototype.PlaySound = function(name){
    this.entity.sound.slot(name).play();
};

PlayerControl.prototype.Init = function(){
  
    this.body.enabled = true;
    this.angle = 0;
    this.rtarget = this.rmiddle;
    this.r = this.rmiddle;
    this.posindex = 1;
    this.entity.setEulerAngles(0,0,this.angle);
    this.entity.setPosition(this.r,0,0);
    this.rotatespeed = 120;
    this.score = 0;
};
