pc.script.create('CameraFollow', function (app) {
    // Creates a new CameraFollow instance
    var CameraFollow = function (entity) {
        this.entity = entity;
    };

    CameraFollow.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () 
        {
            
            this.xs = 2.5;
            this.ys = 0.8;
            this.d = 6;
            this.hs = 0.44;
            this.xd = 1;
            
            this.points = [];
            
            this.InitPoint();
            
            
            this.backgroundColor = ["#423e40","#bc2849","#4a7778","#ffba6f","#007ebe","#5c515d","#ba6689","#db8d41","#3dadc2"];
            this.nextColor = new pc.Color();
            
            
            var manager = app.root.findByName('Manager');
            this.gamemanager = manager.script.GameStateManager;

            this.Rotation = [0,45,90,135,180,-135,-90,-45];
            
            var player = app.root.findByName('player');
     
            this.gamecontrol = player.script.GameControl;
            
            var pos = this.entity.getPosition();
            this.InitPos = new pc.Vec3(pos.x,pos.y,pos.z);

            this.JumpSpeed = 12;
            this.RSpeed = 10;
   
            this.r = 0;
            
            this.timer =0;
            this.bgcolori = Math.floor(pc.math.random(0,9));
            this.nextColor.fromString(this.backgroundColor[this.bgcolori]);
            this.entity.camera.clearColor = new pc.Color(this.nextColor.r,this.nextColor.g,this.nextColor.b,1);
            
            
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt)
        {
      
           if(!this.gamemanager.start || this.gamemanager.lose || !this.gamemanager.startgame)
           {
               return;
           }
            
           var pos =  this.entity.getPosition();        
           var x = (1-this.JumpSpeed*dt)*pos.x+this.JumpSpeed*dt*this.points[this.gamecontrol.nextIndex][0];
           var y = (1-this.JumpSpeed*dt)*pos.y+this.JumpSpeed*dt*this.points[this.gamecontrol.nextIndex][1]; 
           this.entity.setPosition(x,y,pos.z);
           
           var rot = this.entity.getEulerAngles();
            
           this.r = pc.math.lerpAngle(this.r,this.Rotation[this.gamecontrol.nextIndex],this.RSpeed*dt);
           this.r = this.r % 360;
            
           
           this.entity.setEulerAngles(rot.x,rot.y,this.r);
            
           this.entity.translate(0,0,-this.gamecontrol.MoveSpeed*dt);
            
            
            
            this.timer += dt;
                if(this.timer > 15)
                {
                    var colori = Math.floor(pc.math.random(0,9));
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
        
        InitPoint:function()
        {
            var pos0 = [],pos1 = [],pos2 = [],pos3 = [],pos4 = [],pos5 = [],pos6 = [],pos7 = [];

            var x = 0,y = this.d,Sqrt2 = Math.sqrt(2);
            
            var d0 = this.d - this.ys/2-this.hs/2;
            
            pos0.push(x);
            pos0.push(y);
            
            x = this.xs * (0.5+Sqrt2/4) + this.xd -Sqrt2/4*this.hs-d0*Sqrt2/2;
            y = 0.5*this.ys +Sqrt2/4*this.xs+Sqrt2/4*this.hs+d0*Sqrt2/2;
            pos1.push(x);
            pos1.push(y); 
            pos7.push(-x);
            pos7.push(y);
            
            
            
            x = this.xs*(0.5+Sqrt2/2)+this.xd-this.hs*0.5-d0;
            y = this.ys*0.5+(0.5+0.5*Sqrt2)*this.xs+this.xd;
            pos2.push(x);
            pos2.push(y);
            pos6.push(-x);
            pos6.push(y);
            
            x = (Sqrt2/4+0.5)*this.xs+this.xd-Sqrt2/4*this.hs-d0*Sqrt2/2;
            y = 0.5*this.ys+(1+3/4*Sqrt2)*this.xs+2*this.xd-Sqrt2/4*this.hs-d0*Sqrt2/2;
            pos3.push(x);
            pos3.push(y);
            pos5.push(-x);
            pos5.push(y);
            
            x = 0;
            y = 2*this.xd+0.5*this.ys+(Sqrt2+1)*this.xs-0.5*this.hs-d0;
            pos4.push(x);
            pos4.push(y);
            
            this.points.push(pos0);
            this.points.push(pos1);
            this.points.push(pos2);
            this.points.push(pos3);
            this.points.push(pos4);
            this.points.push(pos5);
            this.points.push(pos6);
            this.points.push(pos7); 
           
        },
        
        Init:function()
        {
            
            this.timer = 0;
            this.bgcolori = Math.floor(pc.math.random(0,9));
            this.nextColor.fromString(this.backgroundColor[this.bgcolori]);
            this.entity.camera.clearColor = new pc.Color(this.nextColor.r,this.nextColor.g,this.nextColor.b,1);
        
            this.entity.setPosition(this.InitPos.x,this.InitPos.y,this.InitPos.z);
            this.entity.setEulerAngles(-10,0,0);
            this.r = 0;
    
    
        }
        
        
        
        
    };

    return CameraFollow;
});