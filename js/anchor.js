"use strict"

var app = app || {}

app.Anchor = function(){

	var Anchor = function(x,y,col){
		this.type = 'anchor';
		this.clicked = false;
		this.radius = 10.0;
		this.location = vec2.fromValues(x,y);
		this.velocity = vec2.create();
		this.acceleration = vec2.create();
		this.dragOffset = vec2.create();
		this.mass = 24.0;
		this.gravity = vec2.fromValues(0,9.8);
		this.dampening = 0.95;
		this.ySpeed = Math.random() + 1;
		this.offest = 0;
		this.time = 0;
	};
	
	var p = Anchor.prototype;
	
	p.update = function(){
		this.applyForce(this.gravity);
		//add acceleration to velocity
		vec2.add(this.velocity,this.velocity,this.acceleration);
		//multiply the velocity by dampening value
		this.velocity = vec2.fromValues(this.velocity[0]*this.dampening,
								this.velocity[1]*this.dampening);
		//add velocity to location
		vec2.add(this.location,this.location,this.velocity);
		
		//Zero the acceleration
		this.acceleration = vec2.create();
		
		//check the rest of the world.
		this.checkWorld();
	};
	
	p.applyForce = function(force){
		//divide the force by the mass
		force = vec2.fromValues(force[0]/this.mass,force[1]/this.mass);
		//add the force to acceleration
		vec2.add(this.acceleration, this.acceleration, force);
	};
	
	p.checkWorld = function(){
		if(this.location[1] >= app.shapeShatter.HEIGHT){
			//this.location[1] = 0;
			//this.reset();	
		}
	};
	
	p.reset = function(){
		this.velocity = vec2.create();
		this.acceleration = vec2.create();
	};
	
	p.render = function(ctx){
		var color = undefined;
		if(!this.clicked){
			color = "rgba(255,0,0,0.5)";
		}else{
			color = "#f00";
		}
		app.draw.circle(ctx,this.location[0],this.location[1],this.radius,color);
	};
	
	return Anchor;

}();