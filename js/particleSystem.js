"use strict"

var app = app || {};

app.ParticleSystem = function(){

	var ParticleSystem = function(x,y,num,col){
		this.type = "particleSystem";
		this.particles = [];
		this.x = x;
		this.y = y;
		this.col = col;
		this.remove = false;
		this.populateSystem(4);
	};
	
	var p = ParticleSystem.prototype;
	
	p.update = function(){
		if(this.particles.length <= 1){
			this.remove = true;
		}
		
		for(var i = 0; i < this.particles.length; i++){
			this.particles[i].update();
			
			if(this.particles[i].remove){
				this.particles.splice(i,1);
    			i -= 1;
			}
		}
	}
	
	p.render = function(ctx){
		for(var i = 0; i < this.particles.length; i++){
			this.particles[i].render(ctx);
		}
	}
	
	p.populateSystem = function(num){
		for(var i = 0; i < num; i ++){
			this.particles.push(new app.Particle(this.x,this.y,this.col));
		}
	};
	
	return ParticleSystem;

}();