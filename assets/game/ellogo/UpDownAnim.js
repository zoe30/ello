pc.script.create('UpDownAnim', function (app) {
    // Creates a new UpDownAnim instance
    var UpDownAnim = function (entity) {
        this.entity = entity;
    };

    UpDownAnim.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () 
        {
            this.Up = false;
            this.Down = false;
            this.timerup = 0;
            this.timerdown = 0;
            this.MoveSpeed = 6;  
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) 
        {
            if(this.Up)
            {
                
                this.timerup += dt;
               if(this.timerup < 0.33)
               {
                  this.entity.translate(0,this.MoveSpeed*dt,0);  
               }
               else
               {
         
                  this.entity.setPosition(this.entity.getPosition().x,0,this.entity.getPosition().z);
                  this.entity.collision.enabled = true;
                  this.timerup =0;
                  this.Up = false; 
               
 
               }
               
            }
         
            if(this.Down)
            {
                
                this.timerdown += dt;
                if(this.timerdown < 0.333)
                {
                   this.entity.collision.enabled = false;
                   this.entity.translate(0,-this.MoveSpeed*dt,0);  
                }
                else
                {
                    
                    this.timerdown = 0;
                    this.Down = false;
                } 
            }
        }
    };

    return UpDownAnim;
});