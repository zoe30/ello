pc.script.create('BoxControl', function (app) {
    // Creates a new BoxControl instance
    var BoxControl = function (entity) {
        this.entity = entity;
    };

    BoxControl.prototype = {
        
        initialize: function () 
        {

            this.ZYaw = true;
            this.Up = false;
            this.Down = false;
            this.DownSpeed = 15;
            this.UpSpeed = 15;
            this.DownTime = 0.2;
            this.UpTime = 0.2;
            this.timer = 0;
            
            this.UpDownAnim = false;
            
            
            this.NextPos = new pc.Vec3(0,0,0);
            this.autorun = false;
            this.changelong = false;
            this.changeshort = false;
            this.speeddown = false;
            this.haschildren = false;
            this.childrennode = null;
            
            
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
                    if(this.haschildren)
                    {
                        this.childrennode.translate(0,(this.UpSpeed-5)*dt,0);
                    }
                    this.entity.translate(0,(this.UpSpeed-5)*dt,0);
            
                }
            }

            if(this.Down)
            {
                this.timer += dt;
                if(this.timer > this.DownTime)
                {
                    this.timer = 0;
                    this.Down = false;
                    this.entity.enabled = false;
                }
                else
                {
                    this.entity.translate(0,-this.DownSpeed*dt,0);
                }
            }
            
            if(this.UpDownAnim)
            {

                this.timer += dt;
                
                if(this.timer < this.DownTime/2+this.UpTime/2)
                {
                    
                    if(this.timer < this.DownTime/2)
                    {
                        this.entity.translate(0,-this.DownSpeed/15*dt,0);
                    }
                    else
                    {
                        this.entity.translate(0,this.UpSpeed/15*dt,0);
                    }    
                    
                }
                else
                {
                    this.timer = 0;
                    this.UpDownAnim = false;
                    this.entity.setPosition(this.NextPos.x,this.NextPos.y,this.NextPos.z);
                }

                    


               
            
            }
            
            
        }
    };

    return BoxControl;
});