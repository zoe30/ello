pc.script.attribute("MoveSpeed","number",3);
pc.script.create('CameraFollow', function (app) {
    // Creates a new CameraFollow instance
    var CameraFollow = function (entity) {
        this.entity = entity;
    };

    CameraFollow.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () 
        {
            this.player = app.root.findByName("player");
            var manager = app.root.findByName("Manager");
            this.gamemanager = manager.script.AppStateManager;
            
            this.backgroundColor = ["#423e40","#bc2849","#4a7778","#ffba6f","#007ebe","#5c515d","#1b3b4e","#ba6689","#2b1c40","#db8d41","#3dadc2"];
            this.nextColor = new pc.Color();
            var pos = this.entity.getPosition();
            this.InitPos = new pc.Vec3(pos.x,pos.y,pos.z);
            
            
            this.timer =0;
            this.bgcolori = Math.floor(pc.math.random(0,11));
            this.nextColor.fromString(this.backgroundColor[this.bgcolori]);
            this.entity.camera.clearColor = new pc.Color(this.nextColor.r,this.nextColor.g,this.nextColor.b,1);
           
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) 
        {
            
            if(this.gamemanager.lose || !this.gamemanager.start)
            {
                return;
            }
            
            
            var pos1 = this.player.getPosition();
            var pos2 = this.entity.getPosition();
            var x = pc.math.lerp(pos2.x,pos1.x+4,this.MoveSpeed*dt);
            var y = pc.math.lerp(pos2.y,4.5,this.MoveSpeed*dt);
            var z = pc.math.lerp(pos2.z,pos1.z+4,this.MoveSpeed*dt);
            this.entity.setPosition(x,y,z);
            
            
            this.timer += dt;
                if(this.timer > 15)
                {
                    var colori = Math.floor(pc.math.random(0,11));
                    if(this.bgcolori == colori && this.bgcolori >0)
                    {
                        this.bgcolori -= 1;
                    }
                    else
                    {
                        this.bgcolori = colori;
                    } 
                    
                    this.nextColor.fromString(this.backgroundColor[this.bgcolori]);
                    this.timer = 0;
                }
                else
                {
                    if(this.timer > 5)
                    {
                        
                        var color = this.entity.camera.clearColor;
                        var r = pc.math.lerp(color.r,this.nextColor.r,dt*0.2);
                        var g = pc.math.lerp(color.g,this.nextColor.g,dt*0.2);
                        var b = pc.math.lerp(color.b,this.nextColor.b,dt*0.2);
                        this.entity.camera.clearColor = new pc.Color(r,g,b,1); 
                    }    
                    
                }
            
            
        },
        
        Init:function()
        {
            this.timer = 0;
            this.bgcolori = Math.floor(pc.math.random(0,11));
            this.nextColor.fromString(this.backgroundColor[this.bgcolori]);
            this.entity.camera.clearColor = new pc.Color(this.nextColor.r,this.nextColor.g,this.nextColor.b,1);
            this.entity.setPosition(this.InitPos.x,this.InitPos.y,this.InitPos.z);
        }
        
    };

    return CameraFollow;
});