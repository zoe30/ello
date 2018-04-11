pc.script.create('CreatePath', function (app) {
    // Creates a new CreatePath instance
    var CreatePath = function (entity) {
        this.entity = entity;

    };

    CreatePath.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () 
        {
            this.xs = 2.5;
            this.ys = 0.8;
            this.xd = 1;
            this.D = 15.0;
            
            
            
            this.points = [];
            this.Flypoints = [];
 
            
            this.InitPoint();
            
            var prefabs = app.root.findByName('Prefabs');
            this.prefabPool = prefabs.getChildren();
            this.prefabnum = this.prefabPool.length;
     
            this.smallScale = 4;
            this.bigScale = 6;
            this.delayDis = 0.1;
             
            var manager = app.root.findByName('Manager');
            this.gamemanager = manager.script.GameStateManager;
            
            this.spanIndex  = 0;
            this.CurPointIndex = 0;
            this.LastZscale = 10;
            this.LastPosZ = 0;
            
            this.LastLeft = false;
            
            this.InitTerrainOk = false;
            this.InitTime = 1;
            this.InitNum = 12;
          
            
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) 
        {
         
            if(!this.InitTerrainOk)
            {
                this.InitTime += dt;
                if(this.InitTime > 0.1)
                {
                    this.InitTime  = 0;
                    this.SpanBox();
                    if(this.spanIndex >= this.InitNum)
                    {
                        this.InitTerrainOk = true;
                    }
                    
                }
            }

            
            if(!this.gamemanager.start || this.gamemanager.lose)
            {
               return;
            }
            
            
        },
        
        
        SpanBox:function()
        {
                var bigorsmall = pc.math.random(0,1) >0.5;
                this.prefabPool[this.spanIndex].setLocalScale(this.xs,this.ys,bigorsmall?this.bigScale:this.smallScale);
                
                var leftorright = pc.math.random(0,1)>0.5;
                var z  = this.LastPosZ - ((this.LastZscale + (bigorsmall?this.bigScale:this.smallScale))/2-this.delayDis);
                this.LastPosZ = z;
                this.LastZscale = bigorsmall?this.bigScale:this.smallScale;
                if(leftorright)
                {
                    if(this.CurPointIndex !== 0)
                    {
                        this.CurPointIndex--;
                    }
                    else
                    {
                        this.CurPointIndex = 7;
                    }
                }
                else
                {
                    if(this.CurPointIndex !== 7)
                    {
                        this.CurPointIndex++;
                    }
                    else
                    {
                        this.CurPointIndex = 0;
                    }
                }
                
                this.prefabPool[this.spanIndex].script.BoxControl.PointIndex = this.CurPointIndex;
                this.prefabPool[this.spanIndex].script.BoxControl.IsBigScale = bigorsmall;
                this.prefabPool[this.spanIndex].script.BoxControl.maxZ = z +  this.LastZscale/2;
                this.prefabPool[this.spanIndex].script.BoxControl.minZ = z - this.LastZscale/2;
                this.prefabPool[this.spanIndex].script.BoxControl.canMove = true;
                
                this.prefabPool[this.spanIndex].setPosition(this.Flypoints[this.CurPointIndex][0],this.Flypoints[this.CurPointIndex][1],z-10);
                this.prefabPool[this.spanIndex].script.BoxControl.NextPos.set(this.points[this.CurPointIndex][0],this.points[this.CurPointIndex][1],z);
            
            
                this.prefabPool[this.spanIndex].setEulerAngles(0,0,45*this.CurPointIndex);
                
                
                this.spanIndex ++;
                if(this.spanIndex >= this.prefabnum)
                {
                    this.spanIndex = 0;
                }
        },
        
        InitPoint:function()
        {
            var pos0 = [],pos1 = [],pos2 = [],pos3 = [],pos4 = [],pos5 = [],pos6 = [],pos7 = [];
            var fpos0 = [],fpos1 = [],fpos2 = [],fpos3 = [],fpos4 = [],fpos5 = [],fpos6 = [],fpos7 = [];
            
            var x = 0,fx = 0,y = 0,fy = 0,Sqrt2 = Math.sqrt(2);
            
            pos0.push(x);
            pos0.push(y);

            fx = x;
            fy = y - this.D;
            fpos0.push(fx);
            fpos0.push(fy);


            x = this.xs * (0.5+Sqrt2/4) + this.xd +Sqrt2/4*this.ys;
            y = (0.5-Sqrt2/4)*this.ys +Sqrt2/4*this.xs;
            pos1.push(x);
            pos1.push(y); 
            pos7.push(-x);
            pos7.push(y);

            
            fx = x+Sqrt2*this.D/2;
            fy = y-Sqrt2*this.D/2;
            fpos1.push(fx);
            fpos1.push(fy); 
            fpos7.push(-fx);
            fpos7.push(fy);
            
            
            x = this.xs*(0.5+Sqrt2/2)+this.xd+this.ys*0.5;
            y = this.ys*0.5+(0.5+0.5*Sqrt2)*this.xs+this.xd;
            pos2.push(x);
            pos2.push(y);
            pos6.push(-x);
            pos6.push(y);
            
            
            fx = x+this.D;
            fy = y;
            fpos2.push(fx);
            fpos2.push(fy);
            fpos6.push(-fx);
            fpos6.push(fy);
            
            
            
            x = (Sqrt2/4+0.5)*this.xs+this.xd+Sqrt2/4*this.ys;
            y = (0.5+Sqrt2/4)*this.ys+(1+3/4*Sqrt2)*this.xs+2*this.xd;
            pos3.push(x);
            pos3.push(y);
            pos5.push(-x);
            pos5.push(y);
            
            
            fx = x+Sqrt2*this.D/2;
            fy = y+Sqrt2*this.D/2;
            fpos3.push(fx);
            fpos3.push(fy);
            fpos5.push(-fx);
            fpos5.push(fy);
            
            
            
            x = 0;
            y = 2*this.xd+this.ys+(Sqrt2+1)*this.xs;
            pos4.push(x);
            pos4.push(y);
            
            
            fx = x;
            fy = y + this.D;
            fpos4.push(fx);
            fpos4.push(fy);
            
            
            
            
            this.points.push(pos0);
            this.points.push(pos1);
            this.points.push(pos2);
            this.points.push(pos3);
            this.points.push(pos4);
            this.points.push(pos5);
            this.points.push(pos6);
            this.points.push(pos7); 
            
            this.Flypoints.push(fpos0);
            this.Flypoints.push(fpos1);
            this.Flypoints.push(fpos2);
            this.Flypoints.push(fpos3);
            this.Flypoints.push(fpos4);
            this.Flypoints.push(fpos5);
            this.Flypoints.push(fpos6);
            this.Flypoints.push(fpos7);
            
            
            
        },
        
        
        Init:function()
        {
            
            for(var i=0;i<this.prefabnum;i++)
            {
                this.prefabPool[i].script.canMove = false;
                this.prefabPool[i].script.timer = 0;
                this.prefabPool[i].setPosition(0,-100,0);
            }
            
            
            this.spanIndex  = 0;
            this.CurPointIndex = 0;
            this.LastZscale = 10;
            this.LastPosZ = 0;
            
            this.LastLeft = false;
            
            this.InitTerrainOk = false;
            this.InitTime = 1;
        }
        
        
        
    };

    return CreatePath;
});