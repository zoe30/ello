var CameraFollow = pc.createScript('CameraFollow');

CameraFollow.attributes.add('lefteyetex',{type:'asset',array:true});
CameraFollow.attributes.add('righteyetex',{type:'asset',array:true});
CameraFollow.attributes.add('lefteyetexmat',{type:'asset',array:false});
CameraFollow.attributes.add('righteyetexmat',{type:'asset',array:false});
CameraFollow.attributes.add('lefteyecolormat',{type:'asset',array:false});
CameraFollow.attributes.add('righteyecolormat',{type:'asset',array:false});


CameraFollow.prototype.initialize = function() 
{
    var app = this.app;
    var manager = app.root.findByName('Manager');
    this.gameparam = manager.script.GameParam;
    this.playercontrol = manager.script.PlayerControl;
    this.gamemanager = manager.script.GameStateManager;
    this.pathmanager = manager.script.PathManager;
    this.UpBound = app.root.findByName('UpBound');
    this.UpBoundInitPos = new pc.Vec3(0,0,0);
    
    this.MoveSpeed = 10;
    

    this.leyecolor = ['#e84671','#b50ffe','#ffd809','#b50ffe','#b50ffe','#ff5766','#ffd809','#ffd809','#757575','#ffd809','#ffd809'];
    this.reyecolor = ['#d7d8d8','#51ffff','#757575','#ffd809','#757575','#51ffff','#51ffff','#ff5766','#82d662','#757575','#ff5766'];
    this.colornum = this.leyecolor.length;
    
    this.scenenum = 11;
    this.sceneindex = Math.floor(pc.math.random(0,this.scenenum));
    this.Leyecolor = new pc.Color();
    this.Reyecolor = new pc.Color();
    this.Leyetexs = [];
    this.Reyetexs = [];
    this.Leyecolormat = app.assets.get(this.lefteyecolormat.id).resource;
    this.Reyecolormat = app.assets.get(this.righteyecolormat.id).resource;
    this.Leyetexmat = app.assets.get(this.lefteyetexmat.id).resource;
    this.Reyetexmat = app.assets.get(this.righteyetexmat.id).resource;
    
    for(var i = 0;i<this.scenenum;i++)
    {
        var ltex = app.assets.get(this.lefteyetex[i].id).resource;
        this.Leyetexs.push(ltex);
        var rtex = app.assets.get(this.righteyetex[i].id).resource;
        this.Reyetexs.push(rtex);
    }

    
    this.Leyecolor.fromString(this.leyecolor[this.sceneindex]);
    this.Reyecolor.fromString(this.reyecolor[this.sceneindex]);
    
    this.Leyecolormat.diffuse = new pc.Color(this.Leyecolor.r,this.Leyecolor.g,this.Leyecolor.b,1);
    this.Leyecolormat.update();
    this.Reyecolormat.diffuse = new pc.Color(this.Reyecolor.r,this.Reyecolor.g,this.Reyecolor.b,1);
    this.Reyecolormat.update();
    
    this.Leyetexmat.diffuseMap = this.Leyetexs[this.sceneindex];
    this.Leyetexmat.update();
    this.Reyetexmat.diffuseMap = this.Reyetexs[this.sceneindex];
    this.Reyetexmat.update();

    
};

CameraFollow.prototype.update = function(dt) 
{
    
    if(!this.gamemanager.start || !this.gamemanager.startgame)
    {
        return;
    }
    
    if(this.gamemanager.lose)
    {
        return;
    }
    
    this.entity.translate(0,0,this.MoveSpeed*dt);
    this.UpBound.translate(0,0,this.MoveSpeed*dt);
    
    var posZ = this.UpBound.getPosition().z;
    var score = Math.floor(posZ/8/this.gameparam.playerscale);
    var boundnum = Math.floor(posZ/18);
    var nextindex = (boundnum +1)%this.pathmanager.boundpoollength;
    if(this.pathmanager.boundindex === nextindex)
    {
        this.pathmanager.SpanBound();    
    }
    
    if(score - this.playercontrol.score === 1)
    {
        var scoreui = document.getElementById('score');
        scoreui.innerHTML = score.toString();

        this.pathmanager.SpanPath();

        if(score % 20 === 0)
        {
            this.playercontrol.PlaySound('change');
        }
        
        if(score % 20 === 0)
        {
            if(this.MoveSpeed < 17.1)
            {
                this.MoveSpeed ++;
                this.playercontrol.downmaxspeed = this.MoveSpeed;
            }
            
        }
        this.playercontrol.score = score; 
    }

    
};


CameraFollow.prototype.swap = function(old) 
{
    
    
};


CameraFollow.prototype.Init = function(){
    
    this.MoveSpeed = 10;
    this.entity.setPosition(this.gameparam.cameraposX,10,0.1);
    this.UpBound.setPosition(this.UpBoundInitPos.x,this.UpBoundInitPos.x,this.UpBoundInitPos.z);

    
    this.sceneindex ++;
    if(this.sceneindex >= this.scenenum )
    {
        this.sceneindex = 0;
    }

    this.Leyecolor.fromString(this.leyecolor[this.sceneindex]);
    this.Reyecolor.fromString(this.reyecolor[this.sceneindex]);
    
    this.Leyecolormat.diffuse = new pc.Color(this.Leyecolor.r,this.Leyecolor.g,this.Leyecolor.b,1);
    this.Leyecolormat.update();
    this.Reyecolormat.diffuse = new pc.Color(this.Reyecolor.r,this.Reyecolor.g,this.Reyecolor.b,1);
    this.Reyecolormat.update();
    
    this.Leyetexmat.diffuseMap = this.Leyetexs[this.sceneindex];
    this.Leyetexmat.update();
    this.Reyetexmat.diffuseMap = this.Reyetexs[this.sceneindex];
    this.Reyetexmat.update();

};






