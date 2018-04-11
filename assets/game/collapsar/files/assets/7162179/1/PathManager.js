var PathManager = pc.createScript('PathManager');
PathManager.attributes.add('polygontexs',{type:'asset',array:true});
PathManager.attributes.add('playermat',{type:'asset'});
PathManager.attributes.add('changetex',{type:'asset'});
// initialize code called once per entity
PathManager.prototype.initialize = function() {
    
    var app = this.app;
    var player = app.root.findByName('player');
    this.playercontrol = player.script.PlayerControl;
    var manager = app.root.findByName('Manager');
    this.gamemanager = manager.script.GameStateManager;
    
    this.r = this.playercontrol.rmiddle; 
    this.ChangeTex = app.assets.get(this.changetex.id).resource;
    this.PlayerMat = app.assets.get(this.playermat.id).resource;
    this.PolygonTexs = [];
    this.count = this.polygontexs.length;
    for(var i=0;i<this.count;i++)
    {
        var tex = app.assets.get(this.polygontexs[i].id).resource;
        this.PolygonTexs.push(tex);
    }
    
    this.PolygonColors = [];
    var red = new pc.Color().fromString('#c40558');
    this.PolygonColors.push(red);
    var green = new pc.Color().fromString('#97c405');
    this.PolygonColors.push(green);
    var blue = new pc.Color().fromString('#6405c4');
    this.PolygonColors.push(blue);
    var yellow = new pc.Color().fromString('#05c0c4');
    this.PolygonColors.push(yellow);
    this.levelcount = 4;
    
    this.level = 0;
    this.levelchangecount = 0;
    this.movecount = 4;
    this.playerrow = 0;
    this.playercol = 0;
    this.polymovespeed = 30;
    this.rotatedir = -1;
    this.canMove = true;
    this.changeangle = 0;
    this.changeok = false;
    
    this.CreatePrefabs();
    this.InitPlayerStyle();
    
};

PathManager.prototype.update = function(dt) {
    if(!this.gamemanager.start || !this.gamemanager.startgame || this.gamemanager.lose)
    {
        return;
    }
    this.PolygonMove(dt);
    
};

PathManager.prototype.CreatePrefabs = function(){
  
    var app = this.app;
    var mat = null,polygonparam = null,mats = [];
    this.PolygroupControls = [];
    
    var prefab = app.root.findByName('prefab');
    var children = prefab.children;
    var d = this.playercontrol.rmax-this.playercontrol.rmiddle;
    children[0].setLocalPosition(-d,0,0);
    children[1].setLocalPosition(0,0,0);
    children[2].setLocalPosition(d,0,0);
    for(var i=0;i<children.length;i++)
    {
        mat = this.PlayerMat.clone();
        children[i].model.model.meshInstances[0].material = mat;
        mats.push(mat);
    }
    prefab.enabled = false;
    polygonparam = {
            obj:prefab,
            angle:0,
            hastrigger:false,
            mats:mats,
            rows:[0,0,0],
            cols:[0,0,0],
            changeplayer:false,
            canMove:true
    };
    this.PolygroupControls.push(polygonparam);
    
    for(var i = 1;i<this.levelcount;i++)
    {
        var obj = prefab.clone();
        children = obj.children;
        mats =[];
        for(var j=0;j<children.length;j++)
        {
            mat = this.PlayerMat.clone();
            children[j].model.model.meshInstances[0].material = mat;
            mats.push(mat);
        }
        app.root.addChild(obj);
        polygonparam = {
            obj:obj,
            hastrigger:false,
            angle:0,
            mats:mats,
            rows:[0,0,0],
            cols:[0,0,0],
            changeplayer:false,
            canMove:true
        };
        this.PolygroupControls.push(polygonparam);
    }
};

