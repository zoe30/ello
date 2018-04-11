pc.script.attribute("MoveSpeed","number",1);
pc.script.create('PlayerControl', function (app) {
    // Creates a new PlayerControl instance
    var PlayerControl = function (entity) {
        this.entity = entity;
    };

    PlayerControl.prototype = {
       
        initialize: function () 
        {    
  
             this.forward = true;
             this.gravityspeed = 0;
             this.score = 0;
             
             this.start = false;
             this.lose = false;
  
             var self = this;
             
             this.timer = 0.06;
             this.IsGrounded = true;
             
             this.showUI = false;
             this.initPos = new pc.Vec3(this.entity.getPosition().x,this.entity.getPosition().y,this.entity.getPosition().z);
             this.shadow = this.entity.getChildren()[0];
             
            
             if(app.touch)
             {
            
                 app.touch.on(pc.EVENT_TOUCHSTART,function(event){
                     if(!self.start)
                     {
                         return;
                     }
                     if(self.lose)
                     {
                         return;
                     }
                   
                    self.playSound("left");
                    
                    
                     self.forward = !self.forward;
                     self.score++;
                     var scoreui = document.getElementById("score");
                     scoreui.innerHTML = self.score.toString();
                 },self);
 
             }
            
            
            
            
        },

        update: function (dt) 
        {
            
             if(this.lose)
             {
                 
                 if(!this.showUI)
                 {
                     this.playSound("end");
                     var endUI = document.getElementById("uiend");
                     endUI.style.display = "block";
                     
                     var soundui = document.getElementById("sound");
                     if(soundui.classList.contains("on"))
                     {
                          window.localStorage.setItem("sound","on");
                     }
                     else
                     {
                          window.localStorage.setItem("sound","off");
                     }
                     
                      this.shadow.enabled = false;
                     
                     
                     this.showUI = true;

                     var scoreinfo={"score":this.score};
                     gameover(scoreinfo);
                 }
                 this.ApplyGravity(dt);
                 return;  
             }
            
            if(app.mouse.wasPressed(pc.MOUSEBUTTON_LEFT))
            {
                if(!this.start)
                {
                    
                    return;
                }
                
                if(this.lose)
                {
                    
                    return;
                }
              
                this.playSound("left");
       
              
                
                
                this.forward = !this.forward;
                this.score++;
                var scoreui = document.getElementById("score");
                scoreui.innerHTML = this.score.toString();
            }
            
            
            if(!this.start)
            {
                return;
            }
          
           this.timer += dt;
            if(this.timer > 0.05)
            {
                this.timer = 0;
                this.IsGrounded = this.CheckGrounded();
                 
            }
           
            if(this.IsGrounded)
            {
                this.Move(dt);    
            }
            else
            {  
               this.ApplyGravity(dt);
            }
            
        },
        

        
        CheckGrounded:function()
        {
            var startpos = this.entity.getPosition();
            var endpos = new pc.Vec3(startpos.x,startpos.y - 0.3,startpos.z);
            //var forwardpos = new pc.Vec3(this.forward?(startpos.x - 0.2):stratpos.x,startpos.y,this.forward ? startpos.z:(startpos.z-0.2));
            var isGrounded = false;
           /* var self = this;
            app.systems.rigidbody.raycastFirst(startpos,forwardpos,function(result){
                if(result.name === "treat")
                {
                    self.score += 2;
                    result.entity.enabled = false;
                }
            });*/
            
            
            app.systems.rigidbody.raycastFirst(startpos,endpos,function(result){
                isGrounded = true;
            });
            return isGrounded;
        },
        
        
        Move:function(dt)
        {
           if(this.forward)
           {
               this.entity.translate(0,0,-this.MoveSpeed*dt);  
           }
           else
           {
               this.entity.translate(-this.MoveSpeed*dt,0,0);  
           }
        },
        
        ApplyGravity:function(dt)
        {
            if(!this.lose)
            {
               this.lose = true;
            }
            
            this.gravityspeed += 9.8*dt;
            if(this.forward)
             {
                this.entity.translate(0,-this.gravityspeed*dt,-this.MoveSpeed*dt); 
             }
             else
             {
                 this.entity.translate(-this.MoveSpeed*dt,-this.gravityspeed*dt,0); 
             }
            
        },
        
        
        
        playSound:function(name)
        {

            this.entity.sound.slot(name).play();
        },
        
        
        
        Init:function()
        {
             this.forward = true;
             this.gravityspeed = 0;
             this.score = 0;
             
             this.start = false;
             this.lose = false;
  
             var self = this;
             
             this.timer = 0.06;
             this.IsGrounded = true;
             
             this.showUI = false;
            
             this.entity.setPosition(this.initPos.x,this.initPos.y,this.initPos.z);
             this.shadow.enabled = true;
        }
        
        
        
        
        
    };

    return PlayerControl;
});