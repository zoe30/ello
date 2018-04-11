var PathManager = pc.createScript('PathManager');

PathManager.attributes.add('boxmat',{type:'asset'});
// initialize code called once per entity
PathManager.prototype.initialize = function() {
    var app = this.app;
    var manager = app.root.findByName('Manager');
    this.gamemanager = manager.script.GameStateManager;
    var player = app.root.findByName('player');
    this.playercontrol = player.script.PlayerControl;
    this.curcamera = app.root.findByName('Camera');
    
    var prefabs = app.root.findByName('prefabs');
    this.rows = prefabs.children;
    this.rowscount = this.rows.length;
    this.cols = 7;
    for(var i =0;i<this.rowscount;i++)
    {
        this.rows[i].setPosition(0,-100,0);
    }
    
    this.moveboxes = app.root.findByName('lrprefabs').children;
    this.moveboxescount = this.moveboxes.length;
    this.moveboxesindex = 0;
    for(var i =0;i<this.moveboxescount;i++)
    {
        this.moveboxes[i].setPosition(0,-100,0);
    }
    
    
    this.boxcolors = ["#82d662","#b50ffe","#50ffbe","#51ffff","#ff6a6d","#4fd9ff","#e84671"];
    this.backcolors = ["#192333","#002337","#192333","#002337","#192333","#002337","#192333"];
    this.BoxColor = new pc.Color();
    this.BGColor = new pc.Color();
    this.canchangecolor = false;
    
    this.BoxMat = app.assets.get(this.boxmat.id).resource;
    this.index = Math.floor(pc.math.random(0,7));
    this.BoxColor.fromString(this.boxcolors[this.index]);
    this.BoxMat.diffuse = new pc.Color( this.BoxColor.r,this.BoxColor.g,this.BoxColor.b,1);
    this.BoxMat.update();
    this.BGColor.fromString(this.backcolors[this.index]);
    this.curcamera.camera.clearColor = new pc.Color(this.BGColor.r,this.BGColor.g,this.BGColor.b,1);
    
    var index = Math.floor(pc.math.random(0,7));
    if(this.index === index )
    {
        if(this.index !== 0)
        {
           this.index --; 
        }
        else
        {
            this.index++;
        }
    }
    else
    {
        this.index = index;
    }
    this.BoxColor.fromString(this.boxcolors[this.index]);
    this.BGColor.fromString(this.backcolors[this.index]);
    
    this.changetimer = 0;
    this.ChangeTime = 3;
    this.changespeed = 1;
    
    
    this.xdis = 1.1;
    this.ydis = 1.1;
    this.zdis = 1;
    this.InitSpanNum = 8;
    
    this.lastcolsshow = [];
    this.onlycol = Math.floor(pc.math.random(0,7));
    this.LastPos = new pc.Vec3(0,0,0);
    this.rowsindex = 0;
    
    this.InitPath();
   
    
};


PathManager.prototype.update = function(dt) {
    
    if(this.canchangecolor)
    {
        this.ColorChange(dt);
    }
    
};

PathManager.prototype.swap = function(old) {
    
};

PathManager.prototype.ColorChange = function(dt)
{
    
    this.changetimer += dt;
    if(this.changetimer > this.ChangeTime)
    {
        this.changetimer = 0;
        this.canchangecolor = false;
    }
    else
    {

            var color = this.BoxMat.diffuse;
            var r = pc.math.lerp(color.r,this.BoxColor.r,dt*this.changespeed);
            var g = pc.math.lerp(color.g,this.BoxColor.g,dt*this.changespeed);
            var b = pc.math.lerp(color.b,this.BoxColor.b,dt*this.changespeed);
                
            this.BoxMat.diffuse = new pc.Color(r,g,b,1);
            this.BoxMat.update();
            
            color = this.curcamera.camera.clearColor;
            r = pc.math.lerp(color.r,this.BGColor.r,dt*this.changespeed);
            g = pc.math.lerp(color.g,this.BGColor.g,dt*this.changespeed);
            b = pc.math.lerp(color.b,this.BGColor.b,dt*this.changespeed);
            this.curcamera.camera.clearColor = new pc.Color(r,g,b,1);
        
    }
    
    
};

