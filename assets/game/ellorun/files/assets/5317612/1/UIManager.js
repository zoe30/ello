var UIManager = pc.createScript('UIManager');

    
UIManager.prototype.initialize =  function(){
    
            var app = this.app;
            var manager = app.root.findByName("Manager");
            this.gamemanager = manager.script.GameStateManager;
            this.coinmanager = manager.script.CoinManger;
            this.coinmanager = manager.script.CoinManager;
            
            var trails = app.root.findByName('trails');
            this.trailrender = trails.script.TrailRender;
            var enemy1 =app.root.findByName('enemy1');
            this.enemy1 = enemy1.script.Enemy1;
            var enemy3 =app.root.findByName('enemy3');
            this.enemy3 = enemy3.script.Enemy3;
            var enemy4 =app.root.findByName('enemy4');
            this.enemy4 = enemy4.script.Enemy4;
            var player = app.root.findByName("player");
            this.playercontrol = player.script.ControlPlayer;
           
            this.showEndUI = false;
            
            // var div = document.createElement("div");
            
            // div.innerHTML = "<div id = 'uistart'>"+
            //                 "<img id = 'start'  src = 'img/start.png'>"+
            //                 "</div>"+
            //                 "<div id = 'uiend'>"+
            //                  "<img id = 'loadscene'   src ='img/start.png'>"+
            //                 "</div>"+
            //                 "<p id = 'score'>0</p>"+
            //                 "</div>";
            // document.body.appendChild(div);
            
           // var style = document.createElement("style");

           // style.innerHTML = "#start{ position:absolute;left:38%;top:60%; width:20%;height:20%;}"+
           //                  "#uiend{display:none;}"+
           //                  "#loadscene { position:absolute;left:38%;top:60%; width:20%;height:20%;}"+
           //                  "#score{position: absolute;width: 100%;top: -3%;right: -5%; color: #ffffff;font-size: 25px; font-family: initial;text-align: center;display:none;}"+
           //                  "@media screen and (max-width : 320px) { #score{ font-size:3.3em;}}";
           // document.head.appendChild(style);
          
            
           var self = this; 
           var again = document.getElementById("loadscene");
           var uistart = document.getElementById("uistart");
           var start = document.getElementById("start");
           this.uiend = document.getElementById("uiend");
           this.score = document.getElementById("score"); 

           again.addEventListener('click',function(event){

               self.uiend.style.display = "none";
               self.score.innerHTML = "0";
               self.playercontrol.tips.enabled = true;
               self.coinmanager.Init();
               self.playercontrol.Init();
               self.enemy1.Init();
               self.enemy3.Init();
               self.enemy4.Init();
               self.trailrender.Init();
               self.gamemanager.Init();
               self.Init();
           });
            
          
           start.addEventListener('click',function(event){

  
               self.uiend.style.display = "none";
               self.gamemanager.start = true;
               self.playercontrol.tips.enabled = true;
               self.gamemanager.GameStart();
               self.score.style.display = "block";
               uistart.style.display = "none";
           });

            this.losetimer = 0;


};

        // Called every frame, dt is time in seconds since last update
UIManager.prototype.update =  function (dt) {
           if(this.gamemanager.lose)
           {
               this.losetimer +=dt;
               if(this.losetimer >1 && !this.showEndUI)
               {
                   this.uiend.style.display = "block";
                   this.gamemanager.GameEnd();
                   this.showEndUI = true;
               }
           }
             
};
        
UIManager.prototype.Init = function(){
            this.losetimer = 0;
            this.showEndUI = false;
};


