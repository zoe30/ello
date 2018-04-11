var Waveanim = pc.createScript('waveanim');
Waveanim.attributes.add("mats",{type:"asset",assetType:"material",array:true});
Waveanim.attributes.add("speed",{type:"vec2"});
Waveanim.tmp=new pc.Vec2();
Waveanim.prototype.initialize = function() {
   this.gm=this.app.root.findByName("GameController");
   this.gamemanager=this.gm.script.GameManager;
   this.tmp=Waveanim.tmp;//
};
Waveanim.prototype.update = function(dt) {
        //var num=this.gamemanager.matindex;
        this.tmp.set(this.speed.x,this.speed.y);
        this.tmp.scale(dt);
        this.entity.model.meshInstances[0].material.emissiveMapOffset.add(this.tmp);
        this.entity.model.meshInstances[0].material.opacityMapOffset.add(this.tmp);
        this.entity.model.meshInstances[0].material.update();

};