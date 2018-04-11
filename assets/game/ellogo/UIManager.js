pc.script.attribute("UIHtml","asset",null,{type:'html',max:1});
pc.script.attribute("UICss","asset",null,{type:'css',max:1});
pc.script.attribute("basebox1","entity",null);
pc.script.attribute("basebox2","entity",null);
pc.script.attribute("player","entity",null);
pc.script.attribute("camera","entity",null);
pc.script.attribute("prefabs","entity",null);



pc.script.create('UIManager', function (app) {
    
    var UIManager = function (entity) 
    {
        this.entity = entity;
    };

    UIManager.prototype = {
       
        initialize: function () 
        {


          
            
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
               /*app.root.destroy();
               document.body.removeChild(div);
               document.head.removeChild(style);
               app.loadSceneHierarchy("420135.json",function(entity,error){});*/
                
               //uistart.style.display = "block";
               self.uiend.style.display = "none";
               //self.score.style.display = "none";
               self.score.innerHTML = "0";
               self.player.script.PlayerControl.Init();
               self.basebox1.script.ApplyGravity.Init();
               self.basebox2.script.ApplyGravity.Init();
               
               self.camera.script.CameraFollow.Init();
               self.prefabs.script.CreatePath.Init();
               resetHandle(); 
                
           });

           start.addEventListener('click',function(event){
               var playercontrol = app.root.findByName("player").script.PlayerControl;    
               playercontrol.start = true;
               playercontrol.playSound("start");
               playercontrol.tips.enabled = true;
               self.score.style.display = "block";
               
               uistart.style.display = "none";
               beginHandle();
           });

              /*this.returnuiend.addEventListener("click",function(event){
                 
                 self.uiend.style.display = "block";
                 self.score.style.display = "block";
                 self.infopage.style.display = "none";
            });*/
            
            var inforui = document.getElementById("info");
            /*inforui.addEventListener("click",function(event)
            {
                
                 self.infopage.style.display = "block";
                 self.uiend.style.display = "none";
                 self.score.style.display = "none";
            });*/
            
            
            var soundui = document.getElementById("sound");
            var player = app.root.findByName("player");

            




            initHandle();
            
            
            
            
        },

      
        update: function (dt) 
        {
            
        }
        
      
        
    };

    return UIManager;
});