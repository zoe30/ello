var Changematerialturn = pc.createScript('changematerialturn');
Changematerialturn.attributes.add("turnmats",{type:"asset",assetType:"material",array:true});
// initialize code called once per entity
Changematerialturn.prototype.initialize = function() {
    this.gm=this.app.root.findByName("GameController");
    this.gamemanager=this.gm.script.GameManager;
};
Changematerialturn.prototype.update = function(dt) {
    if(this.entity.name==="plane0"){
        if(this.gamemanager.isturn0===true){
            this.entity.model.meshInstances[0].material=this.turnmats[this.gamemanager.matindex].resource;
            this.gamemanager.isturn0=false;
        }
    }
    
    if(this.entity.name==="plane1"){
        if(this.gamemanager.isturn1){
            this.entity.model.meshInstances[0].material=this.turnmats[this.gamemanager.matindex].resource;
            this.gamemanager.isturn1=false;
        }
    }
    
    if(this.entity.name==="plane2"){
        if(this.gamemanager.isturn2===true){
            this.entity.model.meshInstances[0].material=this.turnmats[this.gamemanager.matindex].resource;
            this.gamemanager.isturn2=false;
        }
    }
    
    if(this.entity.name==="plane3"){
        if(this.gamemanager.isturn3===true){
            this.entity.model.meshInstances[0].material=this.turnmats[this.gamemanager.matindex].resource;
            this.gamemanager.isturn3=false;
        }
    }
    
    if(this.entity.name==="plane4"){
        if(this.gamemanager.isturn4===true){
            this.entity.model.meshInstances[0].material=this.turnmats[this.gamemanager.matindex].resource;
            this.gamemanager.isturn4=false;
        }
    }
            
};