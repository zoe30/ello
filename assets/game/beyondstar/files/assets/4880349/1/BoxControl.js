var BoxControl = pc.createScript('BoxControl');

   
BoxControl.prototype.initialize =  function () {
            this.UpAnim = false;
            this.DownAnim = false;
            this.UpSpeed = 20;
            this.DownSpeed = 20;
            this.UpTime = 0.1;
            this.DownTime = 0.2;
            this.spanXdir = false;
            this.NextPos = new pc.Vec3(0,0,0);
            
            this.hasChildren = false;
            this.hit = false;
            this.childrenNode = null;
            this.childrenNextPos = new pc.Vec3(0,0,0);
            //this.hascoin = false;
            this.timer = 0;
            
};


BoxControl.prototype.update =  function (dt) {
            if(this.UpAnim)
            {
                this.timer += dt;
                if(this.timer > this.UpTime)
                {
                    this.timer = 0;
                    this.UpAnim = false;
                    this.entity.setPosition(this.NextPos.x,this.NextPos.y,this.NextPos.z);
                    if(this.hasChildren)
                    {
                        this.childrenNode.setPosition(this.childrenNextPos.x,this.childrenNextPos.y,this.childrenNextPos.z);
                    }
                }
                else
                {
                    this.entity.translate(0,-this.UpSpeed*dt,0);
                    if(this.hasChildren)
                    {
                        this.childrenNode.translate(0,-this.UpSpeed*dt,0);   
                    }
                }
            }
            
            if(this.DownAnim)
            {
                this.timer += dt;
                if(this.timer > this.DownTime)
                {
                    this.timer = 0;
                    this.DownAnim = false;
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
  
};
