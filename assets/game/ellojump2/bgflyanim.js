pc.script.create('bgflyanim', function (app) {
    // Creates a new Bgflyanim instance
    var Bgflyanim = function (entity) {
        this.entity = entity;
    };

    Bgflyanim.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.MoveSpeed = 0.2;
            var pos = this.entity.getLocalPosition();
            this.UpPosY = pos.y + 0.5; 
            this.DownPosY = pos.y -0.5;
            this.Y = pos.y;
            this.changetimer = pc.math.random(0.5,1);
            this.UpAnim = true;
            this.timer = 0;
            
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) 
        {
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
        }
    };

    return Bgflyanim;
});