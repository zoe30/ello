pc.script.attribute("edge_vert", "asset", null, {type: "shader"});
pc.script.attribute("edge_frag", "asset", null, {type: "shader"});


pc.script.create('toon', function (app) {
    // Creates a new Toon instance
    var Toon = function (entity) {
        this.entity = entity;        
    };

    Toon.prototype = {
        initialize: function () {

            this.edgeMaterial = this.createEdgeMaterial();
            this.edgeMaterial.setParameter('edgeColor', new pc.Color(0,0,0,0).data);
            this.edgeMaterial.setParameter('Outline',0.04);
            this.edgeMaterial.setParameter('zoffset',0.003);
            this.edgeMaterial.setParameter('yoffset',-0.002);
            
            var prefabs = app.root.findByName('Prefabs');
            var children = prefabs.getChildren();
            var basebox = app.root.findByName('BaseBox');
            
            var body = app.root.findByName('body');

             var backfaces0 = new pc.Entity();
             backfaces0.addComponent("model", {
                  type:'box'
                  //asset:basebox.model.asset
             });
             basebox.addChild(backfaces0);
             backfaces0.model.model.meshInstances[0].material = this.edgeMaterial;
             
             /*var backfaces1 = new pc.Entity();
             backfaces1.addComponent("model", {
                  type:'sphere'
             });
             body.addChild(backfaces1);
             backfaces1.model.model.meshInstances[0].material = this.edgeMaterial;*/

            for(var i=0;i<children.length;i++)
            {
                var backfaces = new pc.Entity();
                backfaces.addComponent("model", {
                    type:'box'
                });
                children[i].addChild(backfaces);
                backfaces.model.model.meshInstances[0].material = this.edgeMaterial;
            }

            
        },
        
        // Create material which renders back faces slightly enlarged and black
        createEdgeMaterial: function () {
            var frag = app.assets.get(this.edge_frag).resource;
            var vert = app.assets.get(this.edge_vert).resource;

            var shaderDefinition = {
                attributes: {
                    position: pc.SEMANTIC_POSITION,
                    normal: pc.SEMANTIC_NORMAL
                },
                vshader: vert,
                fshader: frag
            };

            var shader = new pc.Shader(app.graphicsDevice, shaderDefinition);

            // Create a new material and set the shader
            var material = new pc.Material();
            material.setShader(shader);
            material.cull = pc.CULLFACE_FRONT;
            
            return material;
        },
        
        // Create material which uses light direction and ramp texture to set diffuse color
       

        update: function (dt) 
        {
           
            //this.edgeMaterial.setParameter('Outline',this.Outline);
            //this.edgeMaterial.setParameter('zoffset',this.zoffset);
            //this.edgeMaterial.setParameter('yoffset',this.yoffset);
            
        }
    };

    return Toon;
});