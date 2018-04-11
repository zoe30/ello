pc.script.create('BoxControl', function (app) {
    // Creates a new BoxControl instance
    var BoxControl = function (entity) {
        this.entity = entity;
        this.spanXDir = true;
        this.hasChildren = false;
        this.childrenNode = null;
    };

    BoxControl.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () 
        {
            this.Up = false;
            this.Down = false;
            this.UpSpeed = 20;
            this.DownSpeed = 8;
            this.UpTime = 0.2;
            this.DownTime = 0.5;
            this.timer = 0;
            this.NextPos = new pc.Vec3(0,0,0);
            this.childrenPos = new pc.Vec3(0,0,0);
            this.cross = false;
            this.nohit = false;
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) 
        {
            
            if(this.Up)
            {
                this.timer += dt;
                if(this.timer > this.UpTime)
                {
                    this.entity.setPosition(this.NextPos.x,this.NextPos.y,this.NextPos.z);
                    if(this.hasChildren || this.nohit)
                    {
                        this.childrenNode.setPosition(this.childrenPos.x,this.childrenPos.y,this.childrenPos.z); 
                    }
                    else
                    {
                        if(this.cross)
                        {
                            this.childrenNode.setPosition(this.childrenPos.x,this.childrenPos.y,this.childrenPos.z); 
                        }
                    }
                    this.Up = false;
                    this.timer = 0;
                }
                else
                {
                    this.entity.translate(0,-this.UpSpeed*dt,0);
                    if(this.hasChildren || this.nohit)
                    {
                        this.childrenNode.translate(0,-this.UpSpeed*dt,0);      
                    }
                    else
                    {
                        if(this.cross)
                        {
                            this.childrenNode.translate(0,-this.UpSpeed*dt,0);      
                        }
                    }

                }
            }
            
            
            if(this.Down)
            {
                this.timer += dt;
                if(this.timer > this.DownTime)
                {
                    this.hasChildren = false;
                    this.nohit = false;
                    if(this.cross)
                    {
                        this.cross = false;
                        this.childrenNode = null;
                    }
                    this.Down = false;
                    this.timer = 0;
                }
                else
                {
                    this.entity.translate(0,-this.DownSpeed*dt,0);
                    if(this.hasChildren || this.nohit)
                    {
                        this.childrenNode.translate(0,-this.DownSpeed*dt,0);
                    }
                    else
                    {
                        if(this.cross)
                        {
                            this.childrenNode.translate(0,-this.DownSpeed*dt,0);
                        }
                    }
                }
            }
        }
    };

    return BoxControl;
});