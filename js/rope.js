"use strict"

var app = app || {}

app.Rope = function(){

	var Rope = function(a1,a2){
		this.type = "rope";
		this.restLength = 2;
		this.anchor1 = a1;
		this.anchor2 = a2;
		this.k = 0.2;
	};
	
	var p = Rope.prototype;
	
	p.update = function(){
	
	};
	
	p.render = function(ctx){
		app.draw.line(ctx,this.anchor1.location[0],this.anchor1.location[1],
			this.anchor2.location[0],this.anchor2.location[1],10,"#000");
	};
	
	return Rope;

}();