PathManager.prototype.InitPath = function(){
    
    for(var k=0;k<this.InitSpanNum;k++)
    {

        this.rows[this.rowsindex].setPosition(this.LastPos.x,this.LastPos.y,this.LastPos.z);
        var children =  this.rows[this.rowsindex].children;
        for(var j=0;j<this.cols;j++)
        {
            children[j].script.BoxState.Init(this.BoxMat);
        }
        
        if(k > 2)
        {
            var leftcols = Math.floor(pc.math.random(0,this.onlycol+1));
            var rightcols = Math.floor(pc.math.random(0,7-this.onlycol));
    
            for(var i =0;i<leftcols+1;i++)
            {
                this.lastcolsshow.push(this.onlycol-i);
            }
            for(var i=0;i<rightcols;i++)
            {
                this.lastcolsshow.push(this.onlycol+i+1);
            }
    
            var hide = false;
            for(var i=0;i<this.onlycol-leftcols;i++)
            {
                hide = pc.math.random(0,1)>0.5;
                if(hide)
                {  
                    children[i].script.BoxState.hide = true;
                    children[i].model.enabled = false;   
                }
            }
            for(var i=this.onlycol+rightcols+1;i<this.cols;i++)
            {
                hide = pc.math.random(0,1)>0.5;
                if(hide)
                {  
                    children[i].script.BoxState.hide = true;
                    children[i].model.enabled = false;   
                }
            }
    
            var length = this.lastcolsshow.length;
           
            var index = Math.floor(pc.math.random(0,length));
            this.onlycol = this.lastcolsshow[index];
            this.lastcolsshow = [];
        }
        
        this.LastPos.set(this.LastPos.x,this.LastPos.y+this.ydis,this.LastPos.z+this.zdis);
        this.rowsindex++;
    }
    
    
};

PathManager.prototype.SpanRow = function()
{
    if(this.rowsindex >= this.rowscount)
    {
        this.rowsindex = 0;
    }
    
    if( this.playercontrol.currow > 0  && this.playercontrol.currow % 30 === 0)
    {
        console.log('aaa');
        this.canchangecolor = true;
        this.playercontrol.PlaySound("change");
        var index = Math.floor(pc.math.random(0,7));
        if(this.index === index )
        {
            if(this.index !== 0)
            {
               this.index --; 
            }
            else
            {    
                this.index++;
            }
        }
        else
        {
            this.index = index;
        }
        this.BoxColor.fromString(this.boxcolors[this.index]);
        this.BGColor.fromString(this.backcolors[this.index]);
        
    }
    
    
    this.rows[this.rowsindex].setPosition(this.LastPos.x,this.LastPos.y,this.LastPos.z);
    var children =  this.rows[this.rowsindex].children;
    
    for(var i =0;i<this.cols;i++)
    {
        children[i].script.BoxState.Init(this.BoxMat);
    }
    
    var leftcols = Math.floor(pc.math.random(0,this.onlycol+1));
    var rightcols = Math.floor(pc.math.random(0,7-this.onlycol));

    
    var hasbox = pc.math.random(0,1)>0.7;
    
    if(hasbox)
    {
        if(this.moveboxesindex  >= this.moveboxescount)
        {
            this.moveboxesindex = 0;
        }
        this.moveboxes[this.moveboxesindex].script.BoxMoveLR.Init(this.rowsindex,this.LastPos.y+1,this.LastPos.z);
        this.moveboxesindex ++;
        
    }
    else
    {
        for(var i =0;i<leftcols+1;i++)
        {
            this.lastcolsshow.push(this.onlycol-i);
        }
        for(var i=0;i<rightcols;i++)
        {
            this.lastcolsshow.push(this.onlycol+i+1);
        }
        
        var hide = false;
        for(var i=0;i<this.onlycol-leftcols;i++)
        {
            hide = pc.math.random(0,1)>0.5;
            if(hide)
            {  
                children[i].script.BoxState.hide = true;
                children[i].model.enabled = false;   
            }
        }
        for(var i=this.onlycol+rightcols+1;i<this.cols;i++)
        {
            hide = pc.math.random(0,1)>0.5;
            if(hide)
            {  
                children[i].script.BoxState.hide = true;
                children[i].model.enabled = false;   
            }
        }
    
        var length = this.lastcolsshow.length;
        var index = Math.floor(pc.math.random(0,length));
        this.onlycol = this.lastcolsshow[index];
        this.lastcolsshow = [];
    }
    
    
    this.LastPos.set(this.LastPos.x,this.LastPos.y+this.ydis,this.LastPos.z+this.zdis);
    this.rowsindex++;
};

PathManager.prototype.Init = function()
{
    for(var i =0;i<this.rowscount;i++)
    {
        this.rows[i].setPosition(0,-100,0);
    }
    
    for(var i =0;i<this.moveboxescount;i++)
    {
        this.moveboxes[i].script.BoxMoveLR.canmove = false;
        this.moveboxes[i].setPosition(0,-100,0);
    }

    
    this.moveboxesindex = 0;
    this.LastPos.set(0,0,0);
    this.rowsindex = 0;
    this.lastcolsshow = [];
    this.InitPath();

};


