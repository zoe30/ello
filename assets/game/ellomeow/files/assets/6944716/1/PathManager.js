var PathManager = pc.createScript('PathManager');
PathManager.attributes.add("topmats",{type:'asset',array:true});
PathManager.attributes.add('leftmats',{type:'asset',array:true});
PathManager.attributes.add('forwardmats',{type:'asset',array:true});
PathManager.attributes.add('hitpttex',{type:'asset',array:false});

// initialize code called once per entity
PathManager.prototype.initialize = function() {
     
    var app = this.app;
    var manager = app.root.findByName('Manager');
    this.gamemanager = manager.script.GameStateManager;
    var player = app.root.findByName('player');
    this.playercontrol = player.script.PlayerControl;
    
    this.HitPtTex = app.assets.get(this.hitpttex.id).resource;
    this.BoxTopMats = [];
    this.BoxLeftMats = [];
    this.BoxForwardMats = [];
    for(var i=0;i<2;i++)
    {
        var topmat = app.assets.get(this.topmats[i].id).resource;
        this.BoxTopMats.push(topmat);
        var leftmat = app.assets.get(this.leftmats[i].id).resource;
        this.BoxLeftMats.push(leftmat);
        var forwardmat = app.assets.get(this.forwardmats[i].id).resource;
        this.BoxForwardMats.push(forwardmat);
    }

    this.CreatePrefabs();
    
    this.hard = 1;
    this.minMoveCount = 3;
    this.maxMoveCount = 7;
    this.canmovecount = -1;
    
    this.boxmovetime = 50;
    this.length = 2;
    this.playerindex = -1;
    
    this.minChange = 6;
    this.maxChange = 20;
    this.changeCount = Math.floor(pc.math.random(this.minChange,this.maxChange));
    this.moveXDir = true;
    this.changedirindices = [];
    
    this.minMove = 1;
    this.maxMove = 3;
    this.moveCount = Math.floor(pc.math.random(3,5));
    this.canMoveindices = [];
    
    this.canMove = false;
    
    
    
    this.initcount = 15;
    this.X = 0;
    this.Y = 0;
    this.Z = 0;
    this.InitPath();
    
    
};

PathManager.prototype.CreatePrefabs = function(){
    var app = this.app;
    this.boxes = [];
    this.hitpts = [];
    this.boxcount = 25;
    this.boxindex = 0;
    var boxprefab = app.root.findByName('boxprefab');
    this.boxes.push(boxprefab);
    
    var hitptprefab = app.root.findByName('hitptprefab');
    var mat = new pc.StandardMaterial();
    mat.blendType = pc.BLEND_NORMAL;
    mat.emissive = new pc.Color(1,1,1);
    mat.diffuse = new pc.Color(0,0,0);
    mat.specular = new pc.Color(0,0,0);
    mat.cull = pc.CULLFACE_NONE;
    mat.opacityMapChannel = 'a';
    mat.opacityMap = this.HitPtTex;
    mat.update();
    hitptprefab.model.model.meshInstances[0].material = mat;
    
    hitptprefab.enabled = false;
    this.hitpts.push(hitptprefab);

    for(var i=1;i<this.boxcount;i++)
    {
        var hitpt = hitptprefab.clone();
        mat = new pc.StandardMaterial();
        mat.blendType = pc.BLEND_NORMAL;
        mat.emissive = new pc.Color(1,1,1);
        mat.diffuse = new pc.Color(0,0,0);
        mat.specular = new pc.Color(0,0,0);
        mat.cull = pc.CULLFACE_NONE;
        mat.opacityMapChannel = 'a';
        mat.opacityMap = this.HitPtTex;
        mat.update();
        hitpt.model.model.meshInstances[0].material = mat;
        app.root.addChild(hitpt);
        this.hitpts.push(hitpt);
        
        var obj = boxprefab.clone();
        app.root.addChild(obj);
        this.boxes.push(obj);
    } 
    
};

PathManager.prototype.InitPath = function(){
    
    for(var i=0;i<this.boxcount;i++)
    {
        this.hitpts[i].enabled = false;
        if(i<this.initcount)
        {
            this.SpanBox();
        }
        else
        {
            var box = this.boxes[i];
            box.enabled = false;
        }
    }
    
    
};

