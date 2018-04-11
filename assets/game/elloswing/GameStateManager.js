pc.script.create('GameStateManager', function (app) {
    // Creates a new GameStateManager instance
    var GameStateManager = function (entity) {
        this.entity = entity;
    };

    GameStateManager.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () 
        {
            this.start = false;
            this.startgame = false;
            this.lose = false;

            app.mouse.disableContextMenu();
            
            this.playtimer = 0;
            var player = app.root.findByName('player');
            this.playercontrol = player.script.GameControl;
            initHandle();
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) 
        {
            
            if(!this.start || this.lose || !this.startgame)
            {
                return;
            }
            
            this.playtimer += dt;
            
            
        },
        
        
        GameStart:function()
        {
            beginHandle();
        },
        
        GameEnd:function()
        {
            var scoreinfo={"score":this.playercontrol.score,'usermask':parseInt(this.playtimer),"score1":(this.playercontrol.score+17),'usermask1':parseInt(this.playtimer+9)};
            gameover(scoreinfo);
        },
        
        GameStartGame:function()
        {
           startHandle();
        },

        Init:function()
        {
            //this.start = false;
            this.startgame = false;
            this.lose = false;
            this.playtimer = 0;
            resetHandle();
        }
        
    };

    return GameStateManager;
});