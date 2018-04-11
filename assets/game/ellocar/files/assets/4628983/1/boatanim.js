var Boatanim = pc.createScript('boatanim');
Boatanim.attributes.add("boatspeed",{type:"number",default:0.9});

// initialize code called once per entity
Boatanim.prototype.initialize = function() {
    
};

// update code called every frame
Boatanim.prototype.update = function(dt) {
    var pos=this.entity.getPosition();
    //console.log(pos.x.toString());
    if(pos.x>-3){
        this.entity.setPosition(pos.x-this.boatspeed*dt,1.2,-28);
    }else{
        this.entity.setPosition(22.8,1.2,-28);
        //console.log("回来");
    }
    
};

// swap method called for script hot-reloading
// inherit your script state here
Boatanim.prototype.swap = function(old) {
    
};

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/