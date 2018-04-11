var GameStateManager = pc.createScript('GameStateManager');

// initialize code called once per entity
GameStateManager.prototype.initialize = function() {
    this.start = false;
    this.lose = false;

    this.gm=this.app.root.findByName("GameController"); 
    this.gamemanager=this.gm.script.GameManager;


    // var player = app.root.findByName('player');
    // this.playercontrol = player.script.PlayerControl;
    // var manager = app.root.findByName('Manager');
    // this.pathmanager = manager.script.PathManager;
    this.timer = 0;
    initHandle();

};

// update code called every frame
GameStateManager.prototype.update = function(dt) {
    if (!this.start) {
        return;
    }

    this.timer += dt;
};

GameStateManager.prototype.GameStartGame = function() {

    //console.log("游戏进行中");
    //startHandle();
};

GameStateManager.prototype.GameStart = function() {

    //console.log("初次开始游戏，即点击start按钮");
    this.start = true;
    beginHandle();
};

GameStateManager.prototype.GameEnd = function() {
 this.start = false;
    //console.log("游戏结束");
    var scoreinfo = {
        "score": this.gamemanager.score,
        'usermask': parseInt(this.timer),
        "score1": (this.gamemanager.score + 17),
        'usermask1': parseInt(this.timer + 9)
    };
    gameover(scoreinfo);
};

GameStateManager.prototype.Init = function() {

    //console.log("重新开始游戏");
    this.lose = false;
    this.timer = 0;
    this.start = false;
    resetHandle();
};