var GameStateManager = pc.createScript('gameStateManager');

//状态分别为startbefore,tipshow,gaming,gameover
//startbefore为点击按钮start之前的默认状态
//tipshow为点击按钮start后的状态，此时tip显示
//gaming为tip显示时，再点击一次，正式开始游戏的状态
//gameover为游戏结束后，restart未点击前的状态
//restart点击后状态重置为tipshow
var STATUS="startbefore";


// initialize code called once per entity
GameStateManager.prototype.initialize = function() {

    this.player=this.app.root.findByName("Player");
    this.playercontrol=this.player.script.playerControl;

    STATUS="startbefore";

    this.start = false;
    this.startgame = false;
    this.lose = false;
    this.droplose = false;
    this.hitlose = false;
    this.playtimer = 0.3;
        initHandle();
};

// update code called every frame
GameStateManager.prototype.update = function(dt) {
  if(!this.start || !this.startgame)
  {
      return;
  }
  if(this.lose)
  {
      return;
  }

  this.playtimer += dt;
};

GameStateManager.prototype.GameStart=function(){
    //点击start开始按钮后，调用
    beginHandle();
};

GameStateManager.prototype.GameStartGame=function(){
    //tipshow状态时，再次点击屏幕，正式开始游戏时调用
    startHandle();
};

GameStateManager.prototype.GameEnd=function(){
    //游戏结束时调用
    var scoreinfo={"score":this.playercontrol.score,'usermask':parseInt(this.playtimer),"score1":(this.playercontrol.score+17),'usermask1':parseInt(this.playtimer+9)};
    gameover(scoreinfo);
};

GameStateManager.prototype.Init=function(){
    //点击restart按钮，游戏重置时调用
    resetHandle();
      this.playtimer = 0;
      this.startgame =false;
      this.lose = false;
      this.droplose = false;
      this.hitlose = false;
};
