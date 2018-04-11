var ControlPlayer = pc.createScript('ControlPlayer');
ControlPlayer.attributes.add("groundmat",{type:'asset'});
ControlPlayer.attributes.add("groundtextures",{type:'asset',array:true});
ControlPlayer.attributes.add('playermat',{type:'asset'});
ControlPlayer.attributes.add('playertextures',{type:'asset',array:true});

// initialize code called once per entity
ControlPlayer.prototype.initialize = function() {
    var app = this.app;
    var manager = app.root.findByName("Manager");
    this.boundmanager = manager.script.BoundManager;
    this.gamemanager = manager.script.GameStateManager;
    this.enemy1 = app.root.findByName('enemy1');
    this.enemy3 = app.root.findByName('enemy3');
    this.enemy4 = app.root.findByName('enemy4');
    this.hidemeshindex = [12,4,11,3,14,7,2];
    this.meshinstances = this.entity.findByName('body').model.model.meshInstances;
    this.tips = app.root.findByName('tips');
    this.tips.enabled = false;
    
    this.halfscreenwidth = window.innerWidth/2;
    this.changespeed = 360;
    this.MoveSpeed = 4;
    this.Initpos = this.entity.getPosition().clone();
    app.mouse.disableContextMenu();

    
    this.X = this.Initpos.x;
    this.Z = this.Initpos.z;
    this.Y = this.Initpos.y;
    this.eulerY = 0;
    this.dir = 0;
    this.score = 0;
    
    this.gtextureslength = this.groundtextures.length; 
    this.GroundMat = this.groundmat.resource;
    this.GroundTexs = [];
    for(var i = 0;i< this.gtextureslength;i++)
    {
        this.GroundTexs.push(this.groundtextures[i].resource);
    }
    
    this.ptextureslength = this.playertextures.length; 
    this.PlayerdMat = this.playermat.resource;
    this.PlayerTexs = [];
    for(var i = 0;i< this.ptextureslength;i++)
    {
        this.PlayerTexs.push(this.playertextures[i].resource);
    }
    
    this.groundindex = Math.floor(pc.math.random(0,this.gtextureslength));
    this.GroundMat.diffuseMap = this.GroundTexs[this.groundindex];
    this.GroundMat.update();
    this.playerindex = Math.floor(pc.math.random(0,this.ptextureslength));
    this.PlayerdMat.diffuseMap = this.PlayerTexs[this.playerindex];
    this.PlayerdMat.update();
    this.HideMesh();
    
    
    var self = this;
    if(app.touch)
    {
        app.touch.on(pc.EVENT_TOUCHSTART,function(event){
            if(!self.gamemanager.start)
            {
                return;
            }
            if(!self.gamemanager.startgame)
            {
                self.gamemanager.GameStartGame();
                self.gamemanager.startgame = true;
            }
            if(self.gamemanager.lose)
            {
                return;
            }
            var touches = event.touches;
            var lefthover= false;
            var righthover = false;
            for(var i = 0;i<touches.length;i++)
            {
                if(touches[i].x < self.halfscreenwidth)
                {
                   lefthover = true;
                }
                else
                {
                   righthover = true;
                }
            }
            
            if(lefthover)
            {
                self.dir = 1;
            }
            if(righthover)
            {
                self.dir = -1;
            }
            
        });
        
        app.touch.on(pc.EVENT_TOUCHMOVE,function(event){
            if(!self.gamemanager.start)
            {
                return;
            }
            if(self.gamemanager.lose)
            {
                return;
            }
            var touches = event.touches;
            var lefthover= false;
            var righthover = false;
            for(var i = 0;i<touches.length;i++)
            {
                if(touches[i].x < self.halfscreenwidth)
                {
                   lefthover = true;
                }
                else
                {
                   righthover = true;
                }
            }
            
            if(lefthover)
            {
                self.dir = 1;
            }
            if(righthover)
            {
                self.dir = -1;
            }
  
        });
        
        app.touch.on(pc.EVENT_TOUCHEND,function(event){
            if(!self.gamemanager.start)
            {
                return;
            }
            if(self.gamemanager.lose)
            {
                return;
            }
            var touches = event.touches;

            if(touches.length === 0)
            {
                 self.dir = 0;
            }
            else
            {
                var lefthover= false;
                var righthover = false;
                for(var i = 0;i<touches.length;i++)
                {
                    if(touches[i].x < self.halfscreenwidth)
                    {
                       lefthover = true;
                    }
                    else
                    {
                       righthover = true;
                    }
                }
            
                if(lefthover)
                {
                    self.dir = 1;
                }
                if(righthover)
                {
                    self.dir = -1;
                }

           }
            
        });  
    }

};
ControlPlayer.prototype.update = function(dt) {
    if(!this.gamemanager.start || !this.gamemanager.startgame)
    {
        return;
    }
    if(this.gamemanager.lose)
    {
        return;
    }
    this.CheckHit();
    this.Move(dt);
    //this.PCControl();
};
ControlPlayer.prototype.swap = function(old) {
    
};
ControlPlayer.prototype.PCControl = function()
{
    var lefthover= false;
    var righthover = false;
    if(this.app.keyboard.isPressed(pc.KEY_A))
    {
        lefthover = true;
    }
    
    if(this.app.keyboard.wasReleased(pc.KEY_A))
    {
         lefthover = false;          
    }
    
    if(this.app.keyboard.isPressed(pc.KEY_D))
    {
        righthover = true;
    }
    
    if(this.app.keyboard.wasReleased(pc.KEY_D))
    {
        righthover = false;
    }
    
    if(lefthover)
    {
        this.dir = -1;
    }
    if(righthover)
    {
        this.dir = 1;
    }
    if(!lefthover && !righthover)
    {
        this.dir = 0;
    }
};
ControlPlayer.prototype.Move = function(dt){
    
    this.eulerY += this.dir*this.changespeed*dt;
    var dir = this.entity.forward;
    this.X += dir.x*this.MoveSpeed*dt;
    this.Z += dir.z*this.MoveSpeed*dt;
    if(this.X < this.boundmanager.LeftBound)
    {
        this.X = this.boundmanager.RightBound;
    }
    if(this.X > this.boundmanager.RightBound)
    {
        this.X = this.boundmanager.LeftBound;
    }
    
    if(this.Z > this.boundmanager.DownBound)
    {
        this.Z = this.boundmanager.UpBound;
    }
    if(this.Z < this.boundmanager.UpBound)
    {
        this.Z = this.boundmanager.DownBound;
    }
    
    this.entity.setEulerAngles(0,this.eulerY,0);
    this.entity.setPosition(this.X,this.Y,this.Z);
};

