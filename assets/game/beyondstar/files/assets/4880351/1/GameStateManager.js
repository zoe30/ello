var GameStateManager = pc.createScript('GameStateManager'); 

        
GameStateManager.prototype.initialize = function () {
            //needInit
            var app = this.app;
            this.start = false;
            this.lose = false;
            this.taplose = false;
            this.timeoutlose = false;
            this.startgame = false;
            var player = app.root.findByName("player");
            this.playercontrol = player.script.PlayerControl;

            this.playtimer = 0;
            // app.systems.sound.volume = 0;
            initHandle();
};

        // Called every frame, dt is time in seconds since last update
GameStateManager.prototype.update = function (dt) { 
            if(!this.startgame || this.lose)
            {
                return;
            }

            this.playtimer += dt;

};
        
GameStateManager.prototype.GameStartGame = function(){
           startHandle();
            console.log('PlayGame');
};

GameStateManager.prototype.GameStart = function(){
   beginHandle();
            console.log("GameStart");
            
            //startHandle();
};

GameStateManager.prototype.GameEnd = function(){
            console.log("GameEnd");
            
            var scoreinfo={"score":this.playercontrol.score.toString(8),'usermask':parseInt(this.playtimer).toString(8),"score1":(this.playercontrol.score+17).toString(8),'usermask1':parseInt(this.playtimer+9).toString(8)};
            gameover(scoreinfo);
};

GameStateManager.prototype.Init = function(){
           
            this.lose = false;
            this.taplose = false;
            this.timeoutlose = false;
            this.startgame = false;
            this.playtimer = 0;
            resetHandle();
};
