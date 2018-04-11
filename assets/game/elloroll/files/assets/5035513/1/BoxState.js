var BoxState = pc.createScript('BoxState');

BoxState.prototype.initialize = function() {
    
    
    this.dis = 0.1;
    this.updownTime = 0.2;
    this.updowntimer = 0;
    this.UpDownAnim = false;
    
    
    this.dropspeed = 10;
    this.droptimer = 0; 
    this.DropAnim = false;
    
    this.block = false;
    this.hide = false;
    this.hitcount = 3;
    
    
};

BoxState.prototype.update = function(dt) 
{
    
    this.UpDown(dt);
    this.Drop(dt);
    
};


BoxState.prototype.swap = function(old) {
   
};

BoxState.prototype.Hit = function(){
    
    this.UpDownAnim = true;
    this.hitcount --;
    if(this.hitcount <= 0)
    {
        this.UpDownAnim = false;
        this.DropAnim = true;
    }
};

BoxState.prototype.UpDown = function(dt){
  
    if(this.UpDownAnim && !this.DropAnim)
    {
          this.updowntimer += dt;
          if(this.updowntimer < this.updownTime/2)
          {
              this.entity.translate(0,-this.dis*2/this.updownTime*dt,0);
          }
         else
         {
             if(this.updowntimer < this.updownTime)
             {
                 this.entity.translate(0,this.dis*2/this.updownTime*dt,0);
             }
             else
             {
                 var pos = this.entity.getLocalPosition();
                 this.entity.setLocalPosition(pos.x,0,pos.z);
                 this.updowntimer = 0;
                 this.UpDownAnim = false;
             }
         }
    }
    
};

BoxState.prototype.Drop = function(dt){
    if(this.DropAnim)
    {
        this.droptimer += dt;
        if(this.droptimer < 1)
        {
            this.entity.translate(0,-this.dropspeed*dt,0);
        }
        else
        {
            this.DropAnim = false;
            this.droptimer = 0;
        }
    }
};
BoxState.prototype.Init = function(mat)
{
    
    
    this.dropspeed = pc.math.random(10,30);
    var pos = this.entity.getLocalPosition();
    this.entity.setLocalPosition(pos.x,0,pos.z);
    this.entity.model.enabled = true;
    this.entity.model.model.meshInstances[0].material = mat;
    this.updowntimer = 0;
    this.UpDownAnim = false;

    this.droptimer = 0; 
    this.DropAnim = false;
    
    this.block = false;
    this.hide = false;
    this.hitcount = 3;  
};  




