pc.script.create('ScaleAnim', function (app) {
    // Creates a new ScaleAnim instance
    var ScaleAnim = function (entity) {
        this.entity = entity;
    };

    ScaleAnim.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () 
        {
            var scale = this.entity.getLocalScale();
            this.OriScale = new pc.Vec3(scale.x,scale.y,scale.z);
            this.maxScale = 1;
            this.nowScale = 0.5;
            this.Anim = false;
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt)
        {
            if(this.Anim)
            {
                this.nowScale = pc.math.lerp(this.nowScale,this.maxScale,15*dt);
                this.entity.setLocalScale(this.nowScale*this.OriScale.x,this.nowScale*this.OriScale.y,this.nowScale*this.OriScale.z);
                
                if(Math.abs(this.maxScale - this.nowScale) < 0.05)
                {
                    this.Anim = false;
                    this.entity.setLocalScale(this.OriScale.x,this.OriScale.y,this.OriScale.z);
                }
            }
            
                
            
        }
    };

    return ScaleAnim;
});