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
    
    
    this.leyecolor = ['#e84671','#e84671','#ffd809','#ff5766','#ffd809','#b50ffe','#b50ffe','#b50ffe','#b50ffe','#b50ffe','#51ffff','#ffd809','#ff7d46','#757575','#ffd809','#ff7b46','#ff7b46','#ffd809','#e84671','#ffd809','#ff5766','#e84671'];
    this.reyecolor = ['#d7d8d8','#82d662','#82d662','#51ffff','#51ffff','#51ffff','#757575','#ff5766','#ffd809','#50ffbe','#757575','#757575','#51ffff','#82d662','#b50ffe','#d7d8d8','#50ffbe','#ff5766','#50ffbe','#50ffbe','#d7d8d8','#51ffff'];
    this.colornum = this.leyecolor.length;
    
    this.scenenum = 5;
    this.sceneindex = Math.floor(pc.math.random(0,this.scenenum));
    this.colorindex = Math.floor(pc.math.random(0,this.colornum));
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

    
    this.Leyecolor.fromString(this.leyecolor[this.colorindex]);
    this.Reyecolor.fromString(this.reyecolor[this.colorindex]);
    
    this.Leyecolormat.diffuse = new pc.Color(this.Leyecolor.r,this.Leyecolor.g,this.Leyecolor.b,1);
    this.Leyecolormat.update();
    this.Reyecolormat.diffuse = new pc.Color(this.Reyecolor.r,this.Reyecolor.g,this.Reyecolor.b,1);
    this.Reyecolormat.update();
    
    this.Leyetexmat.emissiveMap = this.Leyetexs[this.sceneindex];
    this.Leyetexmat.opacityMap = this.Leyetexs[this.sceneindex];
    this.Leyetexmat.update();
    this.Reyetexmat.emissiveMap = this.Reyetexs[this.sceneindex];
    this.Reyetexmat.opacityMap = this.Reyetexs[this.sceneindex];
    this.Reyetexmat.update();
    
    this.changetime = 0;
    this.canchnagecolor = false;
    
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
            this.ChangeColor();
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
    
    this.ColorChange(dt);
    
};


CameraFollow.prototype.swap = function(old) 
{
    
    
};

CameraFollow.prototype.ColorChange = function(dt)
{
    if(this.canchnagecolor)
    {
        this.changetime += dt;
        if(this.changetime > 4)
        {
            this.canchnagecolor = false;
            this.changetime = 0;
            this.Leyecolormat.diffuse = new pc.Color(this.Leyecolor.r,this.Leyecolor.g,this.Leyecolor.b,1);
            this.Leyecolormat.update();
            this.Reyecolormat.diffuse = new pc.Color(this.Reyecolor.r,this.Reyecolor.g,this.Reyecolor.b,1);
            this.Reyecolormat.update();
        }
        else
        {
            var lcolor =  this.Leyecolormat.diffuse;
            var lr = pc.math.lerp(lcolor.r,this.Leyecolor.r,dt);
            var lg = pc.math.lerp(lcolor.g,this.Leyecolor.g,dt);
            var lb = pc.math.lerp(lcolor.b,this.Leyecolor.b,dt);
            this.Leyecolormat.diffuse = new pc.Color(lr,lg,lb,1);
            this.Leyecolormat.update();
            
            var rcolor =  this.Reyecolormat.diffuse;
            var rr = pc.math.lerp(rcolor.r,this.Reyecolor.r,dt);
            var rg = pc.math.lerp(rcolor.g,this.Reyecolor.g,dt);
            var rb = pc.math.lerp(rcolor.b,this.Reyecolor.b,dt);
            this.Reyecolormat.diffuse = new pc.Color(rr,rg,rb,1);
            this.Reyecolormat.update();
        }
    }
};

CameraFollow.prototype.ChangeColor = function()
{
   this.canchnagecolor = true;
   var colorindex = Math.floor(pc.math.random(0,this.colornum));
   if(this.colorindex === colorindex && colorindex < this.colornum-1)
   {
       this.colorindex ++;
   }
   else
   {
       this.colorindex = colorindex;
   }
   this.Leyecolor.fromString(this.leyecolor[this.colorindex]);
   this.Reyecolor.fromString(this.reyecolor[this.colorindex]);
};



CameraFollow.prototype.Init = function(){
    
    this.MoveSpeed = 10;
    this.entity.setPosition(this.gameparam.cameraposX,10,0.1);
    this.UpBound.setPosition(this.UpBoundInitPos.x,this.UpBoundInitPos.x,this.UpBoundInitPos.z);
    this.canchnagecolor = false;
    this.changetime = 0;
    
    this.sceneindex ++;
    if(this.sceneindex >= this.scenenum )
    {
        this.sceneindex = 0;
    }
    
    
    this.colorindex = Math.floor(pc.math.random(0,this.colornum));
    this.Leyecolor.fromString(this.leyecolor[this.colorindex]);
    this.Reyecolor.fromString(this.reyecolor[this.colorindex]);
    
    this.Leyecolormat.diffuse = new pc.Color(this.Leyecolor.r,this.Leyecolor.g,this.Leyecolor.b,1);
    this.Leyecolormat.update();
    this.Reyecolormat.diffuse = new pc.Color(this.Reyecolor.r,this.Reyecolor.g,this.Reyecolor.b,1);
    this.Reyecolormat.update();
    
    this.Leyetexmat.emissiveMap = this.Leyetexs[this.sceneindex];
    this.Leyetexmat.opacityMap = this.Leyetexs[this.sceneindex];
    this.Leyetexmat.update();
    this.Reyetexmat.emissiveMap = this.Reyetexs[this.sceneindex];
    this.Reyetexmat.opacityMap = this.Reyetexs[this.sceneindex];
    this.Reyetexmat.update();

};