PathManager.prototype.SpanBox = function(){
    
    if(this.playercontrol.score >0 && this.playercontrol.score %20 === 0)
    {
        this.hard = this.hard > 0.51 ? this.hard-0.1:0.5;
    }
    
    if(this.canmovecount < 0 && this.moveCount < 0)
    {
        var spanhard =  Math.random() >this.hard;
        if(spanhard)
        {
            this.canmovecount = Math.floor(pc.math.random(this.minMoveCount,this.maxMoveCount));
        }
    }
    if(this.canmovecount >= 0)
    {
        this.canmovecount --;
        this.moveCount = -1;
    }
    
    var box = this.boxes[this.boxindex];
    box.enabled = true;
    var boxcontrol = box.script.BoxControl;
    if(this.changeCount <0)
    {
        if(this.moveXDir)
        {
            this.X -= 0.25*this.length;
            this.Z += 0.25*this.length;
        }
        else
        {
            this.X += 0.25*this.length;
            this.Z -= 0.25*this.length;
        }
        this.moveXDir = !this.moveXDir;
        this.canmovecount = -1;
        this.moveCount = Math.floor(pc.math.random(2,4));
        this.changeCount = Math.floor(pc.math.random(this.minChange,this.maxChange));
        this.changedir = true;
        this.changedirindices.push(this.boxindex);
    }
    else
    {
        boxcontrol.changedir = false;
    }
        
    if(this.moveCount < 0)
    {
        boxcontrol.targetX = this.X;
        boxcontrol.targetZ = this.Z;
        this.SetBoxStyle(box,1);
        //box.model.model.meshInstances[0].material = this.MoveMat;
        var updownoffset = Math.random()>0.5?1:-1;
        var hitpt = this.hitpts[this.boxindex];
        var hitmat = hitpt.model.model.meshInstances[0].material;
        hitmat.opacity = 1;
        hitmat.update();
        
        if(this.moveXDir)
        {
            box.setPosition(this.X,this.Y,this.Z+0.5*this.length*updownoffset);
            hitpt.setPosition(this.X,this.Y,this.Z-0.25*this.length*updownoffset);
            hitpt.setEulerAngles(90,0,0);
        }
        else
        {
            box.setPosition(this.X+0.5*this.length*updownoffset,this.Y,this.Z);
            hitpt.setPosition(this.X-0.25*this.length*updownoffset,this.Y,this.Z);
            hitpt.setEulerAngles(0,90,90);
        }
        this.moveCount = Math.floor(pc.math.random(this.minMove,this.maxMove));
        boxcontrol.canmove = false;
        this.canMoveindices.push(this.boxindex);
    }
    else
    {
       boxcontrol.canmove = true;
       box.setPosition(this.X,this.Y,this.Z);
       this.SetBoxStyle(box,0);
       //box.model.model.meshInstances[0].material = this.NoMoveMat; 
    }
    
    boxcontrol.movexdir = this.moveXDir;
    
    if(this.moveXDir)
    {
        box.setEulerAngles(0,0,0);
        this.X += this.length;
    }
    else
    {
        box.setEulerAngles(0,90,0);
        this.Z += this.length;
    }

    this.moveCount --;
    this.changeCount --;
    this.boxindex = this.boxindex >= this.boxcount-1 ?0:this.boxindex+1;
};

PathManager.prototype.MoveBox = function(dir,lr){
    
    if(this.canMove || this.canMoveindices.length === 0)
    {
       return; 
    }
    this.canMove = true;
    var box = this.boxes[this.canMoveindices[0]];
    var boxcontrol = box.script.BoxControl;
    var pos = box.getPosition().clone();
    var nextx = pos.x;
    var nextz = pos.z;
    var hitpt = this.hitpts[this.canMoveindices[0]];
    var hitpos = hitpt.getPosition().clone();
    var hitmat = hitpt.model.model.meshInstances[0].material;
    var hittween = null,hitnextx=hitpos.x,hitnextz=hitpos.z;
    if(boxcontrol.movexdir)
    {
       if(lr)
       {
           dir *= -1;
       }
           
       nextz += dir*this.length*0.5;
       hitnextz += dir*this.length;
    }
    else
    {
       nextx += dir*this.length*0.5;
       hitnextx += dir*this.length; 
    }
    if(boxcontrol.Check(nextx,nextz))
    {
        this.playercontrol.AddScore();
        this.SetBoxStyle(box,0);
        //box.model.model.meshInstances[0].material = this.NoMoveMat;
        boxcontrol.canmove = true;
        hitpt.enabled = true;
        hittween = new TWEEN.Tween({x:hitpos.x,z:hitpos.z,s:1})
                            .to({x:hitnextx,z:hitnextz,s:0.01},250)
                            .onUpdate(function(){
                                hitpt.setPosition(this.x,hitpos.y,this.z);
                                //hitpt.setLocalScale(2*this.s,this.s,this.s);
                                //var hitmat = hitpt.model.model.meshInstances[0].material;
                                hitmat.opacity = this.s;
                                hitmat.update();
                            })
                            .onComplete(function(){
                                hitpt.enabled = false;
                            });
        this.canMoveindices.shift();
    }
    
    var self = this;
    var tween = new TWEEN.Tween({x:pos.x,z:pos.z})
                .to({x:nextx,z:nextz},this.boxmovetime)
                .onUpdate(function(){
                    box.setPosition(this.x,0,this.z);
                })
                .onComplete(function(){
                    if(hittween !== null)
                    {
                        hittween.start();
                    }
                    self.canMove = false;
                });
    tween.start();

};

PathManager.prototype.SetBoxStyle = function(box,index){
    var children = box.children;
    children[0].model.model.meshInstances[0].material = this.BoxTopMats[index];
    children[1].model.model.meshInstances[0].material = this.BoxTopMats[index];
    children[2].model.model.meshInstances[0].material = this.BoxLeftMats[index];
    children[3].model.model.meshInstances[0].material = this.BoxLeftMats[index];
    children[4].model.model.meshInstances[0].material = this.BoxForwardMats[index];
    children[5].model.model.meshInstances[0].material = this.BoxForwardMats[index];
    
};


PathManager.prototype.Check = function(){
    this.playerindex = this.playerindex >= this.boxcount-1?0:this.playerindex+1;
    var boxcontrol = this.boxes[this.playerindex].script.BoxControl;
    if(boxcontrol.canmove)
    {
        this.SpanBox();
        var count = 6;
        if(this.changedirindices.length > 0)
        {
            var index = this.changedirindices[0];
            count = index >= this.playerindex?index-this.playerindex:this.boxcount-this.playerindex+index;
            if(count === 0)
            {
                this.changedirindices.shift();
            }
        }
        return count;
    }
    return -1;
};

PathManager.prototype.Init = function(){
    this.hard = 1;
    this.canmovecount = -1;
    this.playerindex = -1;
    this.boxindex = 0;
    this.changeCount = Math.floor(pc.math.random(this.minChange,this.maxChange));
    this.moveXDir = true;
    this.changedirindices = [];
    this.moveCount = Math.floor(pc.math.random(3,5));
    this.canMoveindices = [];
    this.canMove = false;

    this.X = 0;
    this.Y = 0;
    this.Z = 0;
    this.InitPath();
};



