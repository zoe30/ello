var BlockControl = pc.createScript('BlockControl');
BlockControl.attributes.add('initmat',{type:"asset",array:false});

// initialize code called once per entity
BlockControl.prototype.initialize = function() {
    
    this.limitx = 0.5;
    this.initX = 0;
    this.X = 0;
    this.Y = 0;
    this.Z = 0;
    this.offsetx = 0;
    this.movespeed = 2;
    this.leftrightanim = false;
    this.hitanim = false;
    this.scale = 1;
    this.alpha = 1;
    this.changetimer = 0;
    this.scalespeed = 1;
    this.mat = this.app.assets.get(this.initmat.id).resource.clone();
    this.pt = this.entity.findByName('pt');
    this.pt.model.model.meshInstances[0].material = this.mat;
};

// update code called every frame
BlockControl.prototype.update = function(dt) {
    
    

    if(this.leftrightanim)
    {
            if(this.offsetx > this.limitx)
            {
                this.offsetx = this.limitx;
                this.movespeed *= -1; 
            }
            if(this.offsetx < -this.limitx)
            {
                this.offsetx = -this.limitx;
                this.movespeed *= -1;
            }    
            this.offsetx += this.movespeed*dt;    
            this.X = this.initX + this.offsetx;
            this.entity.setPosition(this.X,this.Y,this.Z);
    }
    
    if(this.hitanim)
    {
        this.changetimer += dt;
        this.scale = 1+0.75*this.changetimer;
        this.alpha = 1-this.changetimer;
        if(this.alpha <= 0)
        {
            this.changetimer = 0;
            this.pt.enabled = false;
            this.alpha = 0;
            this.hitanim = false;
        }
        this.mat.opacity = this.alpha;
        this.mat.update();
        this.pt.setLocalScale(this.scale,this.scale,this.scale);
    }
    
};

BlockControl.prototype.Init = function(x,y,z,anim){
    this.pt.enabled = false;
    this.entity.enabled = true;
    this.hitanim = false;
    this.scale = 1;
    this.alpha = 1;
    this.changetimer = 0;
    this.mat.opacity = this.alpha;
    this.mat.update();
    this.pt.setLocalScale(this.scale,this.scale,this.scale);
    this.limitx = 1;
    this.initX = x;
    this.X = x;
    this.Y = y;
    this.Z = z;
    this.offsetx = 0;
    this.movespeed = pc.math.random(0,1)>0.5?-2:2;
    this.leftrightanim = anim;
    this.entity.setPosition(this.X,this.Y,this.Z);
};

BlockControl.prototype.Hide = function(){
    this.leftrightanim = false;
    this.hitanim = false;
    this.entity.enabled = false;
};

BlockControl.prototype.Check = function(x){
  
    if( x> this.X-0.56 && x< this.X+0.56)
    {
        this.hitanim = true;
        this.pt.enabled = true;
        return true;
    }
    
    return false;
};