"use strict"

var app = app || {};

app.Spawner = function(){

	var Spawner = function(x,y){
		this.type = "spawner";
		this.x = x;
		this.y = y;
		this.radius = 50;
		this.opacity = 0.2;
		this.remove = false;
		this.spawnRate = Math.random()*100 + 50;
		this.spawnCount = 0;
		this.opacityStart = 0.2;
	};
	
	var p = Spawner.prototype;
	
	p.update = function(){
		this.spawnCount ++;
		if(this.spawnCount >= this.spawnRate){	
			this.opacity += 0.02;
			if(this.opacity >= 1){
				this.opacity = this.opacityStart;
				this.spawnShape();
				this.spawnCount = 0;
			}
		}
	};
	
	p.render = function(ctx){
		app.draw.circle(ctx,this.x,this.y,this.radius,"rgba(221,0,72," + this.opacity + ");");
	};
	
	p.spawnShape =function(){
		app.shapeShatter.entities.push(new app.Shape(this.x,this.y,parseInt(Math.random()*10 + 3)));
	};
	
	return Spawner;

}();