var Triggerturntable = pc.createScript('triggerturntable');
//Triggerturntable.attributes.add("players",{type:"entity",default:null});
//Triggerturntable.attributes.add("gm",{type:"entity",default:null});
// initialize code called once per entity
Triggerturntable.prototype.initialize = function() { 
    this.gm=this.app.root.findByName("GameController");
    this.gamemanager=this.gm.script.GameManager;
    this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
    this.ui=this.app.root.findByName("UI");
    this.uimanager=this.ui.script.UIManager;
    this.players=this.app.root.findByName("players");
};

// update code called every frame
Triggerturntable.prototype.update = function(dt) {
     
};

Triggerturntable.prototype.onTriggerEnter=function(result){
    var pos=this.players.getPosition();
    var pos2=this.entity.getPosition();
            if(result.name==="players"){                      
                 if(this.gamemanager.isMove===true){                        
                        this.gamemanager.isMove=false;                        
                        if(!this.gamemanager.isReset){
                           //分数
                           this.gamemanager.score++;
                           
                           this.uimanager.scoreui.innerHTML=this.gamemanager.score.toString();
                           
                           //获取碰撞时player位置
                           
                           //更换父物体
                           this.players.reparent(this.entity,0);
                           this.gamemanager.hasParent=true;
                           //设置位置
                           this.players.setPosition(pos.x,pos.y,pos.z);
                            
                           //大小设置
                           var scale=this.entity.getLocalScale();
                           var sc=2/scale.x;
                           this.players.setLocalScale(sc,sc,sc);
                           this.players.collision.halfExtents.set(0.07*sc,0.07*sc);
                           //this.players.collision.radius=0.075*sc;
                           //this.players.collision.height=0.25*sc;
                           
                           //转向
                           this.players.lookAt(pos2);
                             
                           this.gamemanager.isReset=true; 
                        }
               }
           }
   
};