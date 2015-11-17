/**
 * Classe ArcArrow
 * @author Pierre-Luc BLOT
 * @created 13/11/15
 *
 * @requires ../StateAutomaton.src.js
 * @requires HeadArrow.src.js
 * @requires Line.src.js
 * @requires Style.src.js
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
     * @param param.style: Style
     *  Style de l'arc.
     */
    var ArcArrow = function( param ) {
        this.style = param.style ? param.style : new stateAutomaton.graphic.Style();
        param.style = this.style;
        this.arc = new stateAutomaton.graphic.Arc( param );

        var self = this;
        $( this.arc ).on( 'change', function(){
            makeArrows( self );
            $( self ).trigger( 'change' );
        });
            
        makeArrows( this );

        this.direction = 'right';
        if ( typeof param.direction == "string" ){
            this.direction = param.direction;
        }
    };
    // cubic helper formula at T distance
    var cubicN = function(T, a, b, c, d) {
        var t2 = T * T;
        var t3 = t2 * T;
        return a + (-a * 3 + T * (3 * a - a * T)) * T + (3 * b + T * (-6 * b + b * 3 * T)) * T + (c * 3 - c * 3 * T) * t2 + d * t3;
    };

    var getCubicBezierXYatT = function(startPt, controlPt1, controlPt2, endPt, T) {
        var x = cubicN(T, startPt.x, controlPt1.x, controlPt2.x, endPt.x);
        var y = cubicN(T, startPt.y, controlPt1.y, controlPt2.y, endPt.y);
        return ({
            x: x,
            y: y
        });
    };

    var computeAngleBezierStartOrEnd = function(bez, dir) {
        var w = 0.1;
        var pointNearEnd, S, E, D, T;
        if ( dir == "end" ){
            S = {x: bez.sx, y: bez.sy};
            E = {x: bez.ex,y: bez.ey};
            D = E;
            T = 0.99 - w;
        } else {
            S = {x: bez.sx,y: bez.sy};
            E = {x: bez.ex,y: bez.ey};
            D = S;
            T = 0.01 + w;
        }            
        pointNearEnd = getCubicBezierXYatT(
            S, {x: bez.cx1, y: bez.cy1}, {x: bez.cx2, y: bez.cy2},
            E, T
        );
        var dx = D.x - pointNearEnd.x;
        var dy = D.y - pointNearEnd.y;
        return Math.atan2(dy, dx);
    };

    var makeArrows = function( self ){
        var bez1 = {
            sx: self.arc.getStartPoint().getCoord().x,
            sy: self.arc.getStartPoint().getCoord().y,
            cx1: self.arc.getStartControlPoint().getCoord().x,
            cy1: self.arc.getStartControlPoint().getCoord().y,
            cx2: self.arc.getEndControlPoint().getCoord().x,
            cy2: self.arc.getEndControlPoint().getCoord().y,
            ex: self.arc.getEndPoint().getCoord().x,
            ey: self.arc.getEndPoint().getCoord().y
        };

        self.arrowRight = new stateAutomaton.graphic.HeadArrow({
            origin: self.arc.getEndPoint(),
            height: 5,
            width: 5,
            angle: computeAngleBezierStartOrEnd(bez1, 'end'),
            style: self.style
        });

        self.arrowLeft = new stateAutomaton.graphic.HeadArrow({
            origin: self.arc.getStartPoint(),
            height: 5,
            width: 5,
            angle: computeAngleBezierStartOrEnd(bez1, 'start'),
            style: self.style
        });
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