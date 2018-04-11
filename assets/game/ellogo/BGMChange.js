pc.script.create('BGMChange', function (app) {
    // Creates a new BGMChange instance
    var BGMChange = function (entity) {
        this.entity = entity;
    };

    BGMChange.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () 
        {
              this.timer = 0;
              this.index = 0;
              this.entity.sound.slot("bgm1").play();
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) 
        {
            this.SwitchBGM(dt);
        },
        
        
        SwitchBGM:function(dt)
        {
            this.timer += dt;
            if(this.timer > 31.1)
            {
                this.timer = 0;
                if(this.index)
                {
                    this.entity.sound.slot("bgm1").play();
                    this.index = 0;
                }
                else
               {
                   this.entity.sound.slot("bgm2").play();
                   this.index = 1;
               }
               
            }
        }
        
        
    };

    return BGMChange;
});