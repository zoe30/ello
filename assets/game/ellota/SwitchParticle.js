pc.script.attribute("particle1","entity",null);
pc.script.attribute("particle2","entity",null);

pc.script.create('SwitchParticle', function (app) {

    
    // Creates a new SwitchParticle instance
    var SwitchParticle = function (entity) 
    {
        this.entity = entity;
        
    };

    SwitchParticle.prototype = {
        
        initialize: function () 
        {
            this.timer = 0;
            this.play1 = true;
            this.particle1.particlesystem.play();
        },

        update: function (dt) 
        {
            this.timer += dt;
            
            if(this.timer > 2.5)
            {
               
                if(this.play1)
                {
                    this.particle1.particlesystem.stop();
                    this.particle2.particlesystem.play();
                    this.play1 = false;
                }
                else
                {
                    this.particle2.particlesystem.stop();
                    this.particle1.particlesystem.play();
                    this.play1 = true;
                    
                }
                this.timer = 0;
            }
        }
    };

    return SwitchParticle;
});