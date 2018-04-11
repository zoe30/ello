pc.script.attribute("MoveSpeed","number",1);
pc.script.attribute("cloudgroup1","entity",null);
pc.script.attribute("cloudgroup2","entity",null);

pc.script.create('cloudanim', function (app) {
    // Creates a new Cloudanim instance
    var Cloudanim = function (entity) 
    {
        this.entity = entity;
    };

    Cloudanim.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () 
        {
            
            var pos = this.cloudgroup2.getPosition();
            this.InitPos = new pc.Vec3(pos.x,pos.y,pos.z);
            
            var manager = app.root.findByName("Manager");
            this.gamemanager = manager.script.AppStateManager;
            
            
            this.cloud1 = false;
            
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) 
        {
            if(this.gamemanager.lose || !this.gamemanager.start)
            {
                return;
            }
            
            this.cloudgroup1.translate(0,0,this.MoveSpeed*dt);
            this.cloudgroup2.translate(0,0,this.MoveSpeed*dt);
            
            
           
        },
        
        
        Init:function()
        {
            if(this.cloud1)
            {
                this.cloudgroup1.setPosition(0,0,0);
                this.cloudgroup2.setPosition(this.InitPos.x,this.InitPos.y,this.InitPos.z);
                this.cloud1 = false;
            }
            else
            {
               this.cloudgroup2.setPosition(0,0,0);
               this.cloudgroup1.setPosition(this.InitPos.x,this.InitPos.y,this.InitPos.z); 
               this.cloud1 = true;
            }
            
        }
        
        
    };

    return Cloudanim;
});