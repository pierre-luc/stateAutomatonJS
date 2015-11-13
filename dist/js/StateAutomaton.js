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
				if ( !this.antialiasing || !antialiasing ){
					ctx.translate( 0.5, 0.5 ); // Move the canvas by 0.5px to fix blurring
					ctx.imageSmoothingEnabled = true;
					ctx.lineWidth = 0.5;
				} else {
					ctx.imageSmoothingEnabled = true;
					ctx.lineWidth = 1;
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
 (function(window){
 	'use strict';

 	/**
 	 * @param param.start:Point
 	 * @param param.end:Point
 	 */
 	var Line = function( param ) {
 		this.start = param.start;
 		this.end = param.end;
 		
 		if ( this.start.getCoord().x == this.end.getCoord().x ){
 			this.angle = Math.PI / 2;
 		} else if ( this.start.getCoord().y == this.end.getCoord().y ){
 			this.angle = 0;
 		} else {
	 		this.angle = Math.atan( 
	 			( this.end.getCoord().y - this.start.getCoord().y ) / 
	 			( this.end.getCoord().x - this.start.getCoord().x )
	 		);
 		}
 	};
 	Line.prototype.getStartPoint = function() {
 		return this.start;
 	};
 	Line.prototype.getEndPoint = function() {
 		return this.end;
 	};
 	Line.prototype.draw = function( context ){
 		if ( typeof context === "undefined" ){
    		context = window.stateAutomaton.graphic.defaultContext;
    	}
    	context.beginPath();
    	context.moveTo( this.start.getCoord().x, this.start.getCoord().y );
    	context.lineTo( this.end.getCoord().x, this.end.getCoord().y );
    	context.stroke();
 	};
 	Line.prototype.getAngle = function(){
 		return this.angle;
 	};

 	window.stateAutomaton.graphic.Line = Line;
 })(window);
/**
 * @requires StateAutomaton.src.js
 */
(function(window){
	'use strict';

	var HeadArrow = function( param ){
		this.origin = param.origin;
		this.height = param.height;
		this.width = param.width;
		this.angle = param.angle;
	};
	HeadArrow.prototype.getOrigin = function(){
		return this.origin;
	};
	HeadArrow.prototype.getHeight = function(){
		return this.height;
	};
	HeadArrow.prototype.getWidth = function(){
		return this.width;
	};
	HeadArrow.prototype.draw = function( context ){
		if ( typeof context === "undefined" ){
    		context = window.stateAutomaton.graphic.defaultContext;
    	}
		context.beginPath();
		var r = Math.sqrt( this.height * this.height / 4 + this.width * this.width );
		var beta = Math.atan( this.height / ( 2 * this.width ) );

        var A = {
            x: this.origin.getCoord().x,
            y: this.origin.getCoord().y
        };
        var B = {
            x: this.origin.getCoord().x + r * Math.cos( this.angle - beta),
            y: this.origin.getCoord().y + r * Math.sin( this.angle -beta )
        };
        var C = {
            x: this.origin.getCoord().x + r * Math.cos( this.angle + beta ),
            y: this.origin.getCoord().y + r * Math.sin( this.angle + beta )
        };
        context.moveTo( A.x, A.y );
        context.lineTo( B.x, B.y );
        context.lineTo( C.x, C.y );
        context.fill();
        context.stroke();
    };
    window.stateAutomaton.graphic.HeadArrow = HeadArrow;
})(window);

/**
 * @requires StateAutomaton.src.js
 * @requires Line.src.js
 * @requires HeadArrow.src.js
 */
(function(window){
	'use strict';

	var Arrow = function( param ){
		this.start = param.start;
        this.end = param.end;

        this.line = new stateAutomaton.graphic.Line({
            start: this.start,
            end: this.end
        });

        this.headArrow = new stateAutomaton.graphic.HeadArrow({
            origin: this.end,
            angle: this.line.getAngle() + Math.PI,
            height: 7,
            width: 7
        });
	};
	Arrow.prototype.getStart = function(){
		return this.start;
	};
	Arrow.prototype.getEnd = function(){
		return this.end;
	};
	Arrow.prototype.draw = function( context ){
		if ( typeof context === "undefined" ){
    		context = window.stateAutomaton.graphic.defaultContext;
    	}
        this.line.draw( context );
        this.headArrow.draw( context );
    };
    window.stateAutomaton.graphic.Arrow = Arrow;
})(window);

/**
 * @requires StateAutomaton.src.js
 */

(function(window) {
    'use strict';
    
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
    };
    Point.prototype.getCoord = function(){
    	return {
    		x: this.x,
    		y: this.y
    	};
    };
    /**
     * @param coord.x
     * @param coord.y
     */
    Point.prototype.setCoord = function( coord ){
    	this.x = coord.x;
    	this.y = coord.y;
    };
    
    Point.prototype.draw = function( context ){
    	if ( typeof context === "undefined" ){
    		context = window.stateAutomaton.graphic.defaultContext;
    	}
    	context.beginPath();
    	context.moveTo( this.x - 5, this.y );
    	context.lineTo( this.x + 5, this.y );
    	context.moveTo( this.x, this.y - 5 );
    	context.lineTo( this.x, this.y + 5 );
    	context.lineWidth = 1;
    	context.stroke();
    };
    Point.prototype.distance = function( point ){
    	return Math.sqrt( 
    		( this.x - point.getCoord().x ) * ( this.x - point.getCoord().x ) +
    	    ( this.y - point.getCoord().y ) * ( this.y - point.getCoord().y )
    	);
    };
    window.stateAutomaton.graphic.Point = Point;
})(window);
/**
 * @requires StateAutomaton.src.js
 * @requires Point.src.js
 */

 (function(window){
 	'use strict';

 	/**
 	 * @param param.center:Point
 	 * @param param.radius:number || param.point:Point
 	 */
 	var Circle = function( param ) {
 		this.center = param.center;
 		var radius = param.radius;
 		if ( typeof param.radius !== "number" ){
 			radius = this.center.distance( param.point );
 		}
 		this.radius = radius;

 	};
 	Circle.prototype.getCenter = function() {
 		return this.center;
 	};
 	Circle.prototype.getRadius = function() {
 		return this.radius;
 	};
 	Circle.prototype.draw = function( context ){
 		if ( typeof context === "undefined" ){
    		context = window.stateAutomaton.graphic.defaultContext;
    	}
    	context.beginPath();
    	context.arc( this.center.getCoord().x, this.center.getCoord().y, this.radius, 0, Math.PI * 2, true );
    	context.stroke();
 	};
 	Circle.prototype.getPoint = function( angle ){
 		return new stateAutomaton.graphic.Point({
 			coord: { 
 				x: this.center.getCoord().x + this.radius * Math.cos( angle ),
 				y: this.center.getCoord().y + this.radius * Math.sin( angle )
 			}
 		});
 	};

 	window.stateAutomaton.graphic.Circle = Circle;
 })(window);