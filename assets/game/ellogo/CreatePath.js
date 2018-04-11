pc.script.attribute("material","asset",null,{max:1});
pc.script.attribute("poolnum","number",50);
pc.script.attribute("delay","number",5);
pc.script.create('CreatePath', function (app) {
    // Creates a new CreatePath instance
    var CreatePath = function (entity) 
    {
        this.entity = entity;
    };
    
    var MAX_SPANNUM = 8;
    var MIN_SPANNUM = 1;
    var Z_YAW = 0;
    var X_YAW = 1;
        
    
    CreatePath.prototype = {
        
        initialize: function () 
        {
            
            
            this.screenwidth =  window.innerWidth;

            this.CurCamera = app.root.findByName("Camera");
            this.spanNum = 3;
            this.spanDir = Z_YAW;
            this.step = 0.5;
            this.lastPosX = -1.25;
            this.lastPosY = 0;
            this.lastPosZ = -1.75;
            
            this.spanIndex = 0;
            
            var prefabs = app.root.findByName("prefabs");
            this.Pool = prefabs.getChildren();
           
          // var treatprefabs = app.root.findByName("treatprefabs");
          // this.treatPool = treatprefabs.getChildren();
         //this.treatIndex = 0;
         // this.spantreatSpeed = 0;
            this.player = app.root.findByName("player");
            this.playercontrol = this.player.script.PlayerControl;


            
            this.upindex = 0;
            this.downindex = 0;
  
            for(var i=0;i<this.poolnum;i++)
            {
                this.InitSpanBox();           
            }

            var extranum = this.Pool.length - this.poolnum;
            for(var j = 0;j < extranum;j++)
            {
               
                this.Pool[this.upindex+j].collision.enabled = false;
                  
            }
           this.poolnum = this.Pool.length;

            this.timer =0;  
            this.delaytimer = 0;  
            
            
            this.changetimer = 0;
            this.startchange = false;
            this.boxmat = app.assets.get(this.material).resource;
            this.boxcolors = ["#423e40","#bc2849","#4a7778","#ffba6f","#007ebe","#5c515d","#1b3b4e","#ba6689","#2b1c40","#db8d41","#3dadc2"];
            this.boxcolori = Math.floor(pc.math.random(0,11));
            this.boxmatcolor = new pc.Color();
            this.boxmatcolor.fromString(this.boxcolors[this.boxcolori]);
            
            this.boxmat.diffuse = new pc.Color(this.boxmatcolor.r,this.boxmatcolor.g,this.boxmatcolor.b,1);
            this.boxmat.update();
            this.rotatetimes = 0;
            this.lastindex = 0;
            
        },

       
        update: function (dt) 
        {
            
             if(!this.playercontrol)
             {
                   this.playercontrol = app.root.findByName("player").script.PlayerControl;
                   return;
             }
             
            if(!this.playercontrol.start || this.playercontrol.lose || !this.playercontrol.startgame)
            {
                return;
            }
            
               this.screenwidth = window.innerWidth;
               
              
             var pos1 = this.player.getPosition();
             var xoffset = pos1.x;
             var zoffset = pos1.z - 1.25;
             var forwarddis = Math.floor(xoffset*2 +zoffset*2+11.5);
             
             if(forwarddis < 0)
             {
                 var nowindex = Math.abs(forwarddis);
                 if(nowindex-1 === this.lastindex)
                 {
                     this.SpanBox();
                     this.lastindex = nowindex;
                 }                 
                 
             }
            
            
              /* this.delaytimer += dt;
               if(this.delaytimer > this.delay)
               {
                  this.timer += dt;
                  if(this.timer > 0.16 )
                  {
                    
                    this.SpanBox();
                    this.timer = 0;
                 }
              }*/

              this.ChangeBoxColor(dt);
       
            
        },
        
       
        ChangeBoxColor:function(dt)
        {
            
            var i = this.playercontrol.score / 20.0;
            i = i - Math.floor(i);
            
            var j = this.playercontrol.score / 50.0;
            j = j - Math.floor(j);
            
            if(this.playercontrol.score > 0 &&  j < 1.0/50.0)
            {  
                
                
                var level = Math.floor(this.playercontrol.score / 50.0);
                this.rotatetimes = 2 *level;
                
                switch(level)
                {
                    case 1:    
                        
                        MIN_SPANNUM = 1; 
                        MAX_SPANNUM = 6;
                        
                        break;
                    case 2:
                        MIN_SPANNUM = 1; 
                        MAX_SPANNUM = 5;
                        break;
                        
                    case 3:
                        MIN_SPANNUM = 1; 
                        MAX_SPANNUM = 5;
                        break;
                    case 4:
                        MIN_SPANNUM = 1; 
                        MAX_SPANNUM = 4;
                        break;
                    case 5:
                        MIN_SPANNUM = 1; 
                        MAX_SPANNUM = 4;
                        break;
                    default:
                        MIN_SPANNUM = 1; 
                        MAX_SPANNUM = 3;
                        break;
                }
                    
            }  
                
            if(!this.startchange && this.playercontrol.score > 0 &&  i < 1.0/20.0)
            {
                
                this.rotatetimes = 3;
                
                this.playercontrol.playSound("change");
  
                var index = Math.floor(pc.math.random(0,11));
               
                if( this.boxcolori == index && this.boxcolori > 0)
                {
                      this.boxcolori -= 1;
                }
                else
                {
                     this.boxcolori = index;
                }

               
                this.boxmatcolor.fromString(this.boxcolors[this.boxcolori]);  
                this.startchange = true;
            }
            
            if(this.startchange)
            {
                this.changetimer += dt;
                if(this.changetimer > 3)
                {
                    this.changetimer = 0;
                    this.startchange = false;
                }
                else
                {
                   
                   var color = this.boxmat.diffuse;
                   var r = color.r * (1-dt) +this.boxmatcolor.r*dt;
                   var g = color.g * (1-dt) +this.boxmatcolor.g*dt;
                   var b = color.b * (1-dt) +this.boxmatcolor.b*dt;
                   this.boxmat.diffuse = new pc.Color(r,g,b,1);
                   this.boxmat.update(); 
                }
                
            }
            
        },
        
        
        
 
        
        InitSpanBox:function()
        {
 
                var x = this.spanDir ? this.lastPosX - this.step :this.lastPosX;
                var z = this.spanDir ? this.lastPosZ :this.lastPosZ-this.step;
                var pos = this.CurCamera.camera.worldToScreen(new pc.Vec3(x,0.5,z));

                 
                
                while(pos.x > this.screenwidth*Math.sqrt(2)/2 || pos.x < 0)
                {
                    this.spanIndex = 0;
                    this.spanNum = Math.floor(pc.math.random(MIN_SPANNUM,MAX_SPANNUM));
                    this.spanDir = !this.spanDir;
                    x = this.spanDir ? this.lastPosX - this.step :this.lastPosX;
                    z = this.spanDir ? this.lastPosZ :this.lastPosZ-this.step;
                    pos = this.CurCamera.camera.worldToScreen(new pc.Vec3(x,0.5,z));
                }
               
              
               /*
                var entity = new pc.Entity();
                entity.addComponent("model",{type:'box'});
                entity.setLocalScale(0.5,1,0.5); 
                entity.setPosition(x,this.lastPosY,z); 
                entity.model.model.meshInstances[0].material = app.assets.get(this.material).resource;
                entity.addComponent("collision",{type:'box',halfExtents:[0.25,0.5,0.25]});
                entity.addComponent("script",{scripts:[{url:'UpDownAnim.js'}]});
                app.root.addChild(entity);
              */ 

                this.Pool[this.upindex].setPosition(x,this.lastPosY,z);
                this.Pool[this.upindex].collision.enabled = true;
                this.upindex++;
                // this.Pool.push(entity);
                this.lastPosX = x;
                this.lastPosZ = z;
            
                this.spanIndex ++;
                if(this.spanIndex >= this.spanNum)
                {
                    this.spanIndex = 0;
                    this.spanNum = Math.floor(pc.math.random(MIN_SPANNUM,MAX_SPANNUM));
                    this.spanDir = !this.spanDir; 
                }    
              
  
        },
        
        
        SpanBox:function()
        {
            
            var x = this.spanDir ? this.lastPosX - this.step :this.lastPosX;
            var z = this.spanDir ? this.lastPosZ :this.lastPosZ-this.step;
            var pos = this.CurCamera.camera.worldToScreen(new pc.Vec3(x,0.5,z));

            while(pos.x > this.screenwidth || pos.x < 0)
            {
                 this.spanIndex = 0;
                
                
                 this.spanNum = Math.floor(pc.math.random(MIN_SPANNUM,MAX_SPANNUM));
 
                 this.spanDir = !this.spanDir;
                 x = this.spanDir ? this.lastPosX - this.step :this.lastPosX;
                 z = this.spanDir ? this.lastPosZ :this.lastPosZ-this.step;
                 pos = this.CurCamera.camera.worldToScreen(new pc.Vec3(x,0.5,z));
           }

            if(this.rotatetimes > 0)
            {
                this.rotatetimes --;
                this.spanIndex = 0;
                this.spanNum = 1;
            }
            
            this.Pool[this.upindex].setPosition(x,this.lastPosY-2,z);
            
            this.Pool[this.upindex].script.UpDownAnim.Up = true;
            this.Pool[this.downindex].script.UpDownAnim.Down = true;
            
            this.lastPosX = x;
            this.lastPosZ = z;
            
            
            this.spanIndex ++;
            if(this.spanIndex >= this.spanNum)
            {
                this.spanIndex = 0;
                this.spanNum = Math.floor(pc.math.random(MIN_SPANNUM,MAX_SPANNUM));
                this.spanDir = !this.spanDir; 
            }
            
            this.upindex ++;
            if(this.upindex >= this.poolnum)
            {
                this.upindex = 0;
            }
            
            this.downindex ++;
            if(this.downindex >= this.poolnum)
            {
                this.downindex = 0;
            }
            
        },
        
        
        Init:function()
        {
            this.screenwidth =  window.innerWidth;
            this.spanNum = 3;
            this.spanDir = Z_YAW;
            this.lastPosX = -1.25;
            this.lastPosY = 0;
            this.lastPosZ = -1.75;
            this.spanIndex = 0;
 
            this.upindex = 0;
            this.downindex = 0;
            this.poolnum = 16;
            MAX_SPANNUM = 8;
            MIN_SPANNUM = 1;
            
            this.lastindex =0;
  
            for(var i=0;i<this.poolnum;i++)
            {
                this.InitSpanBox();           
            }

            var extranum = this.Pool.length - this.poolnum;
            for(var j = 0;j < extranum;j++)
            {
                this.Pool[this.upindex+j].setPosition(0,100,0);
                this.Pool[this.upindex+j].collision.enabled = false;
                  
            }
           this.poolnum = this.Pool.length;

            this.timer =0;  
            this.delaytimer = 0;  

            this.changetimer = 0;
            this.startchange = false;
            this.boxcolori = Math.floor(pc.math.random(0,11));
            this.boxmatcolor.fromString(this.boxcolors[this.boxcolori]);
            this.boxmat.diffuse = new pc.Color(this.boxmatcolor.r,this.boxmatcolor.g,this.boxmatcolor.b,this.boxmatcolor.a);
            this.boxmat.update();
        
           
        
        }
        
        
        
        
        
    };

    return CreatePath;
});