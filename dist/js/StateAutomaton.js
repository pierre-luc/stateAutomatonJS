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
             *  Référence vers un élément de type canvas
             * @param antialiasing:boolean
             *  Activation l'anti-aliasing, true par défaut.
             * @post
             *  Le premier context2D créé est sauvé en tant que context2D par défaut.
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
 * Classe Point
 * @author Pierre-Luc BLOT
 * @created 13/11/15
 *
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
    /**
     * Retourne les coordonnées du point.
     * @return {x, y}
     */
    Point.prototype.getCoord = function(){
        return {
            x: this.x,
            y: this.y
        };
    };
    /**
     * Définit les coordonées du point.
     * @param coord.x
     * @param coord.y
     */
    Point.prototype.setCoord = function( coord ){
        this.x = coord.x;
        this.y = coord.y;
    };
    
    /**
     * Dessine le point dans le context2D.
     * @param context:CanvasRenderingContext2D
     *  Si context n'est pas pas définit, le context par défaut est chargé.
     */
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
    /**
     * Retourne la distance avec le point passé en argument.
     * @param point
     */
    Point.prototype.distance = function( point ){
        return Math.sqrt( 
            ( this.x - point.getCoord().x ) * ( this.x - point.getCoord().x ) +
            ( this.y - point.getCoord().y ) * ( this.y - point.getCoord().y )
        );
    };
    window.stateAutomaton.graphic.Point = Point;
})(window);
/**
 * Classe Line
 * @author Pierre-Luc BLOT
 * @created 13/11/15
 *
 * @requires StateAutomaton.src.js
 * @requires Point.src.js
 */
 (function(window){
    'use strict';

    /**
     * @constructor
     * @param param.start:Point
     *  Point de départ
     * @param param.end:Point
     *  Point d'arrivé
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

        this.middle = new stateAutomaton.graphic.Point({
            coord:{
                x: ( this.start.getCoord().x + this.end.getCoord().x ) / 2,
                y: ( this.start.getCoord().y + this.end.getCoord().y ) / 2
            }
        });

        this.norm = this.start.distance( this.end );
    };

    /**
     * Retourne le point de départ de la ligne.
     * @return Point
     */
    Line.prototype.getStartPoint = function() {
        return this.start;
    };

    /**
     * Retourne le point d'arrivé de la ligne.
     * @return Point
     */
    Line.prototype.getEndPoint = function() {
        return this.end;
    };

    /**
     * Dessine la ligne entre le point de départ et d'arrivé.
     * @param context:CanvasRenderingContext2D
     *  Si context n'est pas pas définit, le context par défaut est chargé.
     */
    Line.prototype.draw = function( context ){
        if ( typeof context === "undefined" ){
            context = window.stateAutomaton.graphic.defaultContext;
        }
        context.beginPath();
        context.moveTo( this.start.getCoord().x, this.start.getCoord().y );
        context.lineTo( this.end.getCoord().x, this.end.getCoord().y );
        context.stroke();
    };

    /**
     * Retourne l'angle formé entre le point de départ et le point d'arrivé.
     * L'angle est exprimé en Radian et est orienté.
     */
    Line.prototype.getAngle = function(){
        return this.angle;
    };

    
    Line.prototype.getMiddle = function(){
        return this.middle;
    };

    Line.prototype.getNorm = function(){
        return this.norm;
    };

    window.stateAutomaton.graphic.Line = Line;
 })(window);
