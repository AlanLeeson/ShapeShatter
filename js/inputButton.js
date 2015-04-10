"use strict"

var app = app || {};

app.InputButton = function(){

	var InputButton = function(x,y,w,h,string,action){
		this.type = "inputButton";
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
		this.text = string;
		this.action = action;
		this.radius = 20
		this.remove = false;
	};
	
	var p = InputButton.prototype;
	
	p.render = function(ctx){
		app.draw.circle(ctx,this.x,this.y,this.radius,"#000");
		app.draw.text(ctx,this.text,this.x-10,this.y,10,"#fff");
	};
	
	p.update = function(){
		if(app.shapeShatter.tapped || app.shapeShatter.held){
			if(this.checkTapped()){
				this.action();
			}
		}
	};
	
	p.checkTapped = function(){
    	var dx = app.shapeShatter.xTap - this.x;
    	var dy = app.shapeShatter.yTap - this.y;
    	return dx * dx + dy * dy <= this.radius * this.radius;
    };
	
	return InputButton;

}();