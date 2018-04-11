var UIManager = pc.createScript('UIManager');

    
UIManager.prototype.initialize =  function(){
    
            var app = this.app;
            var manager = app.root.findByName("Manager");
            this.gamemanager = manager.script.GameStateManager;
            this.pathmanager = manager.script.PathManager;
            var curcamera = app.root.findByName("Camera");
            this.camerafollow = curcamera.script.camera;
            var player = app.root.findByName("player");
            this.playercontrol = player.script.PlayerControl;
           
            this.showEndUI = false;
    
           var self = this; 
           var again = document.getElementById("loadscene");
           var uistart = document.getElementById("uistart");
           var start = document.getElementById("start");
           this.uiend = document.getElementById("uiend");
           this.score = document.getElementById("score"); 

           again.addEventListener('click',function(event){
               self.playercontrol.PlaySound('start'); 
               self.uiend.style.display = "none";
               self.score.innerHTML = "0";
               //self.playercontrol.tips.enabled = true;
               self.camerafollow.Init();
               self.pathmanager.Init();
               self.playercontrol.Init();
               self.gamemanager.Init();
               self.Init();
           });
            
          
           start.addEventListener('click',function(event){

               self.playercontrol.PlaySound('start');
               self.uiend.style.display = "none";
               self.gamemanager.start = true;
               //self.playercontrol.tips.enabled = true;
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
               if(this.losetimer >1.2 && !this.showEndUI)
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


