var CreateFood = pc.createScript('CreateFood');

CreateFood.attributes.add("createFoodAllowed",{type:"boolean",default:false});
CreateFood.attributes.add("foodprefab",{type:"entity",default:null});
CreateFood.attributes.add("foodparent",{type:"entity",default:null});

//CreateFood.attributes.add("greenMat",{type:"asset",assetType:"material"});
//CreateFood.attributes.add("lightblueMat",{type:"asset",assetType:"material"});
//CreateFood.attributes.add("purpleMat",{type:"asset",assetType:"material"});

// initialize code called once per entity
CreateFood.prototype.initialize = function() {
    this.path1=this.app.root.findByName("WayPoint1");
    this.path2=this.app.root.findByName("WayPoint2");
    
    this.waypointlist1=this.path1.getChildren();
    this.waypointlist2=this.path2.getChildren();
    
    this.hasCreate=false;
    
    //this.gMat=this.greenMat.resource;
    //this.bMat=this.lightblueMat.resource;
    //this.pMat=this.purpleMat.resource;
};

// update code called every frame
CreateFood.prototype.update = function(dt) {
    if(!this.entity.script.GameManager.GameIsOver){
        if(this.entity.script.GameManager.ks && this.createFoodAllowed){
            var obj=this.foodprefab.clone();  
            
            this.foodparent.addChild(obj);
            obj.name="clone";
            /*
            var fd=obj.findByName("food");
            var rr=pc.math.random(0,3);
            if(rr<1){
                fd.model.model.meshInstances[0].material=this.gMat;
            }else{
                if(rr<2){
                    fd.model.model.meshInstances[0].material=this.bMat;
                }else{
                    fd.model.model.meshInstances[0].material=this.pMat;
                }
            }*/
            
            var rand1=pc.math.random(0,2);
            if(rand1<1){
              var rd=pc.math.random(0,this.waypointlist1.length);
              var intnum=rd-rd%1;
              var pos=this.waypointlist1[intnum].getPosition();
              obj.setPosition(pos.x,0.51,pos.z);
              
                        
                       
                        
            }else{
               var rd2=pc.math.random(0,this.waypointlist2.length);
               var intnum2=rd2-rd2%1;

               if(intnum2===26){
                   intnum2=25;
               }
                
               if(intnum2===0){
                   intnum2=1;
               }

               var pos2=this.waypointlist2[intnum2].getPosition();
               obj.setPosition(pos2.x,0.51,pos2.z);                        
                        
            }
                    
            this.createFoodAllowed=false;
        }
    }
};

// swap method called for script hot-reloading
// inherit your script state here
CreateFood.prototype.swap = function(old) {
    
};

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/