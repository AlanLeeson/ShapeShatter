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
		this.col = "#00f";
		this.remove = false;
	};
	
	var p = Shape.prototype;
	
	p.render = function(ctx){
		app.draw.polygon(ctx,this.location[0],this.location[1],this.radius,this.sides,this.col);
	};
	
	p.update = function(targetAnchor,enemyAnchor){
		this.seek(targetAnchor);
		vec2.add(this.velocity,this.velocity,this.acceleration);
		vec2.add(this.location,this.location,this.velocity);
		this.acceleration = vec2.create();
		if(this.checkAnchorCollision(enemyAnchor)){
			this.remove = true;
		}
		else if(this.checkAnchorCollision(targetAnchor)){
			app.shapeShatter.pause = true;
		}
	};
	
	p.seek = function(target){
		var desired = vec2.create();
		vec2.subtract(desired,target.location,this.location);
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
	
	p.checkAnchorCollision = function(anchor){
		var dx = anchor.location[0] - this.location[0];
		var dy = anchor.location[1] - this.location[1];
		var distance = Math.sqrt(dx*dx + dy*dy);
		return distance < anchor.radius + this.radius;
	};
	
	return Shape;
	
}();