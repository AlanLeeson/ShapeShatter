"use strict"

var app = app || {};

app.shapeShatter = {

	WIDTH : 320, 
    HEIGHT: 480,

	RATIO : undefined,
	currentWidth : undefined,
	currentHeight : undefined,
	canvas : undefined,
	ctx :  undefined,
	x : 0,
	
	scale : 1,
	
	offset : {top: 0, left: 0},
	
	anchor1 : undefined,
	anchor2 : undefined,
	
	init : function(){
	
		this.RATIO = this.WIDTH / this.HEIGHT;
		
		this.currentWidth = this.WIDTH;
		this.currentHeight = this.HEIGHT;
		
		// this is our canvas element
		this.canvas = document.querySelector('canvas');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		
		this.ctx = this.canvas.getContext('2d');
		
		this.ua = navigator.userAgent.toLowerCase();
		this.android = this.ua.indexOf('android') > -1 ? true : false;
		this.ios = ( this.ua.indexOf('iphone') > -1 || this.ua.indexOf('ipad') > -1 || this.ua.indexOf('ipod') > -1 ) ? true : false;
		
		this.anchor1 = new app.Anchor(100,100,1);
		
		this.resize();
		this.gameLoop();
	},
	
	gameLoop : function(){
		requestAnimationFrame(this.gameLoop.bind(this));
    	this.render();
    	this.update();
	},
	
	render : function(){
		app.draw.clear(this.ctx,0,0,this.WIDTH,this.HEIGHT);
		this.anchor1.render(this.ctx);
    },
    
    update : function(){
    	this.anchor1.update();
    },
    
    setInput : function(data){
    	//this.xTap = (data.pageX - this.offset.left)/this.scale;
    	//this.yTap = (data.pageY - this.offset.top)/this.scale;
    	//this.tapped = true;
    },

	resize : function() {
     	console.log("resize");
        this.currentHeight = window.innerHeight;
        // resize the width in proportion
        // to the new height
        this.currentWidth = this.currentHeight * this.RATIO;

    
        // set the new canvas style width and height
        // note: our canvas is still 320 x 480, but
        // we're essentially scaling it with CSS
        this.canvas.style.width = this.currentWidth + 'px';
        this.canvas.style.height = this.currentHeight + 'px';
        
         // this will create some extra space on the
        // page, allowing us to scroll past
        // the address bar, thus hiding it.
        if (this.android || this.ios) {
            document.body.style.height = (window.innerHeight + 50) + 'px';
        }

        // we use a timeout here because some mobile
        // browsers don't fire if there is not
        // a short delay
        window.setTimeout(function() {
                window.scrollTo(0,1);
        }, 10);
        
        this.scale = this.currentWidth/this.WIDTH;
        this.offset.top = this.canvas.offsetTop;
        this.offset.left = this.canvas.offsetLeft;
    }

};
