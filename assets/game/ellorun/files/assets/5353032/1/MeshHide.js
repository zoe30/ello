var MeshHide = pc.createScript('MeshHide');
MeshHide.attributes.add('showindex',{type:'number'});

// initialize code called once per entity
MeshHide.prototype.initialize = function() {
    var meshinstances = this.entity.model.model.meshInstances;
    for(var i =1;i<meshinstances.length;i++)
    {
        if(i !== this.showindex)
        {
            meshinstances[i].visible = false;
        }
    }
};

// update code called every frame
MeshHide.prototype.update = function(dt) {
    
};

// swap method called for script hot-reloading
// inherit your script state here
MeshHide.prototype.swap = function(old) {
    
};

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/