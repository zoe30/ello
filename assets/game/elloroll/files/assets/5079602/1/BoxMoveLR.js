var BoxMoveLr = pc.createScript('BoxMoveLR');

// initialize code called once per entity
BoxMoveLr.prototype.initialize = function() {
    
    var app = this.app;
    this.player = app.root.findByName('player');
    this.playercontrol = this.player.script.PlayerControl;
    this.gamemanager = app.root.findByName('Manager').script.GameStateManager;
    this.MoveOnceTime = 0.4;
    this.DropTime = 1;
    this.dropspeed = 10;
    this.coldis = 1.1;
    this.rows = 10;
    
    
    this.drop = false;
    this.canmove = false;
    this.canpause = false;
    this.cury = 0;
    this.curz = 0;
    this.curcol = 0;
    this.currow = 0;
    this.dir = 1;     
    this.movetimer = 0;
    this.droptimer = 0;
    
};

// update code called every frame
BoxMoveLr.prototype.update = function(dt) {
    
    if(this.canmove)
    {
        this.Move(dt);
    }
};

BoxMoveLr.prototype.swap = function(old) {
    
};

BoxMoveLr.prototype.Move = function(dt)
{
    
    if(!this.drop)
    {
        
        if(this.playercontrol.currow > 0)
        {
            var currow = this.playercontrol.currow %  this.rows;
             if(this.currow === this.rows-1 && currow === 0)
             {
                this.drop = true;
             }
             else
             {
                    if(currow -this.currow === 1)
                    {
                       this.drop  = true; 
                    }
             }
        }
         
        
        var pos1 = this.player.getPosition().clone();
        var pos2 = this.entity.getPosition().clone();
        var dis = pos1.sub(pos2).length();
        if(dis < 0.8)
        {
            console.log('Lose'+this.currow);
            this.entity.model.enabled = false;
            this.canmove = false;
            this.drop = false;
            this.playercontrol.HitLose();
            this.gamemanager.lose = true;
             
        }
        this.movetimer += dt;
        if(this.movetimer < this.MoveOnceTime)
        {
            
            this.entity.rotate(0,0,this.dir*90/this.MoveOnceTime*dt);
            this.entity.translate(-this.dir*this.coldis/this.MoveOnceTime*dt,0,0); 

        }
        else
        {
           
           this.curcol += this.dir; 
           this.movetimer = 0; 
           this.entity.setPosition((3-this.curcol)*this.coldis,this.cury,this.curz);
           this.entity.setEulerAngles(0,0,90*this.curcol);  


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
           }

        }
    }
    else
    {
       this.droptimer += dt;
        if(this.droptimer > this.DropTime)
        {
            this.droptimer = 0;
            this.canmove = false;
            this.drop = false;
        }
        else
        {
            this.entity.translate(0,-this.dropspeed*dt,0);
        }
    }
          
};

BoxMoveLr.prototype.Init = function(row,cury,curz){

    this.entity.model.enabled = true;
    this.canmove = true;
    this.drop = false;
    this.curcol = 0;
    this.movetimer = 0;
    this.droptimer = 0;
    this.dir = 1;
    this.currow = row;
    this.cury = cury;
    this.curz = curz;
    this.entity.setPosition((3-this.curcol)*this.coldis,this.cury,this.curz);
    this.entity.setEulerAngles(0,0,0);
};








