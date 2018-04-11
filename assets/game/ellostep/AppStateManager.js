pc.script.create('AppStateManager', function (app) {
    // Creates a new GameStateManager instance
    var AppStateManager = function (entity) {
        this.entity = entity;
    };

    AppStateManager.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () 
        {
            //needInit
            this.start = false;
            this.lose = false;
            var player = app.root.findByName("player");
            this.playercontrol = player.script.PlayerControl;
            var manager = app.root.findByName('Manager');
            this.pathmanager = manager.script.PathManager;

            this.playtimer = 0;
            initHandle();
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) 
        {
            if(!this.pathmanager.startgame || this.lose)
            {
                return;
            }

            this.playtimer += dt;

        },
        
        GameStart:function()
        {
            console.log("GameStart");
            beginHandle();
        },

        GameReset:function()
        {
            console.log("GameReset");
            resetHandle();
        },

        GameStartGame:function()
        {
            startHandle();
        },


        GameEnd:function()
        {
            console.log("GameEnd");
            var scoreinfo={"score":this.playercontrol.score,'usermask':parseInt(this.playtimer),"score1":(this.playercontrol.score+17),'usermask1':parseInt(this.playtimer+9)};
            gameover(scoreinfo);
        },
        
        
        
        
        Init:function()
        {
            //this.start = false;
            this.lose = false;
            this.playtimer = 0;
            resetHandle();
        }
        
    };

    return AppStateManager;
});