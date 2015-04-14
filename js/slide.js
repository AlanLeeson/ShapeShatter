"use strict"

var app = app || {};

app.Slide = function(){

	var Slide = function(url,url2){
			this.type = "slide";
			this.image = Image(360,480);
			this.url1 = url;
			this.url2 = url2;
			this.image.src = this.url1;
			this.switchTime = 50;
			this.switchIncrement = 0;
			this.whichUrl = false;
			this.remove = false;
	};
	
	var p = Slide.prototype;
	
	p.render = function(ctx){
		ctx.drawImage(this.image,0,0,320,480);
	};
	
	p.update = function(){
		this.switchIncrement ++;
		if(this.switchIncrement === this.switchTime){
			this.whichUrl = !this.whichUrl;
			if(this.whichUrl){
				this.image.src = this.url1;
			}else{
				this.image.src = this.url2;
			}
		}
	};
	
	
	
	return Slide;


}();