PathManager.prototype.InitPlayerStyle  = function(){
    
    this.PolygroupControls[0].obj.enabled = true;
    this.playerrow = Math.floor(pc.math.random(0,this.count));
    this.playercol = Math.floor(pc.math.random(0,this.count));
    this.PlayerMat.opacityMap = this.PolygonTexs[this.playerrow];
    this.PlayerMat.emissive = this.PolygonColors[this.playercol];
    this.PlayerMat.update();
    console.log('row:'+this.playerrow+' ,col:'+this.playercol);
    this.movecount = 1;
    for(var i=0;i<this.levelcount;i++)
    {
        var polygonparam = this.PolygroupControls[i];
        polygonparam.canMove = true;
        polygonparam.changeplayer = false;
        if(i >= this.movecount)
        {
            polygonparam.obj.enabled = false;
            continue;
        }
        this.SetPolygonStyle(polygonparam);
        polygonparam.angle = 180;
        var rangle = polygonparam.angle*pc.math.DEG_TO_RAD;
        var x = this.r*Math.cos(rangle),
            y = this.r*Math.sin(rangle);
        polygonparam.obj.setEulerAngles(0,0,polygonparam.angle);
        polygonparam.obj.setPosition(x,y,0);
        polygonparam.obj.enabled = true;
    }

};

PathManager.prototype.SetPlayerStyle = function(count){
    var  polygonparam0 = this.PolygroupControls[0],polygonparam1 = this.PolygroupControls[1],
         polygonparam2 = this.PolygroupControls[2];
    var rowindex = 0,colindex =0,rowcount = 0,colcount =0,roworcol = pc.math.random(0,1);
    switch(count)
    {
        case 2:
            
            rowcount = polygonparam0.rows.length;
            colcount = polygonparam0.cols.length;
            rowindex = Math.floor(pc.math.random(0,rowcount));
            colindex = Math.floor(pc.math.random(0,colcount));
            if(roworcol)
            {
                this.playerrow = polygonparam0.rows[rowindex];
                this.playercol = polygonparam1.cols[colindex];
            }
            else
            {
                this.playerrow = polygonparam1.rows[rowindex];
                this.playercol = polygonparam0.cols[colindex];
            }        
            
            break;
        case 3:
            var rows = [],cols =[];
            for(var i=0;i<3;i++)
            {
                if(roworcol)
                {
                    for(var j=0;j<3;j++)
                    {
                        if(polygonparam0.rows[i] === polygonparam1.rows[j])
                        {
                            rows.push(polygonparam0.rows[i]);
                        }
                        if(polygonparam1.cols[i] === polygonparam2.cols[j])
                        {
                            cols.push(polygonparam1.cols[i]);
                        }
                    }
                    
                }
                else
                {
                    for(var j =0;j<3;j++)
                    {
                       if(polygonparam1.rows[i] === polygonparam2.rows[j])
                        {
                            rows.push(polygonparam1.rows[i]);
                        }
                        if(polygonparam0.cols[i] === polygonparam1.cols[j])
                        {
                            cols.push(polygonparam1.cols[i]);
                        }  
                    }
                   
                } 
            }
            rowcount = rows.length;
            colcount = cols.length;
            rowindex = Math.floor(pc.math.random(0,rowcount));
            colindex = Math.floor(pc.math.random(0,colcount));
            this.playerrow = rows[rowindex];
            this.playercol = cols[colindex];

            break;
        default:
            break;
            
    }
    
    this.PlayerMat.opacityMap = this.PolygonTexs[this.playerrow];
    this.PlayerMat.emissive = this.PolygonColors[this.playercol];
    this.PlayerMat.update();
    
};

PathManager.prototype.SetPolygonStyle = function(polygonparam){

    var orders = [];
    var roworcol = pc.math.random(0,1)>0.5;
    var rows = [], cols = [];
    var rowcount = this.count-1,colcount = this.count-1;
    
    for(var i=0;i<this.count;i++)
    {
        if(i !== this.playerrow)
        {
            rows.push(i);    
        }
        if(i !== this.playercol)
        {
            cols.push(i);
        }
    }
    var rowindex = 0,colindex = 0,index =0;
    if(roworcol)
    {   
        rowindex = this.playerrow;
        while(colcount > 0)
        {
            index = Math.floor(pc.math.random(0,colcount));
            colindex = cols[index];
            orders.push([rowindex,colindex]);
            cols.splice(index,1);
            index = Math.floor(pc.math.random(0,rowcount));
            rowindex = rows[index];
            rows.splice(index,1);
            rowcount--;
            colcount--;
        }
    }
    else
    {
        colindex = this.playercol;
        while(rowcount > 0)
        {
            index = Math.floor(pc.math.random(0,rowcount));
            rowindex = rows[index];
            orders.push([rowindex,colindex]);
            rows.splice(index,1);
            index = Math.floor(pc.math.random(0,colcount));
            colindex = cols[index];
            cols.splice(index,1);
            rowcount--;
            colcount--;
        }
    } 
    
    var polymats = polygonparam.mats,polyrows = polygonparam.rows,polycols = polygonparam.cols;
    var radomindexs = [0,1,2],randomlength = 3;
    for(var i=0;i<3;i++)
    {
        index = Math.floor(pc.math.random(0,randomlength));
        polyrows[i] = orders[index][0];
        polycols[i] = orders[index][1];
        polymats[i].opacityMap = this.PolygonTexs[polyrows[i]];
        polymats[i].emissiveMap = null;
        polymats[i].emissive = this.PolygonColors[polycols[i]];
        polymats[i].update();
        orders.splice(index,1);
        randomlength --;
    }
    
};