/**
 * Classe Arc
 * @author Pierre-Luc BLOT
 * @created 13/11/15
 *
 * @requires StateAutomaton.src.js
 * @requires Point.src.js
 * @requires Line.src.js
 */

 (function(window){
    'use strict';

    /**
     * Construit un Arc en utilisant une courbe de bezier avec deux points de contrôle.

     * @constructor
     * @param param.start: Point
     *  Point de départ de l'arc
     * @param param.end:Point
     *  Point d'arrive de l'arc
     * @param param.height:number
     *  Hauteur de l'arc.
     */
    var Arc = function( param ) {
        this.start = param.start;
        this.end = param.end;
        this.height = param.height;

        var baseArc = new stateAutomaton.graphic.Line({
            start: this.start,
            end: this.end
        });

        this.control1 = new stateAutomaton.graphic.Point({
            coord:{
                x: this.start.getCoord().x + this.height * Math.cos( baseArc.getAngle() + Math.PI / 2 + Math.PI / 11),
                y: this.start.getCoord().y + this.height * Math.sin( baseArc.getAngle() + Math.PI / 2 + Math.PI / 11)
            }
        });

        this.control2 = new stateAutomaton.graphic.Point({
            coord:{
                x: this.end.getCoord().x + this.height * Math.cos( baseArc.getAngle() + Math.PI / 2 - Math.PI / 11),
                y: this.end.getCoord().y + this.height * Math.sin( baseArc.getAngle() + Math.PI / 2 - Math.PI / 11)
            }
        });
    };

    /**
     * Retourne la hauteur du point de contrôle.
     * @return number
     */
    Arc.prototype.getHeight = function(){
        return this.height;
    };

    /**
     * Retourne le point de contrôle associé au point de départ.
     * @return Point
     */
    Arc.prototype.getStartControlPoint = function(){
        return this.control1;
    };

    /**
     * Retourne le point de contrôle associé au point d'arrivé.
     * @return Point
     */
    Arc.prototype.getEndControlPoint = function(){
        return this.control2;
    };

    /**
     * Retourne le point de départ de l'arc.
     * @return Point
     */
    Arc.prototype.getStartPoint = function(){
        return this.start;
    };

    /**
     * Retourne le point d'arrivé de l'arc.
     * @return Point
     */
    Arc.prototype.getEndPoint = function(){
        return this.end;
    };

    /**
     * Dessine le cercle dans le contexte2D.
     * @param context:CanvasRenderingContext2D
     *  Si context n'est pas pas définit, le context par défaut est chargé.
     */
    Arc.prototype.draw = function( context ){
        if ( typeof context === "undefined" ){
            context = window.stateAutomaton.graphic.defaultContext;
        }
        context.beginPath();        
        context.moveTo( this.start.getCoord().x, this.start.getCoord().y );
        context.bezierCurveTo( this.control1.getCoord().x, this.control1.getCoord().y, 
                               this.control2.getCoord().x, this.control2.getCoord().y,
                               this.end.getCoord().x, this.end.getCoord().y
        );
        context.stroke();
    };

    window.stateAutomaton.graphic.Arc = Arc;
 })(window);
/**
 * Classe HeadArrow
 * @author Pierre-Luc BLOT
 * @created 13/11/15
 *
 * @requires StateAutomaton.src.js
 */
