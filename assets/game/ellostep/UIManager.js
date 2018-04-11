pc.script.attribute("UIHtml","asset",null,{max:1,type:'html'});
pc.script.attribute("UICss","asset",null,{max:1,type:'css'});
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
            this.gamemanager = manager.script.AppStateManager;
            this.pathmanager = manager.script.PathManager;
            var curcamera = app.root.findByName("Camera");
            this.camerafollow = curcamera.script.CameraFollow;
            var player = app.root.findByName("player");
            this.playercontrol = player.script.PlayerControl;
            this.showEndUI = false;
            var cloudManager = app.root.findByName("CloudManager");
            this.cloudmanager = cloudManager.script.cloudanim;
            var airManager = app.root.findByName("AirManager");
            this.airmanager = airManager.script.AirManager;
            
            
            this.tips = app.root.findByName("tips");  

           var self = this; 
           var again = document.getElementById("loadscene");
           var uistart = document.getElementById("uistart");
           var start = document.getElementById("start");
           this.returnuiend = document.getElementById("return");
           this.uiend = document.getElementById("uiend");
           this.infopage = document.getElementById("infopage");
           this.infocontent = document.getElementById("infocontent");
           this.score = document.getElementById("score");
            
            
            
           again.addEventListener('click',function(event){
               self.score.innerHTML = "0";
               self.tips.enabled = true;
               self.gamemanager.Init();
               self.pathmanager.Init();
               self.camerafollow.Init();
               self.playercontrol.Init();
               self.cloudmanager.Init();
               self.airmanager.Init();
               self.Init();
           });

           start.addEventListener('click',function(event){
               self.playercontrol.PlaySound("start");
               self.tips.enabled = true;
               self.gamemanager.start = true;
               self.gamemanager.GameStart();
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
                   //this.tapwrongui.style.display = "none";
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