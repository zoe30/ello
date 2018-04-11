pc.script.attribute('boxleftmat','asset',null,{max:1});
pc.script.attribute('boxtopmat','asset',null,{max:1});
pc.script.attribute("autumnleft","asset",null,{max:1});
pc.script.attribute("autumntop","asset",null,{max:1});
pc.script.attribute("grass2left","asset",null,{max:1});
pc.script.attribute("grass2top","asset",null,{max:1});
pc.script.attribute("lamatleft","asset",null,{max:1});
pc.script.attribute("lamattop","asset",null,{max:1});
//pc.script.attribute("rock2left","asset",null,{max:1});
//pc.script.attribute("rock2top","asset",null,{max:1});
pc.script.attribute("springleft","asset",null,{max:1});
pc.script.attribute("springtop","asset",null,{max:1});
pc.script.attribute("winterleft","asset",null,{max:1});
pc.script.attribute("wintertop","asset",null,{max:1});

pc.script.create('PathManager', function (app) {
    // Creates a new PathManager instance
    var PathManager = function (entity) {
        this.entity = entity;
    };

    PathManager.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () 
        {
            
            var manager = app.root.findByName("Manager");
            this.gamemanager = manager.script.GameStateManager;
            this.Vstep = 1;
            this.Hstep = 1;
            
            
            //getPool
            var prefabs = app.root.findByName("prefabs");
            this.BoxPool = prefabs.getChildren();
            this.prefabsnum  = this.BoxPool.length; 
            
            this.tree1parent = app.root.findByName("tree1pool");
            this.tree1pool = this.tree1parent.getChildren();
            this.tree1length = this.tree1pool.length;
            this.tree1Offset = new pc.Vec3(0.2,1,0.2);
            this.tree1parent.enabled = false;
            
            this.tree2parent = app.root.findByName("tree2pool");
            this.tree2pool = this.tree2parent.getChildren();
            this.tree2length = this.tree2pool.length;
            this.tree2Offset = new pc.Vec3(0.08,1,0.08);
            
            this.tree3parent = app.root.findByName("tree3pool");
            this.tree3pool = this.tree3parent.getChildren();
            this.tree3length = this.tree3pool.length;
            this.tree3Offset = new pc.Vec3(0.07,1,0.07);
            this.tree3parent.enabled = false;
            
            this.tree4parent = app.root.findByName("tree4pool");
            this.tree4pool = this.tree4parent.getChildren();
            this.tree4length = this.tree4pool.length;
            this.tree4Offset = new pc.Vec3(0.25,1,0.15);
            this.tree4parent.enabled = false;
            
            this.tree5parent = app.root.findByName("tree5pool");
            this.tree5pool = this.tree5parent.getChildren();
            this.tree5length = this.tree5pool.length;
            this.tree5Offset = new pc.Vec3(0.25,0.75,0.23);
            this.tree5parent.enabled = false;
            
            
            this.hitparent = app.root.findByName("hitpool");
            this.hitpool = this.hitparent.getChildren();
            this.hitlength = this.hitpool.length;
            this.hitOffset = new pc.Vec3(0.25,0.9,0.15);
            
            /*this.hit1parent = app.root.findByName("hitpool1");
            this.hit1pool = this.hit1parent.getChildren();
            this.hit1length = this.hit1pool.length;
            this.hit1parent.enabled = false;*/
            
            
            
            //setMat
            this.BoxleftMat = app.assets.get(this.boxleftmat).resource;
            this.BoxtopMat = app.assets.get(this.boxtopmat).resource;
            
            this.AutumnleftTex = app.assets.get(this.autumnleft).resource;
            this.AutumntopTex = app.assets.get(this.autumntop).resource;
            
            this.Grass2leftTex = app.assets.get(this.grass2left).resource;
            this.Grass2topTex = app.assets.get(this.grass2top).resource;
            
            this.LamatleftTex = app.assets.get(this.lamatleft).resource;
            this.LamattopTex = app.assets.get(this.lamattop).resource;
            
           // this.Rock2leftTex = app.assets.get(this.rock2left).resource;
           // this.Rock2topTex = app.assets.get(this.rock2top).resource;
            
            this.SpringleftTex = app.assets.get(this.springleft).resource;
            this.SpringtopTex = app.assets.get(this.springtop).resource;
            
            this.WinterleftTex = app.assets.get(this.winterleft).resource;
            this.WintertopTex = app.assets.get(this.wintertop).resource;
            
            this.BoxleftMat.diffuseMap = this.AutumnleftTex;
            this.BoxleftMat.update();
            this.BoxtopMat.diffuseMap = this.AutumntopTex;
            this.BoxtopMat.update();
            
            //changeparams
            this.sceneindex = 0;
            this.playerrow = 0;
            this.playercol = 2;
            this.spanindex = 0;
            
            this.tree1index = 0;
            this.tree2index = 0;
            this.tree3index = 0;
            this.tree4index = 0;
            this.tree5index = 0;
            this.hitindex = 0;
            //this.hit1index = 0;
            
            this.spanrow = 0;
            this.znum = 2;
            this.onlycol = 2;
            this.onlyspanXdir = true;
            this.hiderandom = 0.8;
            this.InitSpanBox();
        },

        update: function (dt) 
        {
           
        },
        
        
        
        InitSpanBox:function()
        {
            

            for(var i = 0;i < 10;i++)
            {
                var x = 4;
                if(this.spanrow%2 !== 0)
                {
                    x = 5;
                    this.znum++;
                }
                
                if(this.spanrow > 0)
                {
                    this.onlyspanXdir = Math.random()>0.5;
                    
                    if(this.spanrow%2 !== 0 )
                    {
                        if(this.onlyspanXdir)
                        {
                          this.onlycol ++;
                        }     
                    }
                    else
                    {
                        if(this.onlyspanXdir)
                        {
                             if(this.onlycol === 4)
                             {
                                 this.onlycol -- ;
                             }
              
                        }
                        else
                        {
                            if(this.onlycol === 0)
                            {
                                
                            }
                            else
                            {
                                this.onlycol --;
                            }
                        }
                    }
                }
                
                
                
                var hidebool = false;
                var hidenum = 0;
                
                for( var j = 0;j < x;j++)
                {
                    var nextPos = new pc.Vec3((j+Math.floor(this.spanrow/2)-1) *this.Hstep,-(this.spanrow+1)*this.Vstep,(this.znum-j)*this.Hstep);
                    if(this.spanrow>4)
                    {
                        if(this.onlycol === j)
                        {
                            this.BoxPool[this.spanindex].script.BoxState.hide = false;
                            hidebool = false;
                        }
                        else
                        {
                            hidebool = Math.random() > 0.8;
                          
                            if(hidebool)
                            {
                                hidenum ++;
                                if(hidenum > 1)
                               {
                                   hidebool = false;
                               }
                            }
                            
                            this.BoxPool[this.spanindex].script.BoxState.hide = hidebool;
                        }
                        
                    }
                    else
                    {
                        this.BoxPool[this.spanindex].script.BoxState.hide = false;
                        hidebool = false;
                       
                    }
                    
                    
                    this.ChangeBox(hidebool,nextPos);
                    
                    
                    
                    this.BoxPool[this.spanindex].script.BoxState.Init();
                    this.BoxPool[this.spanindex].setPosition(nextPos.x,nextPos.y,nextPos.z);
                    this.spanindex++;
                }
               this.spanrow ++;

            }
            
            
            
        },
        
        SpanBox:function()
        {
                
               
                
                var x = 4;
                if(this.spanrow%2 !== 0)
                {
                    x = 5;
                    this.znum++;
                }
               
               
               this.onlyspanXdir = Math.random()>0.5;
                    
                    if(this.spanrow%2 !== 0 )
                    {
                        if(this.onlyspanXdir)
                        {
                          this.onlycol ++;
                        }     
                    }
                    else
                    {
                        if(this.onlyspanXdir)
                        {
                             if(this.onlycol === 4)
                             {
                                 this.onlycol -- ;
                             }
              
                        }
                        else
                        {
                            if(this.onlycol === 0)
                            {
                                
                            }
                            else
                            {
                                this.onlycol --;
                            }
                        }
                    }
            
                var hidenum = 0;     
            
                for(var j = 0;j < x;j++)
                {
                    
                    var nextPos = new pc.Vec3((j+Math.floor(this.spanrow/2)-1) *this.Hstep,-(this.spanrow+1)*this.Vstep,(this.znum-j)*this.Hstep);
                    
                     if(this.spanindex >= this.prefabsnum)
                     {
                        this.spanindex = 0;
                     }
                    

                     if(this.onlycol === j)
                     {
                            
                            this.BoxPool[this.spanindex].script.BoxState.hide = false;
                            hidebool = false;
                     }
                    else
                    {
                            hidebool = Math.random() > this.hiderandom;
                            if(this.spanrow > 200)
                            {
                                if(hidebool)
                                {
                                    hidenum ++;
                                    if(hidenum > 2)
                                    {
                                        hidebool = false;
                                    } 
                                }   
                            }
                            else
                            {
                               if(hidebool)
                                {
                                    hidenum ++;
                                    if(hidenum > 1)
                                    {
                                       hidebool = false;
                                    } 
                                } 
                            }
                            
                            this.BoxPool[this.spanindex].script.BoxState.hide = hidebool;

                        
                    }
                    
                    this.ChangeBox(hidebool,nextPos);
                    
                    this.BoxPool[this.spanindex].model.enabled = true;
                    this.BoxPool[this.spanindex].script.BoxState.Init();
                    this.BoxPool[this.spanindex].setPosition(nextPos.x,nextPos.y,nextPos.z);
                    this.spanindex++;
                }
               
               this.spanrow ++;

               if(this.spanrow % 50 === 0)
               {
                   if(this.hiderandom >0.3)
                   {
                       this.hiderandom -= 0.1;
                   }
                   
               }
            
            
        },
        
        ChangeBox:function(hitbool,pos)
        {
            
            var randomx = pc.math.random(0,3);
            switch(this.sceneindex)
            {
                case 0:
                    
                    if(hitbool)
                    {
                        if(randomx > 1.5)
                        {
                              if(this.hitindex >=  this.hitlength)
                             {
                                this.hitindex = 0;
                             }
                       
                            this.hitpool[this.hitindex].setPosition(pos.x+this.hitOffset.x,pos.y+this.hitOffset.y,pos.z+this.hitOffset.z);
                            this.hitindex++;
                            
                        }
                        else
                        {
                            if(this.tree2index >=  this.tree2length)
                            {
                                this.tree2index = 0;
                            }
                       
                            this.tree2pool[this.tree2index].setPosition(pos.x+this.tree2Offset.x,pos.y+this.tree2Offset.y,pos.z+this.tree2Offset.z);
                            this.tree2index++;
                        }
                    }

                    
                    break;
                case 1:
                    
                    if(hitbool)
                    {
                        if(randomx > 1.5)
                        {
                             if(this.tree1index >=  this.tree1length)
                            {
                                this.tree1index = 0;
                            }
                            this.tree1pool[this.tree1index].setPosition(pos.x+this.tree1Offset.x,pos.y+this.tree1Offset.y,pos.z+this.tree1Offset.z);
                            this.tree1index++;
                            
                        }
                        else
                        {
                            if(this.tree5index >=  this.tree5length)
                            {
                                this.tree5index = 0;
                            }
                       
                            this.tree5pool[this.tree5index].setPosition(pos.x+this.tree5Offset.x,pos.y+this.tree5Offset.y,pos.z+this.tree5Offset.z);
                            this.tree5index++;
                        }
                    }

                    
                    break;
                case 2:
                    
      
                    if(hitbool)
                    {
                       if(randomx > 1.5)
                        {
                             if(this.tree1index >=  this.tree1length)
                            {
                                this.tree1index = 0;
                            }
                            this.tree1pool[this.tree1index].setPosition(pos.x+this.tree1Offset.x,pos.y+this.tree1Offset.y,pos.z+this.tree1Offset.z);
                            this.tree1index++;
                            
                        }
                        else
                        {
                            if(this.tree5index >=  this.tree5length)
                            {
                                this.tree5index = 0;
                            }
                       
                            this.tree5pool[this.tree5index].setPosition(pos.x+this.tree5Offset.x,pos.y+this.tree5Offset.y,pos.z+this.tree5Offset.z);
                            this.tree5index++;
                        }
                        
                    }

                    break;
               /* case 3:
                    if(hitbool)
                    {

                        if(randomx > 1.5)
                        {
                            
                             if(this.hitindex >=  this.hitlength)
                             {
                                this.hitindex = 0;
                             }
                       
                            this.hitpool[this.hitindex].setPosition(pos.x+this.hitOffset.x,pos.y+this.hitOffset.y,pos.z+this.hitOffset.z);
                            this.hitindex++;
                        }
                        else
                        {
                             if(this.hit1index >=  this.hit1length)
                             {
                                this.hit1index = 0;
                             }
                       
                            this.hit1pool[this.hit1index].setPosition(pos.x,pos.y,pos.z);
                            this.hit1index++;
                            
                            this.BoxPool[this.spanindex].model.enabled = false;
                        }   
                        
                        
                    }
                    
                    
                    
                    break;*/
                  
                case 3:
                    

                    
                    if(hitbool)
                    {

                        if(randomx > 1.5)
                        {
                             if(this.tree1index >=  this.tree1length)
                            {
                                this.tree1index = 0;
                            }
                            this.tree1pool[this.tree1index].setPosition(pos.x+this.tree1Offset.x,pos.y+this.tree1Offset.y,pos.z+this.tree1Offset.z);
                            this.tree1index++;
                            
                        }
                        else
                        {
                            if(this.tree5index >=  this.tree5length)
                            {
                                this.tree5index = 0;
                            }
                       
                            this.tree5pool[this.tree5index].setPosition(pos.x+this.tree5Offset.x,pos.y+this.tree5Offset.y,pos.z+this.tree5Offset.z);
                            this.tree5index++;
                        }
                        
                    }

                    
                    
                    
                    break;
               case 4:
   
                    
                    if(hitbool)
                    {

                        if(randomx > 1.5)
                        {
                             if(this.tree3index >=  this.tree3length)
                            {
                                this.tree3index = 0;
                            }
                            this.tree3pool[this.tree3index].setPosition(pos.x+this.tree3Offset.x,pos.y+this.tree3Offset.y,pos.z+this.tree3Offset.z);
                            this.tree3index++;
                            
                        }
                        else
                        {
                            if(this.tree4index >=  this.tree4length)
                            {
                                this.tree4index = 0;
                            }
                       
                            this.tree4pool[this.tree4index].setPosition(pos.x+this.tree4Offset.x,pos.y+this.tree4Offset.y,pos.z+this.tree4Offset.z);
                            this.tree4index++;
                        }
                        
                    }
   
                    
                    
                    break;  
                    
                default:
                    break;
                    
                    
            }
            
        },
        
        
        
        
        Init:function()
        {
            this.playerrow = 0;
            this.playercol = 2;
            this.spanindex = 0;
            
            this.tree1index = 0;
            this.tree2index = 0;
            this.tree3index = 0;
            this.tree4index = 0;
            this.tree5index = 0;
            this.hitindex = 0;
            //this.hit1index = 0;
            
            this.spanrow = 0;
            this.znum = 2;
            this.onlycol = 2;
            this.onlyspanXdir = true;
            this.hiderandom = 0.8;
            for(var i=0;i<this.prefabsnum;i++)
            {
                this.BoxPool[i].setPosition(0,-100,0);
                this.BoxPool[i].model.enabled = true;
            }
            
            for(var j=0;j<this.tree1length;j++)
            {
                this.tree1pool[j].setPosition(0,-100,0);
            }
            
            for(var k=0;k<this.tree2length;k++)
            {
                this.tree2pool[k].setPosition(0,-100,0);
            }
            
            
            for( k=0;k<this.tree3length;k++)
            {
                this.tree3pool[k].setPosition(0,-100,0);
            }
            
            for( k=0;k<this.tree4length;k++)
            {
                this.tree4pool[k].setPosition(0,-100,0);
            }
            
            for( k=0;k<this.tree5length;k++)
            {
                this.tree5pool[k].setPosition(0,-100,0);
            }
            
            for(var l=0;l<this.hitlength;l++)
            {
                this.hitpool[l].setPosition(0,-100,0);
            }
            
            /*for( l=0;l<this.hit1length;l++)
            {
                this.hit1pool[l].setPosition(0,-100,0);
            }*/
            
            this.sceneindex ++;
            if(this.sceneindex >= 5)
            {
                this.sceneindex = 0;
            }
            
            switch(this.sceneindex)
            {
                case 0:
                    this.BoxleftMat.diffuseMap = this.AutumnleftTex;
                    this.BoxleftMat.update();
                    
                    this.BoxtopMat.diffuseMap =  this.AutumntopTex;
                    this.BoxtopMat.update();
                    
                    this.tree3parent.enabled = false;
                    this.tree4parent.enabled = false;
                    
                    this.tree2parent.enabled = true;
                    this.hitparent.enabled = true;
                    
                    break;
                case 1:
                    this.BoxleftMat.diffuseMap = this.Grass2leftTex;
                    this.BoxleftMat.update();
                    
                    this.BoxtopMat.diffuseMap =  this.Grass2topTex;
                    this.BoxtopMat.update();
                    
                    this.tree1parent.enabled = true;
                    this.tree5parent.enabled = true;
                    
                    this.tree2parent.enabled = false;
                    this.hitparent.enabled = false;
                    
                    break;
                case 2:
                    this.BoxleftMat.diffuseMap = this.LamatleftTex;
                    this.BoxleftMat.update();
                    
                    this.BoxtopMat.diffuseMap =  this.LamattopTex;
                    this.BoxtopMat.update();
                    break;
                /*case 3:
                   this.BoxleftMat.diffuseMap = this.Rock2leftTex;
                    this.BoxleftMat.update();
                    
                    this.BoxtopMat.diffuseMap =  this.Rock2topTex;
                    this.BoxtopMat.update();
                    this.tree1parent.enabled = false;
                    this.tree5parent.enabled = false;
                    
                    this.hit1parent.enabled = true;
                    this.hitparent.enabled = true;
                    
                    break;*/
                    
               case 3:
                    this.BoxleftMat.diffuseMap = this.SpringleftTex;
                    this.BoxleftMat.update();
                    
                    this.BoxtopMat.diffuseMap =  this.SpringtopTex;
                    this.BoxtopMat.update();
                    /*
                    this.tree1parent.enabled = true;
                    this.tree5parent.enabled = true;
                    
                    this.hit1parent.enabled = false;
                    this.hitparent.enabled = false;*/
                    break;     
               case 4:
                   this.BoxleftMat.diffuseMap = this.WinterleftTex;
                    this.BoxleftMat.update();
                    
                    this.BoxtopMat.diffuseMap =  this.WintertopTex;
                    this.BoxtopMat.update();
                    
                    this.tree3parent.enabled = true;
                    this.tree4parent.enabled = true;
                    
                    this.tree1parent.enabled = false;
                    this.tree5parent.enabled = false;
                    
                    break;
                    
                default:
                    break;
                    
            }
            
            
            
            
            this.InitSpanBox();
        }
        
        
        
    };

    return PathManager;
});