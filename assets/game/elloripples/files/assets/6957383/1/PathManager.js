var PathManager = pc.createScript('PathManager');

PathManager.attributes.add('playermat',{type:'asset'});
PathManager.attributes.add('topmat',{type:'asset'});
PathManager.attributes.add('box0mat',{type:'asset'});
PathManager.attributes.add('box1mat',{type:'asset'});
PathManager.attributes.add('box2mat',{type:'asset'});
PathManager.attributes.add('box3mat',{type:'asset'});
PathManager.attributes.add('playertexs',{type:'asset',array:true});


// initialize code called once per entity
PathManager.prototype.initialize = function() {
    
    var app = this.app;
    this.camera = app.root.findByName('Camera');
    this.bg = this.camera.findByName('bg');
    this.bgpt = this.camera.findByName('bgpt');
    
    this.Playermat = app.assets.get(this.playermat.id).resource;
    this.Topmat = app.assets.get(this.topmat.id).resource;
    this.Box0mat = app.assets.get(this.box0mat.id).resource;
    this.Box1mat = app.assets.get(this.box1mat.id).resource;
    this.Box2mat = app.assets.get(this.box2mat.id).resource;
    this.Box3mat = app.assets.get(this.box3mat.id).resource;
    this.PlayerTexs = [];
    
    for(var i=0;i<3;i++)
    {
        var tex = app.assets.get(this.playertexs[i].id).resource;
        this.PlayerTexs.push(tex);
    }

    this.sceneindex = 0;
    this.sceneconfig = [
        {
            bgcolor:'#56b8e4',
            topdiff:'#dafdfd',topspec:'#3a3a3a',topemssive:'#dafdfd',
            box0diff:'#1e7afb',box0spec:'#3a3a3a',box0emssive:'#000000',
            box1diff:'#2898f8',box1spec:'#393939',box1emssive:'#000000',box1alpha:0.69,
            box2diff:'#22b6ff',box2spec:'#3a3a3a',box2emssive:'#000000',box2alpha:0.611,
            box3diff:'#35c0ff',box3spec:'#3a3a3a',box3emssive:'#000000',box3alpha:0.384,
        },
        {
            bgcolor:'#000000',
            topdiff:'#d5cfcf',topspec:'#3a3a3a',topemssive:'#b3b3b3',
            box0diff:'#919090',box0spec:'#3a3a3a',box0emssive:'#000000',
            box1diff:'#474747',box1spec:'#393939',box1emssive:'#000000',box1alpha:0.7,
            box2diff:'#222222',box2spec:'#3a3a3a',box2emssive:'#000000',box2alpha:0.808,
            box3diff:'#151516',box3spec:'#3a3a3a',box3emssive:'#000000',box3alpha:0.792,
        },
        {
            bgcolor:'#02ffda',
            topdiff:'#fbfde8',topspec:'#3a3a3a',topemssive:'#ede293',
            box0diff:'#dfbb4c',box0spec:'#3a3a3a',box0emssive:'#0c0c0c',
            box1diff:'#f4d87f',box1spec:'#393939',box1emssive:'#151515',box1alpha:0.75,
            box2diff:'#ede58e',box2spec:'#3a3a3a',box2emssive:'#0c0c0c',box2alpha:0.6,
            box3diff:'#ede58e',box3spec:'#3a3a3a',box3emssive:'#787878',box3alpha:0.505,
        }

    ];
    
    this.minwidth = -3;
    this.maxwidth = 4;
    this.changetomax = false;
    
    this.scaleXZ = 1;
    this.scaleY = 0.3;
    this.forwarddis = 2.5;
    this.count = 10;
    this.CreateAllBoxes();
    
    this.lastoffset = 0;
    this.X = 0;
    this.Y = 0;
    this.Z = 0;
    this.index = 0;
    this.playerindex = 0;
    this.canmovemax = 1;
    this.initcount = 7;
    this.setScene();
    this.InitPath();

};

// update code called every frame
PathManager.prototype.update = function(dt) {

    
};

PathManager.prototype.CreateAllBoxes = function()
{
    var app = this.app;
    var boxprefab = app.root.findByName('boxprefab');
    var manager  = app.root.findByName('Manager');
    var player = app.root.findByName('player');
    this.gamemanager = manager.script.GameStateManager;
    this.playercontrol = player.script.PlayerControl;
    
    this.boxpool = [];
    this.boxpool.push(boxprefab);
    for(var i=1;i<this.count;i++)
    {
        var clone = boxprefab.clone();
        app.root.addChild(clone);
        this.boxpool.push(clone);
    }
    
    var propparent = app.root.findByName('props');
    this.propsparents = propparent.children;
    this.props = null;
    this.propcount = 8;
    this.propindex = 0;
    
};

PathManager.prototype.InitPath = function(){

    for(var i=0;i<this.propcount;i++)
    {
        this.props[i].enabled = false;
    }

    for(var i=0;i<this.count;i++)
    {
        if(i< this.initcount)
        {
            this.SpanBox();
        }
        else
        {
            var obj = this.boxpool[i];
            blockcontrol = obj.script.BlockControl;
            blockcontrol.Hide(); 
        }  
    }
};