PathManager.prototype.PolygonMove = function(dt){
    
    for(var i=0;i<this.movecount;i++)
    {
        
        var polygonparam = this.PolygroupControls[i];
        
        if(polygonparam.changeplayer)
        {
            var children = polygonparam.obj.children;
            for(var j=0;j<3;j++)
            {
                children[j].rotateLocal(0,180*dt,0);
            }
        }
        
        
        
        if(this.canMove && polygonparam.canMove)
        {
            if(this.level === 4 && i !== 0)
            {
                if(this.changeangle > 0)
                {
                    this.changeangle -= this.polymovespeed*dt;
                    polygonparam.angle += this.rotatedir*this.polymovespeed*dt;
                }
                else
                {
                    if(!this.PolygroupControls[0].canMove)
                    {
                        this.PolygroupControls[0].canMove = true;
                    }
                }
            }
            
            if(this.level === 11)
            {
                if(this.changeangle > 0)
                {
                    this.changeangle -= this.polymovespeed*dt;
                    if(this.changeangle < 30)
                    {
                        this.PolygroupControls[1].canMove = false;
                    }
                    polygonparam.angle += this.rotatedir*this.polymovespeed*dt;
                }
                else
                {
                    if(!this.PolygroupControls[0].canMove)
                    {
                        this.PolygroupControls[0].canMove = true;
                    }
                    if(!this.PolygroupControls[1].canMove)
                    {
                        this.PolygroupControls[1].canMove = true;
                    }
                }
            }
            polygonparam.angle += this.rotatedir*this.polymovespeed*dt;
            polygonparam.angle %= 360;
            polygonparam.angle = polygonparam.angle<0?polygonparam.angle+360:polygonparam.angle;
            var rangle = polygonparam.angle*pc.math.DEG_TO_RAD;
            var x = this.r*Math.cos(rangle),
                y = this.r*Math.sin(rangle);
            polygonparam.obj.setEulerAngles(0,0,polygonparam.angle);
            polygonparam.obj.setPosition(x,y,0.1);
        }
        
        var dis = Math.abs(polygonparam.angle-this.playercontrol.angle);
        if(dis < 7 || dis > 353 )
        {
            if(!polygonparam.hastrigger)
            {
                var index = this.playercontrol.posindex;

                if(polygonparam.changeplayer)
                {
                    this.playercontrol.PlaySound('change');
                    this.SetPlayerStyle(this.levelchangecount);
                }
                else
                {
                   if(polygonparam.rows[index] === this.playerrow || polygonparam.cols[index] === this.playercol)
                   {
                        this.playercontrol.PlaySound('get');
                        this.SetPolygonStyle(polygonparam);
                        changelevel  = this.playercontrol.AddScore();
                        if(changelevel)
                        {
                            this.SetLevel();
                        }
                    }
                    else
                    {
                        this.playercontrol.LoseGame();
                    }
                }
                
                polygonparam.hastrigger = true;
            }
        }
        else
        {
            polygonparam.hastrigger = false;
        }
    }
 
};

PathManager.prototype.SetPolygonCanChangeStyle = function(polygonparam)
{
    var polymats = polygonparam.mats;
    for(var i=0;i<polymats.length;i++)
    {
        polymats[i].opacityMap = this.ChangeTex;
        polymats[i].emissiveMap = this.ChangeTex; 
        polymats[i].update(); 
    }
    polygonparam.changeplayer = true;
    
};

