var TipMove = pc.createScript('tipMove');

// initialize code called once per entity
TipMove.prototype.initialize = function() {
    
    var pos = this.entity.getLocalPosition().clone();
    this.limitX = 0.25; 
    this.moveSpeed = 0.2;
    this.X = pos.x;
    this.Y = pos.y;
    this.Z = pos.z;
    
};

// update code called every frame
TipMove.prototype.update = function(dt) {
    
    if(this.X > this.limitX )
    {
        this.moveSpeed = -0.2;
    }
    if(this.X < -this.limitX)
    {
        this.moveSpeed = 0.2;
    }
    
    this.X += this.moveSpeed*dt;
    this.entity.setLocalPosition(this.X,this.Y,this.Z);
    
    
};
