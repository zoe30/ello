var Trigger = pc.createScript('trigger');
Trigger.prototype.initialize = function() {
    this.gm=this.app.root.findByName("GameController");
    this.gamemanager=this.gm.script.GameManager;
    this.player=this.app.root.findByName("player");
    
    this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
};
Trigger.prototype.onTriggerEnter=function(result){    
        if(result.name==="players"){
            this.player.sound.slot("gameover").play();
            
            
            this.gamemanager.GameIsOver=true;
            this.gamemanager.showrestart=true;
        }
};



