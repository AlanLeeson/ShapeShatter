"use strict"

var app = app || {};

app.Level = {

	level1 : function(){
		this.removeEntities();
		app.shapeShatter.anchor1 = new app.Anchor(app.shapeShatter.WIDTH/2-50,app.shapeShatter.HEIGHT/4,1);
		app.shapeShatter.anchor2 = new app.Anchor(app.shapeShatter.WIDTH/2+50,app.shapeShatter.HEIGHT/4,1);
		app.shapeShatter.rope = new app.Rope(app.shapeShatter.anchor1,app.shapeShatter.anchor2);
		app.shapeShatter.entities.push(new app.Spawner(0,0));
		app.shapeShatter.entities.push(new app.Spawner(app.shapeShatter.WIDTH,0));
		app.shapeShatter.entities.push(new app.Spawner(0,app.shapeShatter.HEIGHT));
		app.shapeShatter.entities.push(new app.Spawner(app.shapeShatter.WIDTH,app.shapeShatter.HEIGHT));
	},
	
	level2 : function(){
		this.removeEntities();
		app.shapeShatter.anchor1 = new app.Anchor(app.shapeShatter.WIDTH/2-50,app.shapeShatter.HEIGHT/2,1);
		app.shapeShatter.anchor2 = new app.Anchor(app.shapeShatter.WIDTH/2+50,app.shapeShatter.HEIGHT/2,1);
		app.shapeShatter.rope = new app.Rope(app.shapeShatter.anchor1,app.shapeShatter.anchor2);
		app.shapeShatter.entities.push(new app.Spawner(app.shapeShatter.WIDTH/2,app.shapeShatter.HEIGHT/4));
		app.shapeShatter.entities.push(new app.Spawner(app.shapeShatter.WIDTH/2,app.shapeShatter.HEIGHT*3/4));
	},

	level3 : function(){
		this.removeEntities();
		app.shapeShatter.anchor1 = new app.Anchor(app.shapeShatter.WIDTH/2-50,app.shapeShatter.HEIGHT/2,1);
		app.shapeShatter.anchor2 = new app.Anchor(app.shapeShatter.WIDTH/2+50,app.shapeShatter.HEIGHT/2,1);
		app.shapeShatter.rope = new app.Rope(app.shapeShatter.anchor1,app.shapeShatter.anchor2);
		app.shapeShatter.entities.push(new app.Spawner(0,app.shapeShatter.HEIGHT/4));
		app.shapeShatter.entities.push(new app.Spawner(0,app.shapeShatter.HEIGHT*3/4));
		app.shapeShatter.entities.push(new app.Spawner(0,app.shapeShatter.HEIGHT/2));
		app.shapeShatter.entities.push(new app.Spawner(app.shapeShatter.WIDTH,app.shapeShatter.HEIGHT/4));
		app.shapeShatter.entities.push(new app.Spawner(app.shapeShatter.WIDTH,app.shapeShatter.HEIGHT*3/4));
		app.shapeShatter.entities.push(new app.Spawner(app.shapeShatter.WIDTH,app.shapeShatter.HEIGHT/2));
		app.shapeShatter.entities.push(new app.Spawner(app.shapeShatter.WIDTH/2,0));
		app.shapeShatter.entities.push(new app.Spawner(app.shapeShatter.WIDTH/2,app.shapeShatter.HEIGHT));
	},
	
	removeEntities : function(){
		app.shapeShatter.entities = [];
	}

};