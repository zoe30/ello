pc.script.create('UIManager', function (app) {
    // Creates a new UIManager instance
    var UIManager = function (entity) {
        this.entity = entity;
    };

    UIManager.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () 
        {
            var manager = app.root.findByName("Manager");
            this.gamemanager = manager.script.GameStateManager;
            var curcamera = app.root.findByName("Camera");
            this.camerafollow = curcamera.script.CameraFollow;
            this.playercontrol = manager.script.PlayerControl;
            this.showEndUI = false;

            
           var self = this; 
           var again = document.getElementById("loadscene");
           var uistart = document.getElementById("uistart");
           var start = document.getElementById("start");
           this.uiend = document.getElementById("uiend");
           this.score = document.getElementById("score");
 
           again.addEventListener('click',function(event){
             
               self.uiend.style.display = "none";
               self.score.innerHTML = "0";
               self.playercontrol.playsound(-1);
               self.camerafollow.Init();
               self.playercontrol.Init();
               self.gamemanager.Init();
               self.Init();
           });

           start.addEventListener('click',function(event){
               
               self.gamemanager.start = true;
               self.gamemanager.GameStart();
               self.playercontrol.playsound(-1);
               self.score.style.display = "block";
               uistart.style.display = "none";
           });

            this.losetimer = 0;
            
            
            
            

        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) 
        {
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
             
        },
        
        Init:function()
        {
            this.losetimer = 0;
            this.showEndUI = false;
        }
        
    };

    return UIManager;
});