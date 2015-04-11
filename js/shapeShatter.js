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
	
	pause : false,
	tapped : false,
	held : false,
	xTap : undefined,
	yTap : undefined,
	
	scale : 1,
	offset : {top: 0, left: 0},
	
	anchor1 : undefined,
	anchor2 : undefined,
	rope : undefined,
	
	entities : [],
	score : 0,
	multiplier : 1,
	
	GAME_STATE_MENU : 0,
	GAME_STATE_PLAY : 1,
	gameState : 0,
	
	menuElements : [],
	
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
		
		//
		this.gameState = this.GAME_STATE_MENU;
		
		//Menu
		this.menuElements.push(new app.InputButton("play",this.WIDTH/2,100,2,2,"Play",false,
			function(){app.shapeShatter.gameState = app.shapeShatter.GAME_STATE_PLAY;
				app.shapeShatter.pause = true;}));
		this.menuElements.push(new app.InputButton("level",this.WIDTH/2,300,2,2,"Classic",true,
			function(){app.Level.level1();}));
		this.menuElements.push(new app.InputButton("level",this.WIDTH/2+100,300,2,2,"level3",false,
			function(){app.Level.level2();}));
		
		//classic level
		this.resize();
		this.gameLoop();
	},
	
	gameLoop : function(){
		requestAnimationFrame(this.gameLoop.bind(this));
		if(!this.pause){
    		this.update();
    	}
    	this.render();
	},
	
	render : function(){
		app.draw.clear(this.ctx,0,0,this.WIDTH,this.HEIGHT);
		if(this.gameState === this.GAME_STATE_MENU){
    		for(var i = 0; i < this.menuElements.length; i++){
    			this.menuElements[i].render(this.ctx);
    		}
    	}else if(this.gameState === this.GAME_STATE_PLAY){
			this.drawHud();
			this.rope.render(this.ctx);
			this.anchor1.render(this.ctx);
			this.anchor2.render(this.ctx);
			for(var i = 0; i < this.entities.length; i ++){
				this.entities[i].render(this.ctx);
			}
		}
    },
    
    update : function(){
    	if(this.gameState === this.GAME_STATE_MENU){
    		for(var i = 0; i < this.menuElements.length; i++){
    			this.menuElements[i].update();
    		}
    	}else if(this.gameState === this.GAME_STATE_PLAY){
    	
    		this.rope.update();
    	
    		this.anchor1.update();
    		this.anchor2.update();
    	
    		this.checkGameElements();
    	}
    },
    
    checkGameElements : function(){
    	if(this.held){
    		if(this.anchor1.clicked){
				this.anchor1.location = vec2.fromValues(this.xTap,this.yTap);
				for(var i = 0; i < this.entities.length; i++){
					if(this.entities[i].type === "shape"){
						this.entities[i].update(this.anchor1,this.anchor2);
					}else{
						this.entities[i].update();
					}
					if(this.entities[i].remove){
    					this.entities.splice(i,1);
    					i -= 1;
    				}
				}
			}else if(this.anchor2.clicked){
				this.anchor2.location = vec2.fromValues(this.xTap,this.yTap);
				for(var i = 0; i < this.entities.length; i++){
					if(this.entities[i].type === "shape"){
						this.entities[i].update(this.anchor2,this.anchor1);
					}else{
						this.entities[i].update();
					}
					if(this.entities[i].remove){
    					this.entities.splice(i,1);
    					i -= 1;
    				}
				}//end for
			}//end else if
		}//end if held
    },
    
    mouseUp : function(){
    	this.held = false;
    	if(this.gameState === this.GAME_STATE_PLAY){
    		this.pauseScene();
    	}
    },
    
    pressed : function(data){
    	this.setInput(data);
    },
    
    //method only called when the user taps
    //the if is used for when the tap is first administered
    setInput : function(data){
    	this.xTap = (data.pageX - this.offset.left)/this.scale;
    	this.yTap = (data.pageY - this.offset.top)/this.scale;
    	if(this.tapped){
    		this.checkAnchorTapped(this.anchor1);
    		this.checkAnchorTapped(this.anchor2);
    	}
    	this.tapped = false;
    },
    
    pauseScene : function(){
    	this.pause = true;
    	this.tapped = false;
    	this.held = false;
    	this.anchor1.clicked = false;
    	this.anchor2.clicked = false;
    },
    
    checkAnchorTapped : function(I){
    	var dx = this.xTap - I.location[0];
    	var dy = this.yTap - I.location[1];
    	var collided = dx * dx + dy * dy <= I.radius * I.radius;
    	if(collided){
    		this.pause = false;
    		I.clicked = true;
    	}
    },
    
    drawHud : function(){
    	app.draw.text(this.ctx,this.score + "pts",this.WIDTH/2-30,this.HEIGHT-10,30,"#fff");
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
