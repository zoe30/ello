pc.script.attribute('boxmat','asset',null,{max:1});
pc.script.attribute('boxtex1','asset',null,{max:1});
pc.script.attribute('boxtex2','asset',null,{max:1});
pc.script.attribute('boxtex3','asset',null,{max:1});
pc.script.attribute('boxtex4','asset',null,{max:1});
pc.script.attribute('boxtex5','asset',null,{max:1});
pc.script.attribute('boxtex6','asset',null,{max:1});

pc.script.create('PathManager', function (app) {
    // Creates a new PathManager instance
    var PathManager = function (entity) {
        this.entity = entity;
    };
        
    PathManager.prototype = {
       
        initialize: function () 
        {

            var manager = app.root.findByName('Manager');
            this.gamemanager = manager.script.GameStateManager;
            
            var player = app.root.findByName('player');
            this.playercontrol = player.script.PlayerControl;
            
            var boxprefabs = app.root.findByName("prefabs"); 
            this.BoxPool = boxprefabs.getChildren();
            this.prefabsNum = this.BoxPool.length;
            this.InitNum = 7;
            this.Hstep = 0.8;
            this.Vstep = 0.4;
            this.DropHeight = 2;
            this.dropstartnum = 4;
            
            
            
            this.BoxMat = app.assets.get(this.boxmat).resource;
            this.BoxTex1 = app.assets.get(this.boxtex1).resource;
            this.BoxTex2 = app.assets.get(this.boxtex2).resource;
            this.BoxTex3 = app.assets.get(this.boxtex3).resource;
            this.BoxTex4 = app.assets.get(this.boxtex4).resource;
            this.BoxTex5 = app.assets.get(this.boxtex5).resource;
            this.BoxTex6 = app.assets.get(this.boxtex6).resource;  
            
            this.bg1 = app.root.findByName('bg1');
            this.bg2 = app.root.findByName('bg2');
            this.bg2.enabled = false;
            this.bg3 = app.root.findByName('bg3');
            this.bg3.enabled = false;
            this.bg4 = app.root.findByName('bg4');
            this.bg4.enabled = false;
            this.bg5 = app.root.findByName('bg5');
            this.bg5.enabled = false;
            this.bg6 = app.root.findByName('bg6');
            this.bg6.enabled = false;
            
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
             
             this.boxtexindex = 1;

            this.LastPos = new pc.Vec3(0,-this.Vstep,this.Hstep);
            var j = 0;
            for( j =0;j<this.prefabsNum;j++)
            {
                this.BoxPool[j].setPosition(0,-100,0);
            }
            
             for( j =0;j<this.levelcount;j++)
            {
                this.levelpool[j].setPosition(0,-100,0);
            }

            this.dropindex = 0;
            this.droptimer = 0;
            this.dropdelay = 0.4;
            
            this.playerindex = 0;
            
            this.spanIndex  = 0;
            this.spanXDir = false;

            this.InitSpanBox();

        },

        
        update: function (dt) 
        {
            if(!this.gamemanager.start)
            {
                return;
            }
            if(!this.gamemanager.startgame)
            {
                return;
            }
            if(this.gamemanager.lose)
            {
                return;
            }
            
            this.droptimer += dt;
            if(this.droptimer > this.dropdelay)
            {
                this.BoxPool[this.dropindex].script.BoxControl.DownAnim = true;
                if(this.dropindex === this.playerindex )
                {
                    this.gamemanager.lose = true;
                    this.gamemanager.timeoutlose = true;
                    return;
                }
                
                this.droptimer = 0;
                this.dropindex++;
                if(this.dropindex >= this.prefabsNum)
                {
                    this.dropindex = 0;
                }
            }
            
               
        },

        InitSpanBox:function()
        {

            for(var i = 0;i<this.InitNum;i++)
            {
               this.BoxPool[this.spanIndex].script.BoxControl.spanXdir = this.spanXDir;  
               var pos = new pc.Vec3(this.spanXDir ? this.LastPos.x-this.Hstep:this.LastPos.x,this.LastPos.y + this.Vstep,this.spanXDir?this.LastPos.z:this.LastPos.z-this.Hstep);
               this.BoxPool[this.spanIndex].setPosition(pos.x,pos.y,pos.z);
               this.LastPos.set(pos.x,pos.y,pos.z);
               this.spanXDir = pc.math.random(0,1)>0.5?true:false;
               this.spanIndex++;  
            }
   
       },
        
        
        SpanBox:function()
        {
            if(this.spanIndex >= this.prefabsNum)
            {
                this.spanIndex = 0;
            }
            
            var pos = new pc.Vec3(this.spanXDir ? this.LastPos.x-this.Hstep:this.LastPos.x,this.LastPos.y + this.Vstep,this.spanXDir?this.LastPos.z:this.LastPos.z-this.Hstep);
            this.BoxPool[this.spanIndex].setPosition(pos.x,pos.y+this.DropHeight,pos.z);
            this.BoxPool[this.spanIndex].script.BoxControl.NextPos.set(pos.x,pos.y,pos.z);

            this.BoxPool[this.spanIndex].script.BoxControl.spanXdir = this.spanXDir; 
            this.BoxPool[this.spanIndex].script.BoxControl.UpAnim = true; 

            var hasChildren = pc.math.random(0,1)>0.8 ?true:false;
            if(hasChildren)
            {
                var childrenpos = new pc.Vec3(!this.spanXDir ? this.LastPos.x-this.Hstep:this.LastPos.x,this.LastPos.y + this.Vstep,!this.spanXDir?this.LastPos.z:this.LastPos.z-this.Hstep);
                this.BoxPool[this.spanIndex].script.BoxControl.hasChildren = true;
                this.BoxPool[this.spanIndex].script.BoxControl.childrenNode = this.levelpool[this.levelindex];
                
                var hit = pc.math.random(0,1)>0.5?true:false;
                if(hit)
                {
                    this.BoxPool[this.spanIndex].script.BoxControl.hit = true;
                    this.BoxPool[this.spanIndex].script.BoxControl.childrenNextPos.set(childrenpos.x,childrenpos.y,childrenpos.z); 
                    this.levelpool[this.levelindex].setPosition(childrenpos.x,childrenpos.y+this.DropHeight,childrenpos.z);
                }
                else
                {
                    this.BoxPool[this.spanIndex].script.BoxControl.hit = false;
                    var offset = Math.floor(pc.math.random(1,3));
                    this.BoxPool[this.spanIndex].script.BoxControl.childrenNextPos.set(!this.spanXDir?childrenpos.x-offset*this.Hstep:childrenpos.x,childrenpos.y,!this.spanXDir?childrenpos.z:childrenpos.z-offset*this.Hstep); 
                    this.levelpool[this.levelindex].setPosition(!this.spanXDir?childrenpos.x-offset*this.Hstep:childrenpos.x,childrenpos.y+this.DropHeight,!this.spanXDir?childrenpos.z:childrenpos.z-offset*this.Hstep);    
                }
                
                this.levelindex++;
                if(this.levelindex >= this.levelcount)
                {
                    this.levelindex = 0;
                }
            }
            else
            {
                this.BoxPool[this.spanIndex].script.BoxControl.hasChildren = false;
                this.BoxPool[this.spanIndex].script.BoxControl.hit = false;
                this.BoxPool[this.spanIndex].script.BoxControl.childrenNode = null;
            }
            
            //掉落
            var num = 0;
            if(this.playerindex >= this.dropindex)
            {
                num = this.playerindex -this.dropindex;
            }
            else
            {
                num = this.prefabsNum - this.dropindex +this.playerindex;
            }
            
            if(num >= this.dropstartnum)
            {
                
                this.BoxPool[this.dropindex].script.BoxControl.DownAnim = true;
                this.dropindex ++;
                if(this.dropindex >= this.prefabsNum)
                {
                    this.dropindex = 0;
                }
            }
            
            //缩减掉落时间
            
            if( this.playercontrol.score % 50 === 0)
            {
               if(this.dropdelay > 0.21)
               {
                   this.dropdelay -=0.05;   
               }
            }
            
            
            this.spanXDir = pc.math.random(0,1)>0.5?true:false;
            this.LastPos.set(pos.x,pos.y,pos.z);
            this.spanIndex++;  
            
        },
        
        Init:function()
        {
             
             this.boxtexindex ++;
             if(this.boxtexindex > 6)
             {
                 this.boxtexindex = 1;
             }

             var j = 0;
             switch(this.boxtexindex)
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
                       
                       this.bg6.enabled = false;
                       this.bg1.enabled = true;
                     
                       this.BoxMat.diffuseMap = this.BoxTex1;
                       this.BoxMat.update();
                     
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
                       
                      this.bg1.enabled = false;
                      this.bg2.enabled = true;
                     
                      this.BoxMat.diffuseMap = this.BoxTex2;
                       this.BoxMat.update(); 
                     
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
                     
                       this.bg2.enabled = false;
                       this.bg3.enabled = true;
                       
                       this.BoxMat.diffuseMap = this.BoxTex3;
                       this.BoxMat.update();
                     
                     
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
                     
                      this.bg3.enabled = false;
                      this.bg4.enabled = true;
                       
                       this.BoxMat.diffuseMap = this.BoxTex4;
                       this.BoxMat.update();
                      
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
                     
                       this.bg4.enabled = false;
                       this.bg5.enabled = true;
                     
                       this.BoxMat.diffuseMap = this.BoxTex5;
                       this.BoxMat.update();
                     
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
                     
                       this.bg5.enabled = false;
                       this.bg6.enabled = true;
                     
                       this.BoxMat.diffuseMap = this.BoxTex6;
                       this.BoxMat.update();  
                     
                       break;

                   default:
                       break;
               }
            
                
                this.dropindex = 0;
                this.droptimer = 0;
                this.dropdelay = 0.4;
                this.levelindex = 0;
                this.playerindex = 0;
                this.LastPos.set(0,-this.Vstep,this.Hstep);
                this.spanIndex  = 0;
                this.spanXDir = false;

                for(j =0;j<this.prefabsNum;j++)
                {
                    this.BoxPool[j].setPosition(0,-100,0);
                    this.BoxPool[j].script.BoxControl.hasChildren = false;
                    this.BoxPool[j].script.BoxControl.childrenNode = null;
                    this.BoxPool[j].script.BoxControl.hit = false;
                    this.BoxPool[j].script.BoxControl.UpAnim = false;
                    this.BoxPool[j].script.BoxControl.DownAnim = false;
                }    

                this.InitSpanBox();
  

         }
       

        
    };

    return PathManager;
});