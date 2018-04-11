var PlayerControl = pc.createScript('PlayerControl');

PlayerControl.attributes.add('boxmats',{type:'asset',array:true});

// initialize code called once per entity
PlayerControl.prototype.initialize = function() {
    var app = this.app;
    
    var manager = app.root.findByName('Manager');
    this.gamemanager = manager.script.GameStateManager;
    this.pathmanager = manager.script.PathManager;
    
    this.tips = app.root.findByName('tips');
    this.tips.enabled = false;
    
    this.body = this.entity.findByName('body');
    this.hitpt = this.entity.findByName('hitpt');
    
    this.Initpos = this.entity.getPosition().clone();
    this.BoxMats = [];
    for(var i =0;i<this.boxmats.length;i++)
    {
        var mat = app.assets.get(this.boxmats[i].id).resource;
        this.BoxMats.push(mat);
    }

    
    this.coldis = 1.1;
    this.rowdis = 1.1;
    this.JumpOncetTme = 0.4;
    this.MoveOnceTime = 0.16;
    this.movetimer = 0;
    
    
    this.dir = 1;
    this.JumpUp = false;
    this.jumptimer = 0;
    this.curcol = 0;
    this.currow = 0;
    this.curz = 0;
    this.leftmove = true;
    this.rightmove = true;
    this.canjump = false;
    this.pause = false;
    this.hitlose = false;
    
    
    
    var self = this;
    if(app.touch)
    {
        app.touch.on(pc.EVENT_TOUCHSTART,function(event){
            self.ClickControl();
           
        },this);
    }
    else
    {
           app.mouse.on(pc.EVENT_MOUSEDOWN,function(event){
           
               self.ClickControl();
            
        },this); 
    }
    
    
    
    
    
};

// update code called every frame
PlayerControl.prototype.update = function(dt) {
    
    /*if(this.app.keyboard.wasPressed(pc.KEY_P))
    {
        this.pause = !this.pause;
    }
    
    if(this.pause)
    {
        return;
    }*/
    
    if(!this.gamemanager.start || !this.gamemanager.startgame)
    {
        return;
    }
    
    if(this.gamemanager.lose)
    {
        if(!this.hitlose)
        {
            this.entity.translate(0,-10*dt,0);
        }
        
        
        return;
    }
    
    this.Move(dt);
    
};


PlayerControl.prototype.swap = function(old) {
    
};


