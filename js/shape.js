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
		this.col = "#00F";
		this.points = 10;
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
			app.shapeShatter.entities.push(new app.ParticleSystem(this.location[0],this.location[1],this.sides,this.col));
			app.shapeShatter.entities.push(new app.ScreenText(this.location[0],this.location[1],this.sides + "pts.",12,"#50,25,200"));
			this.remove = true;
		}
		else if(this.checkAnchorCollision(targetAnchor)){
			//app.shapeShatter.pause = true;
		}
		this.findDistance(app.shapeShatter.rope);
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
	
	//calculate shortest distance between centerpoint and rope line for collision
	p.findDistance = function(rope){
		var ptX = this.location[0];
		var ptY = this.location[1];
		//console.log(rope.anchor1.location[0]);
		var p1X = rope.anchor1.location[0];
		var p2X = rope.anchor2.location[0];
		var p1Y = rope.anchor1.location[1];
		var p2Y = rope.anchor2.location[1];
		
		var dx = p2X - p1X;
		var dy = p2Y - p1Y;
		
		//if it's a point rather than a segment
		if((dx == 0) && (dy == 0)){
			var closest = {x: p1X, y: p1Y};
			dx = ptX - p1X;
			dy = ptY - p1Y;
			return Math.sqrt(dx * dx + dy * dy);
		}
		
		//calculate the t that minimizes the distance
		var t = ((ptX - p1X) * dx + (ptY - p1Y) * dy) / (dx * dx + dy * dy);
		
		//see if this represents one of the segment's end points or a point in the middle.
		if(t < 0){
			var closest = {x: p1X, y: p1Y};
			dx = ptX - p1X;
			dy = ptY - p1Y;
		} else if(t > 1){
			var closest = {x: p2X, y: p2Y};
			dx = ptX - p2X;
			dy = ptY - p2Y;
		} else {
			var closest = {x: p1X + t * dx, y: p1Y + t * dy};
			dx = ptX - closest.x;
			dy = ptY - closest.y;
		}
		
		var leastDistance = Math.sqrt(dx * dx + dy * dy);
		//return Math.sqrt(dx * dx + dy * dy);
		
		if(leastDistance < this.radius){
			app.shapeShatter.entities.push(new app.ParticleSystem(this.location[0],this.location[1],this.sides,this.col));
			this.remove = true;
		}
		
	}
	
	
	return Shape;
	
}();