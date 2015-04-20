"use strict"

var app = app || {};

app.shapeShatter = {

	WIDTH : 320, 
    HEIGHT: 480,
	
	//musica
	song : undefined,
	shatterSound : undefined,

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
	ropes : [],
	
	entities : [],
	score : 0,
	multiplier : 1,
	
	level : 0,
	LEVEL_ONE : 0,
	LEVEL_TWO : 1,
	LEVEL_THREE : 2,
	
	GAME_STATE_TUTORIAL : 0,
	GAME_STATE_MENU : 1,
	GAME_STATE_PLAY : 2,
	gameState : 1,
	
	MODE_INFINITE : 0,
	MODE_PRACTICE : 1,
	MODE_HARDCORE : 2,
	gameMode : 0,
	
	menuElements : [],
	backgroundImage : undefined,
	menuButton: undefined,
	
	tutorialElements : [],
	tutorialIndex : 0,
	tutorialButton : undefined,
	
	init : function(){
	
		this.RATIO = this.WIDTH / this.HEIGHT;
		
		//musica
		this.song = new Audio('sound/background.wav');
		this.song.volume = 0.3;
		this.song.loop = true;
		this.song.play();
		
		this.shatterSound = new Audio('sound/shatter.wav');
		this.shatterSound.volume = 0.3;
		this.shatterSound.loop = false;
		
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
		
		this.gameState = this.GAME_STATE_MENU;
		
		//makes the menu button
		this.menuButton = new app.InputButton("menu",2,2,80,80,40,"images/Menu.png",false,
			function(){app.shapeShatter.returnToMenu();});
		
		//Makes the tutorial step-through button
		this.tutorialButton = new app.InputButton("tutorial",this.WIDTH-65,this.HEIGHT-65,60,60,30,"images/Next.png",false,
			function(){app.shapeShatter.tutorialIndex ++;});
		
		//Menu
		this.initMenu();
		
		//Tutorial
		this.initTutorial();
		
		//Check Storage
		this.initStorage();

		this.resize();
		this.gameLoop();
	},
	
	gameLoop : function(){
		requestAnimationFrame(this.gameLoop.bind(this));
    	this.update();
    	this.render();
	},
	
	render : function(){
		if(this.gameState === this.GAME_STATE_TUTORIAL){
			this.tutorialElements[this.tutorialIndex].render(this.ctx);
			this.tutorialButton.render(this.ctx);
		}else if(this.gameState === this.GAME_STATE_MENU){
			this.ctx.drawImage(this.BackgroundImage,0,0,320,480);
    		for(var i = 0; i < this.menuElements.length; i++){
    			this.menuElements[i].render(this.ctx);
    		}
    		//ctx,string,x,y,size,col
    		app.draw.text(this.ctx,localStorage.highScoreLevel1,this.WIDTH/4-50,230,20,"white");
    		app.draw.text(this.ctx,localStorage.highScoreLevel2,this.WIDTH/2-30,160,20,"white");
    		app.draw.text(this.ctx,localStorage.highScoreLevel3,this.WIDTH*3/4-10,230,20,"white");
    	}else if(this.gameState === this.GAME_STATE_PLAY){
			app.draw.clear(this.ctx,0,0,this.WIDTH,this.HEIGHT);
			this.drawHud();
			for(var i = 0; i < this.entities.length; i ++){
				this.entities[i].render(this.ctx);
			}
			//render ropes
			for(var i = 0; i < this.ropes.length; i++){
				this.ropes[i].render(this.ctx);
			}
			this.anchor1.render(this.ctx);
			this.anchor2.render(this.ctx);
			
			if(this.pause){
				this.doPauseScene();
			}
		}
	
    },
    
    update : function(){
    	if(this.gameState === this.GAME_STATE_TUTORIAL){
    		this.tutorialElements[this.tutorialIndex].update();
		}else if(this.gameState === this.GAME_STATE_MENU){
			//Isn't needed really
		} else if(this.gameState === this.GAME_STATE_PLAY && !this.pause){
			for(var i = 0; i < this.ropes.length; i ++){
				this.ropes[i].update();
			}
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
					if(this.entities[i].type === "shape" || this.entities[i].type === "powerUp"){
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
					if(this.entities[i].type === "shape" || this.entities[i].type === "powerUp"){
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
    	this.tapped = true;
    	this.held = true;
    	if(this.gameState === this.GAME_STATE_TUTORIAL){
			this.tutorialButton.update();
			if(this.tutorialIndex >= this.tutorialElements.length){
    				this.gameState = this.GAME_STATE_MENU;
    		}
			this.tutorialButton.selected = false;
		}else if(this.gameState === this.GAME_STATE_MENU){
			for(var i = 0; i < this.menuElements.length; i++){
				this.menuElements[i].update();
			}
		} 
    	this.setInput(data);
    },
    
    //method only called when the user taps
    //the if is used for when the tap is first administered
    setInput : function(data){
    	this.xTap = (data.pageX - this.offset.left)/this.scale;
    	this.yTap = (data.pageY - this.offset.top)/this.scale;
    	if(this.tapped && this.gameState === this.GAME_STATE_PLAY){
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
    
    doPauseScene : function(){
		app.draw.rect(this.ctx,0,0,1000,1000,"rgba(0,0,0,0.3)");
		app.draw.circle(this.ctx, this.anchor1.location[0], this.anchor1.location[1], this.anchor1.radius*3, "rgba(255,255,255,0.09)");
		app.draw.circle(this.ctx, this.anchor2.location[0], this.anchor2.location[1], this.anchor2.radius*3, "rgba(255,255,255,0.09)");
		var grd = this.ctx.createLinearGradient(this.WIDTH-20,this.HEIGHT/2,this.WIDTH,this.HEIGHT/2);
		grd.addColorStop(0,'rgba(119,119,119,0.4)');
		grd.addColorStop(1,'rgba(0,0,0,0.4)');
		var grd2 = this.ctx.createLinearGradient(this.WIDTH/2,20,this.WIDTH/2,0);
		grd2.addColorStop(0,'rgba(119,119,119,0.4)');
		grd2.addColorStop(1,'rgba(0,0,0,0.4)');
		var grd3 = this.ctx.createLinearGradient(20,this.HEIGHT/2,0,this.HEIGHT/2);
		grd3.addColorStop(0,'rgba(119,119,119,0.4)');
		grd3.addColorStop(1,'rgba(0,0,0,0.4)');
		var grd4 = this.ctx.createLinearGradient(this.WIDTH/2,this.HEIGHT-20,this.WIDTH/2,this.HEIGHT);
		grd4.addColorStop(0,'rgba(119,119,119,0.4)');
		grd4.addColorStop(1,'rgba(0,0,0,0.4)');
		app.draw.rect(this.ctx,this.WIDTH - 20,0,20,this.HEIGHT,grd);
		app.draw.rect(this.ctx,0,0,this.WIDTH,20,grd2);
		app.draw.rect(this.ctx,0,0,20,this.HEIGHT,grd3);
		app.draw.rect(this.ctx,0,this.HEIGHT-20,this.WIDTH,20,grd4);
		this.menuButton.render(this.ctx);
		this.menuButton.update();
    },
    
    returnToMenu : function(){
    	this.checkScores();
    	this.gameState = this.GAME_STATE_MENU;
    	this.pauseScene();
    	this.entities = [];
		this.ropes = [];
		this.score = 0;
		this.multiplier = 1;
		for(var i = 0; i < this.menuElements.length; i++){
			if(this.menuElements[i].type !== "play" && this.menuElements[i].selected){
				this.menuElements[i].action();
			}else{
				this.menuElements[i].selected = false;
			}
		}
		
    },
    
    checkScores : function(){
    	switch(this.level){
    		case this.LEVEL_ONE:
    			if(localStorage.getItem("highScoreLevel1") < this.score){
    				localStorage.highScoreLevel1 = this.score;
    			}
    			break;
    		case this.LEVEL_TWO:
    			if(localStorage.getItem("highScoreLevel2") < this.score){
    				localStorage.highScoreLevel2 = this.score;
    			}
    			break;
    		case this.LEVEL_THREE:
    			if(localStorage.getItem("highScoreLevel3") < this.score){
    				localStorage.highScoreLevel3 = this.score;
    			}
    			break;
    	}
    },
    
    drawHud : function(){
    	app.draw.text(this.ctx,this.score + "pts",this.WIDTH/2-30,this.HEIGHT-10,30,"#fff");
    },
    
    initStorage : function(){
    	if(localStorage.highScoreLevel1){
			this.highScoreLevel1 = localStorage.highScoreLevel1;
		}else{
			localStorage.setItem("highScoreLevel1",0);
		}
		if(localStorage.highScoreLevel2){
			this.highScoreLevel2 = localStorage.highScoreLevel2;
		}else{
			localStorage.setItem("highScoreLevel2",0);
		}
		if(localStorage.highScoreLevel3){
			this.highScoreLevel3 = localStorage.highScoreLevel3;
		}else{
			localStorage.setItem("highScoreLevel3",0);
		}
    },
    
    initTutorial : function(){
    	this.tutorialElements.push(new app.Slide("images/Tutorial1-1.png","images/Tutorial1-2.png"));
    	this.tutorialElements.push(new app.Slide("images/Tutorial2-1.png","images/Tutorial2-2.png"));
    	this.tutorialElements.push(new app.Slide("images/Tutorial3-1.png","images/Tutorial3-2.png"));
    	this.tutorialElements.push(new app.Slide("images/Tutorial4-1.png","images/Tutorial4-2.png"));
    },
    
    initMenu : function(){
    	//Background image
		this.BackgroundImage = new Image(320,480);
		this.BackgroundImage.src = "images/Background.png";
		
		//Play Button
		this.menuElements.push(new app.InputButton("play",this.WIDTH/2-62,250,124,124,70,"images/Play.png",false,
			function(){app.shapeShatter.gameState = app.shapeShatter.GAME_STATE_PLAY;
				app.shapeShatter.pause = true;}));
		//levels
		this.menuElements.push(new app.InputButton("level",10,150,100,100,60,"images/Stage1.png",false,
			function(){app.Level.level1(); app.shapeShatter.level = app.shapeShatter.LEVEL_ONE;}));
		//classic level
		this.menuElements.push(new app.InputButton("level",this.WIDTH/2-50,80,100,100,60,"images/Stage2.png",true,
			function(){app.Level.level2(); app.shapeShatter.level = app.shapeShatter.LEVEL_TWO;}));
			
		this.menuElements.push(new app.InputButton("level",this.WIDTH-110,150,100,100,60,"images/Stage3.png",false,
			function(){app.Level.level3(); app.shapeShatter.level = app.shapeShatter.LEVEL_THREE;}));
			
		//modes
		this.menuElements.push(new app.InputButton("mode",30,380,80,80,40,"images/Infinite.png",true,
			function(){app.shapeShatter.gameMode = app.shapeShatter.MODE_INFINITE;}));
		this.menuElements.push(new app.InputButton("mode",this.WIDTH-110,380,80,80,40,"images/Classic.png",false,
			function(){app.shapeShatter.gameMode = app.shapeShatter.MODE_HARDCORE;}));
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
