pc.script.create('ApplyGravity', function (app) {
    // Creates a new ApplyGravity instance
    var ApplyGravity = function (entity) 
    {
        this.entity = entity;
        this.canMove = false;
    };

    
    ApplyGravity.prototype = {
        
        initialize: function () 
        {
            
            this.MoveSpeed = 0;
            this.a = -9.8;
            this.hide = -5;
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) 
        {
            if(!this.canMove)
            {
                return;
            }
            if(this.entity.getPosition().y < this.hide)
            {
               this.entity.destroy();
            }
            this.MoveSpeed += this.a*dt;
            this.entity.translate(0,this.MoveSpeed * dt,0);
        
           
        }
    };

    return ApplyGravity;
});