PlayerControl.prototype.Move = function(dt)
{
    if(!this.JumpUp)
    {
        
        if(this.canjump)
        {
           var b = this.movetimer / this.MoveOnceTime;
           if(b < 0.5)
           {

               this.canjump = false; 
               this.movetimer = 0; 
               this.JumpUp = true; 
               this.entity.setPosition((3-this.curcol)*this.coldis,this.currow*this.rowdis+1,this.curz);
               this.entity.setEulerAngles(90*this.currow,0,90*this.curcol);
               return;
           }
           
        }
        
        
        this.movetimer += dt;
        if(this.movetimer < this.MoveOnceTime)
        {
            
            this.entity.rotate(0,0,this.dir*90/this.MoveOnceTime*dt);
            if(this.leftmove && this.dir <0)
            {
               this.entity.translate(-this.dir*this.coldis/this.MoveOnceTime*dt,0,0); 
            }
            if(this.rightmove && this.dir > 0)
            {
                this.entity.translate(-this.dir*this.coldis/this.MoveOnceTime*dt,0,0); 
            }
        }
        else
        {
            
           if(this.canjump) 
           {
               this.canjump = false;
               this.JumpUp = true;
           }
           
           var rowsindex1 = this.currow % this.pathmanager.rowscount;
           var children1 =  this.pathmanager.rows[rowsindex1].children;
           
            
           this.movetimer = 0; 
           
           if(this.dir < 0 && this.leftmove)
           {
               this.curcol += this.dir;
           }
           
            if(this.dir > 0 && this.rightmove)
           {
              this.curcol += this.dir;
           }
            
           this.leftmove = this.curcol === 0?false:(!children1[this.curcol-1].script.BoxState.hide && children1[this.curcol-1].script.BoxState.hitcount > 0);
           this.rightmove = this.curcol === 6?false:(!children1[this.curcol+1].script.BoxState.hide && children1[this.curcol+1].script.BoxState.hitcount > 0);  
            
           this.entity.setPosition((3-this.curcol)*this.coldis,this.currow*this.rowdis+1,this.curz);
           this.entity.setEulerAngles(90*this.currow,0,90*this.curcol);
           
           
           if(children1[this.curcol].script.BoxState.hide || children1[this.curcol].script.BoxState.hitcount <= 0)
           {
                 this.gamemanager.lose = true;
                 this.PlaySound('drop');
           } 
            
            
           children1[this.curcol].script.BoxState.Hit();
           var hitcount = children1[this.curcol].script.BoxState.hitcount; 
           if( hitcount > 0) 
           {
               children1[this.curcol].model.model.meshInstances[0].material = this.BoxMats[2-hitcount];
           } 
           if(this.curcol >= 6)
           {
                this.dir = -1;   
           }
           else
           {
               if(this.curcol <= 0)
               {
                   this.dir = 1;
               }
               else
               {
                  var nextboxstate = children1[this.curcol+this.dir].script.BoxState;  
                  if(nextboxstate.hide || nextboxstate.hitcount <= 0)
                  {
                      this.dir = -this.dir;
                  }
               }
           }
           
            
            
           
        }
        
    }
    else
    {
         this.jumptimer += dt;
         if(this.jumptimer < this.JumpOncetTme)
         {
             this.entity.rotate(90/this.JumpOncetTme*dt,0,0);
             this.entity.translate(0,0,1/this.JumpOncetTme*dt);
             var pos = this.entity.getPosition();
             var a = this.jumptimer/this.JumpOncetTme;

             this.entity.setPosition(pos.x,this.currow*this.rowdis+1+Math.sin(a*Math.PI/2),pos.z);
         }
         else
         {
             this.pathmanager.SpanRow();
             var rowsindex = this.currow % this.pathmanager.rowscount;
             var children =  this.pathmanager.rows[rowsindex].children;
             for(var i=0;i<this.pathmanager.cols;i++)
             {
                children[i].script.BoxState.DropAnim = true;
             }
             this.jumptimer = 0;
             this.JumpUp = false;
             this.currow ++;
             this.curz ++;
             this.entity.setPosition((3-this.curcol)*this.coldis,this.currow*this.rowdis+1,this.curz);
             this.entity.setEulerAngles(90*this.currow,0,90*this.curcol);
             
             rowsindex = this.currow % this.pathmanager.rowscount;
             children =  this.pathmanager.rows[rowsindex].children;   
             this.leftmove = this.curcol === 0?false:(!children[this.curcol-1].script.BoxState.hide && children[this.curcol-1].script.BoxState.hitcount > 0);
             this.rightmove = this.curcol === 6?false:(!children[this.curcol+1].script.BoxState.hide && children[this.curcol+1].script.BoxState.hitcount > 0);
             
             children[this.curcol].script.BoxState.Hit();
             var hitcount = children[this.curcol].script.BoxState.hitcount; 
             if( hitcount > 0) 
             {
               children[this.curcol].model.model.meshInstances[0].material = this.BoxMats[2-hitcount];
             } 
             if(children[this.curcol].script.BoxState.hide)
             {
                 this.gamemanager.lose = true;
                 this.PlaySound('drop');
                 return;
             }

             var score = document.getElementById('score');
             score.innerHTML = this.currow.toString();
             
             
             
             if(this.leftmove && !this.rightmove)
             {
                 this.dir = -1;
             }
             if(!this.leftmove && this.rightmove)
             {
                 this.dir = 1;
             }
            
         }
        
    }
};

PlayerControl.prototype.ClickControl = function()
{
    if(this.gamemanager.lose)
    {
        return;
    }
    
    if(!this.gamemanager.start )
    {
        return;
    }
    
    if(!this.gamemanager.startgame)
    {    
        this.tips.enabled = false;
        this.gamemanager.startgame =true;
        this.gamemanager.GameStartGame();
        return;
    }
    
    if(this.canjump )
    {
        return;
    }
            
    this.canjump = true;
    
    
    
};    

PlayerControl.prototype.HitLose = function(){
    
    this.PlaySound('hit');
    this.body.enabled = false;
    this.hitlose = true;
    this.hitpt.particlesystem.reset();
    this.hitpt.particlesystem.play();
};


PlayerControl.prototype.PlaySound = function(name){
      this.entity.sound.slot(name).play();  
};





PlayerControl.prototype.Init = function()
{
    this.body.enabled = true;
    this.entity.setPosition(this.Initpos.x,this.Initpos.y,this.Initpos.z);
    this.entity.setEulerAngles(0,0,0);
    this.movetimer = 0;
    this.dir = 1;
    this.JumpUp = false;
    this.jumptimer = 0;
    this.curcol = 0;
    this.currow = 0;
    this.curz = 0;
    this.leftmove = true;
    this.rightmove = true;
    this.canjump = false;
    this.hitlose = false;
    //this.pause = false;
    
};



