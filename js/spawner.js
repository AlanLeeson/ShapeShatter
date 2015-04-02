"use strict"

var app = app || {};

app.Spawner = function(){

	var Spawner = function(x,y){
		this.type = "spawner";
		this.x = x;
		this.y = y;
		this.radius = 50;
		this.opacity = 0.5;
		this.remove = false;
		this.spawnRate = Math.random()*200 + 100
		this.spawnCount = 0;
	};
	
	var p = Spawner.prototype;
	
	p.update = function(){
		this.spawnCount ++;
		if(this.spawnCount >= this.spawnRate){	
			this.spawnShape();
			this.spawnCount = 0;
		}
	};
	
	p.render = function(ctx){
		app.draw.circle(ctx,this.x,this.y,this.radius,"rgba(221,0,72," + this.opacity + ");");
	};
	
	p.spawnShape =function(){
		app.shapeShatter.entities.push(new app.Shape(this.x,this.y,4));
	};
	
	return Spawner;

}();