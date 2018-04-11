var PathManager = pc.createScript('PathManager');
PathManager.attributes.add('baseboxmats',{type:'asset',array:true});
PathManager.attributes.add('stepmats',{type:'asset',array:true});
PathManager.attributes.add('floortexs',{type:'asset',array:true});
PathManager.attributes.add('groundtexs',{type:'asset',array:true});
PathManager.attributes.add('floormat',{type:'asset'});
PathManager.attributes.add('groundmat',{type:'asset'});

PathManager.prototype.initialize = function() {
    
    var app = this.app;
    var manager = app.root.findByName('Manager');
    var player = app.root.findByName('player');
    this.playercontrol = player.script.PlayerControl;
    this.gamemanager = manager.script.GameStateManager;
    this.MainBox1 = app.root.findByName('MainBox1');
    this.MainBox2 = app.root.findByName('MainBox2');
    
    this.FloorMat = app.assets.get(this.floormat.id).resource;
    this.GroundMat = app.assets.get(this.groundmat.id).resource;
    
    this.scenecount = 4;
    this.sceneindex = 0;
    
    this.BaseBoxMats = [];
    this.StepMats = [];
    this.FloorTexs = [];
    this.GroundTexs = [];
    for(var i=0;i<this.scenecount;i++)
    {
        this.BaseBoxMats.push(app.assets.get(this.baseboxmats[i].id).resource);
        this.StepMats.push(app.assets.get(this.stepmats[i].id).resource);
        this.FloorTexs.push(app.assets.get(this.floortexs[i].id).resource);
        this.GroundTexs.push(app.assets.get(this.groundtexs[i].id).resource);
    }

    
    this.changeindex = 0;
    this.changeheight = 75;
    
    var prefab = app.root.findByName('prefab');
    this.count = 44;
    this.Scale = 1;
    this.dropnum = 10;
    this.initcount = 22;
    
    this.scaleX = this.Scale;
    this.scaleY = 0.2;
    this.scaleZ = this.Scale/2;
    this.PosY = 0.1; 
    this.PosX = 3;
    this.PosZ = 2.25;
    this.XDir = 0;
    this.ZDir = -1;
    this.droptime = 0.35;
    this.droptimer = this.droptime+1;
    this.curAxis = 0;
    this.index = 0;
    this.stepsindex = 0;
    this.dropindex = 0;
    this.playerindex = -1;
    this.sethitdelay = Math.floor(pc.math.random(0,6));
    
    this.hitcontrolcount = 10;
    this.hitsindex = [];
    this.hitcontrols = [];
    this.InitHitControl();
    this.SetScene();
    
    this.prefabs = [];
    this.prefabs.push(prefab);
    for(var i=1;i< this.count;i++)
    {
        var obj = prefab.clone();
        app.root.addChild(obj);
        this.prefabs.push(obj);
    }
    
    this.InitPath();
};

PathManager.prototype.update = function(dt) {
      if(!this.gamemanager.start || !this.gamemanager.startgame)
      {
          return;
      }
      if(this.gamemanager.lose)
      {
          return;
      }
      this.droptimer -= dt;
      if(this.droptimer < 0)
      {
            this.droptimer = this.droptime;
            if(this.playerindex === this.dropindex)
            {
                this.gamemanager.droplose = true;
                this.gamemanager.lose = true;
            }
            this.RemoveStep();
            
      }
    

};

PathManager.prototype.InitPath = function(){
    
    for(var i=this.initcount;i<this.count;i++)
    {
        this.prefabs[i].model.model.meshInstances[0].material = this.StepMats[this.sceneindex];
        this.prefabs[i].enabled = false;
    }

    for(var i=0;i<this.initcount;i++)
    {
        this.prefabs[i].model.model.meshInstances[0].material = this.StepMats[this.sceneindex];
        var obj = this.prefabs[this.index];
        obj.enabled = true;
        if(this.stepsindex >9)
        {
            this.curAxis ++;
            this.curAxis = (this.curAxis === 4)?0:this.curAxis;
            this.PosX += this.XDir*this.Scale/4;
            this.PosZ += this.ZDir*this.Scale/4;
            obj.setPosition(this.PosX,this.PosY,this.PosZ);
            obj.setLocalScale(this.Scale,this.scaleY,this.Scale);
            switch(this.curAxis)
            {
                case 0:    
                    this.XDir = 0;
                    this.ZDir = -1;
                    this.scaleX = this.Scale;
                    this.scaleZ = this.Scale/2;
                    break;
                case 1:
                    this.XDir = -1;
                    this.ZDir = 0;
                    this.scaleX = this.Scale/2;
                    this.scaleZ = this.Scale;
                    break;
                case 2:
                    this.XDir = 0;
                    this.ZDir = 1;
                    this.scaleX = this.Scale;
                    this.scaleZ = this.Scale/2;
                    break;
                case 3:
                    this.XDir = 1;
                    this.ZDir = 0;
                    this.scaleX = this.Scale/2;
                    this.scaleZ = this.Scale;
                    break;
            }
            this.PosY += this.scaleY;
            this.PosX += this.XDir*this.Scale*3/4;
            this.PosZ += this.ZDir*this.Scale*3/4;
        }
        else
        {
            if(i > 10)
            {
                this.SetHit();
            }
            obj.setPosition(this.PosX,this.PosY,this.PosZ);
            obj.setLocalScale(this.scaleX,this.scaleY,this.scaleZ);
            this.PosY += this.scaleY;
            this.PosX += this.XDir*this.scaleX;
            this.PosZ += this.ZDir*this.scaleZ;
        }
        this.stepsindex = this.stepsindex>9?0:this.stepsindex+1;
        this.index++;
    }
};



