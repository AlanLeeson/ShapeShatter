"user strict"

var app = app || {};

app.Particle = function(){

	var Particle = function(x,y,col){
		this.type = "particle";
		this.location = vec2.fromValues(x,y);
		this.velocity = vec2.fromValues(Math.round(Math.random()) * 4 - 2,Math.round(Math.random()) * 4 - 2);
		this.acceleration = vec2.create();
		this.col = col;
		this.opacity = 1.0;
		this.remove = false;
	};
	
	var p = Particle.prototype;
	
	p.update = function(){
		//add velocity to location
		vec2.add(this.location,this.location,this.velocity);

		this.opacity -= 0.02;
		if(this.opacity <= 0.0){
			this.remove = true;
		}
	};
	
	p.render = function(ctx){
		app.draw.circle(ctx,this.location[0],this.location[1],2,this.col);
	};
	
	p.applyForce = function(force){
		//divide the force by the mass
		force = vec2.fromValues(force[0]/this.mass,force[1]/this.mass);
		//add the force to acceleration
		vec2.add(this.acceleration, this.acceleration, force);
	};
	
	return Particle;

}();