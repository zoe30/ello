var CameraFollow = pc.createScript('CameraFollow');

CameraFollow.attributes.add("MoveSpeed",{type:'number',default:3});

CameraFollow.prototype.initialize = function () {
            var app = this.app;
            this.player = app.root.findByName("player");
            this.playercontrol = this.player.script.PlayerControl;
            var manager = app.root.findByName("Manager");
            this.gamemanager = manager.script.GameStateManager;

            var pos = this.entity.getPosition();
            this.InitPos = new pc.Vec3(pos.x,pos.y,pos.z);
            this.left = 12;
            this.up = 12; 
            this.shaketimer = 0;
};

        // Called every frame, dt is time in seconds since last update
CameraFollow.prototype.update = function (dt) {
            
            if(!this.gamemanager.start || !this.gamemanager.startgame)
            {
                return;
            }
            
            if(this.gamemanager.lose)
            {
                if(this.gamemanager.taplose && !this.playercontrol.nohitanim)
                {
                    this.shaketimer += dt;
                    if(this.shaketimer>0.1 && this.shaketimer < 0.6)
                    {
                        this.entity.translate(this.left*dt,this.up*dt,0);
                        this.left = -this.left;
                        if(this.left >0)
                        {
                            this.left -= 48*dt;
                        }
                        this.up = -this.up;
                        if(this.up > 0)
                        {
                            this.up -= 48*dt;
                        }
                    }
                }
                return;
            }
            
            
            var pos1 = this.player.getPosition();
            var pos2 = this.entity.getPosition();
            var x = pc.math.lerp(pos2.x,pos1.x+5,this.MoveSpeed*dt);
            var y = pc.math.lerp(pos2.y,pos1.y+7,this.MoveSpeed*dt);
            var z = pc.math.lerp(pos2.z,pos1.z+5,this.MoveSpeed*dt);
            this.entity.setPosition(x,y,z);

};
        
CameraFollow.prototype.Init = function(){
            
            this.entity.setPosition(this.InitPos.x,this.InitPos.y,this.InitPos.z);
            this.shaketimer = 0;
            this.left = 12;
            this.up = 12;
};

