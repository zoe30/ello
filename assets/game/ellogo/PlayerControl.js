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
             this.startgame = false; 
             
             this.tips = app.root.findByName('tips');
             
             this.tips.enabled = false;
            
            
             
             
             this.timer = 0.06;
             this.IsGrounded = true;
             
             this.showUI = false;
             this.initPos = new pc.Vec3(this.entity.getPosition().x,this.entity.getPosition().y,this.entity.getPosition().z);
             this.shadow = this.entity.getChildren()[0];
            
            this.playtimer =0;

            this.halfscreenwidth = window.innerWidth/2; 

            var self = this;
            
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
                    
                    var lastdir = self.forward; 
                    
                    var touches = event.changedTouches;

                    if(touches[0].x < self.halfscreenwidth)
                    {
                       self.forward = false;
                    }
                    else
                    {
                        self.forward = true;                      
                    }
                     
                    self.playSound("left");
                     
                    if(!self.startgame)
                    {
                         self.tips.enabled = false;
                         self.startgame = true;
                         startHandle();
                         return;
                    }

                     if(self.forward != lastdir)
                     {
                         self.score++;
                     }
                     
                     var scoreui = document.getElementById("score");
                     scoreui.innerHTML = self.score.toString();
                     
                     if(self.score % 50 === 0)
                    {
                    
                        if(self.MoveSpeed < 3)
                        {
                            self.MoveSpeed += 0.5;
                        }
                    }
                     
                     
                 },false);
 
             }
            else
            {
                app.mouse.on(pc.EVENT_MOUSEDOWN,function(event){
                    
                    if(!self.start)
                     {
                         return;
                     }
                     if(self.lose)
                     {
                         return;
                     }
                       
                    var lastdir = self.forward;
                    
                    if(event.x < self.halfscreenwidth)
                    {
                        self.forward = false;
                    }
                    else
                    {
                        self.forward = true; 
    
                    }

                    self.playSound("left");
                    if(!self.startgame)
                    {
                         self.tips.enabled = false;
                         self.startgame = true;
                         return;
                    }

                     if(self.forward != lastdir)
                     {
                         self.score++;
                     }
                     
                     var scoreui = document.getElementById("score");
                     scoreui.innerHTML = self.score.toString();
                     
                     if(self.score % 50 === 0)
                    {
                    
                        if(self.MoveSpeed < 3)
                        {
                            self.MoveSpeed += 0.5;
                        }
                    }
                    
                },false);
            }

        },

        update: function (dt) 
        {
            
             if(this.lose)
             {
                 
                 if(!this.showUI)
                 {
                     this.playSound("end");

                     this.shadow.enabled = false;
                     
                     
                     this.showUI = true;
                     var scoreinfo={"score":this.score,'usermask':parseInt(this.playtimer),"score1":(this.score+17),'usermask1':parseInt(this.playtimer+9)};
                     gameover(scoreinfo);
                     
                 }
                 this.ApplyGravity(dt);
                 return;  
             }
            
            
            
            
            if(!this.start || !this.startgame)
            {
                return;
            }
          
            this.playtimer += dt;
            
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
            
            var isGrounded = false;
       
            
            
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
             
             //this.start = false;
             this.lose = false;
             this.startgame = false;
            
             this.MoveSpeed = 2;
             
             this.timer = 0.06;
             this.IsGrounded = true;
             
             this.showUI = false;
            
             this.entity.setPosition(this.initPos.x,this.initPos.y,this.initPos.z);
             this.shadow.enabled = true;
            
            this.tips.enabled = true;
            
            this.playtimer = 0;
        }
        
        
        
        
        
    };

    return PlayerControl;
});