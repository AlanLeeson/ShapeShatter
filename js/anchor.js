"use strict"

var app = app || {}

app.Anchor = function(){

	var Anchor = function(x,y,col){
		this.type = 'anchor';
		this.r = 5.0;
		this.location = vec2.fromValues(x,y);
		this.velocity = vec2.create();
		this.acceleration = vec2.create();
		this.dragOffset = vec2.create();
		this.mass = 5.0;
		this.dampening = 0.95;
		this.ySpeed = Math.random() + 1;
		this.offest = 0;
		this.time = 0;
	};
	
	var p = Anchor.prototype;
	
	p.run = function(){
	
	};
	
	p.update = function(){
		
	};
	
	p.render = function(ctx){
		app.draw.circle(ctx,this.location[0],this.location[1],10,"#f00");
	};
	
	return Anchor;

}();