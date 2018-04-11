var GameManager = pc.createScript('GameManager');

GameManager.attributes.add("GameIsOver",{type:"boolean",default:true}); //游戏是否结束
GameManager.attributes.add("ks",{type:"boolean",default:false});//是否正式开始游戏
GameManager.attributes.add("showrestart",{type:"boolean",default:false});
GameManager.attributes.add("score",{type:"number",default:0});
GameManager.attributes.add("startspeed",{type:"number",default:16});
GameManager.attributes.add("speed",{type:"number",default:16});   
GameManager.attributes.add("score",{type:"number",default:0});
GameManager.attributes.add("sfs",{type:"number",default:5,description:"add speed when score up"});
GameManager.attributes.add("tip",{type:"entity",default:null});
GameManager.attributes.add("tip2",{type:"entity",default:null});
//GameManager.attributes.add("playerreal",{type:"entity"});

GameManager.attributes.add("redMat",{type:"asset",assetType:"material"});
GameManager.attributes.add("yellowMat",{type:"asset",assetType:"material"});
GameManager.attributes.add("blueMat",{type:"asset",assetType:"material"});
GameManager.attributes.add("greenMat",{type:"asset",assetType:"material"});

GameManager.attributes.add("modelindex",{type:"number",default:0});

// initialize code called once per entity
GameManager.prototype.initialize = function() {
    //禁用右键和长按功能
    //this.app.mouse.disableContextMenu();
    this.playerreal=this.app.root.findByName("playerreal");
    
    this.modelindex=parseInt(pc.math.random(0,4),10);
    //console.log(this.playerreal.name);
};

// update code called every frame
GameManager.prototype.update = function(dt) {
    var v=(parseInt((this.score/5).toString(),10))*2;
    this.speed=this.startspeed+v;
    
    if(this.modelindex===0){
       this.playerreal.model.model.meshInstances[0].material=this.redMat.resource; 
    }
    
    if(this.modelindex===1){
        this.playerreal.model.model.meshInstances[0].material =this.yellowMat.resource; 
    }
    
    if(this.modelindex===2){
        this.playerreal.model.model.meshInstances[0].material=this.blueMat.resource; 
    }
    
    if(this.modelindex===3){
        this.playerreal.model.model.meshInstances[0].material=this.greenMat.resource; 
    }
};

// swap method called for script hot-reloading
// inherit your script state here
GameManager.prototype.swap = function(old) {
    
};

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/