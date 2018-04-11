pc.script.create('BoxControl', function (app) {
    // Creates a new BoxControl instance
    var BoxControl = function (entity) {
        this.entity = entity;
    };

    BoxControl.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () 
        {     
            this.PointIndex = 0;
            this.NextPos = new pc.Vec3(0,0,0);
            this.MoveTime = 2.0;
            this.timer = 0;
            this.MoveSpeed  = 5;
            this.canMove = false;
            this.X = 0;
            this.Y = 0;
            this.minZ = 0;
            this.maxZ= 0;        
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) 
        {
            if(this.canMove)
            {
                this.timer += dt;
                if(this.timer > this.MoveTime)
                {
                    this.timer = 0;
                    this.canMove = false;
                    this.entity.setPosition(this.NextPos.x,this.NextPos.y,this.NextPos.z);
                    
                }
                else
                {
                   var pos = this.entity.getPosition();
                   var x = pc.math.lerp(pos.x,this.NextPos.x,this.MoveSpeed*dt);
                   var y = pc.math.lerp(pos.y,this.NextPos.y,this.MoveSpeed*dt);
                   var z = pc.math.lerp(pos.z,this.NextPos.z,this.MoveSpeed*dt);
                   this.entity.setPosition(x,y,z); 
                }
            }
        }
    };

    return BoxControl;
});