pc.script.create('BoxControl', function (app) {
    // Creates a new BoxControl instance
    var BoxControl = function (entity) {
        this.entity = entity;
    };

    BoxControl.prototype = {
        
        initialize: function () 
        {
            this.XDir = 0;
            this.YDir = 0;
            this.ZDir = 0;
            this.Up = false;
            this.Down = false;
            this.DownSpeed = 12;
            this.UpSpeed = 15;
            this.DownTime = 1;
            this.UpTime = 0.2;
            this.timer = 0;
            this.NextPos = new pc.Vec3(0,0,0);
            this.hasChildren = false;
            this.childrenNode = null;
            this.autorun = false;
        },

      
        update: function (dt) 
        {
            if(this.Up)
            {
                this.timer += dt;
                if(this.timer > this.UpTime)
                {
                    this.timer = 0;
                    this.Up = false;
                    this.entity.setPosition(this.NextPos.x,this.NextPos.y,this.NextPos.z);
                    
                }
                else
                {
                    this.entity.translate(0,this.UpSpeed*dt,0);
                    if(this.hasChildren)
                    {
                        this.childrenNode.translate(0,this.UpSpeed*dt,0);
                    }
                }
            }
            
            
            if(this.Down)
            {
                this.timer += dt;
                if(this.timer > this.DownTime)
                {
                    
                    this.timer = 0;
                    this.Down = false;
                    if(this.hasChildren)
                    {
                        this.childrenNode.setPosition(0,-100,0);
                        this.hasChildren = false;    
                    }
                    
                    
                    
                }
                else
                {
                    this.entity.translate(0,-this.DownSpeed*dt,0);
                    if(this.hasChildren)
                    {
                        this.childrenNode.translate(0,-this.DownSpeed*dt,0);
                    }
                }
            }
            
            
        }
    };

    return BoxControl;
});