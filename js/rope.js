"use strict"

var app = app || {}

app.Rope = function(){

	var Rope = function(a1,a2){
		this.type = "rope";
		this.restLength = 100;
		this.anchor1 = a1;
		this.anchor2 = a2;
		this.start = a1.location;
		this.end = a2.location;
		this.k = 1.0;
	};
	
	var p = Rope.prototype;
	
	p.update = function(){
		this.calcSpringForce();
		if(this.anchor1.clicked == true)
		this.constrainLength(10,100,this.anchor1,this.anchor2);
		else if(this.anchor2.clicked == true)
		this.constrainLength(10,100,this.anchor2,this.anchor1);
	};
	
	p.render = function(ctx){
		app.draw.line(ctx,this.anchor1.location[0],this.anchor1.location[1],
			this.anchor2.location[0],this.anchor2.location[1],5,"#000");
	};
	
	p.calcSpringForce = function(){
		var force = vec2.create();
		vec2.sub(force,this.anchor1.location,this.anchor2.location);
		var distance = vec2.distance(this.anchor1.location,this.anchor2.location);
		var stretch = distance - this.restLength;
		vec2.normalize(force,force);
		var multiplyValues = -1 * this.k * stretch;
		force = vec2.fromValues(force[0]*multiplyValues,force[1]*multiplyValues);
		this.anchor1.applyForce(force);
		force = vec2.fromValues(force[0]*-1,force[1]*-1);
		this.anchor2.applyForce(force);
	};
	
	p.constrainLength = function(minL,maxL,bob,anchor){
		var direction = vec2.create();
		vec2.subtract(direction,bob.location,anchor.location);
		var distance = vec2.distance(bob.location,anchor.location);
		if(distance < minL){
			vec2.normalize(direction,direction);
			direction = vec2.fromValues(direction[0]*minL,direction[1]*minL);
			vec2.add(bob.location,anchor.location,direction);
			//this.anchor1.velocity = vec2.create();
		}else if(distance > maxL){
			vec2.normalize(direction,direction);
			direction = vec2.fromValues(direction[0]*maxL,direction[1]*maxL);
			vec2.add(bob.location,anchor.location,direction);
			//this.anchor1.velocity = vec2.create();
		}
	}
	
	return Rope;

}();