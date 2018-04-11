pc.script.attribute("PerfectEffect","entity",null);
pc.script.attribute("box1Mat","asset",null,{type:'material',max:1});
pc.script.attribute("box2Mat","asset",null,{type:'material',max:1});

pc.script.create('PlayerControl', function (app) {
    // Creates a new PlayerControl instance
    var PlayerControl = function (entity) {
        this.entity = entity;
    };

    PlayerControl.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            
            
            
            var manager = app.root.findByName('Manager');
            this.gamemanger = manager.script.GameStateManager;
            
            this.prefab1 = app.root.findByName('prefab1');
            this.prefab2 = app.root.findByName('prefab2');
            
            
            
            this.needdestroyobjs = [];
            this.newEntity = null;
            this.score = 0;
            this.step = 0.3;
            this.lastScale = new pc.Vec3(2,0.3,2);
            this.newScale = new pc.Vec3(2,0.3,2);
            this.newPosition = new pc.Vec3(0,0,0);
            this.anotherPosition = new pc.Vec3(0,0,0);
            this.newYaw = true;
            this.moveSpeed = 1;
            this.NewScript = null;
            this.Color = new pc.Color(0,0,0,1);
            this.lastColor = new pc.Color(0,0,0,1);
            this.Perfect = 0;
            this.PerfectAnim = false;

            this.rk = 0.1;
            this.gk = 0.1;
            this.bk = 0.1;
            this.r = pc.math.random(0,5)/10;
            this.g = pc.math.random(0,5)/10;
            this.b = pc.math.random(0,5)/10;
            this.index = 0;
            if(this.g > this.r && this.g >this.b)
            {
                this.index = 1;
            }
            if(this.b > this.r && this.b >this.g)
            {
                this.index = 2;
            }

            this.Color.set(this.r,this.g,this.b,this.a);
            this.baseboxmat = app.assets.get(this.box1Mat).resource;
            this.baseboxmat.diffuse = this.Color;
            this.baseboxmat.update();
            
            this.perfectmat = app.assets.get(this.box2Mat).resource;
            
            
           if(app.touch)
           {
                app.touch.on(pc.EVENT_TOUCHSTART,this.SpanCube,this);
           }
          else
          {
               app.mouse.on(pc.EVENT_MOUSEDOWN,this.SpanCube,this); 
          }

          this.playsound(-2);
            
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            if(this.gamemanger.lose)
            {
                return;
            }
            
            if(!this.gamemanger.start)
            {
                return;
            }
            
            if(!this.gamemanger.startgame)
            {
                return;
            }
            
             if(this.PerfectAnim)
             {
                   
                   var a =  this.perfectmat.opacity;
                   a -= 2*dt;
                   if(a <= 0)
                   {
                       
                       this.PerfectAnim = false;     
                   }
                   this.perfectmat.opacity = a;
                   this.perfectmat.update();
             }
   
        },
        CreateCube:function()
        {
           var entity = this.prefab1.clone();
           entity.setLocalScale(this.newScale.x,this.newScale.y,this.newScale.z);
           this.newYaw = !this.newYaw;
           entity.setPosition(this.newYaw ?this.newPosition.x:-3.1,(this.score+1)*this.step,this.newYaw?-3.1:this.newPosition.z);
           var material = new pc.PhongMaterial();
           material.shadingModel = pc.SPECULAR_BLINN;
           material.diffuse = this.Color;
           material.update();
           entity.model.model.meshInstances[0].material = material;

           switch(this.index)
           {
               case 0 :
                   
                       this.r += this.rk; 
                       if(this.r <0)    
                       {
                           this.rk = 0.1;
                           this.index = Math.floor(pc.math.random(1,3));
                       }
                       if(this.r >1)
                       {
                          this.rk = -0.1;
                          this.index = Math.floor(pc.math.random(1,3));
                       }
                       
                       break;
               case 1:
                       this.g += this.gk; 
                       if(this.g < 0)
                       {
                           this.gk = 0.1;
                           this.index = Math.floor(pc.math.random(0,2));
                           if(this.index == 1)
                           {
                               this.index = 2;
                           }
                       }
                       if(this.g >1)
                       {
                          this.gk = -0.1;
                          this.index = Math.floor(pc.math.random(0,2));
                          if(this.index == 1)
                          {
                               this.index = 2;
                          }
                       }
                       
                       break;
               case 2:
                       this.b += this.bk;
                       if(this.bk <0)
                       {
                           this.bk = 0.1;
                           this.index = Math.floor(pc.math.random(0,2));
                       }    
                       if(this.b >1)
                       {
                          this.bk = -0.1;
                          this.index = Math.floor(pc.math.random(0,2));
                       }
                        
                       break;
               default:
                       break;
           }    
       
          
           this.Color.set(this.r,this.g,this.b,this.a); 

           app.root.addChild(entity);
           this.newEntity = entity;
           this.NewScript = this.newEntity.script.NewEntityMove;
           if(this.Perfect >0)
           {
               this.NewScript.MoveSpeed += this.Perfect * 0.25;
           }
           this.NewScript.MoveSpeed += Math.round(this.score/50)*0.5;
           
        },
        
        CreateStaticRigibodyCube:function(entity)
        {
            entity.setLocalScale(this.newScale.x,this.newScale.y,this.newScale.z);
            entity.setPosition(this.newPosition.x,(this.score+1)*this.step,this.newPosition.z);
            entity.removeComponent("script");
            entity.enabled = true;
            this.needdestroyobjs.push(entity);
        },
        
        CreateDynamicRigibodyCube:function()
        {
            
            var entity = this.prefab2.clone();
            entity.setLocalScale((this.newYaw?this.newScale.x:(this.lastScale.x -this.newScale.x)),this.newScale.y,(this.newYaw?(this.lastScale.z -this.newScale.z):this.newScale.z));
            entity.setPosition(this.anotherPosition.x,(this.score+1)*this.step,this.anotherPosition.z);
            var material = new pc.PhongMaterial();
            material.shadingModel = pc.SPECULAR_BLINN;
            material.diffuse = this.lastColor;
            material.update();
            entity.model.model.meshInstances[0].material = material;
            entity.script.ApplyGravity.canMove = true;
            app.root.addChild(entity);
           
        },
        
        
        
        
        SpanCube:function(event)
        {
          
           if(!this.gamemanger.start) 
           {
               return;
           }
           if(this.gamemanger.lose)
           {
               return;
               
           }
           if(!this.gamemanger.startgame)
           {
               this.gamemanger.startgame = true;
               this.CreateCube();
               this.gamemanger.GameStartGame();
               return;
           }
            
 
          this.NewScript.Move = false;
          this.lastScale.x = this.newScale.x;
          this.lastScale.y = this.newScale.y;
          this.lastScale.z = this.newScale.z;
          this.anotherPosition.x = this.newPosition.x;
          this.anotherPosition.y = this.newPosition.y;
          this.anotherPosition.z = this.newPosition.z;
          if(!this.newYaw)
          {
             var x = this.newEntity.getPosition().x - this.newPosition.x;
             if(Math.abs(x) >= this.newScale.x)
             {
                 this.gamemanger.lose = true;
             }
             else
             {
                 var newscaleX = this.newScale.x -Math.abs(x);
                 if(newscaleX >= 0.925*this.newScale.x)
                 {
                     
                 }
                 else
                 {
                   if(x > 0)
                   {
                    this.newPosition.x = this.newPosition.x + (this.newScale.x - newscaleX)/2.0;
                    this.anotherPosition.x = this.newPosition.x + (this.newScale.x-newscaleX/2.0);
                   }
                  else
                  {
                    this.newPosition.x = this.newPosition.x - (this.newScale.x - newscaleX)/2.0;
                    this.anotherPosition.x = this.newPosition.x - (this.newScale.x-newscaleX/2.0);
                  }
                   this.newScale.x = newscaleX;     
                }
                 
                 
             }
          }
          else
          {
             var z = this.newEntity.getPosition().z - this.newPosition.z;
            
             if(Math.abs(z) >= this.newScale.z)
             {
                 this.gamemanger.lose = true;
             }
             else
             {
                 var newscaleZ =  this.newScale.z - Math.abs(z);
                 if(newscaleZ >= this.newScale.z*0.925)
                 {
                     
                 }
                 else
                 {
                     if(z > 0)
                     {
                       this.newPosition.z = this.newPosition.z + (this.newScale.z - newscaleZ)/2.0;
                       this.anotherPosition.z = this.newPosition.z + (this.newScale.z-newscaleZ/2.0);
                     }
                     else
                     {
                       this.newPosition.z = this.newPosition.z - (this.newScale.z - newscaleZ)/2.0; 
                       this.anotherPosition.z = this.newPosition.z -(this.newScale.z-newscaleZ/2.0);
                     }
                     this.newScale.z = newscaleZ; 
                }
                 
             }
          }
            
          if(this.gamemanger.lose)
          {
                
               if(!this.NewScript.applyGravity)
               {

                   this.NewScript.applyGravity = true;
                   this.playsound(-3);
            
                   console.log("Your Score is:   "+this.score);
               }
               
             
               
          }
          else
          {
               this.newEntity.enabled = false;   
               var color0 = this.newEntity.model.model.meshInstances[0].material.diffuse;
               this.lastColor.set(color0.r,color0.g,color0.b,color0.a);
               
    
               if(this.anotherPosition.x != this.newPosition.x || this.anotherPosition.z != this.newPosition.z)
               {
                   this.CreateDynamicRigibodyCube();
                   this.Perfect = 0;
                   this.playsound(this.Perfect);
               }
               else
               {
                   this.Perfect++;
                   this.playsound(this.Perfect);
                   this.PerfectEffect.setPosition(this.newPosition.x,(this.score+0.5)*this.step,this.newPosition.z);
                   this.PerfectEffect.setLocalScale(this.newScale.x+0.15,1,this.newScale.z+0.15);
                   this.PerfectEffect.enabled = true;
                   this.PerfectAnim = true;
                   
                   this.perfectmat.opacity = 1;
                   this.perfectmat.update();
                    if(this.Perfect >= 7 && this.Perfect != this.score+1 )
                   {
                       
                       if(!this.newYaw)
                       {
                          if(this.newScale.x<2)
                          {
                               
                                   var disX1 = -1 -this.newPosition.x+this.newScale.x/2;
                                  
                                   if(Math.abs(disX1) >0.01)
                                   {
                                        if( -disX1 > 0.1*this.newScale.x )
                                        {
                                          this.newPosition.x -= 0.05*this.newScale.x;
                                          this.newScale.x *= 1.1;
                                        }
                                        else
                                        {
                                          this.newPosition.x  -= -disX1/2 ;
                                          this.newScale.x += -disX1; 
                                        }

                                   }
                                  else
                                  {
                                      var disX2 = 1-this.newPosition.x- this.newScale.x/2;
                                     
                                       if(Math.abs(disX2) >0.01)
                                       {
                                            if( disX2 > 0.1*this.newScale.x)
                                           {
                                              this.newPosition.x += 0.05*this.newScale.x;
                                              this.newScale.x *=1.1; 
                                           }
                                           else
                                           {
                                             this.newPosition.x  += disX2/2 ;
                                             this.newScale.x += disX2;
                                           }
                                       }
   
                                  }
                                 
                           }
                                  
                       }
                       else
                       {
                           if( this.newScale.z <2)
                           {
                              
                                   
                                   var disX3 = -1-this.newPosition.z+this.newScale.z/2;  
                                  
                                   if(Math.abs(disX3) >0.01)
                                   {
                                       if( -disX3 > 0.1*this.newScale.z)
                                       {
                                          this.newPosition.z -= 0.05*this.newScale.z;
                                          this.newScale.z *= 1.1;
                                       }
                                       else
                                       {
                                          this.newPosition.z  -= -disX3/2 ;
                                          this.newScale.z += -disX3; 
                                       }
                                   }
                                   else
                                   {
                                      var disX4 = 1-this.newPosition.z-this.newScale.z/2;
                                       
                                       if(Math.abs(disX4) >0.01)
                                       {
                                           if( disX4 > 0.1*this.newScale.z)
                                           {
                                              this.newPosition.z += 0.05*this.newScale.z;
                                              this.newScale.z *=1.1; 
                                           }
                                           else
                                           {
                                             this.newPosition.z  += disX4/2 ;
                                             this.newScale.z += disX4;
                                           }   
                                       }
                                       
                                   }
                                   
                                    
                           }
                       }
                   }
               }
               this.CreateStaticRigibodyCube(this.newEntity);
               this.score++;
              
               var score = document.getElementById("score");
               score.innerHTML = this.score.toString();
              
               this.CreateCube();
          }
         
            
        },
        
        
        playsound:function(num)
        {
            
               var name;
               switch(num)
               {
               case -3:
                 name = "K"; 
                 break;
               case -2:
                 name = "J";
                 break;     
               case -1:
                 name = "I";
                 break;
               case 0:
                 name = "H";
                 break;
               case 1:
                name = "A";
                break;
               case 2:
                name = "B";
                break;
               case 3:
                name = "C";
                break;
               case 4:
                name = "D";
                break;
               case 5:
                name = "E";
                break;
               case 6:
                name = "F";
                break;
               case 7:
                name = "G";
                break;
               default:
                break;
               }
              if(num >7)
              {
                  name = "G";
              }
              this.entity.sound.slot(name).play();
        },
        
        Init:function()
        {
            var length = this.needdestroyobjs.length;
            for(var i =0;i<length;i++)
            {
                var obj = this.needdestroyobjs.pop();
                obj.destroy();
            }
            
            this.newEntity = null;
            this.score = 0;
            this.step = 0.3;
            this.lastScale.set(2,0.3,2);
            this.newScale.set(2,0.3,2);
            this.newPosition.set(0,0,0);
            this.anotherPosition.set(0,0,0);
            this.newYaw = true;
            this.moveSpeed = 1;
            this.NewScript = null;
            this.Color = new pc.Color(0,0,0,1);
            this.lastColor = new pc.Color(0,0,0,1);
            this.Perfect = 0;
            this.PerfectAnim = false;

            this.rk = 0.1;
            this.gk = 0.1;
            this.bk = 0.1;
            this.r = pc.math.random(0,5)/10;
            this.g = pc.math.random(0,5)/10;
            this.b = pc.math.random(0,5)/10;
            this.index = 0;
            if(this.g > this.r && this.g >this.b)
            {
                this.index = 1;
            }
            if(this.b > this.r && this.b >this.g)
            {
                this.index = 2;
            }

            this.Color.set(this.r,this.g,this.b,this.a);
            this.baseboxmat = app.assets.get(this.box1Mat).resource;
            this.baseboxmat.diffuse = this.Color;
            this.baseboxmat.update();
            
        }
        
        
        
    };

    return PlayerControl;
});