"use strict"

var app = app || {};

app.Level = {

	level1 : function(){
		this.removeEntities();
		app.shapeShatter.anchor1 = new app.Anchor(100,100,1);
		app.shapeShatter.anchor2 = new app.Anchor(200,100,1);
		app.shapeShatter.rope = new app.Rope(app.shapeShatter.anchor1,app.shapeShatter.anchor2);
		app.shapeShatter.entities.push(new app.Spawner(0,0));
		app.shapeShatter.entities.push(new app.Spawner(app.shapeShatter.WIDTH,0));
		app.shapeShatter.entities.push(new app.Spawner(0,app.shapeShatter.HEIGHT));
		app.shapeShatter.entities.push(new app.Spawner(app.shapeShatter.WIDTH,app.shapeShatter.HEIGHT));
	},
	
	level2 : function(){
		this.removeEntities();
		app.shapeShatter.anchor1 = new app.Anchor(100,100,1);
		app.shapeShatter.anchor2 = new app.Anchor(200,100,1);
		app.shapeShatter.rope = new app.Rope(app.shapeShatter.anchor1,app.shapeShatter.anchor2);
		app.shapeShatter.entities.push(new app.Spawner(app.shapeShatter.WIDTH/2,app.shapeShatter.HEIGHT/2));
	},
	
	removeEntities : function(){
		app.shapeShatter.entities = [];
	}

};