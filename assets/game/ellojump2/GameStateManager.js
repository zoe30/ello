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
            this.taplose = false;
            this.timeoutlose = false;
            this.startgame = false;
            var player = app.root.findByName("player");
            this.playercontrol = player.script.PlayerControl;

            this.playtimer = 0;
            //app.systems.sound.volume = 0;
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
            console.log("startHandle");
            startHandle();
        },

        GameStart:function()
        {
            beginHandle();
        },
	 GameReset:function()
        {
            resetHandle();
        },

        GameEnd:function()
        {
            console.log("GameEnd");
            
            var scoreinfo={"score":this.playercontrol.score,'usermask':parseInt(this.playtimer),"score1":(this.playercontrol.score+17),'usermask1':parseInt(this.playtimer+9)};
            gameover(scoreinfo);
        },

        Init:function()
        {
           
            this.lose = false;
            this.taplose = false;
            this.timeoutlose = false;
            this.startgame = false;
            this.playtimer = 0;
            resetHandle();
        }
        
    };

    return GameStateManager;
});