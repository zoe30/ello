pc.script.attribute("MoveSpeed","number",1);

pc.script.create('AirManager', function (app) {
    // Creates a new AirManager instance
    var AirManager = function (entity) {
        this.entity = entity;
    };

    AirManager.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () 
        {
            
            
            var manager = app.root.findByName("Manager");
            this.gamemanager = manager.script.AppStateManager;
            
            
            this.Delay = 20;
            
            this.timer = this.Delay+1;
            this.airs = this.entity.getChildren();
            this.airlength = this.airs.length;
            this.airindex = 0;
            this.Xpos = 2.5;
            this.Ypos = 0;
            this.Zpos = -35;
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) 
        {
            
            if(this.gamemanager.lose || !this.gamemanager.start)
            {
                return;
            }
            
            
            
            this.timer += dt;
            
            if(this.timer > this.Delay)
            {
               
                this.Ypos = pc.math.random(-1,3);
                this.airs[this.airindex].setLocalPosition(this.Xpos,this.Ypos,this.Zpos);
                this.timer = 0;
            }
            else
            {
                this.airs[this.airindex].translate(0,0,this.MoveSpeed*dt);
            }
            
            
            
        },
        
        Init:function()
        {
            this.airs[this.airindex].setLocalPosition(this.Xpos +1,this.Ypos,this.Zpos);
            this.timer = this.Delay +1;
            
            this.airindex ++;
            if(this.airindex >= this.airlength)
            {
                this.airindex = 0;
            }
        }
        
        
        
        
    };

    return AirManager;
});