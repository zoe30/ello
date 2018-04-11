var Waypoint = pc.createScript('waypoint');

Waypoint.attributes.add("isDisapper",{type:"boolean",default:false});
Waypoint.attributes.add("currentWayPoint",{type:"number",default:0});
// initialize code called once per entity
Waypoint.prototype.initialize = function() {
    this.isIOS = /iPad|iPhone|iPod/.test(navigator.platform); //IOS终端
    this.switchLine=false;           
    this.targetWayPoint=new pc.Entity();
    this.timess=0;
    this.st=false;
    
    this.gm=this.app.root.findByName("GameController");
    //this.player=this.app.root.findByName("player");
    this.gamestatemanager=this.gm.script.GameStateManager;
    this.path1=this.app.root.findByName("WayPoint1");
    this.path2=this.app.root.findByName("WayPoint2");
    this.waypointlist1=this.path1.getChildren();
    this.waypointlist2=this.path2.getChildren();
    
    this.app.mouse.on(pc.EVENT_MOUSEDOWN,this.onMouseDown,this);
    if(this.app.touch){
        if(this.isIOS){
          this.app.touch.on(pc.EVENT_TOUCHSTART,this.onMouseDown,this);  
        }else{
          this.app.touch.on(pc.EVENT_TOUCHCANCEL,this.onMouseDown,this);
        }
    }
    
    
    this.tmtm=0;
};

// update code called every frame
Waypoint.prototype.update = function(dt) {
          //仅当游戏不是处于结束状态且ks=true时，Car才运动
            if(!this.gm.script.GameManager.GameIsOver){                               
                  if(this.gm.script.GameManager.ks===true){
                     if(!this.isDisapper){
                        if(this.tmtm<1.5){
                         this.tmtm+=dt;
                        }else{
                         this.gm.script.GameManager.tip.enabled=false;
                         this.isDisapper=true;
                         this.tmtm=0;
                        }  
                     }
                    
                     this.gamestatemanager.GameStartGame();
                      
                     
                     this.gm.script.GameManager.tip2.enabled=false;
                      
                      
                     if(this.isIOS===true){
                        if(this.st===false){
                            this.timess+=dt;
                            if(this.timess>0.1){
                             this.st=true;
                            }
                        }
                     }
                     
                     if(this.currentWayPoint+1>this.waypointlist1.length-1){
                       this.currentWayPoint=0;
                       }                   
                       //目标位置
                       var vect=new pc.Vec3();
                       if(this.switchLine===false){
                           vect=this.waypointlist1[this.currentWayPoint+1].getPosition();
                       }else{
                           vect=this.waypointlist2[this.currentWayPoint+1].getPosition();
                       }
                       
                       //当前位置
                       var vec=this.entity.getPosition();   
                       //与目标位置的距离
                       var dis=(vect.x-vec.x)*(vect.x-vec.x)+(vect.y-vec.y)*(vect.y-vec.y)+(vect.z-vec.z)*(vect.z-vec.z);  
                       //与目标位置相距0.01时，切换到下一个目标
                       if(dis<1.4){
                           this.currentWayPoint++;                       
                       }else{
                           var sd=this.gm.script.GameManager.speed;
                           //console.log(sd.toString());
                           //与目标相距大于0.01时，汽车运动
                           this.entity.lookAt(vect.x,vect.y,vect.z);                       
                           this.entity.translateLocal(0,0,-sd*dt);
                       }  
                  }     
                       
                   
            }else{
                
                if(this.gm.script.GameManager.showrestart){
                   this.currentWayPoint=17;
                   this.switchLine=false;
                   this.st=false;
                   this.timess=0; 
                }else{
                   var vect2=new pc.Vec3();
                    vect2=this.waypointlist1[17].getPosition();
                    this.entity.lookAt(vect2.x,vect2.y,vect2.z); 
                }
            }
    
};

Waypoint.prototype.onMouseDown=function(){
            if(!this.gm.script.GameManager.GameIsOver){
               if(!this.gm.script.GameManager.ks){
                  this.gm.script.GameManager.ks=true; 
                   
                  this.entity.sound.slot("run").play();
                   
               }else{
                  if(this.app.touch){
                     if(this.isIOS){
                       if(this.st===true){
                          this.switchLine=!this.switchLine;  
                       }  
                     }else{
                         this.switchLine=!this.switchLine; 
                     }
                  }else{
                   this.switchLine=!this.switchLine; 
                  }   
               }
            } 
};

// swap method called for script hot-reloading
// inherit your script state here
Waypoint.prototype.swap = function(old) {
    
};

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/