"use strict"

var app = app || {};

app.Spawner = function(){

	var Spawner = function(x,y){
		this.type = "spawner";
		this.x = x;
		this.y = y;
		this.radius = 50;
		this.opacity = 0.5;
	};
	
	var p = Spawner.prototype;
	
	p.update = function(){
	
	};
	
	p.render = function(ctx){
		app.draw.circle(ctx,this.x,this.y,this.radius,"rgba(221,0,72," + this.opacity + ");");
	};
	
	return Spawner;

}();