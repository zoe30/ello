var BoxControl = pc.createScript('BoxControl');

BoxControl.prototype.initialize = function() {

    this.targetX = 0;
    this.targetZ = 0;    
    this.canmove = true;
    this.movexdir = false;
};

BoxControl.prototype.Check = function(nextx,nextz){
    
    if(Math.abs(nextx+nextz-this.targetX-this.targetZ)< 0.1)
    {
        return true;
    }
    
    return false;
};