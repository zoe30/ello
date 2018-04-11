var Rotateown2 = pc.createScript('rotateown2');
Rotateown2.attributes.add("isOn",{type:"boolean",default:false});
Rotateown2.attributes.add("isTranslate",{type:"boolean",default:false});
Rotateown2.attributes.add("speed",{type:"number",default:4});
//Rotateown2.attributes.add("gm",{type:"entity",default:null});
//Rotateown2.attributes.add("cam",{type:"entity",default:null});
Rotateown2.attributes.add("fruit0",{type:"entity",default:null});
Rotateown2.attributes.add("fruit1",{type:"entity",default:null});
Rotateown2.attributes.add("fruit2",{type:"entity",default:null});
Rotateown2.attributes.add("fruit3",{type:"entity",default:null});
Rotateown2.attributes.add("fruit4",{type:"entity",default:null});
// initialize code called once per entity
Rotateown2.prototype.initialize = function() {    
    this.isRight=true;    
    this.hasCreate=false;
    
    this.turnparent=this.app.root.findByName("Scene");
    this.gm=this.app.root.findByName("GameController");
    this.gamemanager=this.gm.script.GameManager;
    this.cam=this.app.root.findByName("Camera");    
};

Rotateown2.prototype.update = function(dt) {
    this.speed=pc.math.random(3,4+this.gamemanager.score*0.02); 
    var pos=this.entity.getPosition();
    
    var euler=this.entity.getEulerAngles();
    this.entity.setEulerAngles(0,0,euler.z%360);
    
    if(!this.gamemanager.GameIsOver){
        if(this.gamemanager.ks){
            //转向
            if(this.isOn){
               this.entity.rotateLocal(0,0,this.speed);
            }else{
               this.entity.rotateLocal(0,0,-this.speed);
            }
            
            //移动
            if(this.isTranslate){                
                if(pos.x>1.2){
                    this.isRight=false;
                }else{
                    if(pos.x<-1.2){
                        this.isRight=true;
                    }
                }                
                
                
                if(this.isRight){
                    //向右移动
                    this.entity.translate(0.02,0,0);
                }else{
                    this.entity.translate(-0.02,0,0);
                }
                
            }
                
                 
            //触发
            if(this.cam.getPosition().y-pos.y>5.6){
                   //位置
                   this.entity.setPosition(pc.math.random(-1.2,1.2),2.7*this.gamemanager.turnindex+4.5,0);
                   var posentity=this.entity.getPosition();
                   this.gamemanager.turnindex++; 
                    
                   ////大小随机
                   if(this.gamemanager.score<100){                    
                      var rr=pc.math.random(0.9-this.gamemanager.score*0.003,1.1);
                      this.entity.setLocalScale(rr,rr,rr);
                      this.entity.collision.radius=rr;
                   }else{
                      if(this.gamemanager.score<200){
                         var rr2=pc.math.random(0.6,0.9);
                         this.entity.setLocalScale(rr2,rr2,rr2);
                         this.entity.collision.radius=rr2; 
                      }else{
                          if(this.gamemanager.score<300){
                             var rr3=pc.math.random(0.5,0.8);
                             this.entity.setLocalScale(rr3,rr3,rr3);
                             this.entity.collision.radius=rr3; 
                          }else{
                              if(this.gamemanager.score<400){
                                 var rr4=pc.math.random(0.4,0.7);
                                 this.entity.setLocalScale(rr4,rr4,rr4);
                                 this.entity.collision.radius=rr4; 
                              }else{
                                  var rr5=pc.math.random(0.4,0.6);
                                  this.entity.setLocalScale(rr5,rr5,rr5);
                                  this.entity.collision.radius=rr5;
                              }
                          }
                          
                      }
                      
                   }
                    
                   //转向随机
                   if(pc.math.random(0,2)<0.8){
                      this.isOn=false;
                   }else{
                      this.isOn=true;
                   }
                    
                   //转盘是否可移动
                   if(pc.math.random(0,5)>3.5){
                      this.isTranslate=true;
                   }else{
                      this.isTranslate=false;
                   } 
                   
                   //是否出现水果                  
                   if(pc.math.random(0,1)<0.65){
                      var num=this.gamemanager.score%5;
                      //var pos=this.entity.getPosition();
                      var sc=this.entity.getLocalScale();
                      
                      if(num===0){
                          this.fruit0.setLocalScale(0.225,0.225,0.9);
                          if(parseInt(pc.math.random(1,5),10)===1){
                             this.fruit0.setPosition(posentity.x-sc.x-0.1,posentity.y+sc.y/2,posentity.z); 
                          }else{
                              if(parseInt(pc.math.random(1,5),10)===2){
                                this.fruit0.setPosition(posentity.x+sc.x+0.1,posentity.y-sc.y/2,posentity.z); 
                              }else{
                                  if(parseInt(pc.math.random(1,5),10)===3){
                                      this.fruit0.setPosition(posentity.x-sc.x-0.1,posentity.y-sc.y/2,posentity.z); 
                                  }else{                                  
                                      this.fruit0.setPosition(posentity.x+sc.x+0.1,posentity.y+sc.y/2,posentity.z);
                                  }
                              }
                          }
                      }else{
                          if(num===1){
                              this.fruit1.setLocalScale(0.225,0.225,0.9);
                              if(parseInt(pc.math.random(1,5),10)===1){
                                 this.fruit1.setPosition(posentity.x-sc.x-0.1,posentity.y+sc.y/2,posentity.z); 
                              }else{
                                  if(parseInt(pc.math.random(1,5),10)===2){
                                    this.fruit1.setPosition(posentity.x+sc.x+0.1,posentity.y-sc.y/2,posentity.z); 
                                  }else{
                                      if(parseInt(pc.math.random(1,5),10)===3){
                                          this.fruit1.setPosition(posentity.x-sc.x-0.1,posentity.y-sc.y/2,posentity.z); 
                                      }else{                                  
                                          this.fruit1.setPosition(posentity.x+sc.x+0.1,posentity.y+sc.y/2,posentity.z);
                                      }
                                  }
                              } 
                          }else{
                              if(num===2){
                                  this.fruit2.setLocalScale(0.225,0.225,0.9);
                                  if(parseInt(pc.math.random(1,5),10)===1){
                                     this.fruit2.setPosition(posentity.x-sc.x-0.1,posentity.y+sc.y/2,posentity.z); 
                                  }else{
                                      if(parseInt(pc.math.random(1,5),10)===2){
                                        this.fruit2.setPosition(posentity.x+sc.x+0.1,posentity.y-sc.y/2,posentity.z); 
                                      }else{
                                          if(parseInt(pc.math.random(1,5),10)===3){
                                              this.fruit2.setPosition(posentity.x-sc.x-0.1,posentity.y-sc.y/2,posentity.z); 
                                          }else{                                  
                                              this.fruit2.setPosition(posentity.x+sc.x+0.1,posentity.y+sc.y/2,posentity.z);
                                          }
                                      }
                                  }  
                              }else{
                                  if(num===3){
                                      this.fruit3.setLocalScale(0.225,0.225,0.9);
                                      if(parseInt(pc.math.random(1,5),10)===1){
                                         this.fruit3.setPosition(posentity.x-sc.x-0.1,posentity.y+sc.y/2,posentity.z); 
                                      }else{
                                          if(parseInt(pc.math.random(1,5),10)===2){
                                            this.fruit3.setPosition(posentity.x+sc.x+0.1,posentity.y-sc.y/2,posentity.z); 
                                          }else{
                                              if(parseInt(pc.math.random(1,5),10)===3){
                                                  this.fruit3.setPosition(posentity.x-sc.x-0.1,posentity.y-sc.y/2,posentity.z); 
                                              }else{                                  
                                                  this.fruit3.setPosition(posentity.x+sc.x+0.1,posentity.y+sc.y/2,posentity.z);
                                              }
                                          }
                                      }  
                                  }else{
                                      this.fruit4.setLocalScale(0.225,0.225,0.9);
                                      if(parseInt(pc.math.random(1,5),10)===1){
                                         this.fruit4.setPosition(posentity.x-sc.x-0.1,posentity.y+sc.y/2,posentity.z); 
                                      }else{
                                          if(parseInt(pc.math.random(1,5),10)===2){
                                            this.fruit4.setPosition(posentity.x+sc.x+0.1,posentity.y-sc.y/2,posentity.z); 
                                          }else{
                                              if(parseInt(pc.math.random(1,5),10)===3){
                                                  this.fruit4.setPosition(posentity.x-sc.x-0.1,posentity.y-sc.y/2,posentity.z); 
                                              }else{                                  
                                                  this.fruit4.setPosition(posentity.x+sc.x+0.1,posentity.y+sc.y/2,posentity.z);
                                              }
                                          }
                                      }  
                                  }
                              }
                          }
                      }         
                   }
                    
                   
                   
                
                   
                }
            
            
            
            
            
            
        }else{
            //重置
            if(this.entity.name==="0"){
               this.entity.setPosition(0,4.5,0); 
               this.entity.setLocalScale(0.9,0.9,0.9);                
               this.entity.collision.radius=0.9;
            }
            
            if(this.entity.name==="1"){
                this.entity.setPosition(-1.1,7.2,0);
                this.entity.setLocalScale(1.1,1.1,1.1);
                this.entity.collision.radius=1.1;
            }
            
            if(this.entity.name==="2"){
                this.entity.setPosition(1.1,9.9,0);
                this.entity.setLocalScale(0.9,0.9,0.9);
                this.entity.collision.radius=0.9;
            }
            
            if(this.entity.name==="3"){
                this.entity.setPosition(0,12.6,0);
                this.entity.setLocalScale(1,1,1);
                this.entity.collision.radius=1;
            }
            
            if(this.entity.name==="4"){
                this.entity.setPosition(1,15.3,0);
                this.entity.setLocalScale(0.9,0.9,0.9);
                this.entity.collision.radius=0.9;
            }
        }
    }else{
        this.hasCreate=false;
    }
    
    
    
    
};
