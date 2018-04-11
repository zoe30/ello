pc.script.create('BoxState', function (app) {
    // Creates a new BoxState instance
    var BoxState = function (entity) {
        this.entity = entity;
     
    };

    BoxState.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () 
        {
            this.hide = false;
            this.UpDownAnim = false;
            this.UpTime = 0.125;
            this.DownTime = 0.125;
            this.timer = 0;
            this.changespeed = 2;
            this.dropspeed = 2;
            this.lastPos = new pc.Vec3(0,0,0);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) 
        {
            if(this.UpDownAnim)
            {
                
                this.timer += dt;
                if(this.timer > this.UpTime+this.DownTime)
                {
                    this.UpDownAnim = false;
                    this.timer = 0;
                    this.entity.setPosition(this.lastPos.x,this.lastPos.y,this.lastPos.z);
                }
                else
                {
                    if(this.timer < this.DownTime)
                    {
                        this.entity.translate(0,-this.dropspeed*dt,0);
                    }
                    else
                    {
                        this.entity.translate(0,this.dropspeed*dt,0);
                    }
                    
             
                }
                
            }
        },
        
        UpDown:function()
        {
            this.UpDownAnim = true;
            var pos = this.entity.getPosition();
            this.lastPos.set(pos.x,pos.y,pos.z);
        },
        
        Init:function()
        {
            this.timer = 0;
            this.UpDownAnim = false;
        }
        
     
        
        
        
        
    };

    return BoxState;
});