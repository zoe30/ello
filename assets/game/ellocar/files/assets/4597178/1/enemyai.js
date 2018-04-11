var Enemyai = pc.createScript('enemyai');

Enemyai.attributes.add("currentWayPointEnemy",{type:"number",default:0});
// initialize code called once per entity
Enemyai.prototype.initialize = function() {
            this.autoSwitch=true;//默认第二赛道
            this.player=this.app.root.findByName("player");
            this.gm=this.app.root.findByName("GameController");
            this.path1=this.app.root.findByName("WayPoint1");
            this.path2=this.app.root.findByName("WayPoint2");
            this.waypointlist1=this.path1.getChildren();
            this.waypointlist2=this.path2.getChildren();
    
            //Enemy初始目标
            this.currentWayPointEnemy=2;
    
            this.switchingAllowed=true;
            this.timeToSwitch=pc.math.random(5,10);
};

// update code called every frame
Enemyai.prototype.update = function(dt) {
               if(!this.gm.script.GameManager.GameIsOver){
                
                if(this.gm.script.GameManager.ks){
                     this.timeToSwitch-=dt;
                     
                     var cha=this.currentWayPointEnemy-this.player.script.waypoint.currentWayPoint;
                     
                     if(this.timeToSwitch<0 && this.switchingAllowed===true && (cha>7 || cha<-7) ){
                         this.timeToSwitch=pc.math.random(0,2.5);                         
                         this.switchLineEnemy=!this.switchLineEnemy;
                     }
                
                     
                     if(this.currentWayPointEnemy<0){
                       this.currentWayPointEnemy=this.waypointlist1.length-1;
                     }
                     var vect2=new pc.Vec3();
                     if(!this.switchLineEnemy){
                         vect2=this.waypointlist1[this.currentWayPointEnemy].getPosition();
                     }else{
                         vect2=this.waypointlist2[this.currentWayPointEnemy].getPosition();
                     }
                     //当前位置
                     var vec2=this.entity.getPosition();
                     //与目标位置的距离
                     var dis2=(vect2.x-vec2.x)*(vect2.x-vec2.x)+(vect2.y-vec2.y)*(vect2.y-vec2.y)+(vect2.z-vec2.z)*(vect2.z-vec2.z); 
                     if(dis2<1.4){
                           this.currentWayPointEnemy--;                       
                     }else{
                           var sd=this.gm.script.GameManager.speed;
                           //与目标相距大于0.04时，汽车运动
                           this.entity.lookAt(vect2.x,vect2.y,vect2.z);                       
                           this.entity.translateLocal(0,0,-sd*dt);
                     }
                }
                 
            }else{
                this.currentWayPointEnemy=this.waypointlist1.length-1;
                this.switchLineEnemy=true;
                this.timeToSwitch=pc.math.random(5,20);                
            }  
};

// swap method called for script hot-reloading
// inherit your script state here
Enemyai.prototype.swap = function(old) {
    
};

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/