PathManager.prototype.AddStep = function(){
        
        if(this.PosY>this.changeheight)
        {
            this.changeheight += 50;
            if(this.changeindex === 0)
            {
                this.changeindex = 1;
                this.MainBox1.setPosition(0,this.changeheight,0);
            }
            else
            {
                this.changeindex = 0;
                this.MainBox2.setPosition(0,this.changeheight,0);
            }
        }
        var obj = this.prefabs[this.index];
        obj.enabled = true;
        if(this.stepsindex >9)
        {
            this.curAxis ++;
            this.curAxis = (this.curAxis === 4)?0:this.curAxis;
            this.PosX += this.XDir*this.Scale/4;
            this.PosZ += this.ZDir*this.Scale/4;
            obj.setPosition(this.PosX,this.PosY,this.PosZ);
            obj.setLocalScale(this.Scale,this.scaleY,this.Scale);
            switch(this.curAxis)
            {
                case 0:    
                    this.XDir = 0;
                    this.ZDir = -1;
                    this.scaleX = this.Scale;
                    this.scaleZ = this.Scale/2;
                    break;
                case 1:
                    this.XDir = -1;
                    this.ZDir = 0;
                    this.scaleX = this.Scale/2;
                    this.scaleZ = this.Scale;
                    break;
                case 2:
                    this.XDir = 0;
                    this.ZDir = 1;
                    this.scaleX = this.Scale;
                    this.scaleZ = this.Scale/2;
                    break;
                case 3:
                    this.XDir = 1;
                    this.ZDir = 0;
                    this.scaleX = this.Scale/2;
                    this.scaleZ = this.Scale;
                    break;
            }
            this.PosY += this.scaleY;
            this.PosX += this.XDir*this.Scale*3/4;
            this.PosZ += this.ZDir*this.Scale*3/4;
        }
        else
        {
            this.SetHit();
            obj.setPosition(this.PosX,this.PosY,this.PosZ);
            obj.setLocalScale(this.scaleX,this.scaleY,this.scaleZ);
            this.PosY += this.scaleY;
            this.PosX += this.XDir*this.scaleX;
            this.PosZ += this.ZDir*this.scaleZ;
        }
        this.stepsindex = this.stepsindex>9?0:this.stepsindex+1;
        this.index = this.index>=this.count-1?0:this.index+1;
        this.playerindex = this.playerindex >= this.count-1?0:this.playerindex+1;
        var num = this.dropindex <= this.playerindex? this.playerindex-this.dropindex:this.count-this.dropindex+this.playerindex;
        if( num > this.dropnum)
        {
            this.RemoveStep();
        }
    
    
};

PathManager.prototype.RemoveStep = function(){

    this.prefabs[this.dropindex].enabled = false;
    this.dropindex = this.dropindex >=this.count-1?0:this.dropindex+1;
};

