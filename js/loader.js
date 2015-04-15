"use strict";

var app = app || {};

window.onload = function() {
	app.shapeShatter.init();
	
	window.onresize = function(){
		app.shapeShatter.resize();
	};
	
	window.addEventListener('mousedown',function(e){
		e.preventDefault();
		app.shapeShatter.pressed(e);
	}, false);
	
	window.addEventListener('mouseup',function(e){
		e.preventDefault();
		app.shapeShatter.mouseUp();
	}, false);
	
	window.addEventListener('mousemove',function(e){
		e.preventDefault();
		app.shapeShatter.setInput(e);
	}, false);
	
	window.addEventListener('touchstart',function(e){
		e.preventDefault();
		app.shapeShatter.pressed(e.touches[0]);
	},false);
	
	window.addEventListener('touchmove',function(e){
		e.preventDefault();
		app.shapeShatter.setInput(e.touches[0]);
	},false);
	
	window.addEventListener('touchend',function(e){
		e.preventDefault();
		app.shapeShatter.mouseUp();
	},false);
};
