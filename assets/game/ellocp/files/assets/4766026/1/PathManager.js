var PathManager = pc.createScript('PathManager');

PathManager.prototype.initialize = function() {
    var app = this.app;
    var manager = app.root.findByName('Manager');  
    this.gameparam = manager.script.GameParam;
    this.gamemanager = manager.script.GameStateManager;
    this.playercontrol = manager.script.PlayerControl;
    
    var boxprefabl = app.root.findByName('Boxprefabl');
    var boxprefabr = app.root.findByName('Boxprefabr');
    var boundprefab = app.root.findByName('prefab');
    
    
    
    this.BoxInitNum = 9;
    this.BoundInitNum  = 2;
    
    this.BoxLPool = [];
    this.BoxRPool = [];
    this.BoundPool = [];
    
    this.BoxLPool.push(boxprefabl);
    this.BoxRPool.push(boxprefabr);
    this.BoundPool.push(boundprefab);
    
    var i = 0;
    for(i=0;i<this.BoxInitNum;i++)
    {
        var objl = boxprefabl.clone();
        app.root.addChild(objl);
        this.BoxLPool.push(objl);
        var objr = boxprefabr.clone();
        app.root.addChild(objr);
        this.BoxRPool.push(objr);
    }
    
    for(i= 0;i<this.BoundInitNum;i++)
    {
       var objbound = boundprefab.clone();
       app.root.addChild(objbound); 
       this.BoundPool.push(objbound); 
    }

    this.bounddis = 18;
    this.boxdis = 8;
    this.boxminlength = 1;
    this.boxmaxlength = 4;
    this.boundpoollength = this.BoundInitNum +1;
    this.boxpoollength = this.BoxInitNum +1;
    
    this.boundindex = 0;
    this.boxindex = 0;
    this.lastboundPosZ = 0;
    var loffset = Math.floor(pc.math.random(0,2));
    this.lastlboundz = loffset *this.gameparam.playerscale;
    var roffset = Math.floor(pc.math.random(3,5));
    this.lastrboundz = roffset*this.gameparam.playerscale;
    this.InitBoxNum = 6;
    this.collidernum = 20;
    
    this.lcolliderpool = [];
    this.rcolliderpool = [];
    for(var i = 0;i<this.collidernum;i++)
    {
        this.lcolliderpool.push({ubound:0,dbound:0,lrbound:0,min:true});
        this.rcolliderpool.push({ubound:0,dbound:0,lrbound:0,min:true});
    }
    
    this.colliderindex = 0;
    
    this.InitPath();
};

PathManager.prototype.update = function(dt) 
{
   if(!this.gamemanager.start || !this.gamemanager.startgame)
    {
        return;
    }
    
    if(this.gamemanager.lose)
    {
        return;
    } 
};


PathManager.prototype.swap = function(old) 
{
    
};

PathManager.prototype.InitPath = function()
{    
     var i = 0;
     for(i = 0;i<this.boundpoollength;i++)
     {
        this.BoundPool[i].setPosition(-100,0,0); 
     }
     
     for(i = 0;i<this.boxpoollength;i++)
     {
       this.BoxLPool[i].setPosition(-100,0,0);
       this.BoxRPool[i].setPosition(-100,0,0);  
     }
    
     this.BoundPool[this.boundindex].setPosition(0,0,this.lastboundPosZ);
     this.lastboundPosZ += this.bounddis;
     this.boundindex ++;
     this.BoundPool[this.boundindex].setPosition(0,0,this.lastboundPosZ);
     this.lastboundPosZ += this.bounddis;
     this.boundindex ++;
     for(i = 0;i<this.InitBoxNum;i++)
     {
        var llr = pc.math.random(0,1) > 0.5;
        var lboxlength = Math.floor(pc.math.random(this.boxminlength,this.boxmaxlength));
        this.BoxLPool[this.boxindex].setPosition(llr?-(lboxlength*this.gameparam.playerscale/2+this.gameparam.boundscale):-(this.gameparam.worldwidth/2-lboxlength*this.gameparam.playerscale/2-this.gameparam.boundscale),0,this.lastlboundz);
        var lbox = this.BoxLPool[this.boxindex].findByName('Box');
        lbox.setLocalScale(this.gameparam.playerscale*lboxlength,100,this.gameparam.playerscale);
        this.lcolliderpool[this.colliderindex].ubound = this.lastlboundz-this.gameparam.playerscale/2;
        this.lcolliderpool[this.colliderindex].dbound = this.lastlboundz +this.gameparam.playerscale/2;
        this.lcolliderpool[this.colliderindex].lrbound = llr?-(lboxlength*this.gameparam.playerscale+this.gameparam.boundscale+this.gameparam.playerscale/2):-(this.gameparam.worldwidth/2-lboxlength*this.gameparam.playerscale-this.gameparam.boundscale-this.gameparam.playerscale/2);
        this.lcolliderpool[this.colliderindex].min = llr?false:true; 
        this.lastlboundz +=  this.boxdis*this.gameparam.playerscale; 
        
                                                 
        var rlr = false;
        var rboxlength = Math.floor(pc.math.random(this.boxminlength,this.boxmaxlength));
        this.BoxRPool[this.boxindex].setPosition(rlr?(rboxlength*this.gameparam.playerscale/2+this.gameparam.boundscale):(this.gameparam.worldwidth/2-rboxlength*this.gameparam.playerscale/2-this.gameparam.boundscale),0,this.lastrboundz);
        var rbox = this.BoxRPool[this.boxindex].findByName('Box');
        rbox.setLocalScale(this.gameparam.playerscale*rboxlength,100,this.gameparam.playerscale);
        this.rcolliderpool[this.colliderindex].ubound = this.lastrboundz-this.gameparam.playerscale/2;
        this.rcolliderpool[this.colliderindex].dbound = this.lastrboundz +this.gameparam.playerscale/2;
        this.rcolliderpool[this.colliderindex].lrbound = rlr?(rboxlength*this.gameparam.playerscale+this.gameparam.boundscale+this.gameparam.playerscale/2):(this.gameparam.worldwidth/2-rboxlength*this.gameparam.playerscale-this.gameparam.boundscale-this.gameparam.playerscale/2);
        this.rcolliderpool[this.colliderindex].min = rlr?true:false;
        this.lastrboundz += this.boxdis*this.gameparam.playerscale;
        
        this.colliderindex++;
        this.colliderindex  = this.colliderindex%this.collidernum;  
         
        this.boxindex ++; 

     }
};

