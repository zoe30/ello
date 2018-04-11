var Changematerial = pc.createScript('changematerial');
//Changematerial.attributes.add("bg",{type:"entity"});
//Changematerial.attributes.add("bgwater1",{type:"entity"});
//Changematerial.attributes.add("bgwater2",{type:"entity"});
//Changematerial.attributes.add("ground",{type:"entity"});
Changematerial.attributes.add("bgmats",{type:"asset",assetType:"material",array:true});

Changematerial.attributes.add("groundmats",{type:"asset",assetType:"material",array:true});
Changematerial.attributes.add("bgwater1mats",{type:"asset",assetType:"material",array:true});
Changematerial.attributes.add("bgwater2mats",{type:"asset",assetType:"material",array:true});

//Changematerial.attributes.add("isStartChange",{type:"boolean",default:false});
Changematerial.prototype.initialize = function() {
    this.gm=this.app.root.findByName("GameController");
    this.gamemanager=this.gm.script.GameManager;
    
    this.bg=this.app.root.findByName("Bg");
    this.bgwater1=this.app.root.findByName("bgwater1");
    this.bgwater2=this.app.root.findByName("bgwater2");
    this.ground=this.app.root.findByName("ground");
    
    this.isStartChange=false;
};
Changematerial.prototype.update = function(dt) {
    if(this.isStartChange){
        this.bg.model.model.meshInstances[0].material=this.bgmats[this.gamemanager.matindex].resource;
        this.bgwater1.model.meshInstances[0].material=this.bgwater1mats[this.gamemanager.matindex].resource;
        this.bgwater2.model.meshInstances[0].material=this.bgwater2mats[this.gamemanager.matindex].resource;
        this.ground.model.meshInstances[0].material=this.groundmats[this.gamemanager.matindex].resource;
        
        this.isStartChange=false;
    }
};