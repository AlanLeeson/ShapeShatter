"use strict"

var app = app || {};

app.Shape = function(){
	
	var Shape = function(x,y,s){
		this.type = "shape";
		this.location = vec2.fromValues(x,y);
		this.velocity = vec2.create();
		this.acceleration = vec2.create();
		this.sides = s;
		this.radius = 5;
		this.maxSpeed = 4;
		this.maxForce = 0.1;
		this.mass = 2;
	};
	
	var p = Shape.prototype;
	
	p.render = function(ctx){
		app.draw.polygon(ctx,this.location[0],this.location[1],this.radius,this.sides,"#00f");
	};
	
	p.update = function(anchor){
		this.seek(anchor);
		vec2.add(this.velocity,this.velocity,this.acceleration);
		vec2.add(this.location,this.location,this.velocity);
		this.acceleration = vec2.create();
	};
	
	p.seek = function(target){
		var desired = vec2.create();
		vec2.subtract(desired,target,this.location);
		vec2.normalize(desired,desired);
		vec2.scale(desired,desired,this.maxSpeed);
		var steer = vec2.create();
		vec2.subtract(steer,desired,this.velocity);
		vec2.scale(steer,steer,this.maxForce);
		this.applyForce(steer);
	};
	
	p.applyForce = function(force){
		//divide the force by the mass
		force = vec2.fromValues(force[0]/this.mass,force[1]/this.mass);
		//add the force to acceleration
		vec2.add(this.acceleration, this.acceleration, force);
	};
	
	return Shape;
	
}();