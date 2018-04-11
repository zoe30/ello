var RotateFood = pc.createScript('RotateFood');
RotateFood.attributes.add("rotatespeed",{type:"number",default:2});

// initialize code called once per entity
RotateFood.prototype.initialize = function() {
    this.gc=this.app.root.findByName("GameController");
    this.gamemanager=this.gc.script.GameManager;
};

// update code called every frame
RotateFood.prototype.update = function(dt) {
    if(this.gamemanager.GameIsOver){
        if(this.gamemanager.ks){
            if(this.entity.name==="clone"){
                this.entity.destroy();
            }
        }
    }else{
        this.entity.rotateLocal(0,2,0);
    }
};

// swap method called for script hot-reloading
// inherit your script state here
RotateFood.prototype.swap = function(old) {
    
};

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/