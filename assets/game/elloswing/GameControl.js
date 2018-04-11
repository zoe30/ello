pc.script.attribute("material","asset",null,{max:1});

pc.script.create('GameControl', function (app) {
    
    var GameControl = function (entity) {
        this.entity = entity;
    };

    GameControl.prototype = {
        
        initialize: function () {
            
            if(app.touch)
            {
                app.touch.on(pc.EVENT_TOUCHSTART,this.Control,this);       
            }
            else
            { 
                app.mouse.on(pc.EVENT_MOUSEDOWN,this.Control,this);
            }
            
            this.xs = 2.5;
            this.ys = 0.8;
            this.hs = 0.84;
            this.xd = 1;
            this.lerpD = 0.8;
            
            this.points = [];
            this.lpoints = [];

            this.InitPoint();
            
            this.tips = app.root.findByName('tips');
            this.tips.enabled = false;
            
            
            

            var manager = app.root.findByName('Manager');
            this.pathmanager = manager.script.CreatePath;
            this.gamemanager = manager.script.GameStateManager;
            
            this.Rotation = [0,45,90,135,180,-135,-90,-45];
            
            
            this.shadow = this.entity.findByName('shadow');
            
            this.BoxMat = app.assets.get(this.material).resource;
            
            this.Colors = ["#423e40","#bc2849","#4a7778","#ffba6f","#007ebe","#5c515d","#ba6689","#db8d41","#3dadc2"];
            this.nextColor = new pc.Color();
            
            this.body = this.entity.findByName('body');
            
            
            
            
            this.colori = Math.floor(pc.math.random(0,9));
            this.nextColor.fromString(this.Colors[this.colori]);
            this.BoxMat.diffuse = new pc.Color(this.nextColor.r,this.nextColor.g,this.nextColor.b,1);
            this.BoxMat.update();
            
            this.canChangeColor = false;
            this.timer = 0;
            
            this.RSpeed = 10;
            this.MoveSpeed = 7;
            this.MoveMaxTime = 0.3;
            
            this.scoreUi = document.getElementById('score');
            this.scoreUi.innerHTML = '0';
            
            this.X = this.points[0][0];
            this.Y = this.points[0][1];
            this.entity.setPosition(this.X,this.Y,4);
            this.MoveTime = 0;
            this.Jump = false;
            this.canControl = true;
            this.nowIndex = 0;
            this.nextIndex = 0;
            this.r = 0;
            this.playerIndex = -1;
            this.score = 0;
            this.index  = 0;
            this.lerpindex = 0;

            
            
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) 
        {
            
            //this.RenderJumpCurve();
            
            if(!this.gamemanager.start ) 
            {
               return;
            }
            
            if(!this.gamemanager.startgame)
            {
                return;
            }
            
            
            if(this.gamemanager.lose)
            {
                var up = this.entity.up;
                this.entity.translate(-2*this.MoveSpeed*up.x*dt,-2*this.MoveSpeed*up.y*dt,-2*this.MoveSpeed*up.z*dt);
                return;
            }
            
            this.body.rotateLocal(-this.MoveSpeed*80*dt,0,0);
            this.entity.translate(0,0,-this.MoveSpeed*dt);
            
           
             
             if(this.Jump)
             {
                 
                 this.MoveTime += dt;
                 var rot = this.entity.getEulerAngles();
                 if(this.MoveTime > this.MoveMaxTime)
                 {
                     this.MoveTime = 0;
                     this.Jump = false;
                     this.canControl = true;
                     this.X = this.points[this.nextIndex][0];
                     this.Y = this.points[this.nextIndex][1];
                     this.entity.setPosition(this.X,this.Y,this.entity.getPosition().z);
                     
                     this.entity.setEulerAngles(rot.x,rot.y,this.Rotation[this.nextIndex]);
                     
                     if(this.entity.getPosition().z > this.pathmanager.prefabPool[this.index].script.BoxControl.maxZ || this.entity.getPosition().z < this.pathmanager.prefabPool[this.index].script.BoxControl.minZ)
                     {
                         this.gamemanager.lose = true;
                         this.PlaySound('fall');
                     }
                     else
                     {
                         this.score++;
                         this.scoreUi.innerHTML = this.score.toString();
                         this.shadow.enabled = true;
                         
                         if(this.score%15 === 0)
                         {
                             this.PlaySound('change');
                             
                            this.canChangeColor = true;
                            var colori = Math.floor(pc.math.random(0,9));
                            if(this.colori == colori && this.colori >0)
                            {
                                this.colori -= 1;
                            }
                            else
                            {
                                this.colori = colori;
                            } 
                    
                            this.nextColor.fromString(this.Colors[this.colori]);
                        
                         }
                         
                         
                         
                         
                         if(this.score % 20 === 0)
                         {
                             if(this.MoveSpeed < 11)
                             {
                                 this.MoveSpeed += 0.5;
                             }
                         }
                         
                     }
                     
                     
                     this.nowIndex = this.nextIndex;
                     
                 }
                 else
                 {
                     //this.X = (1-this.JumpSpeed*dt)*this.X+this.JumpSpeed*dt*this.points[this.nextIndex][0];
                     //this.Y = (1-this.JumpSpeed*dt)*this.Y+this.JumpSpeed*dt*this.points[this.nextIndex][1];
                     
                    
                    var s = this.MoveTime/this.MoveMaxTime;
                    //console.log(s);
                    var X = (1-s)*(1-s)*this.X +2*(1-s)*s*this.lpoints[this.lerpindex][0]+s*s*this.points[this.nextIndex][0];
                    var Y = (1-s)*(1-s)*this.Y +2*(1-s)*s*this.lpoints[this.lerpindex][1]+s*s*this.points[this.nextIndex][1];
                    this.entity.setPosition(X,Y,this.entity.getPosition().z);
                    //console.log('X:'+this.X+',Y:'+this.Y+',NextPosX:'+ this.points[this.nextIndex][0]+',NextPosY:'+this.points[this.nextIndex][1]+',lerpX:'+this.lpoints[this.lerpindex][0]+',lerpY:'+this.lpoints[this.lerpindex][1]);
                    this.r = pc.math.lerpAngle(this.r,this.Rotation[this.nextIndex],this.RSpeed*dt);
                    this.r = this.r % 360;
                     
                    this.entity.setEulerAngles(rot.x,rot.y,this.r);
  
                 }
             }
             else
             {
                 
                 if(this.playerIndex === -1)
                 {
                     if(this.entity.getPosition().z < -5 )
                     {
                         
                         this.gamemanager.lose = true;
                         this.shadow.enabled = false;
                         this.PlaySound('fall');
                     }
                 }
                 else
                 {
                     

                     if(this.entity.getPosition().z > this.pathmanager.prefabPool[this.index].script.BoxControl.maxZ || this.entity.getPosition().z < this.pathmanager.prefabPool[this.index].script.BoxControl.minZ)
                     {
                         this.gamemanager.lose = true;
                         this.shadow.enabled  = false;
                         this.PlaySound('fall');
                     }
                 }
                 
                 
             }
             
            if(this.canChangeColor)
            {
                this.ColorChange(dt);
            }
            
            
           
            
             
        },
        
        ColorChange:function(dt)
        {
                this.timer += dt;
                if(this.timer > 3)
                {
                    this.timer = 0;
                    this.canChangeColor = false;
                }
                else
                {     
                        var color = this.BoxMat.diffuse;
                        var r = pc.math.lerp(color.r,this.nextColor.r,dt*2);
                        var g = pc.math.lerp(color.g,this.nextColor.g,dt*2);
                        var b = pc.math.lerp(color.b,this.nextColor.b,dt*2);
                        
                       //console.log('R:'+r.toFixed(3)+',G:'+g.toFixed(3)+',B:'+b.toFixed(3));
                    
                    
                    
                        this.BoxMat.diffuse = new pc.Color(r,g,b,1);
                        this.BoxMat.update();
                }
        },
        
        
        
        
        
        
        Control:function(event)
        {

            if(!this.gamemanager.start)
            {
                return;    
            }
            
            if(!this.gamemanager.startgame)
            {
                this.PlaySound('start');
                
                this.gamemanager.GameStartGame();
                
                this.tips.enabled = false;
                this.gamemanager.startgame = true;
                return;
            }
            
            
            
           if(this.gamemanager.lose)
            {
                return;
            }
            
            if(this.canControl)
            {
    
                this.shadow.enabled = false;
                this.Jump = true;
                this.canControl = false;
                
                this.PlaySound('click');
                
                if(this.playerIndex === -1)
                {
                    this.playerIndex = 0;
                }
                
                this.playerIndex = this.playerIndex % this.pathmanager.prefabnum;
                
                this.nextIndex =  this.pathmanager.prefabPool[this.playerIndex].script.BoxControl.PointIndex;
               
                this.pathmanager.SpanBox();
                
                this.playerIndex++;
                
              
                if((this.nowIndex === 0 && this.nextIndex === 7)||(this.nowIndex === 7 && this.nextIndex === 0))
                {
                    this.lerpindex = 7;
                }
                else
                {
                    this.lerpindex = this.nowIndex > this.nextIndex?this.nextIndex:this.nowIndex;
                }
               
               if(this.playerIndex === 0)
               {
                    this.index = this.pathmanager.prefabnum -1;
               }
               else
               {
                    this.index = this.playerIndex -1;
               }
                
                
            }
        },

        InitPoint:function()
        {
            var pos0 = [],pos1 = [],pos2 = [],pos3 = [],pos4 = [],pos5 = [],pos6 = [],pos7 = [];
            var lpos0 = [],lpos1 = [],lpos2 = [],lpos3 = [],lpos4 = [],lpos5 = [],lpos6 = [],lpos7 = [];
            var x = 0,y = this.ys/2+this.hs/2,Sqrt2 = Math.sqrt(2);
            var lx = 0,ly = 0;
            
            pos0.push(x);
            pos0.push(y);
            
            x = this.xs * (0.5+Sqrt2/4) + this.xd -Sqrt2/4*this.hs;
            y = 0.5*this.ys +Sqrt2/4*this.xs+Sqrt2/4*this.hs;
            pos1.push(x);
            pos1.push(y); 
            pos7.push(-x);
            pos7.push(y);
            
            x = this.xs*(0.5+Sqrt2/2)+this.xd-this.hs*0.5;
            y = this.ys*0.5+(0.5+0.5*Sqrt2)*this.xs+this.xd;
            pos2.push(x);
            pos2.push(y);
            pos6.push(-x);
            pos6.push(y);
            
            x = (Sqrt2/4+0.5)*this.xs+this.xd-Sqrt2/4*this.hs;
            y = 0.5*this.ys+(1+3/4*Sqrt2)*this.xs+2*this.xd-Sqrt2/4*this.hs;
            pos3.push(x);
            pos3.push(y);
            pos5.push(-x);
            pos5.push(y);
            
            x = 0;
            y = 2*this.xd+0.5*this.ys+(Sqrt2+1)*this.xs-0.5*this.hs;
            pos4.push(x);
            pos4.push(y);

            this.points.push(pos0);
            this.points.push(pos1);
            this.points.push(pos2);
            this.points.push(pos3);
            this.points.push(pos4);
            this.points.push(pos5);
            this.points.push(pos6);
            this.points.push(pos7);
            
            
           // var d = this.xs/4+this.xd/2+Sqrt2/4*this.xs;
            
            var pos  = this.CalLerppoint(pos0[0],pos1[0],pos0[1],pos1[1],true);
            lx = pos[0];
            ly = pos[1];
            //lx = pos0[0] +d;
            //ly = pos0[1] +this.xs/2;
            lpos0.push(lx);
            lpos0.push(ly);
            lpos7.push(-lx);
            lpos7.push(ly);
            
            pos  = this.CalLerppoint(pos1[0],pos2[0],pos1[1],pos2[1],true);
            lx = pos[0];
            ly = pos[1];
            //lx = pos2[0] -this.xs/2;
            //ly = pos2[1] -d;
            lpos1.push(lx);
            lpos1.push(ly);
            lpos6.push(-lx);
            lpos6.push(ly);
            
            pos  = this.CalLerppoint(pos2[0],pos3[0],pos2[1],pos3[1],false);
            lx = pos[0];
            ly = pos[1];
            //lx = pos2[0] -this.xs/2;
            //ly = pos2[1] +d;
            lpos2.push(lx);
            lpos2.push(ly);
            lpos5.push(-lx);
            lpos5.push(ly);
            
            
            pos  = this.CalLerppoint(pos3[0],pos4[0],pos3[1],pos4[1],false);
            lx = pos[0];
            ly = pos[1];
            //lx = pos4[0] +this.xs/2;
            //ly = pos4[1] -d;
            lpos3.push(lx);
            lpos3.push(ly);
            lpos4.push(-lx);
            lpos4.push(ly);
            
            this.lpoints.push(lpos0);
            this.lpoints.push(lpos1);
            this.lpoints.push(lpos2);
            this.lpoints.push(lpos3);
            this.lpoints.push(lpos4);
            this.lpoints.push(lpos5);
            this.lpoints.push(lpos6);
            this.lpoints.push(lpos7);
 
        },
        
       
        
        Init:function()
        {
            
            this.colori = Math.floor(pc.math.random(0,9));
            this.nextColor.fromString(this.Colors[this.colori]);
            this.BoxMat.diffuse = new pc.Color(this.nextColor.r,this.nextColor.g,this.nextColor.b,1);
            this.BoxMat.update();
            this.timer = 0;
            this.canChangeColor = false;
            
            
            this.X = this.points[0][0];
            this.Y = this.points[0][1];
            this.entity.setPosition(this.X,this.Y,4);
            this.entity.setEulerAngles(0,0,0);
            
            this.MoveTime = 0;
            this.Jump = false;
            this.canControl = true;
            this.nowIndex = 0;
            this.nextIndex = 0;
            this.r = 0;
            this.playerIndex = -1;
            this.score = 0;
            this.index = 0;
            this.MoveSpeed = 7;
            this.shadow.enabled = true;
            this.tips.enabled = true;
        },
        
        
        PlaySound:function(name)
        {
            this.entity.sound.slot(name).play();
            
        },
        
        
        
        RenderJumpCurve:function()
        {
            
            
            for(var i = 0;i<7;i++)
            {
                var points = [];
                var colors = [];
                var x = 0;
                var y = 0;
                var s = 0;
                while(s <= 1)
                {
                
                    x  = (1-s)*(1-s)*this.points[7-i][0] +2*(1-s)*s*this.lpoints[6-i][0]+s*s*this.points[6-i][0];
                    y  = (1-s)*(1-s)*this.points[7-i][1] +2*(1-s)*s*this.lpoints[6-i][1]+s*s*this.points[6-i][1];
                    var v = new pc.Vec3(x,y,4);
                    //console.log(v.toString());
                    points.push(v);
                
                    var c = new pc.Color(1,0,0);
                    colors.push(c);
                
                    s += 0.056;
                
                }
            
                app.renderLines(points,colors); 
            }
           
             var points1 = [];
             var colors1 = [];
             var x1 = 0;
             var y1 = 0;
             var s1 = 0;
             while(s1 <= 1)
             {

                x1  = (1-s1)*(1-s1)*this.points[0][0] +2*(1-s1)*s1*this.lpoints[7][0]+s1*s1*this.points[7][0];
                y1  = (1-s1)*(1-s1)*this.points[0][1] +2*(1-s1)*s1*this.lpoints[7][1]+s1*s1*this.points[7][1];
                var v1 = new pc.Vec3(x1,y1,4);
                
                points1.push(v1);
                
                var c1 = new pc.Color(1,0,0);
                colors1.push(c1);
                
                s1 += 0.056;
                
             }
            
             app.renderLines(points1,colors1);
            
            
        },
        
        
        CalLerppoint:function(x1,x2,y1,y2,big)
        {
            var a = x2-x1;
            var b = y2-y1;
            var c = x1 +x2;
            var d = y1+y2;
            
            var x = this.lerpD/Math.sqrt(1+(a/b)*(a/b))+c/2;
            var y = -a/b*(x-c/2)+d/2;
            
            if(big)
            {
                if(y < b/a*x+y1-b/a*x1)
                {
                    x = -this.lerpD/Math.sqrt(1+(a/b)*(a/b))+c/2;
                    y = -a/b*(x-c/2)+d/2;
                }
            
            }
            else
            {
                if(y > b/a*x+y1-b/a*x1)
                {
                    x = -this.lerpD/Math.sqrt(1+(a/b)*(a/b))+c/2;
                    y = -a/b*(x-c/2)+d/2;
                }
            }
            
            var pos = [];
            pos.push(x);
            pos.push(y);
            
            return pos;
        }
        
    
        
        
        
        
        
        
    };

    return GameControl;
});