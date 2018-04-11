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
            this.lose = false;
            var player = app.root.findByName('player');
            this.playercontrol = player.script.PlayerControl;
            var manager = app.root.findByName('Manager');
            this.pathmanager = manager.script.PathManager;
            this.timer = 0;
            initHandle();
            
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) 
        {
            if(!this.playercontrol.startgame || this.lose)
            {
                return;
            }
            
            this.timer += dt;
            
        },
        
        GameStartGame:function()
        {
        	startHandle();
        },


        GameStart:function()
        {
            beginHandle();
        },
        
        GameEnd:function()
        {
            var scoreinfo={"score":this.playercontrol.score,'usermask':parseInt(this.timer),"score1":(this.playercontrol.score+17),'usermask1':parseInt(this.timer+9)};
            gameover(scoreinfo);
        },

        GameStartGame:function()
        {
            startHandle();

        },
        
        
        Init:function()
        {
            //this.start = false;
            this.lose = false;
            this.timer = 0;
            resetHandle();
        }
        
    };

    return GameStateManager;
});