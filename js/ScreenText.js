"use strict"

var app = app || {};

app.ScreenText = function(){

	//takes in an x and y position
	//a size parameter
	//and a color parameter
	var ScreenText = function(x,y,text,s,col){
		this.type = "text";
		this.text = text;
		this.location = vec2.fromValues(x,y);
		this.velocity = vec2.fromValues(0,-1.5);
		this.size = s;
		this.col = col;
		this.life = 0;
		this.lifespan = 25;
		this.opacity = 1.0;
		this.remove = false;
	};
	
	var p = ScreenText.prototype;
	
	p.update = function(){
		vec2.add(this.location,this.location,this.velocity);

		this.opacity -= 0.02;
		if(this.opacity <= 0){
			this.remove = true;
		}
		
	};
	
	p.applyForce = function(force){
		//divide the force by the mass
		force = vec2.fromValues(force[0]/this.mass,force[1]/this.mass);
		//add the force to acceleration
		vec2.add(this.acceleration, this.acceleration, force);
	};
	
	p.render = function(ctx){
		ctx.globalAlpha = this.opacity;
		app.draw.text(ctx,this.text,this.location[0],this.location[1],this.size,this.col);
		ctx.globalAlpha = 1.0;
	};
	
	return ScreenText;

}();