PathManager.prototype.SpanBox = function(){
    var score = this.playercontrol.score;
    if( score>0&& score% 20 === 0)
    {
        this.canmovemax = this.canmovemax >0.51?this.canmovemax-0.1: 0.5;
    }
    
    if(score >20 && !this.changetomax)
    {
        this.changetomax = true;
        this.minwidth = -4;
        this.maxwidth = 5;    
    }
    
    var obj = this.boxpool[this.index];
    var blockcontrol = obj.script.BlockControl;
    var anim = Math.abs(this.lastoffset) > 2?false:pc.math.random(0,1) > this.canmovemax;
    blockcontrol.Init(this.X,this.Y,this.Z,anim);
    var hasprop = pc.math.random(0,1)>0.5;
    if(!anim&&hasprop)
    {
        var propoffset = pc.math.random(1,2)*(pc.math.random(0,1)>0.5?-1:1);
        this.props[this.propindex].enabled = true;
        this.props[this.propindex].setPosition(this.X+propoffset,0,this.Z);
        this.propindex = this.propindex>= this.propcount-1?0:this.propindex+1;
    }
    var offset = Math.floor(pc.math.random(this.minwidth,this.maxwidth));
    this.lastoffset = Math.abs(this.lastoffset-offset) === 8?(offset>0?offset-1:offset+1) :offset;
    this.X  =  this.lastoffset*this.scaleXZ/2;
    this.Z -= this.scaleXZ *this.forwarddis; 
    this.index = this.index>=this.count-1?0:this.index+1;
};


PathManager.prototype.Check = function(x){
    this.playerindex = this.playerindex >= this.count-1?0:this.playerindex+1;
    var blockcontrol = this.boxpool[this.playerindex].script.BlockControl;
    return blockcontrol.Check(x);
};

PathManager.prototype.setScene = function(){
    //
    var index = Math.floor(pc.math.random(0,3));
    //var index = 1;
    this.sceneindex = this.sceneindex === index? (index>0?index-1:index+1):index;
    for(var i=0;i<3;i++)
    {
        if(this.sceneindex === i)
        {
           this.propsparents[i].enabled = true;
        }
        else
        {
           this.propsparents[i].enabled = false;
        }
    } 
    
    if(this.sceneindex === 1)
    {
        this.bgpt.enabled = false;
        this.bg.enabled = true;
    }
    else
    {
        this.bgpt.enabled = true;
        this.bg.enabled = false;
    }
    
    this.props = this.propsparents[this.sceneindex].children;
    
    this.Playermat.emissiveMap = this.PlayerTexs[this.sceneindex];
    this.Playermat.opacityMap = this.PlayerTexs[this.sceneindex];
    this.Playermat.update();
    
    var scenefonfig = this.sceneconfig[this.sceneindex];
    this.camera.camera.clearColor = new pc.Color().fromString(scenefonfig.bgcolor);
    this.app.scene.fogColor = new pc.Color().fromString(scenefonfig.bgcolor);
    
    this.Topmat.diffuse = new pc.Color().fromString(scenefonfig.topdiff);
    this.Topmat.specular = new pc.Color().fromString(scenefonfig.topspec);
    this.Topmat.emissive = new pc.Color().fromString(scenefonfig.topemssive);
    this.Topmat.update();
    this.Box0mat.diffuse = new pc.Color().fromString(scenefonfig.box0diff);
    this.Box0mat.specular = new pc.Color().fromString(scenefonfig.box0spec);
    this.Box0mat.emissive = new pc.Color().fromString(scenefonfig.box0emssive);
    this.Box0mat.update();
    this.Box1mat.diffuse = new pc.Color().fromString(scenefonfig.box1diff);
    this.Box1mat.specular = new pc.Color().fromString(scenefonfig.box1spec);
    this.Box1mat.emissive = new pc.Color().fromString(scenefonfig.box1emssive);
    this.Box1mat.opacity = scenefonfig.box1alpha;
    this.Box1mat.update();
    this.Box2mat.diffuse = new pc.Color().fromString(scenefonfig.box2diff);
    this.Box2mat.specular = new pc.Color().fromString(scenefonfig.box2spec);
    this.Box2mat.emissive = new pc.Color().fromString(scenefonfig.box2emssive);
    this.Box2mat.opacity = scenefonfig.box2alpha;
    this.Box2mat.update();
    this.Box3mat.diffuse = new pc.Color().fromString(scenefonfig.box3diff);
    this.Box3mat.specular = new pc.Color().fromString(scenefonfig.box3spec);
    this.Box3mat.emissive = new pc.Color().fromString(scenefonfig.box3emssive);
    this.Box3mat.opacity = scenefonfig.box3alpha;
    this.Box3mat.update();
    
};


PathManager.prototype.Init = function(){
    
    
    this.propindex = 0;
    this.minwidth = -3;
    this.maxwidth = 4;
    this.changetomax = false;
    this.lastoffset = 0;
    this.X = 0;
    this.Y = 0;
    this.Z = 0;
    this.index = 0;
    this.playerindex = 0;
    this.canmovemax = 1;
    this.setScene();
    this.InitPath();
};






