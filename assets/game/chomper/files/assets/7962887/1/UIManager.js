var Uimanager = pc.createScript('uimanager');

// initialize code called once per entity
Uimanager.prototype.initialize = function() {
    this.manager=this.app.root.findByName("Manager");
    if(this.manager){
        this.gamemanager=this.manager.script.gameStateManager;
        this.pathmanager=this.manager.script.pathManager;
    }
    this.tips=this.app.root.findByName("Tips");
    this.curcamera=this.app.root.findByName("Camera");
    this.camerafollow=this.curcamera.script.cameraFollow;
    this.player=this.app.root.findByName("Player");
    this.playercontrol=this.player.script.playerControl;
    this.showEndUI = false;


    //添加监听事件
    var self=this;
    var again = document.getElementById("loadscene");
    var uistart = document.getElementById("uistart");
    var start = document.getElementById("start");
    this.uiend = document.getElementById("uiend");
    this.score = document.getElementById("score");

    again.addEventListener("click",function(e){
        //UI相关
        self.uiend.style.display = "none";
        self.score.innerHTML = "0";

        //调用函数
        self.gamemanager.Init();

        //场景相关,状态改变
        self.tips.enabled=true;
        self.manager.sound.slot("start").play();
        STATUS="tipshow";

        self.pathmanager.Init();
        self.playercontrol.Init();
        self.camerafollow.Init();
         self.Init();
    });
    start.addEventListener("click",function(e){
        //UI相关
        self.uiend.style.display = "none";
        self.score.style.display = "block";
        uistart.style.display = "none";

        //调用函数
        self.gamemanager.GameStart();
 self.gamemanager.start = true;
        //状态改变
        self.manager.sound.slot("start").play();
        STATUS="tipshow";

    });
    this.losetimer = 0;
};

// update code called every frame
Uimanager.prototype.update = function(dt) {
  // if(this.gamemanager.lose)
  // {
  //
  //   console.log(this.gamemanager);
    if(STATUS==="gameover"){
      this.losetimer +=dt;
      if(this.losetimer >1 && !this.showEndUI)
      {
        // if(STATUS==="gameover"){
            //UI相关
             this.uiend.style.display = "block";
            //调用函数
            this.gamemanager.GameEnd();
            this.showEndUI = true;
        }

      }
  // }

    if(STATUS==="tipshow"){
        this.tips.enabled=true;
    }
    if(STATUS!=="tipshow"){
        this.tips.enabled=false;
    }

};
Uimanager.prototype.Init = function(){
            this.losetimer = 0;
            this.showEndUI = false;
};
