pc.script.create('CameraFollow', function (app) {
    // Creates a new CameraFollow instance
    var CameraFollow = function (entity) {
        this.entity = entity;
    };

    CameraFollow.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            
            var manager = app.root.findByName('Manager');
            this.playercontrol = manager.script.PlayerControl;
            this.gamemanager = manager.script.GameStateManager;
            
            this.backgroundColor = ["#423e40","#bc2849","#4a7778","#ffba6f","#007ebe","#5c515d","#1b3b4e","#ba6689","#2b1c40","#db8d41","#3dadc2"];
            this.initHeight = 11.5;
            this.step = 0.3;
            var pos = this.entity.getPosition();
            this.InitPos = new pc.Vec3(pos.x,pos.y,pos.z);
            this.InitorthoHeight = this.entity.camera.orthoHeight;
            
            this.nextColor = new pc.Color(1,1,1,1);
            this.timer = 16;
            this.bgcolori = Math.floor(pc.math.random(0,11));
            this.nextColor.fromString(this.backgroundColor[this.bgcolori]);
            this.entity.camera.clearColor = new pc.Color(this.nextColor.r,this.nextColor.g,this.nextColor.b,1);
            
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            
            if(!this.gamemanager.start)
            {
                return;
            }
            if(this.gamemanager.lose)
            {
                var orthoheight = this.entity.camera.orthoHeight;
                this.entity.camera.orthoHeight = pc.math.lerp(orthoheight,this.InitorthoHeight+this.playercontrol.score*this.step,dt);
                var vec3Pos = this.entity.getPosition();
                var y = pc.math.lerp(vec3Pos.y,this.initHeight+this.playercontrol.score*this.step,dt);
                this.entity.setPosition(vec3Pos.x,y,vec3Pos.z);
                
                return;
            }
            
            
                var pos0 = this.entity.getPosition();
                var  y1 = this.initHeight + this.playercontrol.score*this.step;
                
                var y0 = pc.math.lerp(pos0.y,y1,dt);
                this.entity.setPosition(pos0.x,y0,pos0.z);    

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
            this.timer = 16;
            this.bgcolori = Math.floor(pc.math.random(0,11));
            this.nextColor.fromString(this.backgroundColor[this.bgcolori]);
            this.entity.camera.clearColor = new pc.Color(this.nextColor.r,this.nextColor.g,this.nextColor.b,1);
            this.entity.setPosition(this.InitPos.x,this.InitPos.y,this.InitPos.z);
            this.entity.camera.orthoHeight = this.InitorthoHeight;
        }
        
        
        
    };

    return CameraFollow;
});