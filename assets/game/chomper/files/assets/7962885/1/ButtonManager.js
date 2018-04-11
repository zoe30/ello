var ButtonManager = pc.createScript('buttonManager');
ButtonManager.attributes.add("leftEntity",{type:"entity",default:null});
ButtonManager.attributes.add("rightEntity",{type:"entity",default:null});
ButtonManager.attributes.add("leftdownMat",{type:"asset",default:null});
ButtonManager.attributes.add("leftupMat",{type:"asset",default:null});
ButtonManager.attributes.add("rightdownMat",{type:"asset",default:null});
ButtonManager.attributes.add("rightupMat",{type:"asset",default:null});
// initialize code called once per entity
ButtonManager.prototype.initialize = function() {
    this.halfwidth=window.innerWidth/2; //判断点击左右时使用
    var self=this;
    //横竖屏转换时，重新获取innerWidth/2
    window.addEventListener("resize",function(e){
        self.halfwidth=window.innerWidth/2;
    });
    
    //点击事件检测
    if(this.app.touch){
        this.app.touch.on(pc.EVENT_TOUCHSTART,this.onTouchStart,this);
        this.app.touch.on(pc.EVENT_TOUCHEND,this.onTouchEnd,this);
    }else{
        this.app.mouse.on(pc.EVENT_MOUSEDOWN,this.onTouchStart,this);
        this.app.mouse.on(pc.EVENT_MOUSEUP,this.onTouchEnd,this);
    }
    
    this.leftDownMat=this.leftdownMat.resource;
    this.leftUpMat=this.leftupMat.resource;
    this.rightDownMat=this.rightdownMat.resource;
    this.rightUpMat=this.rightupMat.resource;
};

// update code called every frame
ButtonManager.prototype.update = function(dt) {
    if(STATUS==="tipshow" || STATUS==="gaming"){
        this.leftEntity.enabled=true;
        this.rightEntity.enabled=true;
    }
    
    if(STATUS==="gameover"){
        this.leftEntity.enabled=false;
        this.rightEntity.enabled=false;
    }
};

ButtonManager.prototype.onTouchStart=function(e){
    if(STATUS==="gaming"){
        e.event.preventDefault();
    }
    
    if(this.app.touch){
        var touches=e.changedTouches;
        if(touches[0].x>this.halfwidth){
            //点击了右边
            this.rightEntity.model.meshInstances[0].material=this.rightDownMat;
        }else{
            //点击了左边
            //clickLeft=true;
            this.leftEntity.model.meshInstances[0].material=this.leftDownMat;
        }
    }else{
        if(e.x>this.halfwidth){
            //点击了右边
            this.rightEntity.model.meshInstances[0].material=this.rightDownMat;
        }else{
            //点击了左边
            //clickLeft=true;
            this.leftEntity.model.meshInstances[0].material=this.leftDownMat;
        }
    }
};

ButtonManager.prototype.onTouchEnd=function(e){
    if(STATUS==="gaming"){
        e.event.preventDefault();
    }
    
    if(this.app.touch){
        var touches=e.changedTouches;
        if(touches[0].x>this.halfwidth){
            //点击了右边
            this.rightEntity.model.meshInstances[0].material=this.rightUpMat;
        }else{
            //点击了左边
            //clickLeft=true;
            this.leftEntity.model.meshInstances[0].material=this.leftUpMat;
        }
    }else{
        if(e.x>this.halfwidth){
            //点击了右边
            this.rightEntity.model.meshInstances[0].material=this.rightUpMat;
        }else{
            //点击了左边
            //clickLeft=true;
            this.leftEntity.model.meshInstances[0].material=this.leftUpMat;
        }
    }
};
