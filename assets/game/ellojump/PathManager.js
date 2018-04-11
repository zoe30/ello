pc.script.attribute("material","asset",null,{max:1});


pc.script.create('PathManager', function (app) {
    // Creates a new PathManager instance
    var PathManager = function (entity) {
        this.entity = entity;
    };
        
    PathManager.prototype = {
       
        initialize: function () 
        {
            
            var manager = app.root.findByName("Manager");
            this.gamemanager = manager.script.GameStateManager;
            var player = app.root.findByName("player");
            this.playercontrol = player.script.PlayerControl;
            var boxprefabs = app.root.findByName("prefabs"); 
            this.BoxPool = boxprefabs.getChildren();
            this.prefabsNum = this.BoxPool.length;
            this.dropnum  = 4;
            this.InitNum = 6;
            this.Hstep = 0.5;
            this.Vstep = 0.25;
            this.DropHeight = 4;
            var prefabs = app.root.findByName("boxprefabs");
            this.BoxChildren = prefabs.getChildren();
            this.childrenNum = this.BoxChildren.length;
            this.boxmat = app.assets.get(this.material).resource;
            this.boxcolors = ["#bc2849","#4a7778","#ffba6f","#007ebe","#ba6689","#db8d41","#3dadc2"];
            this.boxmatcolor = new pc.Color();
            for(var k = 0;k<this.childrenNum;k++)
            {
                this.BoxChildren[k].setPosition(0,-100,0);
                //this.BoxPool[k].script.BoxControl.childrenNode = this.BoxChildren[k];
            }
            var crossparent = app.root.findByName("crossprefabs");
            this.crossprefabs = crossparent.getChildren();
            this.crossnum = this.crossprefabs.length;
            for(var m = 0;m<this.crossnum;m++)
            {
                this.crossprefabs[m].setPosition(0,-100,0);
            }
            
            
            
            
            
            //needInit
            this.startgame = false;
            this.playerindex = 0;
            this.dropIndex = 0;
            this.DownIndex  = 1;
            this.childrenIndex = 0;
            
            
            this.spanXDir = false;
            this.LastPos = new pc.Vec3(0,0,0);
            this.BoxPool[0].setPosition(0,0,0);
            for(var i = 1;i<this.InitNum;i++)
            {
                this.InitSpanBox();
            }
            this.everydelay = 0.4;
            this.timer = 0;
            var extranum = this.prefabsNum - this.InitNum;
            for(var j =0;j<extranum;j++)
            {
                this.BoxPool[this.DownIndex+j].setPosition(0,-100,0);
            }
            
         
               
        
            
            
            this.changetimer = 0;
            this.startchange = false;
            this.boxcolori = Math.floor(pc.math.random(0,7));
            this.boxmatcolor.fromString(this.boxcolors[this.boxcolori]);
            this.boxmat.diffuse = new pc.Color(this.boxmatcolor.r,this.boxmatcolor.g,this.boxmatcolor.b,1);
            this.boxmat.update();
            
            this.crosstimes = 0;
            this.boxchildrenindex = 0;
            this.boxcrossindex = 0;
            this.lastnum = 0;
            this.lastdir = this.spanXDir;
            
        },

        
        update: function (dt) 
        {
            
            if(!this.gamemanager.start)
            {
                return;
            }
            
            if(!this.startgame)
            {
                return;
            }
            
            if(this.gamemanager.lose)
            {
               
               return;
            }
            
            
            this.ChangeBoxColor(dt);
            
            this.timer += dt;
            if(this.timer > this.everydelay)
            {
                this.BoxPool[this.dropIndex].script.BoxControl.Down = true;
                if(this.playerindex === this.dropIndex)
                {
                    this.playercontrol.timeoutlose = true;
                    this.gamemanager.lose = true;
                    this.playercontrol.PlaySound("lose");
                }
                this.timer = 0;
                this.dropIndex++;
                if(this.dropIndex >= this.prefabsNum)
                {
                    this.dropIndex = 0;
                }
            }
            
        },
        
        ChangeBoxColor:function(dt)
        {
             if(this.startchange)
             {
                this.changetimer += dt;
                if(this.changetimer > 3)
                {
                    this.changetimer = 0;
                    this.startchange = false;
                }
                else
                {
                   
                   var color = this.boxmat.diffuse;
                   var r = color.r * (1-dt) +this.boxmatcolor.r*dt;
                   var g = color.g * (1-dt) +this.boxmatcolor.g*dt;
                   var b = color.b * (1-dt) +this.boxmatcolor.b*dt;
                   this.boxmat.diffuse = new pc.Color(r,g,b,1);
                  
                   this.boxmat.update(); 
                }
                
            }
        },
        
        
        InitSpanBox:function()
        {
           
           this.BoxPool[this.DownIndex].script.BoxControl.spanXDir = this.spanXDir;
           this.BoxPool[this.DownIndex].setPosition(this.spanXDir ? this.LastPos.x-this.Hstep:this.LastPos.x,this.LastPos.y + this.Vstep,this.spanXDir?this.LastPos.z:this.LastPos.z-this.Hstep);
           var pos = this.BoxPool[this.DownIndex].getPosition();
           this.LastPos.set(pos.x,pos.y,pos.z);
           this.DownIndex++;  
           this.spanXDir = pc.math.random(0,1) > 0.5 ?true:false;
           
       },
        
        
        SpanBox:function()
        {
            if(this.DownIndex >= this.prefabsNum)
            {
                this.DownIndex = 0;
            }
 
           if(this.crosstimes > 0)
           {
               
               if(this.boxcrossindex >= this.crossnum)
               {
                   this.boxcrossindex = 0;
               }
               this.BoxPool[this.DownIndex].script.BoxControl.spanXDir = this.spanXDir;
               var pos = new pc.Vec3(this.spanXDir ? this.LastPos.x-this.Hstep:this.LastPos.x,this.LastPos.y + this.Vstep,this.spanXDir?this.LastPos.z:this.LastPos.z-this.Hstep);
               this.BoxPool[this.DownIndex].setPosition(pos.x,pos.y+this.DropHeight,pos.z);
               this.BoxPool[this.DownIndex].script.BoxControl.Up = true;
               this.BoxPool[this.DownIndex].script.BoxControl.NextPos.set(pos.x,pos.y,pos.z);
               this.BoxPool[this.DownIndex].script.BoxControl.hasChildren = false;

               var childrenpos = new pc.Vec3(!this.spanXDir ? this.LastPos.x-(5-this.crosstimes)*this.Hstep:(this.LastPos.x+(4-this.crosstimes)*this.Hstep),this.LastPos.y + this.Vstep,!this.spanXDir?(this.LastPos.z+(4-this.crosstimes)*this.Hstep):this.LastPos.z-(5-this.crosstimes)*this.Hstep);
              
               if(this.crosstimes > 3)
               {
                   console.log(this.boxcrossindex);
                   this.BoxPool[this.DownIndex].script.BoxControl.hasChildren = true;
                   this.crossprefabs[this.boxcrossindex].getChildren()[0].enabled = false;
               }
               
               this.BoxPool[this.DownIndex].script.BoxControl.cross = true;
               this.BoxPool[this.DownIndex].script.BoxControl.childrenNode  = null;
               
               this.crossprefabs[this.boxcrossindex].setPosition(childrenpos.x,childrenpos.y+this.DropHeight,childrenpos.z);
               this.BoxPool[this.DownIndex].script.BoxControl.childrenNode = this.crossprefabs[this.boxcrossindex];
               this.BoxPool[this.DownIndex].script.BoxControl.childrenPos.set(childrenpos.x,childrenpos.y,childrenpos.z);
               
               this.LastPos.set(pos.x,pos.y,pos.z);
               this.boxcrossindex ++;
               this.crosstimes --;
           }
           else
           {
               var cross = pc.math.random(0,1) >0.8 ? true:false;
               if(cross)
               {
                   this.crosstimes = 4;
               }
             
               
               this.BoxPool[this.DownIndex].script.BoxControl.spanXDir = this.spanXDir;
               var pos1 = new pc.Vec3(this.spanXDir ? this.LastPos.x-this.Hstep:this.LastPos.x,this.LastPos.y + this.Vstep,this.spanXDir?this.LastPos.z:this.LastPos.z-this.Hstep);
               this.BoxPool[this.DownIndex].setPosition(pos1.x,pos1.y+this.DropHeight,pos1.z);
               this.BoxPool[this.DownIndex].script.BoxControl.Up = true;
               this.BoxPool[this.DownIndex].script.BoxControl.NextPos.set(pos1.x,pos1.y,pos1.z);
               this.BoxPool[this.DownIndex].script.BoxControl.hasChildren = false;
            
               //hit 
               var hasChildren1 = (pc.math.random(0,1)>0.5) ? true:false;
               if(cross)
               {
                   hasChildren1 = false;
               }
               if(hasChildren1)
               {
                   
                    if(this.boxchildrenindex >= this.childrenNum)
                    {
                        this.boxchildrenindex = 0;
                    }
                    var childrenpos1 = new pc.Vec3(!this.spanXDir ? this.LastPos.x-this.Hstep:this.LastPos.x,this.LastPos.y + this.Vstep,!this.spanXDir?this.LastPos.z:this.LastPos.z-this.Hstep);
                    this.BoxPool[this.DownIndex].script.BoxControl.hasChildren = true;
                    this.BoxPool[this.DownIndex].script.BoxControl.childrenNode = null;
               
                       
                        
                        if(this.BoxChildren[this.boxchildrenindex].name === "Box3" && this.spanXDir)
                        {
                            this.boxchildrenindex +=2;
                        }
                        else
                        {
                           if((this.BoxChildren[this.boxchildrenindex].name === "Box4" || this.BoxChildren[this.boxchildrenindex].name === "Box9") && !this.spanXDir)
                            {
                                this.boxchildrenindex += 2;
                            }
                          
                        }     
                        if(this.boxchildrenindex >= this.childrenNum)
                        {
                            this.boxchildrenindex =0;    
                        }
                    
                    var nohit = (pc.math.random(0,1)>0.5) ? true:false;
                    if(nohit)
                    {
                        this.BoxPool[this.DownIndex].script.BoxControl.nohit = true;
                        this.BoxPool[this.DownIndex].script.BoxControl.hasChildren = false;
                        var x = Math.floor(pc.math.random(1,3));
                        this.BoxChildren[this.boxchildrenindex].setPosition(!this.spanXDir ?(childrenpos1.x -x*this.Hstep):childrenpos1.x,childrenpos1.y+this.DropHeight,!this.spanXDir?childrenpos1.z:(childrenpos1.z-x*this.Hstep));
                        this.BoxPool[this.DownIndex].script.BoxControl.childrenPos.set(!this.spanXDir ?(childrenpos1.x -x*this.Hstep):childrenpos1.x,childrenpos1.y,!this.spanXDir?childrenpos1.z:(childrenpos1.z-x*this.Hstep));
                    }
                    else
                    {
                        this.BoxChildren[this.boxchildrenindex].setPosition(childrenpos1.x,childrenpos1.y+this.DropHeight,childrenpos1.z);
                        this.BoxPool[this.DownIndex].script.BoxControl.childrenPos.set(childrenpos1.x,childrenpos1.y,childrenpos1.z);
                    }
                    this.BoxPool[this.DownIndex].script.BoxControl.childrenNode = this.BoxChildren[this.boxchildrenindex]; 
                    
                    this.boxchildrenindex ++;
               }
              
              this.spanXDir = pc.math.random(0,1) > 0.5 ?true:false;
              
              if((this.spanXDir && this.lastdir) || (!this.spanXDir && !this.lastdir))
              {
                    console.log(this.spanXDir  +"   "+this.lastdir);
                    this.lastnum++;
                    if(this.lastnum > 3)
                    {
                        this.spanXDir = !this.spanXDir;
                        this.lastnum = 0;
                    }
               }
            
               this.lastdir = this.spanXDir; 
             


              
               this.LastPos.set(pos1.x,pos1.y,pos1.z);
              
           }
            
         
            
            

           this.DownIndex++;  
           
           //cross show
            var index1 = 0;
            if(this.playerindex >= this.prefabsNum - 4)
            {
                index1 =  4 - (this.prefabsNum - this.playerindex);   
            }
            else
            {
                index1 = this.playerindex + 4;
            }
            
           if(this.BoxPool[index1].script.BoxControl.cross && this.BoxPool[index1].script.BoxControl.hasChildren)
           {
               this.BoxPool[index1].script.BoxControl.childrenNode.getChildren()[0].enabled = true;
               this.BoxPool[index1].script.BoxControl.childrenNode.getChildren()[0].script.ScaleAnim.nowScale = 0.5;
               this.BoxPool[index1].script.BoxControl.childrenNode.getChildren()[0].script.ScaleAnim.Anim = true;
           }
     
           //start drop 
           var num = 0;
           if(this.playerindex >= this.dropIndex)
           {
               num = this.playerindex - this.dropIndex;
           }
           else
           {
               num = this.prefabsNum - this.dropIndex + this.playerindex;     
           }
           if( num > this.dropnum)
           {
                this.BoxPool[this.dropIndex].script.BoxControl.Down = true;
                this.dropIndex++;
                if(this.dropIndex >= this.prefabsNum)
                {
                    this.dropIndex = 0;
                }
           }
           
            
           //harder  color change
           if(this.playercontrol.score >0)
            {
                if(Math.floor(this.playercontrol.score % 50) === 0)
                {
                  this.playercontrol.PlaySound("change");
                  var index = Math.floor(pc.math.random(0,7));
               
                  if( this.boxcolori == index && this.boxcolori > 0)
                  {
                      this.boxcolori -= 1;
                  }
                 else
                 {
                     this.boxcolori = index;
                 }

               
                this.boxmatcolor.fromString(this.boxcolors[this.boxcolori]);  
                this.startchange = true;
                    
                    if(this.playercontrol.score > 150)
                    {
                        this.everydelay = 0.18;
                    }
                    else
                    {
                        if(this.playercontrol.score > 100)
                        {
                            this.everydelay = 0.2;
                        }
                        else
                        {
                            this.everydelay = 0.3;
                        }
                    }
                    
                }
            }
            
            
            
        },
        
        Init:function()
        {
          
            this.startgame = false;
            this.playerindex = 0;
            this.dropIndex = 0;
            this.DownIndex  = 1;
            this.spanXDir = false;
            this.LastPos.set(0,0,0);
            this.BoxPool[0].setPosition(0,0,0);
            for(var i = 1;i<this.InitNum;i++)
            {
                this.InitSpanBox();
               
            }
            this.everydelay = 0.4;
            this.timer = 0;
            var extranum = this.prefabsNum - this.InitNum;
            for(var j =0;j<extranum;j++)
            {
                this.BoxPool[this.DownIndex+j].setPosition(0,-100,0);
                
            }
            
            for(var n =0;n<this.prefabsNum;n++)
            {
                this.BoxPool[n].script.BoxControl.hasChildren = false;
                this.BoxPool[n].script.BoxControl.nohit  = false;
                this.BoxPool[n].script.BoxControl.cross = false;
                this.BoxPool[n].script.BoxControl.childrenNode  = null;
            }
            
            
            for(var k =0;k<this.childrenNum;k++)
            {
                this.BoxChildren[k].setPosition(0,-100,0);  
            }
            
            
            
            
            for(var m = 0;m<this.crossnum;m++)
            {
                this.crossprefabs[m].setPosition(0,-100,0);
                
            }
            
            this.boxchildrenindex = 0;
            this.boxcrossindex = 0;
            this.crosstimes = 0;
            this.changetimer = 0;
            this.startchange = false;
            this.boxcolori = Math.floor(pc.math.random(0,7));
            this.boxmatcolor.fromString(this.boxcolors[this.boxcolori]);
            this.boxmat.diffuse = new pc.Color(this.boxmatcolor.r,this.boxmatcolor.g,this.boxmatcolor.b,1);
            this.boxmat.update();
            this.lastnum = 0;
            this.lastdir = this.spanXDir;
        }
       
        
        
        
        
        
        
    };

    return PathManager;
});