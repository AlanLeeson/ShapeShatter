"use strict"

var app = app || {};

app.InputButton = function(){

	var InputButton = function(type,x,y,s,string,defaul,action){
		this.type = type;
		this.x = x;
		this.y = y;
		this.text = string;
		this.action = action;
		this.radius = s;
		this.textSize = s;
		this.remove = false;
		this.selected = defaul;
		if(this.selected){
			this.action();
		}
	};
	
	var p = InputButton.prototype;
	
	p.render = function(ctx){
		if(this.selected){
			app.draw.circle(ctx,this.x,this.y,this.radius + 5,"rgba(255,255,255,0.9)");
			app.draw.circle(ctx,this.x,this.y,this.radius + 10,"rgba(255,20,50,0.5)");
		}
		app.draw.circle(ctx,this.x,this.y,this.radius,"#000");
		app.draw.text(ctx,this.text,this.x-this.textSize*3/4,this.y,this.textSize/2,"#fff");
	};
	
	p.update = function(){
		//checks to see if the user tapped
		if(app.shapeShatter.tapped || app.shapeShatter.held){
			//this checks if the user clicked in the button
			if(this.checkTapped()){
				//performs the action specified in the buttons creation
				this.action();
				//checks if the other buttons are selected, then turn them off.
				for(var i = 0; i < app.shapeShatter.menuElements.length; i++){
					if(app.shapeShatter.menuElements[i].type === this.type){
						app.shapeShatter.menuElements[i].selected = false;
					}
				}//end of for
				//makes it selected so it draws differently.
				this.selected = true;
			}//end of if
		}//end of other if
	};
	
	p.checkTapped = function(){
    	var dx = app.shapeShatter.xTap - this.x;
    	var dy = app.shapeShatter.yTap - this.y;
    	return dx * dx + dy * dy <= this.radius * this.radius;
    };
	
	return InputButton;

}();