PathManager.prototype.SetLevel = function(){
    this.level ++;
    if(this.level > 15)
    {
        var polygonchangecount = (this.level -15)%4;
        switch(polygonchangecount)
        {
            case 1:
                this.canMove = false;
                break;
            case 2:
                this.canMove = true;
                this.rotatedir = -1;
                break;
            case 3:
                this.canMove = false;
                break;
            case 0:
                this.canMove = true;
                this.rotatedir = 1;
                break;
        }
        return;
    }
    
    var  polygonparam0 = this.PolygroupControls[0],polygonparam1 = this.PolygroupControls[1],
         polygonparam2 = this.PolygroupControls[2],polygonparam3 = this.PolygroupControls[3];
    var rangle = 0,x=0,y=0;
    switch(this.level)
    {
        case 1:
            this.rotatedir = 1;
            this.movecount = 2;
            this.SetPolygonStyle(polygonparam1);
            polygonparam1.angle = polygonparam0.angle+180;
            polygonparam1.angle %= 360;
            rangle = polygonparam1.angle*pc.math.DEG_TO_RAD;
            x = this.r*Math.cos(rangle);
            y = this.r*Math.sin(rangle);
            polygonparam1.obj.setEulerAngles(0,0,polygonparam1.angle);
            polygonparam1.obj.setPosition(x,y,0.1);
            polygonparam1.obj.enabled = true;
            break;
        case 2:
            this.canMove = false;
            break;
        case 3:
            this.canMove = true;
            this.rotatedir = -1;
            break;
        case 4:
            this.playercontrol.rotatespeed = 90;
            this.rotatedir = 1;
            this.movecount = 3;
            this.changeangle = 60;
            this.levelchangecount = 2;
            
            polygonparam0.canMove = false;
            polygonparam2.changeplayer = true;
            this.SetPolygonCanChangeStyle(polygonparam2);
            polygonparam2.angle = polygonparam1.angle-120;
            polygonparam2.angle %= 360;
            rangle = polygonparam2.angle*pc.math.DEG_TO_RAD;
            x = this.r*Math.cos(rangle);
            y = this.r*Math.sin(rangle);
            polygonparam2.obj.setEulerAngles(0,0,polygonparam2.angle);
            polygonparam2.obj.setPosition(x,y,0.1);
            polygonparam2.obj.enabled = true;
            break;
        case 5:
            this.canMove = false;
            break;
        case 6:
            this.canMove = true;
            this.rotatedir = -1;
            break;
        case 7:
            this.canMove = false;
            break;
        case 8:
            this.canMove = true;
            this.rotatedir = 1;
            polygonparam2.changeplayer = false;
            var children = polygonparam2.obj.children;
            for(var j=0;j<3;j++)
            {
                children[j].setLocalEulerAngles(90,0,0);
            }
            this.SetPolygonStyle(polygonparam2);
            break;
        case 9:
            this.canMove = false;
            break;
        case 10:
            this.canMove = true;
            this.rotatedir = -1;
            break;
        case 11:
            this.rotatedir = 1;
            this.movecount = 4;
            this.changeangle = 60;
            this.levelchangecount = 3;
            
            polygonparam0.canMove = false;
            polygonparam3.changeplayer = true;
            this.SetPolygonCanChangeStyle(polygonparam3);
            polygonparam3.angle = polygonparam2.angle-90;
            polygonparam3.angle %= 360;
            rangle = polygonparam3.angle*pc.math.DEG_TO_RAD;
            x = this.r*Math.cos(rangle);
            y = this.r*Math.sin(rangle);
            polygonparam3.obj.setEulerAngles(0,0,polygonparam3.angle);
            polygonparam3.obj.setPosition(x,y,0.1);
            polygonparam3.obj.enabled = true;
            break;
        case 12:
            this.canMove = false;
            break;
        case 13:
            this.canMove = true;
            this.rotatedir = -1;
            break;
        case 14:
            this.canMove = false;
            break;
        case 15:
            this.canMove = true;
            this.rotatedir = 1;
            polygonparam3.changeplayer = false;
            var children = polygonparam3.obj.children;
            for(var j=0;j<3;j++)
            {
                children[j].setLocalEulerAngles(90,0,0);
            }
            this.SetPolygonStyle(polygonparam3);
            break;
        default:
            break;
    }
    
};

PathManager.prototype.Init = function(){

    this.level = 0;
    this.playerrow = 0;
    this.playercol = 0;
    this.polymovespeed = 30;
    this.rotatedir = -1;
    this.canMove = true;
    this.changeok = false;
    this.changeangle = 0;
    this.InitPlayerStyle();
};





