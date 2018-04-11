var Waterfloat2 = pc.createScript('waterfloat2');
Waterfloat2.attributes.add("isUp",{type:"boolean",default:true});
Waterfloat2.attributes.add("topnum",{type:"number"});
Waterfloat2.attributes.add("bottomnum",{type:"number"});
Waterfloat2.attributes.add("speed",{type:"number"});
Waterfloat2.attributes.add("starttime",{type:"number"});
Waterfloat2.prototype.update = function(dt) {
    var pos=this.entity.getLocalPosition();
    if(pos.y>this.topnum){
        this.isUp=false;
    }
    if(pos.y<this.bottomnum){
        this.isUp=true;
    }
    
    if(this.isUp){
        this.entity.translate(0,this.speed,0);
    }else{
        this.entity.translate(0,-this.speed,0);
    }
};