PathManager.prototype.Init = function()
{
    this.boundindex = 0;
    this.boxindex = 0;
    this.colliderindex = 0;
    this.lastboundPosZ = 0;
    var loffset = Math.floor(pc.math.random(0,2));
    this.lastlboundz = loffset *this.gameparam.playerscale;
    var roffset = Math.floor(pc.math.random(2,4));
    this.lastrboundz = roffset*this.gameparam.playerscale;
    
    this.InitPath();
};

PathManager.prototype.SpanPath = function()
{
    
        var llr = this.playercontrol.score < 5 ?pc.math.random(0,1) > 0.5:(this.playercontrol.score <15?false:pc.math.random(0,1) > 0.5);
        var lboxlength = Math.floor(this.playercontrol.score <30?pc.math.random(this.boxminlength,this.boxmaxlength-1):pc.math.random(this.boxminlength,this.boxmaxlength));
        this.BoxLPool[this.boxindex].setPosition(llr?-(lboxlength*this.gameparam.playerscale/2+this.gameparam.boundscale):-(this.gameparam.worldwidth/2-lboxlength*this.gameparam.playerscale/2-this.gameparam.boundscale),0,this.lastlboundz);
        var lbox = this.BoxLPool[this.boxindex].findByName('Box');
        lbox.setLocalScale(this.gameparam.playerscale*lboxlength,100,this.gameparam.playerscale);
        this.lcolliderpool[this.colliderindex].ubound = this.lastlboundz-this.gameparam.playerscale/2;
        this.lcolliderpool[this.colliderindex].dbound = this.lastlboundz +this.gameparam.playerscale/2;
        this.lcolliderpool[this.colliderindex].lrbound = llr?-(lboxlength*this.gameparam.playerscale+this.gameparam.boundscale+this.gameparam.playerscale/2):-(this.gameparam.worldwidth/2-lboxlength*this.gameparam.playerscale-this.gameparam.boundscale-this.gameparam.playerscale/2);
        this.lcolliderpool[this.colliderindex].min = llr?false:true; 
        this.lastlboundz +=  this.boxdis*this.gameparam.playerscale; 
        
                                                 
        var rlr = this.playercontrol.score < 5 ?false:pc.math.random(0,1) > 0.5;
        var rboxlength = Math.floor(this.playercontrol.score <30?pc.math.random(this.boxminlength,this.boxmaxlength-1):pc.math.random(this.boxminlength,this.boxmaxlength));
        this.BoxRPool[this.boxindex].setPosition(rlr?(rboxlength*this.gameparam.playerscale/2+this.gameparam.boundscale):(this.gameparam.worldwidth/2-rboxlength*this.gameparam.playerscale/2-this.gameparam.boundscale),0,this.lastrboundz);
        var rbox = this.BoxRPool[this.boxindex].findByName('Box');
        rbox.setLocalScale(this.gameparam.playerscale*rboxlength,100,this.gameparam.playerscale);
        this.rcolliderpool[this.colliderindex].ubound = this.lastrboundz-this.gameparam.playerscale/2;
        this.rcolliderpool[this.colliderindex].dbound = this.lastrboundz +this.gameparam.playerscale/2;
        this.rcolliderpool[this.colliderindex].lrbound = rlr?(rboxlength*this.gameparam.playerscale+this.gameparam.boundscale+this.gameparam.playerscale/2):(this.gameparam.worldwidth/2-rboxlength*this.gameparam.playerscale-this.gameparam.boundscale-this.gameparam.playerscale/2);
        this.rcolliderpool[this.colliderindex].min = rlr?true:false;
        this.lastrboundz += this.boxdis*this.gameparam.playerscale;
        
        this.colliderindex++;
        this.colliderindex  = this.colliderindex%this.collidernum;  
            
        this.boxindex ++; 
        if(this.boxindex >= this.boxpoollength)
        {
            this.boxindex = 0;
        }
            
        
};
PathManager.prototype.SpanBound = function()
{
    this.BoundPool[this.boundindex].setPosition(0,0,this.lastboundPosZ);
    this.lastboundPosZ += this.bounddis;
    this.boundindex ++;
    if(this.boundindex >= this.boundpoollength)
    {
        this.boundindex = 0;
    }
};




