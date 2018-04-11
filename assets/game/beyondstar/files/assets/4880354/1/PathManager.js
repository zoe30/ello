var PathManager = pc.createScript('PathManager');

   
PathManager.prototype.initialize = function () {
            var app = this.app;
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
            
      
             this.levelpool = app.root.findByName('propprefabs').children;
             this.levelcount = this.levelpool.length;
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
            
            //this.coinprop = app.root.findByName('coin');
            //this.coinprop.enabled = false;
            
            this.bgindex = 0;
             
            this.bg1 = app.root.findByName('bg1');
            this.bg2 = app.root.findByName('bg2');
            this.bg2.enabled = false;
    
            this.InitSpanBox();
           
};

        
PathManager.prototype.update = function (dt) {
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
            
               
};

PathManager.prototype.InitSpanBox = function(){
            
    
            var index = Math.floor(pc.math.random(2,4));
            
            for(var i = 0;i<this.InitNum;i++)
            {
               this.BoxPool[this.spanIndex].script.BoxControl.spanXdir = this.spanXDir;
              
               var pos = new pc.Vec3(this.spanXDir ? this.LastPos.x-this.Hstep:this.LastPos.x,this.LastPos.y + this.Vstep,this.spanXDir?this.LastPos.z:this.LastPos.z-this.Hstep);
               this.BoxPool[this.spanIndex].setPosition(pos.x,pos.y,pos.z);

               if(i === index || i === index+2)
               {
                    while(this.levelpool[this.levelindex].name !== '2')
                    {
                        this.levelindex ++;   
                    }
                   
                    var childrenpos = new pc.Vec3(!this.spanXDir ? this.LastPos.x-this.Hstep:this.LastPos.x,this.LastPos.y + this.Vstep,!this.spanXDir?this.LastPos.z:this.LastPos.z-this.Hstep);
                    this.BoxPool[this.spanIndex].script.BoxControl.hasChildren = true;
                    this.BoxPool[this.spanIndex].script.BoxControl.childrenNode = this.levelpool[this.levelindex];
                
                    var hit = pc.math.random(0,1)>0.5?true:false;
                    if(hit)
                    {
                        this.BoxPool[this.spanIndex].script.BoxControl.hit = true;
                        this.levelpool[this.levelindex].setPosition(childrenpos.x,childrenpos.y,childrenpos.z);
                    }
                    else
                    {
                        this.BoxPool[this.spanIndex].script.BoxControl.hit = false;
                        var offset = Math.floor(pc.math.random(1,3));
                        this.levelpool[this.levelindex].setPosition(!this.spanXDir?childrenpos.x-offset*this.Hstep:childrenpos.x,childrenpos.y,!this.spanXDir?childrenpos.z:childrenpos.z-offset*this.Hstep);    
                    }
                
                    this.levelindex++;
                    if(this.levelindex >= this.levelcount)
                    {
                        this.levelindex = 0;
                    }
               } 
                
                
               this.LastPos.set(pos.x,pos.y,pos.z);
               if(this.spanIndex === 0)
               {
                   this.spanXDir = false;
               }
               else
               {
                   this.spanXDir = pc.math.random(0,1)>0.5?true:false;
               }
               this.spanIndex++;  
            }
   
};               
        
PathManager.prototype.SpanBox = function(){
            if(this.spanIndex >= this.prefabsNum)
            {
                this.spanIndex = 0;
            }
            
            var pos = new pc.Vec3(this.spanXDir ? this.LastPos.x-this.Hstep:this.LastPos.x,this.LastPos.y + this.Vstep,this.spanXDir?this.LastPos.z:this.LastPos.z-this.Hstep);
            this.BoxPool[this.spanIndex].setPosition(pos.x,pos.y+this.DropHeight,pos.z);
            this.BoxPool[this.spanIndex].script.BoxControl.NextPos.set(pos.x,pos.y,pos.z);

            this.BoxPool[this.spanIndex].script.BoxControl.spanXdir = this.spanXDir; 
            this.BoxPool[this.spanIndex].script.BoxControl.UpAnim = true; 
            //this.BoxPool[this.spanIndex].script.BoxControl.hascoin = false;
            
            
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
               /* if(this.playercontrol.score % 20 === 0)
                {
                    var hascoin = pc.math.random(0,1)>0.8;
                    if(hascoin)
                    {
                        this.coinprop.enabled = true;
                        this.coinprop.setPosition(pos.x,pos.y+0.5,pos.z);
                        this.BoxPool[this.spanIndex].script.BoxControl.hascoin = true;
                    }
                }*/
            
            this.spanXDir = pc.math.random(0,1)>0.5?true:false;
            this.LastPos.set(pos.x,pos.y,pos.z);
            this.spanIndex++;  
            
};
        
PathManager.prototype.Init = function(){
             //this.coinprop.enabled = false;
                
                this.bgindex ++;
                this.bgindex %= 2;
                if(this.bgindex > 0)
                {
                    this.bg1.enabled = false;
                    this.bg2.enabled = true;
                }
                else
                {
                    this.bg1.enabled = true;
                    this.bg2.enabled = false;
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
                    //this.BoxPool[j].script.BoxControl.hascoin = false;
                }    
                
                for( j =0;j<this.levelcount;j++)
                {
                    this.levelpool[j].setPosition(0,-100,0);
                }
    
    
                this.InitSpanBox();
  

};
       
