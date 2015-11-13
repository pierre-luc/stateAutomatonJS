/*!
 * StateAutomatonJS - v0.0.1
 * @author Pierre-Luc BLOT
 * @created 13/11/15
 */
(function( window ){
	var stateAutomaton = {
		graphic: {
			defaultContext: null,
			antialiasing: true,
			
			/**
			 * Retourne le context2D d'un canvas et permet d'activer l'anti-aliasing.
			 * @param canvas:Element
			 *	Référence vers un élément de type canvas
			 * @param antialiasing:boolean
			 *	Activation l'anti-aliasing, true par défaut.
			 * @post
			 *	Le premier context2D créé est sauvé en tant que context2D par défaut.
			 */
			getContext: function( canvas, antialiasing ){
				if ( typeof antialiasing === "undefined" ){
					antialiasing = true;
				}
				var ctx = canvas.getContext( '2d' );
				if ( this.antialiasing && antialiasing ){
					ctx.translate( 0.5, 0.5 ); // Move the canvas by 0.5px to fix blurring
				}
				if ( this.defaultContext === null ){
					this.defaultContext = ctx;
				}
				return ctx;
			},
			/**
			 * Définit le context par défaut.
			 * @param context:CanvasRenderingContext2D
			 */
			setDefaultContext: function( context ){
				this.defaultContext = context;
			}
		}
	};
	if ( typeof window.stateAutomaton === "undefined" ){
		window.stateAutomaton = stateAutomaton;
	}
})(window);
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