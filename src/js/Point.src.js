/**
 * @requires StateAutomaton.src.js
 */

(function(window) {
    'use strict';
    
    var pointsCount = 0;
    /**
     * @constructor
     * @param param.coord.x
     * @param param.coord.y
     * @param param.name;
     */
    var Point = function( param ){
    	this.x = param.coord.x;
    	this.y = param.coord.y;
    	this.name = param.name;
    	this.pointIndex = pointsCount;
    	++pointsCount;
    	window.stateAutomaton.graphic.points[ this.pointIndex ] = this;
    };
    Point.prototype.getCoord = function(){
    	return {
    		x: this.x,
    		y: this.y
    	};
    };
    Point.prototype.getIndex = function(){
    	return this.pointIndex;
    };

    /**
     * @param coord.x
     * @param coord.y
     */
    Point.prototype.setCoord = function( coord ){
    	this.x = coord.x;
    	this.y = coord.y;
    };
    

    Point.prototype.remove = function(){
    	delete( window.stateAutomaton.graphic.points[ this.pointIndex ] );
    };

    Point.prototype.draw = function( context ){
    	if ( typeof context === "undefined" ){
    		context = window.stateAutomaton.graphic.defaultContext;
    	}
    	context.beginPath();
    	context.moveTo( this.x - 2, this.y );
    	context.lineTo( this.x + 2, this.y );
    	context.moveTo( this.x, this.y - 2 );
    	context.lineTo( this.x, this.y + 2 );
    	context.lineWidth = 1;
    	context.stroke();
    };
    window.stateAutomaton.graphic.Point = Point;
    window.stateAutomaton.graphic.points = {};
})(window);