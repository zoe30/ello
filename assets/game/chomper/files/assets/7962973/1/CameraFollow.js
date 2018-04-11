var CameraFollow = pc.createScript('cameraFollow');
CameraFollow.attributes.add("player",{type:"entity",default:null});
CameraFollow.attributes.add("CameraSpeed",{type:"number",default:3});
// initialize code called once per entity
CameraFollow.prototype.initialize = function() {
    //this.player=this.app.root.findByName("Player");
    this.pos=this.entity.getPosition();
    if(this.pos){
        this.InitPos=new pc.Vec3(this.pos.x,this.pos.y,this.pos.z);
    }    
};

// update code called every frame
CameraFollow.prototype.update = function(dt) {
    if(STATUS==="gaming"){
        var pos1=this.player.getPosition();
        var pos2=this.entity.getPosition();
        var x=pc.math.lerp(pos2.x,pos1.x+4,this.CameraSpeed*dt);
        var y=pc.math.lerp(pos2.y,4.5,this.CameraSpeed*dt);
        var z=pc.math.lerp(pos2.z,pos1.z+4,this.CameraSpeed*dt);
        this.entity.setPosition(x,y,z);
    }
};

CameraFollow.prototype.Init=function(){
    this.entity.setPosition(this.InitPos.x,this.InitPos.y,this.InitPos.z);  
};

