"use strict"

var app = app || {};

app.PowerUp = function(){

	var PowerUp = function(x,y){
		this.type = "powerUp";
		this.x = x;
		this.y = y;
		this.col = "#fff";
		this.radius = 5;
		this.radiusMin = 5;
		this.radiusMax = 8;
		this.remove = false;
		this.dir = 1;
		this.pulse
	};
	
	var p = PowerUp.prototype;
	
	p.render = function(ctx){
		this.radius += 0.1 * this.dir; 
		if(this.radius >= this.radiusMax){
			this.dir = -1;
		}else if(this.radius <= this.radiusMin){
			this.dir = 1;
		}
		app.draw.circle(ctx,this.x,this.y,this.radius,this.col);
	};
	
	p.update = function(selectedAnchor,enemyAnchor){
	
		if(this.checkAnchorCollision(enemyAnchor) || this.checkAnchorCollision(selectedAnchor)){
			app.shapeShatter.entities.push(new app.ParticleSystem(this.x,this.y,this.sides,this.col));
			app.shapeShatter.entities.push(new app.ScreenText(
			25,300,"Screen Cleared",35,"#fff"));
			
			for(var i = 0; i < app.shapeShatter.entities.length; i++){
				if(app.shapeShatter.entities[i].type === "shape"){
					app.shapeShatter.entities[i].doMultiplierAnchor();
				}
			}
			
			this.remove = true;
		}
	};
	
	p.checkAnchorCollision = function(anchor){
		var dx = anchor.location[0] - this.x;
		var dy = anchor.location[1] - this.y;
		var distance = Math.sqrt(dx*dx + dy*dy);
		return distance < anchor.radius + this.radius;
	};
	
	return PowerUp;

}();