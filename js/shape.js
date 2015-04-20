"use strict"

var app = app || {};

app.Shape = function(){
	
	var Shape = function(x,y,s){
		this.type = "shape";
		this.shape = "something";
		this.location = vec2.fromValues(x,y);
		this.velocity = vec2.create();
		this.acceleration = vec2.create();
		this.sides = s;
		this.radius = 5;
		this.maxSpeed = s; //speed relative to numsides
		this.maxForce = 0.1;
		this.shatterSound = new Audio('sound/shatter.wav');
		this.shatterSound.volume = 0.3;
		this.shatterSound.loop = false;
		this.smashSound = new Audio('sound/smash.wav');
		this.smashSound.volume = 0.4;
		this.smashSound.loop = false;
		this.deathSound = new Audio('sound/death.wav');
		this.deathSound.volume = 1;
		this.deathSound.loop = false;
		
		this.mass = 2;
		//color based on num sides
		if(this.sides == 3){
			this.col = "#00F";
		} else if(this.sides == 4){
			this.col = "yellow";
		} else if(this.sides == 5){
			this.col = "purple";
		} else if(this.sides == 6){
			this.col = "orange";
			this.maxSpeed = 1;
			this.radius = 10;
		} else if(this.sides > 6){
			this.col = "black";
			this.radius = 9;
		}
		this.points = s; //points relative to numsides
		this.remove = false;
		this.targetAnchor = undefined;
		this.enemyAnchor = undefined;
	};
	
	var p = Shape.prototype;
	
	p.render = function(ctx){
		app.draw.polygon(ctx,this.location[0],this.location[1],this.radius,this.sides,this.col);
	};
	
	p.update = function(targetAnchor,enemyAnchor){
		this.targetAnchor = targetAnchor;
		this.enemyAnchor = enemyAnchor;
		this.seek(targetAnchor);
		vec2.add(this.velocity,this.velocity,this.acceleration);
		vec2.add(this.location,this.location,this.velocity);
		this.acceleration = vec2.create();
		if(this.checkAnchorCollision(enemyAnchor)){
			this.doMultiplierAnchor();
		}
		else if(this.checkAnchorCollision(targetAnchor)){
			if(app.shapeShatter.gameMode === app.shapeShatter.MODE_INFINITE)
			{
				app.shapeShatter.pause = true;
			}else if(app.shapeShatter.gameMode === app.shapeShatter.MODE_PRACTICE){
			
			}else if(app.shapeShatter.gameMode === app.shapeShatter.MODE_HARDCORE){
				app.shapeShatter.returnToMenu();
			}
			app.shapeShatter.multiplier = 0;
			this.deathSound.play();
		}
		for(var i = 0; i < app.shapeShatter.ropes.length; i++){
			this.findDistance(app.shapeShatter.ropes[i]);
		}
		if(this.sides == 6){
			if(parseInt(Math.random()*33 + 33) == 33){
				this.shape = new app.Shape(this.location[0], this.location[1], 3);
				this.shape2 = new app.Shape(this.location[0], this.location[1], 3);
				this.shape3 = new app.Shape(this.location[0], this.location[1], 3);
				app.shapeShatter.entities.push(this.shape);
				app.shapeShatter.entities.push(this.shape2);
				app.shapeShatter.entities.push(this.shape3);
			}
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
			this.doRopeCollision();
		}
		
	};
	
	p.doMultiplierAnchor = function(){
		app.shapeShatter.entities.push(new app.ParticleSystem(this.location[0],this.location[1],this.sides,this.col));
		var points = app.shapeShatter.multiplier * this.sides;
		app.shapeShatter.score += points;
		app.shapeShatter.entities.push(new app.ScreenText(
			this.location[0]-points*2,this.location[1],points + "pts.",points*2,"#50,25,200"));
		app.shapeShatter.multiplier = 1;
		this.enemyAnchor.minorExplosion = true;
		this.enemyAnchor.explosionRadiusMax = this.enemyAnchor.radius + (app.shapeShatter.multiplier * 15);
		this.remove = true;
		this.smashSound.play();
	};
	
	p.doRopeCollision = function(){
		app.shapeShatter.entities.push(new app.ParticleSystem(this.location[0],this.location[1],this.sides,this.col));
		app.shapeShatter.multiplier += 1;
		if(app.shapeShatter.multiplier >= 9){
			app.shapeShatter.multiplier = 9;
		}
		this.remove = true;
		this.shatterSound.play();
	};
	
	return Shape;
	
}();