pc.script.attribute("topmat","asset",null,{max:1});
pc.script.attribute("leftmat","asset",null,{max:1});
pc.script.attribute("toptex1","asset",null,{max:1});
pc.script.attribute("toptex2","asset",null,{max:1});
pc.script.attribute("toptex3","asset",null,{max:1});
pc.script.attribute("toptex4","asset",null,{max:1});
pc.script.attribute("toptex5","asset",null,{max:1});
pc.script.attribute("toptex6","asset",null,{max:1});

pc.script.attribute("lefttex1","asset",null,{max:1});
pc.script.attribute("lefttex2","asset",null,{max:1});
pc.script.attribute("lefttex3","asset",null,{max:1});
pc.script.attribute("lefttex4","asset",null,{max:1});
pc.script.attribute("lefttex5","asset",null,{max:1});
pc.script.attribute("lefttex6","asset",null,{max:1});


pc.script.create('PathManager', function (app) {

    var PathManager = function (entity) {
        this.entity = entity;
    };
   
    
    var MIN_CHANGENUM = 8;
    var MAX_CHANGENUM = 12;
     
    PathManager.prototype = {
        
        initialize: function () 
        {
           
            
             var manager = app.root.findByName("Manager");
             this.gamemanager = manager.script.AppStateManager;
             var player = app.root.findByName("player");
             this.playercontrol = player.script.PlayerControl;
            
             this.thunder = app.root.findByName("thunder");
             this.thunder.enabled = false;
             var boxparent  = app.root.findByName("prefabs");
             this.BoxPool =  boxparent.getChildren();
             this.prefabsNum = this.BoxPool.length;
             this.DropHeight = 3;
             this.Hstep = 0.6;
             this.Vstep = 0.6;
             this.VOffset = 0.3;
             this.minHeight = -1; 
             this.maxHeight = 4;
            
             var otherboxparent = app.root.findByName("otherprefabs");
             this.OtherBoxPool  = otherboxparent.getChildren();
             this.otherprefabsNum = this.OtherBoxPool.length;
             this.otherinex = 0;
            
            
             this.Topmat = app.assets.get(this.topmat).resource;
             this.LefMat = app.assets.get(this.leftmat).resource;
             this.TopTex1 = app.assets.get(this.toptex1).resource;
             this.TopTex2 = app.assets.get(this.toptex2).resource;
             this.TopTex3 = app.assets.get(this.toptex3).resource;
             this.TopTex4 = app.assets.get(this.toptex4).resource;
             this.TopTex5 = app.assets.get(this.toptex5).resource;
             this.TopTex6 = app.assets.get(this.toptex6).resource;

            
            
             this.LeftTex1 = app.assets.get(this.lefttex1).resource;
             this.LeftTex2 = app.assets.get(this.lefttex2).resource;
             this.LeftTex3 = app.assets.get(this.lefttex3).resource;
             this.LeftTex4 = app.assets.get(this.lefttex4).resource;
             this.LeftTex5 = app.assets.get(this.lefttex5).resource;
             this.LeftTex6 = app.assets.get(this.lefttex6).resource;

            
             this.everydrop = 0.6;
             this.droptimer = 0;
             this.LastPos = new pc.Vec3(0,0,0);
             this.Ydir = Math.floor(pc.math.random(0,3))-1;
             this.lastYdir = 0;
             this.ChangedNum = Math.floor(pc.math.random(MIN_CHANGENUM,MAX_CHANGENUM));
             this.NextDir = false;
             this.ZYaw = true; 
             this.everySpan = 0;
             this.SpanIndex = 0;
             this.playerindex = 0;
             this.dropindex = 0;
             this.startgame = false;
             this.nowheight = 0;
             this.onespan = 0.9;
             this.twospan = 0.8;
             this.threespan = 0.9;
             this.texindex = 0;
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
              
                if(this.playercontrol.tapwrong)
                {
                    this.droptimer += dt;
                    if(this.droptimer > 0.1)
                    {
                        if(this.dropindex !== this.playerindex)
                        {
                            this.droptimer = 0;
                            this.BoxPool[this.dropindex].script.BoxControl.Down = true;
                            this.dropindex++;
                            if(this.dropindex >= this.prefabsNum)
                            {
                                this.dropindex = 0;
                            }
                        }
                        else
                        {
                            this.playercontrol.shadow.enabled = false;
                            this.BoxPool[this.dropindex].script.BoxControl.Down = true;
                        }
                    }
                } 
                return;
            }
            
            if(!this.startgame)
            {
                return;
            }
            
            
            
            this.droptimer += dt;
            if(this.droptimer > this.everydrop)
            {
                if(this.dropindex === this.playerindex)
                {
                    this.gamemanager.lose = true;
                    this.playercontrol.timeoutwrong = true;
                    this.playercontrol.shadow.enabled = false;
                }
                this.droptimer = 0;
                this.BoxPool[this.dropindex].script.BoxControl.Down = true;
                this.dropindex++;
                if(this.dropindex >= this.prefabsNum)
                {
                    this.dropindex = 0;
                }
            }
            
        },
        
        
        
        
        InitSpanBox:function()
        {
            
            this.texindex++;
            
            if(this.texindex > 6)
            {
                this.texindex = 1;
            }
            
            switch(this.texindex)
            {
                        case 1:
                            this.Topmat.diffuseMap = this.TopTex1;
                            this.Topmat.update();
                            this.LefMat.diffuseMap = this.LeftTex1;
                            this.LefMat.update();
                            break;
                            
                        case 2:
                            this.Topmat.diffuseMap = this.TopTex2;
                            this.Topmat.update();
                            this.LefMat.diffuseMap = this.LeftTex2;
                            this.LefMat.update(); 
                            break;
                            
                        case 3:
                            this.Topmat.diffuseMap = this.TopTex3;
                            this.Topmat.update();
                            this.LefMat.diffuseMap = this.LeftTex3;
                            this.LefMat.update();
                            break;
                        case 4:
                            this.Topmat.diffuseMap = this.TopTex4;
                            this.Topmat.update();
                            this.LefMat.diffuseMap = this.LeftTex4;
                            this.LefMat.update();
                            break;    
                        case 5:
                            this.Topmat.diffuseMap = this.TopTex5;
                            this.Topmat.update();
                            this.LefMat.diffuseMap = this.LeftTex5;
                            this.LefMat.update();
                            break;
                        case 6:
                            this.Topmat.diffuseMap = this.TopTex6;
                            this.Topmat.update();
                            this.LefMat.diffuseMap = this.LeftTex6;
                            this.LefMat.update();
                            break;
                       

                    
                        default:
                            break;
      
                            
             }
            
  
             
             for(var i =1;i<6;i++)
             {
                 

                 this.BoxPool[this.SpanIndex].setPosition(this.LastPos.x,this.LastPos.y,this.LastPos.z);

                 this.everySpan ++;
                 this.SpanIndex++;
                 
                 var YDir = 0;
  
                 this.BoxPool[this.SpanIndex].script.BoxControl.XDir = 0;
                 this.BoxPool[this.SpanIndex].script.BoxControl.YDir = YDir;
                 this.BoxPool[this.SpanIndex].script.BoxControl.ZDir = -1;


                 this.LastPos.set(this.LastPos.x,this.LastPos.y,this.LastPos.z - this.Hstep);
             }

            this.everySpan -= 1;
        },
        
        SpanBox:function()
        {
            
            
            
            this.BoxPool[this.SpanIndex].setPosition(this.LastPos.x,this.LastPos.y-this.DropHeight,this.LastPos.z);
            this.BoxPool[this.SpanIndex].script.BoxControl.Up = true;
            this.BoxPool[this.SpanIndex].script.BoxControl.hasChildren = false;
            this.BoxPool[this.SpanIndex].script.BoxControl.childrenNode = null;
            this.BoxPool[this.SpanIndex].script.BoxControl.autorun = false;
            this.BoxPool[this.SpanIndex].script.BoxControl.NextPos.set(this.LastPos.x,this.LastPos.y,this.LastPos.z);
             //add scene
            var randomscene = Math.random() > 0.8;
            if(randomscene && this.everySpan < this.ChangedNum-4 && this.everySpan > 0)
            {
                var closerdis = Math.floor(pc.math.random(2,4));
                var dir = Math.random()>0.5?-1:1;
                this.BoxPool[this.SpanIndex].script.BoxControl.hasChildren = true;
                this.BoxPool[this.SpanIndex].script.BoxControl.childrenNode = this.OtherBoxPool[this.otherinex];
                if(this.ZYaw ? 0:(this.NextDir?1:-1) !== 0)
                {
                   this.OtherBoxPool[this.otherinex].setPosition(this.LastPos.x,this.LastPos.y-this.DropHeight,this.LastPos.z+dir*closerdis*this.Hstep); 
                }
                else
                {
                   this.OtherBoxPool[this.otherinex].setPosition(this.LastPos.x+dir*closerdis*this.Hstep,this.LastPos.y-this.DropHeight,this.LastPos.z);                                            
                }
                
                this.otherinex++;
                if(this.otherinex >= this.otherprefabsNum) 
                {
                    this.otherinex = 0;
                }
            }
            
            if(this.playercontrol.score % 15 === 0)
            {
                var isauto = Math.random() > 0.8;
               
                if(isauto)
                {
                    this.BoxPool[this.SpanIndex].script.BoxControl.autorun = true;

                    this.thunder.enabled = true;
                    if(this.BoxPool[this.SpanIndex].getLocalScale().y < 2*this.Vstep)
                    {
                         this.thunder.setPosition(this.LastPos.x,this.LastPos.y+0.35,this.LastPos.z);
                        
                    }
                    else
                    {
                        this.thunder.setPosition(this.LastPos.x,this.LastPos.y+0.5,this.LastPos.z-0.05);
                    }
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
            
            if(num > 5)
            {
                this.BoxPool[this.dropindex].script.BoxControl.Down = true;
                this.dropindex++;
                if(this.dropindex >= this.prefabsNum)
                {
                    this.dropindex = 0;
                }
            }
            

            this.everySpan ++;
            this.SpanIndex++;
            
            if(this.SpanIndex >= this.prefabsNum)
            {
                this.SpanIndex = 0;
            }
            
            if(this.everySpan >= this.ChangedNum)
            {
                this.ChangedNum =  Math.floor(pc.math.random(MIN_CHANGENUM,MAX_CHANGENUM));
                this.everySpan = 0;
                this.ZYaw = !this.ZYaw;
                this.NextDir = pc.math.random(0,1) > 0.5;
                this.Ydir = 0;
            }

            if(this.everySpan === this.ChangedNum-1 || this.everySpan === this.ChangedNum-2)
            {
                this.Ydir = 0;
            }
            
            
            var XDir = this.ZYaw ? 0:(this.NextDir?1:-1);
            var ZDir = this.ZYaw ? (this.NextDir?1:-1):0;
            var YDir = 0;
                 
                 if(this.lastYdir === 0)
                 {
                     if(this.Ydir === 0)
                     {
                        this.BoxPool[this.SpanIndex].setLocalScale(this.Hstep,this.Vstep,this.Hstep);
                        this.LastPos.set(this.LastPos.x+XDir*this.Hstep,this.LastPos.y,this.LastPos.z + ZDir* this.Hstep);
                        YDir = 0;
                     }
                     else
                     {
                         if(this.Ydir > 0)
                         {
                             this.BoxPool[this.SpanIndex].setLocalScale(this.Hstep,this.Vstep*2,this.Hstep);
                             this.LastPos.set(this.LastPos.x+XDir*this.Hstep,this.LastPos.y+this.VOffset/2,this.LastPos.z + ZDir*this.Hstep);
                             YDir = 1;
                         }
                         else
                         {
                             this.BoxPool[this.SpanIndex].setLocalScale(this.Hstep,this.Vstep*2,this.Hstep);
                             this.LastPos.set(this.LastPos.x+XDir*this.Hstep,this.LastPos.y - this.VOffset/2,this.LastPos.z +ZDir* this.Hstep);
                             YDir = 0;
                         }
                     }
                 }
                 else
                 {
                     if(this.lastYdir > 0)
                     {
                         if(this.Ydir === 0)
                         {
                            this.BoxPool[this.SpanIndex].setLocalScale(this.Hstep,this.Vstep,this.Hstep);
                            this.LastPos.set(this.LastPos.x+XDir*this.Hstep,this.LastPos.y + this.VOffset/2,this.LastPos.z +ZDir*this.Hstep);
                            YDir = 0;
                         }
                         else
                         {
                             if(this.Ydir > 0)
                             {
                                 this.BoxPool[this.SpanIndex].setLocalScale(this.Hstep,this.Vstep*2,this.Hstep);
                                 this.LastPos.set(this.LastPos.x+XDir*this.Hstep,this.LastPos.y+this.VOffset,this.LastPos.z+ZDir*this.Hstep);
                                 YDir = 1;
                             }
                             else
                             {
                                 this.BoxPool[this.SpanIndex].setLocalScale(this.Hstep,this.Vstep,this.Hstep);
                                 this.LastPos.set(this.LastPos.x+XDir*this.Hstep,this.LastPos.y - this.VOffset/2,this.LastPos.z +ZDir*this.Hstep);
                                 YDir = -1;
                             }
                         }
                         
                     }
                     else
                     {
                         
                         var index  = this.SpanIndex - 1;
                         if(this.SpanIndex === 0)
                         {
                             index = this.prefabsNum - 1;
                         }
                         
                         if(this.Ydir === 0)
                         {
                            this.BoxPool[this.SpanIndex].setLocalScale(this.Hstep,this.Vstep,this.Hstep);

                            if(this.BoxPool[index].getLocalScale().y < this.Vstep*2)
                            {
                                this.LastPos.set(this.LastPos.x+XDir*this.Hstep,this.LastPos.y ,this.LastPos.z +ZDir*this.Hstep);
                                YDir = 0;
                            }
                            else
                            {
                                this.LastPos.set(this.LastPos.x+XDir*this.Hstep,this.LastPos.y - this.VOffset/2,this.LastPos.z +ZDir*this.Hstep);
                                YDir = -1;
                            }

                         }
                         else
                         {
                            
                             if(this.Ydir < 0)
                             {
                                 
                                 this.BoxPool[this.SpanIndex].setLocalScale(this.Hstep,this.Vstep*2,this.Hstep);

                                 if(this.BoxPool[index].getLocalScale().y < this.Vstep*2)
                                 {
                                     this.LastPos.set(this.LastPos.x+XDir*this.Hstep,this.LastPos.y - this.VOffset/2,this.LastPos.z +ZDir*this.Hstep);
                                     YDir = 0;
                                 }
                                 else
                                 {
                                     this.LastPos.set(this.LastPos.x+XDir*this.Hstep,this.LastPos.y - this.VOffset,this.LastPos.z +ZDir*this.Hstep);
                                     YDir = -1;
                                 }
                                 
                             }
                         }
                     }
                 }

           this.BoxPool[this.SpanIndex].script.BoxControl.XDir = XDir;
           this.BoxPool[this.SpanIndex].script.BoxControl.YDir = YDir;
           this.BoxPool[this.SpanIndex].script.BoxControl.ZDir = ZDir;

           
            
            
           if(YDir > 0)
           {
                this.nowheight ++;
           }
           if(YDir < 0)
           {
                this.nowheight --;
           }
             
           this.lastYdir = this.Ydir;
             
           if(this.lastYdir < 0)
           {
               if(this.nowheight <= this.minHeight)
               {
                    this.Ydir = 0;
               }
               else
               { 
                 
                       var dir0 = Math.random();
                       if(dir0 > this.onespan)
                       {
                           this.Ydir = -1;
                       }
                       else
                       {
                           this.Ydir = 0;
                       }
                
               }     
           }
           else
           {
               if(this.nowheight >= this.maxHeight)
               {
                  
                       var dir2 = Math.random();
                       if(dir2 > this.onespan)
                       {
                           this.Ydir = -1;
                       }
                       else
                       {
                           this.Ydir = 0;
                       }
                 
               }
               else
               {
                   if(this.nowheight <=this.minHeight)
                    {

                        
                           var dir1 = Math.random();
                           if(dir1 > this.onespan)
                           {
                               this.Ydir = 1;
                               
                           }
                           else
                           {
                               
                               this.Ydir = 0;

                               
                           }
                   
                    }
                    else
                    {
                        
                           var dir3 = Math.random();
                           if(dir3 > this.threespan)
                           {
                               this.Ydir = 1;
                               
                           }
                           else
                           {
                               if(dir3 > this.twospan)
                               {
                                   this.Ydir = -1;
                               }
                               else
                               {
                                   this.Ydir = 0;
                               }
                               
                           }
                        
                      
                         
                    }
              }
          }
          

           //harder
            if(this.playercontrol.score > 0)
            {

                
                if(this.playercontrol.score%50 === 0) 
                {
                    if(this.everydrop > 0.3 )
                    {
                        this.everydrop -= 0.1;
                    }
                    
                    if(this.onespan > 0.5)
                    {
                        this.onespan -= 0.1;
                    }
                    
                    if(this.threespan >0.7)
                    {
                        this.threespan -= 0.1;
                    }
                    
                    if(this.twospan > 0.4)
                    {
                        this.twospan -= 0.2;
                    }
                    
                }
            }
            
            
            //change box texture
           /* if(this.playercontrol.score > 0)
            {
                if(this.playercontrol.score%50 === 0)
                {
                    this.texindex ++;
                    if(this.texindex > 3)
                    {
                        this.texindex = 1;
                    }
                    
                    switch(this.texindex)
                    {
                        case 1:
                            this.Topmat.diffuseMap = this.TopTex1;
                            this.Topmat.update();
                            this.LefMat.diffuseMap = this.LeftTex1;
                            this.LefMat.update();
                            break;
                            
                        case 2:
                            this.Topmat.diffuseMap = this.TopTex2;
                            this.Topmat.update();
                            this.LefMat.diffuseMap = this.LeftTex2;
                            this.LefMat.update(); 
                            break;
                            
                        case 3:
                            this.Topmat.diffuseMap = this.TopTex3;
                            this.Topmat.update();
                            this.LefMat.diffuseMap = this.LeftTex3;
                            this.LefMat.update();
                            break;
                            
                        default:
                            break;
      
                            
                    }
                }
            }*/
            
            
            
        },
        
        
        Init:function()
        {
            
             for(var i =0;i<this.prefabsNum;i++)
             {
                 this.BoxPool[i].setPosition(0,-100,0);
                 this.BoxPool[i].setLocalScale(this.Hstep,this.Vstep,this.Hstep);
                 
                 this.BoxPool[i].script.BoxControl.Up = false;
                 this.BoxPool[i].script.BoxControl.Down = false;
                 this.BoxPool[i].script.BoxControl.timer = 0;
                 this.BoxPool[i].script.BoxControl.hasChildren = false;
                 this.BoxPool[i].script.BoxControl.childrenNode = null;
                 this.BoxPool[i].script.BoxControl.autorun = false;
             }
             
             for(var j =0;j<this.otherprefabsNum;j++)
             {
                 this.OtherBoxPool[j].setPosition(0,-100,0);

             }
            
            
            
             this.startgame = false;
             this.dropindex =0;
             this.everydrop = 0.6;
             this.droptimer = 0;
             this.LastPos = new pc.Vec3(0,0,0);
             this.Ydir = Math.floor(pc.math.random(0,3))-1;
             this.lastYdir = 0;
             this.ChangedNum = Math.floor(pc.math.random(MIN_CHANGENUM,MAX_CHANGENUM));
             this.NextDir = false;
             this.ZYaw = true; 
             this.everySpan = 0;
             this.SpanIndex = 0;
             this.playerindex = 0;
             this.nowheight = 0;
             this.onespan = 0.9;
             this.twospan = 0.8;
             this.threespan = 0.9;
             //this.texindex = 1;
             this.Topmat.diffuseMap = this.TopTex1;
             this.Topmat.update();
             this.LefMat.diffuseMap = this.LeftTex1;
             this.LefMat.update();
            
             this.thunder.enabled = false;
            
             this.InitSpanBox();
        }

        
    };

    return PathManager;
});