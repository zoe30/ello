var Changefruit = pc.createScript('changefruit');
Changefruit.attributes.add("lemon",{type:"entity",default:null});
Changefruit.attributes.add("orange",{type:"entity",default:null});
Changefruit.attributes.add("apple",{type:"entity",default:null});
Changefruit.attributes.add("qiyi",{type:"entity",default:null});
//Changefruit.attributes.add("gm",{type:"entity",default:null});
// initialize code called once per entity
Changefruit.prototype.initialize = function() {   
    this.gm=this.app.root.findByName("GameController");
    this.gamemanager=this.gm.script.GameManager;
};

// update code called every frame
Changefruit.prototype.update = function(dt) {
   if(this.entity.name==="fruit0"){
     if(this.gamemanager.isfruit0){
         this.changeEnabed();
         this.gamemanager.isfruit0=false;
     }
   }
    
   if(this.entity.name==="fruit1"){
     if(this.gamemanager.isfruit1){
         this.changeEnabed();
         this.gamemanager.isfruit1=false;
     } 
   }
    
   if(this.entity.name==="fruit2"){
     if(this.gamemanager.isfruit2){
         this.changeEnabed();
         this.gamemanager.isfruit2=false;
     }
   }
    
   if(this.entity.name==="fruit3"){
     if(this.gamemanager.isfruit3){
         this.changeEnabed();
         this.gamemanager.isfruit3=false;
     }
   }
    
    if(this.entity.name==="fruit4"){
     if(this.gamemanager.isfruit4){
         this.changeEnabed();
         this.gamemanager.isfruit4=false;
     }
   }
};

Changefruit.prototype.changeEnabed=function(){
            if(this.gamemanager.matindex===0){
                //console.log("000");
                this.lemon.enabled=true;                
                this.orange.enabled=false;
                this.apple.enabled=false;
                this.qiyi.enabled=false;
            }
        
            if(this.gamemanager.matindex===1){
                //console.log("111");
                this.lemon.enabled=false;                
                this.orange.enabled=true;
                this.apple.enabled=false;
                this.qiyi.enabled=false;              
            }
            
            if(this.gamemanager.matindex===2){
                //console.log("222");
                this.lemon.enabled=false;                
                this.orange.enabled=false;
                this.apple.enabled=true;
                this.qiyi.enabled=false; 
            }
        
            if(this.gamemanager.matindex===3){ 
                //console.log("333");
                this.lemon.enabled=false;                
                this.orange.enabled=false;
                this.apple.enabled=false;
                this.qiyi.enabled=true;  
            }
};


        