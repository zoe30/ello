var Bgflyanim = pc.createScript('bgflyanim');

// initialize code called once per entity
Bgflyanim.prototype.initialize = function() {
            this.MoveSpeed = 0.1;
            var pos = this.entity.getLocalPosition();
            this.UpPosY = pos.y + 0.5; 
            this.DownPosY = pos.y -0.5;
            this.Y = pos.y;
            this.changetimer = pc.math.random(0.5,2);
            this.UpAnim = true;
            this.timer = 0;
};

// update code called every frame
Bgflyanim.prototype.update = function(dt) {
            this.timer +=dt;
            if(this.timer > this.changetimer)
            {
                this.UpAnim = !this.UpAnim;
                this.changetimer = pc.math.random(0.5,1);
                this.timer = 0;
            }
            else
            {
                var pos = this.entity.getLocalPosition();
                if(this.UpAnim)
                {
                    this.Y = pc.math.lerp(this.Y,this.UpPosY,this.MoveSpeed*dt);
                    this.entity.setLocalPosition(pos.x,this.Y,pos.z);
                }
                else
                {
                    this.Y = pc.math.lerp(this.Y,this.DownPosY,this.MoveSpeed*dt);
                    this.entity.setLocalPosition(pos.x,this.Y,pos.z);
                }
            }
};

// swap method called for script hot-reloading
// inherit your script state here
Bgflyanim.prototype.swap = function(old) {
    
};

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/