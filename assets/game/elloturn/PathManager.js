pc.script.create('PathManager', function (app) {

    var PathManager = function (entity) {
        this.entity = entity;
    };
   
    
    var MIN_CHANGENUM = 4;
    var MAX_CHANGENUM = 7;
     
    PathManager.prototype = {
        
        initialize: function () 
        {
            
             
             var manager = app.root.findByName("Manager");
             this.gamemanager = manager.script.GameStateManager;
             var player = app.root.findByName("player");
             this.playercontrol = player.script.PlayerControl;
         
            
             this.autopropoffset = new pc.Vec3(0.05,0.5,0);
             this.autoprop = app.root.findByName('auto');
             this.autoprop.enabled = false;
             
             this.speeddownpropoffset = new pc.Vec3(0.15,0.5,0.15);
             this.speeddownprop = app.root.findByName('speeddown');
             this.speeddownprop.enabled = false;

  
             var boxparent  = app.root.findByName("prefabs");
             this.BoxPool =  boxparent.getChildren();
             this.prefabsNum = this.BoxPool.length;
             this.DropHeight = 2;
             this.Hstep = 0.85;
  
             this.level1 = app.root.findByName('level1');
             this.level1pool = this.level1.getChildren();
             this.level1count = this.level1pool.length; 
            
             this.level2 = app.root.findByName('level2');
             this.level2.enabled = false;
             this.level2pool = this.level2.getChildren();
             this.level2count = this.level2pool.length; 
            
             this.level3 = app.root.findByName('level3');
             this.level3.enabled = false;
             this.level3pool = this.level3.getChildren();
             this.level3count = this.level3pool.length; 
            
             this.level4 = app.root.findByName('level4');
             this.level4.enabled = false;
             this.level4pool = this.level4.getChildren();
             this.level4count = this.level4pool.length; 
             
             this.level5 = app.root.findByName('level5');
             this.level5.enabled = false;
             this.level5pool = this.level5.getChildren();
             this.level5count = this.level5pool.length; 
            
             this.level6 = app.root.findByName('level6');
             this.level6.enabled = false;
             this.level6pool = this.level6.getChildren();
             this.level6count = this.level6pool.length; 
             
             this.levelpool = this.level1pool;
             this.levelcount = this.level1count;
             this.levelindex = 0; 
            
             for(var j=0;j<this.levelcount;j++)
             {
                this.levelpool[j].setPosition(0,-100,0);
             }
            
             this.LastPos = new pc.Vec3(0,0,0);
             this.ChangedNum = Math.floor(pc.math.random(MIN_CHANGENUM,MAX_CHANGENUM));
             this.ZYaw = true; 
             this.everySpan = 0;
             this.SpanIndex = 0;
             this.playerindex = 0;
             this.dropindex = 0;
             this.InitSpanBox();
            
        },

       
        update: function (dt) 
        {
            
            if(!this.gamemanager.start)
            {
               
                return;
            }
            
            if(this.gamemanager.lose )
            {

                return;
            }
            
            if(!this.startgame)
            {
                return;
            }
            
            
        },
        
        
        
        
        InitSpanBox:function()
        {
            
             
             for(var i =0;i<6;i++)
             {
                 this.BoxPool[this.SpanIndex].enabled = true;

                 this.BoxPool[this.SpanIndex].setPosition(this.LastPos.x,this.LastPos.y,this.LastPos.z);
                 this.BoxPool[this.SpanIndex].script.BoxControl.NextPos.set(this.LastPos.x,this.LastPos.y,this.LastPos.z);
                 this.BoxPool[this.SpanIndex].script.BoxControl.ZYaw = this.ZYaw;
                 
                 this.everySpan ++;
                 this.SpanIndex++;
 
                 

                 this.LastPos.set(this.LastPos.x,this.LastPos.y,this.LastPos.z - this.Hstep);
             }

            //this.everySpan -= 1;
            
        },
        
        SpanBox:function()
        {
            this.BoxPool[this.SpanIndex].enabled = true;
            this.BoxPool[this.SpanIndex].setPosition(this.LastPos.x,this.LastPos.y-this.DropHeight,this.LastPos.z);
            this.BoxPool[this.SpanIndex].script.BoxControl.Up = true;
            this.BoxPool[this.SpanIndex].script.BoxControl.autorun = false;
            this.BoxPool[this.SpanIndex].script.BoxControl.speeddown = false;
            this.BoxPool[this.SpanIndex].script.BoxControl.changelong = false;
            this.BoxPool[this.SpanIndex].script.BoxControl.changeshort = false;
            this.BoxPool[this.SpanIndex].script.BoxControl.haschildren = false;
            this.BoxPool[this.SpanIndex].script.BoxControl.childrennode = null;
            
            
            this.BoxPool[this.SpanIndex].script.BoxControl.NextPos.set(this.LastPos.x,this.LastPos.y,this.LastPos.z);
            
       
           if(this.playercontrol.score % 30 === 0)
           {
               var random = Math.floor(pc.math.random(1,5));
               
               switch(random)
               {
                   case 1:
                       this.BoxPool[this.SpanIndex].script.BoxControl.autorun = true;
                       this.autoprop.enabled = true;
                       this.autoprop.setPosition(this.LastPos.x+this.autopropoffset.x,this.LastPos.y+this.autopropoffset.y,this.LastPos.z+this.autopropoffset.z);
                       break;
                   case 2:
                       this.BoxPool[this.SpanIndex].script.BoxControl.speeddown = true;
                       this.speeddownprop.enabled = true;
                       this.speeddownprop.setPosition(this.LastPos.x+this.speeddownpropoffset.x,this.LastPos.y+this.speeddownpropoffset.y,this.LastPos.z+this.speeddownpropoffset.z);
                       break;
                   case 3:
                       this.BoxPool[this.SpanIndex].script.BoxControl.changelong = true;
                       break;
                   case 4:
                       this.BoxPool[this.SpanIndex].script.BoxControl.changeshort = true;
                       break;
                   default:
                       break;
               }

           }
           
           if(this.playercontrol.score %5 ===0 && this.everySpan < this.ChangedNum) 
           {
               var sceneok = pc.math.random(0,1) > 0.3;
               if(sceneok)
               {
                   var offset = pc.math.random(2,2.5);
                   this.levelpool[this.levelindex].setPosition(this.ZYaw ?this.LastPos.x+offset:this.LastPos.x,this.LastPos.y-this.DropHeight,this.ZYaw?this.LastPos.z:this.LastPos.z+offset);
                   this.BoxPool[this.SpanIndex].script.BoxControl.haschildren = true;
                   this.BoxPool[this.SpanIndex].script.BoxControl.childrennode = this.levelpool[this.levelindex];
                   this.levelindex ++;
                   if(this.levelindex >= this.levelcount)
                   {
                       this.levelindex = 0;
                   }
               }
               
           }
            
            
            
            
            if(this.playercontrol.score % 100 === 0)
            {
                if(MIN_CHANGENUM >2)
                {
                    MIN_CHANGENUM --;
                }
                if(MAX_CHANGENUM >4)
                {
                    MAX_CHANGENUM --;
                }
                
            }
            
            
            var num = 0;
            if(this.playercontrol.score > 0 && this.playerindex >= this.dropindex)
            {
                num = this.playerindex - this.dropindex;
            }
            else
            {
                num = this.playerindex + this.prefabsNum - this.dropindex;
            }
            
            if(num >2)
            {
                this.BoxPool[this.dropindex].script.BoxControl.Down = true;
                this.dropindex++;
                if(this.dropindex >= this.prefabsNum)
                {
                    this.dropindex = 0;
                }
            }

            if(this.everySpan >= this.ChangedNum)
            {
                this.ChangedNum =  Math.floor(pc.math.random(MIN_CHANGENUM,MAX_CHANGENUM));
                this.everySpan = 0;
                this.ZYaw = !this.ZYaw;
                
            }
            else
            {
                this.everySpan ++;
            }
            
            this.BoxPool[this.SpanIndex].script.BoxControl.ZYaw = this.ZYaw;
            //console.log("PathIndex:"+ this.SpanIndex+"   ZDir:"+this.ZYaw+"   AutoRun:"+this.BoxPool[this.SpanIndex].script.BoxControl.autorun);
            
            this.LastPos.set(this.ZYaw?this.LastPos.x:this.LastPos.x-this.Hstep,this.LastPos.y,this.ZYaw?this.LastPos.z - this.Hstep:this.LastPos.z);
            
            
            this.SpanIndex++;
            if(this.SpanIndex >= this.prefabsNum)
            {
                this.SpanIndex = 0;
            }
          
        },
        
        
        Init:function()
        {
            
             for(var i =0;i<this.prefabsNum;i++)
             {
                 
                 this.BoxPool[i].setPosition(0,-100,0);

                 this.BoxPool[i].script.BoxControl.Up = false;
                 this.BoxPool[i].script.BoxControl.Down = false;
                 this.BoxPool[i].script.BoxControl.timer = 0;
                 this.BoxPool[i].script.BoxControl.UpDownAnim = false;

                 
                 this.BoxPool[i].script.BoxControl.autorun = false;
                 this.BoxPool[i].script.BoxControl.speeddown = false;
                 this.BoxPool[i].script.BoxControl.changelong = false;
                 this.BoxPool[i].script.BoxControl.changeshort = false;
                 this.BoxPool[i].script.BoxControl.haschildren = false;
                 this.BoxPool[i].script.BoxControl.childrennode = null;
                 
                 this.BoxPool[i].enabled = false;
             }
            
             var j = 0;
             switch(this.playercontrol.boxtexindex)
               {
                   case 1:
                       this.level6.enabled = false;
                       this.level1.enabled = true;
                       this.levelpool = this.level1pool;
                       this.levelcount = this.level1count;
                       for(j=0;j<this.levelcount;j++)
                       {
                           this.levelpool[j].setPosition(0,-100,0);
                       }
                       
                       break;
                   case 2:
                       this.level1.enabled = false;
                       this.level2.enabled = true;
                       this.levelpool = this.level2pool;
                       this.levelcount = this.level2count;
                       for(j=0;j<this.levelcount;j++)
                       {
                           this.levelpool[j].setPosition(0,-100,0);
                       }
                       break;
                   case 3:
                      this.level2.enabled = false;
                       this.level3.enabled = true;
                       this.levelpool = this.level3pool;
                       this.levelcount = this.level3count;
                       for(j=0;j<this.levelcount;j++)
                       {
                           this.levelpool[j].setPosition(0,-100,0);
                       }
                       break;
                   case 4:
                       this.level3.enabled = false;
                       this.level4.enabled = true;
                       this.levelpool = this.level4pool;
                       this.levelcount = this.level4count;
                       for(j=0;j<this.levelcount;j++)
                       {
                           this.levelpool[j].setPosition(0,-100,0);
                       }
                       break;
                   case 5:
                       this.level4.enabled = false;
                       this.level5.enabled = true;
                       this.levelpool = this.level5pool;
                       this.levelcount = this.level5count;
                       for(j=0;j<this.levelcount;j++)
                       {
                           this.levelpool[j].setPosition(0,-100,0);
                       }
                       break;
                  case 6:
                       this.level5.enabled = false;
                       this.level6.enabled = true;
                       this.levelpool = this.level6pool;
                       this.levelcount = this.level6count;
                       for(j=0;j<this.levelcount;j++)
                       {
                           this.levelpool[j].setPosition(0,-100,0);
                       }
                       break;

                   default:
                       break;
               }
            
             
             this.levelindex = 0;
             this.dropindex = 0;
             this.LastPos = new pc.Vec3(0,0,0);
             
             MIN_CHANGENUM = 4;
             MAX_CHANGENUM = 7;
            
            
             this.ChangedNum = Math.floor(pc.math.random(MIN_CHANGENUM,MAX_CHANGENUM));
             this.ZYaw = true; 
             this.everySpan = 0;
             this.SpanIndex = 0;
             this.playerindex = 0;

             this.autoprop.enabled = false;
             this.speeddownprop.enabled = false;
            
             this.InitSpanBox();
        }

        
    };

    return PathManager;
});