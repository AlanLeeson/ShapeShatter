"use strict"

var app = app || {};

app.Spawner = function(){

	var Spawner = function(x,y){
		this.type = "spawner";
		this.shape = "nothing"; // holds the shape being spawned, added to check the number of sides to deduce color
		this.x = x;
		this.y = y;
		this.radius = 50;
		this.opacity = 0.2;
		this.color = "rgb(0,0,255)";
		this.remove = false;
		this.spawnRate = Math.random()*100 + 50;
		this.spawnCount = 0;
		this.opacityStart = 0.2;
		this.spawn = new Audio('sound/wub.wav');
		this.spawn.volume = 1;
		this.spawn.loop = false;
	};
	
	var p = Spawner.prototype;
	
	p.update = function(){
		this.spawnCount ++;
		if(this.spawnCount >= this.spawnRate){	
			this.opacity += 0.02;
			if(this.opacity >= 1){
				this.opacity = this.opacityStart;
				this.spawnShape();
				if(this.shape.sides == 3){
					this.color = "rgb(0,0,255)";
				} else if(this.shape.sides == 4){
					this.color = "rgb(255,255,0)";
				} else if(this.shape.sides == 5){
					this.color = "rgb(255,0,255)";
				} else if(this.shape.sides == 6 ){
					this.color = "rgb(255,165,0)";
				} else if(this.shape.sides == 8){
					this.color = "rgb(0,0,0)";
				}
				this.spawnCount = 0;
			}
		}
	};
	
	p.render = function(ctx){
		ctx.globalAlpha = this.opacityStart;
		app.draw.circle(ctx,this.x,this.y,this.radius,this.color);
		ctx.globalAlpha = 1.0;
	};
	
	p.spawnShape =function(){
		if(app.shapeShatter.score < 50){
			//this.shape = new app.Shape(this.x, this.y, parseInt(Math.random()*3 + 3));
			//app.shapeShatter.entities.push(this.shape);
			//if(parseInt(Math.random()*3 + 3) == 4){
				//this.shape = new app.Shape(this.x, this.y, 8);
				//app.shapeShatter.entities.push(this.shape);
				//this.spawn.play();
			//}
			//if(parseInt(Math.random()*3 + 3) == 4){
				//this.shape = new app.Shape(this.x, this.y, 6);
				//app.shapeShatter.entities.push(this.shape);
				//this.spawn.play();
			//}
		
		
			if(parseInt((Math.random()*4) + 1) == 3 ){
				this.shape = new app.Shape(this.x, this.y, 3);
				app.shapeShatter.entities.push(this.shape);
				this.spawn.play();
			}
		} else if(app.shapeShatter.score < 200){ //spawn squares
			if(parseInt((Math.random()*3) + 1) == 2 ){
				this.shape = new app.Shape(this.x,this.y,parseInt(Math.random()*2 + 3));
				app.shapeShatter.entities.push(this.shape);
				this.spawn.play();
			}
		} else if(app.shapeShatter.score < 500){ //begin spawn 5 sided
			if(parseInt((Math.random()*2) + 1) == 1 ){
				this.shape = new app.Shape(this.x, this.y, parseInt(Math.random()*3 + 3));
				app.shapeShatter.entities.push(this.shape);
				this.spawn.play();
			}
		} else if(app.shapeShatter.score < 1000) {
			if(parseInt((Math.random()*2) + 1) == 1){
				this.shape = new app.Shape(this.x, this.y, parseInt(Math.random()*3 + 3));
				app.shapeShatter.entities.push(this.shape);
				this.spawn.play();
			}
			if(parseInt(Math.random()*3 + 3) == 4){
				this.shape = new app.Shape(this.x, this.y, 8);
				app.shapeShatter.entities.push(this.shape);
				this.spawn.play();
			}
		} else {
			if(parseInt((Math.random()*2) + 1) == 1){
				this.shape = new app.Shape(this.x, this.y, parseInt(Math.random()*3 + 3));
				app.shapeShatter.entities.push(this.shape);
				this.spawn.play();
			}
			if(parseInt(Math.random()*9 + 9) == 9){
				this.shape = new app.Shape(this.x, this.y, 8);
				app.shapeShatter.entities.push(this.shape);
				this.spawn.play();
			}
			if(parseInt(Math.random()*12 + 12) == 12){
				this.shape = new app.Shape(this.x, this.y, 6);
				app.shapeShatter.entities.push(this.shape);
				this.spawn.play();
			}
		}
		if(parseInt(Math.random()*20) == 0){
			app.shapeShatter.entities.push(new app.PowerUp(Math.random()*200+30,Math.random()*300+30));
		}
		
	};
	
	return Spawner;

}();