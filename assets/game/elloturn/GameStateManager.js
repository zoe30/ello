pc.script.create('GameStateManager', function (app) {
    // Creates a new GameStateManager instance
    var GameStateManager = function (entity) {
        this.entity = entity;
    };

    GameStateManager.prototype = {
        
        initialize: function () 
        {
            //needInit
            this.start = false;
            this.lose = false;
            this.startgame = false;
            var player = app.root.findByName("player");
            this.playercontrol = player.script.PlayerControl;

            this.playtimer = 0;
            //游戏加载完之后调用
            initHandle();
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) 
        { 
            if(!this.startgame || this.lose)
            {
                return;
            }

            this.playtimer += dt;

        },
        
        GameStartGame:function()
        {
            //玩家点击正式开始游戏
            console.log('PlayGame');
             startHandle();
        },

        GameStart:function()
        {
            console.log("GameStart");
            //开始按钮点击
          
             beginHandle();
        },

        GameEnd:function()
        {
            console.log("GameEnd");
            //游戏结束时调用
            var scoreinfo={"score":this.playercontrol.score,'usermask':parseInt(this.playtimer),"score1":(this.playercontrol.score+17),'usermask1':parseInt(this.playtimer+9)};
            gameover(scoreinfo);
        },

        Init:function()
        {
           //游戏重新开始时调用
            this.lose = false;
            this.startgame = false;
            this.playtimer = 0;
            resetHandle();
        }
        
    };

    return GameStateManager;
});