(function(window){
    'use strict';

    /**
     * @constructor
     * Construit la tête d'une flèche en fonction de sa longueur et sa largeur. 
     * Du point situé à la pointe de la flèche ainsi que d'un angle d'inclinaison.
     * @param param.origin: Point
     *  Pointe de la flèche.
     * @param param.height: number
     *  Largeur de la flèche.
     * @param param.width: number
     *  Longueur de la flèche.
     * @param param.angle: number
     *  Angle d'inclinaison exprimé en radians.
     */
    var HeadArrow = function( param ){
        this.origin = param.origin;
        this.height = param.height;
        this.width = param.width;
        this.angle = param.angle;
    };

    /**
     * Retourne le point de la pointe de la tête de flèche.
     * @return Point
     */
    HeadArrow.prototype.getOrigin = function(){
        return this.origin;
    };

    /**
     * Retourne la largeur de la tête de flèche.
     * @return number
     */
    HeadArrow.prototype.getHeight = function(){
        return this.height;
    };

    /**
     * Retourne la longueur de la tête de flèche.
     * @return number
     */
    HeadArrow.prototype.getWidth = function(){
        return this.width;
    };

    /**
     * Dessine la tête de flèche dans le context2D
     * @param context:CanvasRenderingContext2D
     *  Si context n'est pas pas définit, le context par défaut est chargé.
     */  
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
 * Classe ArcArrow
 * @author Pierre-Luc BLOT
 * @created 13/11/15
 *
 * @requires StateAutomaton.src.js
 * @requires HeadArrow.src.js
 * @requires Line.src.js
 */

 (function(window){
    'use strict';

    /**
     * Construit un ArcArrow en utilisant une courbe de bezier avec deux points de contrôle.
     
     * @constructor
     * @param param.start: Point
     *  Point de départ de l'arcArrow
     * @param param.end:Point
     *  Point d'arrive de l'arcArrow
     * @param param.height:number
     *  Hauteur de l'arcArrow.
     * @param param.direction: string
     *  'both' : bidirectionnelle
     *  'left' : tête de flèche sur le point de départ
     *  'right' : tête de flèche sur le point d'arrivé
     *  'right' par défaut.
     */
    var ArcArrow = function( param ) {
        this.arc = new stateAutomaton.graphic.Arc( param );
        
        var alphaRight = new stateAutomaton.graphic.Line({
            end: this.arc.getEndControlPoint(),
            start: this.arc.getEndPoint()
        }).getAngle();

        this.arrowRight = new stateAutomaton.graphic.HeadArrow({
            origin: this.arc.getEndPoint(),
            height: 5,
            width: 5,
            angle: alphaRight
        });

        var alphaLeft = new stateAutomaton.graphic.Line({
            end: this.arc.getStartControlPoint(),
            start: this.arc.getStartPoint()
        }).getAngle();

        this.arrowLeft = new stateAutomaton.graphic.HeadArrow({
            origin: this.arc.getStartPoint(),
            height: 5,
            width: 5,
            angle: alphaLeft + Math.PI 
        });

        this.direction = 'right';
        if ( typeof param.direction == "string" ){
            this.direction = param.direction;
        }
    };

    /**
     * Retourne la direction des flèches.
     */
    ArcArrow.prototype.getDirection = function(){
        return this.direction;
    };

    /**
     * Retourne le point de départ de l'arcArrow.
     * @return Point
     */
    ArcArrow.prototype.getArc = function(){
        return this.arc;
    };

    /**
     * Dessine le cercle dans le contexte2D.
     * @param context:CanvasRenderingContext2D
     *  Si context n'est pas pas définit, le context par défaut est chargé.
     */
    ArcArrow.prototype.draw = function( context ){
        if ( typeof context === "undefined" ){
            context = window.stateAutomaton.graphic.defaultContext;
        }
        this.arc.draw( context );

        if ( this.direction == 'left' || this.direction == 'both' ){
            this.arrowLeft.draw( context );
        }
        if ( this.direction == 'right' || this.direction == 'both' ){
            this.arrowRight.draw( context );
        }
    };

    window.stateAutomaton.graphic.ArcArrow = ArcArrow;
 })(window);
/**
 * Classe Arrow
 * @author Pierre-Luc BLOT
 * @created 13/11/15
 *
 * @requires StateAutomaton.src.js
 * @requires Line.src.js
 * @requires HeadArrow.src.js
 */
(function(window){
    'use strict';

    /**
     * @constructor
     * Construit une flèche unidirectionnelle ou bidirectionnelle entre deux points déterminant les extrémités.
     * @param param.start: Point
     *  Point de départ de la flèche.
     * @param param.end: Point
     *  Point d'arrivé de la flèche.
     * @param param.direction: string
     *  'both' : bidirectionnelle
     *  'left' : tête de flèche sur le point de départ
     *  'right' : tête de flèche sur le point d'arrivé
     *  'right' par défaut.
     */
    var Arrow = function( param ){
        this.start = param.start;
        this.end = param.end;

        this.line = new stateAutomaton.graphic.Line({
            start: this.start,
            end: this.end
        });

        this.direction = 'right';
        if ( typeof param.direction == "string" ){
            this.direction = param.direction;
        }

        this.endHeadArrow = new stateAutomaton.graphic.HeadArrow({
            origin: this.start,
            angle: this.line.getAngle(),
            height: 7,
            width: 7
        });
    
        this.startHeadArrow = new stateAutomaton.graphic.HeadArrow({
            origin: this.end,
            angle: this.line.getAngle() + Math.PI,
            height: 7,
            width: 7
        });

    };

    /**
     * Retourne le point de départ de la flèche.
     * @return Point
     */
    Arrow.prototype.getStartPoint = function(){
        return this.start;
    };

    /**
     * Retourne le point d'arrivé de la flèche.
     * @return Point
     */
    Arrow.prototype.getEndPoint = function(){
        return this.end;
    };

    /**
     * Retourne la direction des flèches.
     */
    Arrow.prototype.getDirection = function(){
        return this.direction;
    };

    /**
     * Dessine la flèche dans le context2D.
     * @param context:CanvasRenderingContext2D
     *  Si context n'est pas pas définit, le context par défaut est chargé.
     */
    Arrow.prototype.draw = function( context ){
        if ( typeof context === "undefined" ){
            context = window.stateAutomaton.graphic.defaultContext;
        }
        this.line.draw( context );
        if ( this.direction == 'right' || this.direction == 'both' ){
            this.endHeadArrow.draw( context );
        }
        if ( this.direction == 'left' || this.direction == 'both' ){
            this.startHeadArrow.draw( context );
        }
    };
    window.stateAutomaton.graphic.Arrow = Arrow;
})(window);

/**
 * Classe Circle
 * @author Pierre-Luc BLOT
 * @created 13/11/15
 *
 * @requires StateAutomaton.src.js
 * @requires Point.src.js
 */

 (function(window){
	'use strict';

	/**
	 * Construit un Cercle à partir d'un Point représentant le centre du cercle et d'un rayon ou d'un Point 
	 * par lequel il passe.
	 *
	 * @constructor
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

	/**
	 * Retourne le centre du cercle.
	 * @return Point
	 */
	Circle.prototype.getCenter = function() {
		return this.center;
	};

	/**
	 * Retourne le rayon du cercle.
	 */
	Circle.prototype.getRadius = function() {
		return this.radius;
	};

	/**
	 * Dessine le cercle dans le contexte2D.
	 * @param context:CanvasRenderingContext2D
	 *	Si context n'est pas pas définit, le context par défaut est chargé.
	 */
	Circle.prototype.draw = function( context ){
		if ( typeof context === "undefined" ){
			context = window.stateAutomaton.graphic.defaultContext;
		}
		context.beginPath();
		context.arc( this.center.getCoord().x, this.center.getCoord().y, this.radius, 0, Math.PI * 2, true );
		context.stroke();
	};

	/**
	 * Retourne le point sur le cercle grâce à son angle.
	 */
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