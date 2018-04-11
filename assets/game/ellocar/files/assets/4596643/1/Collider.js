
var Collider = pc.createScript('Collider');

// initialize code called once per entity
Collider.prototype.initialize = function() {
    this.entity.collision.on("collisionstart",this.onCollidionStart,this);
    
    this.startcollision=false;
    this.startfood=false;
    this.tm=0;
    this.tmfood=0;
    
    this.gm=this.app.root.findByName("GameController");
    this.player=this.app.root.findByName("player");
    this.gamemanager=this.gm.script.GameManager;
    
    this.gamestatemanager=this.gm.script.GameStateManager;
};

// update code called every frame
Collider.prototype.update = function(dt) {
    if(!this.gamemanager.GameIsOver && this.gamemanager.ks){
        if(this.startcollision){
            if(this.tm<0.5){
                this.tm+=dt;
            }else{
                this.startcollision=false;
                this.tm=0;
            }
        }
        
        if(this.startfood){
            if(this.tmfood<0.5){
                this.tmfood+=dt;                
            }else{
                this.startfood=false;
                this.tmfood=0;
            }
        }
    }else{
        this.tm=0;
        this.tmfood=0;
        this.startcollision=false;
        this.startfood=false;
    }
};

Collider.prototype.onCollidionStart=function(result){
    
    
    //console.log("碰撞了");
    if(!this.gamemanager.GameIsOver && this.gamemanager.ks){
        if(result.other.name==="checkpoint"){
            //console.log("pass checkpoint");
            if(!this.startcollision){
                this.gamemanager.score+=1;
                
                this.startcollision=true;
            }
        }
    }
    
    
    if(result.other.name==="food" ){
       //console.log("eat food");
       if(!this.startfood){
           this.gamemanager.score+=1;
           
           this.startfood=true;
           
           result.other.destroy();
           
           this.gm.script.CreateFood.createFoodAllowed=true;
           
           this.player.sound.slot("eatfood").play();
       } 
    }
    
    
    if(result.other.name==="enemy"){
        //console.log("collider enemy");
        this.gamemanager.GameIsOver=true;
        this.gamemanager.showrestart=true;
        
        this.player.sound.slot("crash").play();
    }
};

// swap method called for script hot-reloading
// inherit your script state here
Collider.prototype.swap = function(old) {
    
};

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/