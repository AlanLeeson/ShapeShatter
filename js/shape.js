"use strict"

var app = app || {};

app.Shape = function(){
	
	var Shape = function(x,y,s){
		this.type = "shape";
		this.location = vec2.fromValues(x,y);
		this.velocity = vec2.create();
		this.acceleration = vec2.create();
		this.sides = s;
	};
	
	var p = Shape.prototype;
	
	p.render = function(ctx){
		app.draw.polygon(ctx,this.location[0],this.location[1],10,this.sides,"#00f");
	};
	
	return Shape;
	
}();