PathManager.prototype.SetHit = function(){
    
    this.sethitdelay --;
    if(this.sethitdelay > 0)
    {
        return;
    }
    this.sethitdelay = Math.floor(pc.math.random(3,6));
    var type = Math.floor(pc.math.random(0,4));
    var hitobj = this.hitcontrols[type][this.hitsindex[type]];
    hitobj.enabled = true;
    var hitcontrol = null;
    switch(type)
    {   
        case 0:
            hitcontrol = hitobj.script.Hit1Control;
            hitcontrol.index = this.index;
            hitcontrol.delay = Math.floor(pc.math.random(5,9));
            hitcontrol.XDir = this.XDir;
            hitcontrol.ZDir = this.ZDir;
            hitcontrol.limitY = this.PosY+0.3;
            switch(this.curAxis)
            {
                case 0:
                    hitcontrol.X = 2.75;
                    hitcontrol.Y = this.PosY+4;
                    hitcontrol.Z = this.PosZ;   
                    break;
                case 1:
                    hitcontrol.X = this.PosX;
                    hitcontrol.Y = this.PosY+4;
                    hitcontrol.Z = -2.75;
                    break;
                case 2:
                    hitcontrol.X = -2.75;
                    hitcontrol.Y = this.PosY+4;
                    hitcontrol.Z = this.PosZ;
                    break;
                case 3:
                    hitcontrol.X = this.PosX;
                    hitcontrol.Y = this.PosY+4;
                    hitcontrol.Z = 2.75;
                    break;
                default:
                    break;
            }
            hitcontrol.Init();
            break;
        case 1:
            hitcontrol = hitobj.script.Hit2Control;
            hitcontrol.index = this.index;
            hitobj.setPosition(this.PosX,0.9+this.PosY,this.PosZ);
            switch(this.curAxis)
            {
                case 0:
                    hitobj.setEulerAngles(0,0,0);
                    break;
                case 1:
                    hitobj.setEulerAngles(0,90,0);
                    break;
                case 2:
                    hitobj.setEulerAngles(0,180,0);
                    break;
                case 3:
                    hitobj.setEulerAngles(0,270,0);
                    break;
                default:
                    break;
            }
            hitcontrol.Init();
            break;
        case 2:
            hitcontrol = hitobj.script.Hit3Control;
            hitcontrol.index = this.index;
            hitobj.setPosition(this.PosX,0.2+this.PosY,this.PosZ);
            switch(this.curAxis)
            {
                case 0:
                    hitobj.setEulerAngles(0,0,0);
                    break;
                case 1:
                    hitobj.setEulerAngles(0,90,0);
                    break;
                case 2:
                    hitobj.setEulerAngles(0,180,0);
                    break;
                case 3:
                    hitobj.setEulerAngles(0,270,0);
                    break;
                default:
                    break;
            }
            hitcontrol.Init();
            break;
        case 3:
            hitcontrol = hitobj.script.Hit4Control;
            hitcontrol.index = this.index;
            hitobj.setPosition(this.PosX,0.25+this.PosY,this.PosZ);
            hitcontrol.Init();
            break;
        default:
            break;      
            
    }
    
    
    this.hitsindex[type]= this.hitsindex[type]>=this.hitcontrolcount-1?0:this.hitsindex[type]+1;
    
};

PathManager.prototype.InitHitControl = function(){
    
    var app = this.app;
    var templates = app.root.findByName('Template').children;
    for(var i=0;i< templates.length;i++)
    {
        var pool = [];
        templates[i].enabled = false;
        pool.push(templates[i]);
        this.hitsindex.push(0);
        for(var j=1;j<this.hitcontrolcount;j++)
        {
            var obj = templates[i].clone();
            app.root.addChild(obj);
            pool.push(obj);
        }
        this.hitcontrols.push(pool);
    }

};
PathManager.prototype.ResetHitControl = function(){
    for(var i=0;i< this.hitsindex.length;i++)
    {
        var pool = this.hitcontrols[i];
        this.hitsindex[i] =0;
        for(var j=0;j<this.hitcontrolcount;j++)
        {
            pool[j].enabled = false;
        }
    }
};
PathManager.prototype.SetScene = function(){
  
    var index = Math.floor(pc.math.random(0,this.scenecount));
    this.sceneindex = this.sceneindex===index?(index >0?index-1:index+1):index;
    
    this.FloorMat.diffuseMap = this.FloorTexs[this.sceneindex];
    this.FloorMat.update();
    this.GroundMat.diffuseMap = this.GroundTexs[this.sceneindex];
    this.GroundMat.update();
    this.MainBox1.model.model.meshInstances[0].material = this.BaseBoxMats[this.sceneindex];
    this.MainBox2.model.model.meshInstances[0].material = this.BaseBoxMats[this.sceneindex];
    
};

PathManager.prototype.Init = function(){
    

    
    this.scaleX = this.Scale;
    this.scaleY = 0.2;
    this.scaleZ = this.Scale/2;
    this.PosY = 0.1; 
    this.PosX = 3;
    this.PosZ = 2.25;
    this.XDir = 0;
    this.ZDir = -1;
    
    this.changeindex = 0;
    this.changeheight = 75;
    this.MainBox1.setPosition(0,25,0);
    this.MainBox2.setPosition(0,75,0);
    
    this.droptime = 0.35;
    this.droptimer = this.droptime+1;
    
    this.curAxis = 0;
    this.index = 0;
    this.stepsindex = 0;

    this.dropindex = 0;
    this.playerindex = -1;
    this.SetScene();
    this.ResetHitControl();
    this.InitPath();
};