var Fruittrigger = pc.createScript('fruittrigger');
// initialize code called once per entity
Fruittrigger.prototype.initialize = function() {
    this.entity.collision.on("triggerenter",this.onTriggerEnter,this);
    this.gm=this.app.root.findByName("GameController");
    this.player=this.app.root.findByName("player");
    this.cam=this.app.root.findByName("Camera");
    this.ui=this.app.root.findByName("UI");
    this.uimanager=this.ui.script.UIManager;
};

// update code called every frame
Fruittrigger.prototype.update = function(dt) {
    if(this.gm.script.GameManager.GameIsOver===true){ //游戏结束，位置重置
        this.entity.setPosition(-16,5,0);
        this.entity.setLocalScale(0.25,0.25,1);
    }
};

Fruittrigger.prototype.onTriggerEnter=function(result){
  
  if(result.name==="players"){   
      this.player.sound.slot("eat").play();
      this.gm.script.GameManager.score++; 
      
      this.uimanager.scoreui.innerHTML=this.gm.script.GameManager.score.toString();
      
      this.entity.setPosition(-16,5,0);
      this.entity.setLocalScale(0.25,0.25,1);
  }
};
 
