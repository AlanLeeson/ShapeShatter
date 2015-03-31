"use strict"

var app = app || {};

app.draw = {
	
	clear: function(ctx,x,y,w,h){
		ctx.clearRect(x,y,w,h);
	},
	
	rect: function(ctx,x,y,w,h,col){
		ctx.fillStyle = col;
		ctx.fillRect(x,y,w,h);
	},
	
	circle: function(ctx,x,y,r,col){
		ctx.fillStyle = col;
		ctx.beginPath();
		ctx.arc(x,y,r,0,Math.PI*2,true);
		ctx.closePath();
		ctx.fill();
	},
	
	text: function(ctx,string,x,y,size,col){
		ctx.font = 'bold ' + size + 'px Monoscope';
		ctx.fillStyle = col;
		ctx.fillText(string,x,y);
	},
	
	line: function(ctx,x1,y1,x2,y2,w,col){
		ctx.strokeStyle = col;
		ctx.lineWidth = w;
		ctx.beginPath();
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
		ctx.closePath();
		ctx.stroke();
	}
};