ControlPlayer.prototype.CheckHit = function(){
    var pos = this.entity.getPosition();
    var pos1 = this.enemy1.getPosition();
    var pos2 = this.enemy3.getPosition();
    var pos3 = this.enemy4.getPosition();
    
    var d1 = Math.sqrt((pos.x-pos1.x)*(pos.x-pos1.x)+(pos.z-pos1.z)*(pos.z-pos1.z));
    var d2 = Math.sqrt((pos.x-pos2.x)*(pos.x-pos2.x)+(pos.z-pos2.z)*(pos.z-pos2.z));
    var d3 = Math.sqrt((pos.x-pos3.x)*(pos.x-pos3.x)+(pos.z-pos3.z)*(pos.z-pos3.z));   
    if( d1 < 0.5)
    {
        this.gamemanager.lose = true;
        console.log("Hit Enemy1");
        this.PlaySound('lose');
    }
    if( d2 < 1)
    {
        this.gamemanager.lose = true;
        console.log("Hit Enemy3");
        this.PlaySound('lose');
    }
    if( d3 < 1.2)
    {
        this.gamemanager.lose = true;
        console.log("Hit Enemy4");
        this.PlaySound('lose');
    }
    
};
ControlPlayer.prototype.AddScore = function(){
    this.PlaySound('eat');
     this.score ++;
     if(this.score === 15) 
     {
         this.enemy1.script.Enemy1.canMove = true;
     }
     if(this.score === 30)
    {
        this.enemy3.script.Enemy3.canMove = true;
    }
    if(this.score % 30 === 0 && this.score < 240)
     {
         this.enemy1.script.Enemy1.MoveSpeed += 0.2;
         this.enemy3.script.Enemy3.MoveSpeed += 0.2;
         this.enemy4.script.Enemy4.MoveSpeed += 0.2;
         this.MoveSpeed += 0.2;
     }
     var scoreui = document.getElementById('score');
     scoreui.innerHTML = this.score.toString();  
};
ControlPlayer.prototype.HideMesh = function(){
      for(var i =1;i<this.meshinstances.length;i++)
      {
          if(i === this.hidemeshindex[this.playerindex])
          {
              this.meshinstances[i].visible = true;
          }
          else
          {
              this.meshinstances[i].visible = false;
          }
      }
};

ControlPlayer.prototype.PlaySound = function(name){
    this.entity.sound.slot(name).play();
};


ControlPlayer.prototype.Init = function()
{
    this.groundindex = Math.floor(pc.math.random(0,this.gtextureslength));
    this.GroundMat.diffuseMap = this.GroundTexs[this.groundindex];
    this.GroundMat.update();
    this.playerindex = Math.floor(pc.math.random(0,this.ptextureslength));
    this.PlayerdMat.diffuseMap = this.PlayerTexs[this.playerindex];
    this.PlayerdMat.update();
    this.HideMesh();
    this.entity.setPosition(this.Initpos.x,this.Initpos.y,this.Initpos.z);
    this.entity.setEulerAngles(0,0,0);
    this.X = this.Initpos.x;
    this.Z = this.Initpos.z;
    this.Y = this.Initpos.y;
    this.MoveSpeed = 4;
    this.eulerY = 0;
    this.dir = 0;
    this.score = 0;
};





