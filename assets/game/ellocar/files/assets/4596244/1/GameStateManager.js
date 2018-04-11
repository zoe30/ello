var GameStateManager = pc.createScript('GameStateManager');

// initialize code called once per entity
GameStateManager.prototype.initialize = function() {

    this.gm=this.app.root.findByName("GameController");
    this.gamemanager=this.gm.script.GameManager;
   
    initHandle();

    this.playtimer = 0;
};

// update code called every frame
GameStateManager.prototype.update = function(dt) {
    if(this.gamemanager.GameIsOver)
    {
        return;
    }

    this.playtimer += dt;
    
};

GameStateManager.prototype.GameStartGame=function(){
 // startHandle();
    
    //console.log("游戏进行中");
};

GameStateManager.prototype.GameStart=function(){
   beginHandle();
    //console.log("初次开始游戏，即点击start按钮");
};

GameStateManager.prototype.GameEnd=function(uiend){

    if(uiend.style.display!="block"){

        console.log("GameEnd1");
        var fscore=this.gm.script.GameManager.score;
        var scoreinfo={"score":fscore,'usermask':parseInt(this.playtimer),"score1":(fscore+17),'usermask1':parseInt(this.playtimer+9)};
        gameover(scoreinfo);
    }
    uiend.style.display="block";
  
    //console.log("游戏结束");

};

GameStateManager.prototype.Init=function(){
  
 resetHandle();
    //console.log("重新开始游戏");
};




// swap method called for script hot-reloading
// inherit your script state here
GameStateManager.prototype.swap = function(old) {
    
};

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/