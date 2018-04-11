pc.script.attribute("Delay","number",1.5);
pc.script.attribute("DropHeight","number",1.5);
pc.script.attribute("DropSpeed","number",2);
pc.script.create('ApplyGravity', function (app) {
    // Creates a new ApplyGravity instance
    var ApplyGravity = function (entity) {
        this.entity = entity;
    };

    ApplyGravity.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () 
        {
            this.timer = 0;
            this.playercontrol = app.root.findByName("player").script.PlayerControl;
            this.InitPos = new pc.Vec3(this.entity.getPosition().x,this.entity.getPosition().y,this.entity.getPosition().z);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) 
        {
             
             if(!this.playercontrol)
             {
                   this.playercontrol = app.root.findByName("player").script.PlayerControl;
                   return;
             }
            
            
            if(!this.playercontrol.start || this.playercontrol.lose || !this.playercontrol.startgame)
            {
                return;
            }
            
            this.timer += dt;
            if(this.timer > this.Delay)
            {
                
                if( this.timer < this.Delay + 1)
                {
                    this.entity.translate(0,-this.DropSpeed*dt,0);
                    this.entity.collision.enabled = false;
                }
                
            }
        },
        
        Init:function()
        {
             this.entity.setPosition(this.InitPos.x,this.InitPos.y,this.InitPos.z);
             this.entity.collision.enabled = true;
             this.timer = 0;
        }
        
    };

    return ApplyGravity;
});