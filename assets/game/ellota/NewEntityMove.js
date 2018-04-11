pc.script.create('NewEntityMove', function (app) {

    var MIN_DISTANCE = -3;
    var MAX_DISTANCE = 3;
   
    
    var NewEntityMove = function (entity) 
    {
        this.entity = entity;
       
    };

    NewEntityMove.prototype = {
       
        initialize: function () 
        {
            this.Yaw = this.entity.getPosition().x < MIN_DISTANCE?true:false;
            this.Move = true;
            this.MoveSpeed = 3.0;
            this.X = MIN_DISTANCE-0.1;
            this.Z = MIN_DISTANCE-0.1;
            this.dir = 1;
            
            this.applyGravity = false;
            this.moveSpeed = 0;
            this.a = -9.8;
            this.hide = -5;
        },

        update: function (dt)
        {
            
             if(this.applyGravity)
            {
                 if(this.entity.getPosition().y < this.hide)
                 {
                    this.entity.destroy();
                 }
                 this.moveSpeed += this.a*dt;
                 this.entity.translate(0,this.moveSpeed * dt,0);
            }
            
            
            if(this.Move)
            {
                if(this.Yaw)
                {
                    if(this.X >  MAX_DISTANCE)
                    {
                       this.dir = -1;
                    }
                    else
                    {
                      if(this.X < MIN_DISTANCE)
                      {
                       this.dir = 1;
                      }  
                    }    
                    
                    this.X += this.dir*this.MoveSpeed*dt;

                    this.entity.translate(this.dir*this.MoveSpeed*dt,0,0);
                }
                else
                {
                    if(this.Z >  MAX_DISTANCE)
                    {
                       this.dir = -1;
                    }
                    else
                    {
                       if(this.Z < MIN_DISTANCE)
                       {
                         this.dir = 1;
                       }
                    }
                  
                    this.Z += this.dir * this.MoveSpeed * dt;
                    this.entity.translate(0,0,this.dir * this.MoveSpeed * dt);
                }
            }
        }
    };

    return NewEntityMove;
});