/**
 * Classe Arc
 * @author Pierre-Luc BLOT
 * @created 13/11/15
 *
 * @requires ../StateAutomaton.src.js
 * @requires Point.src.js
 * @requires Line.src.js
 * @requires Style.src.js
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
     * @param param.style: Style
     *  Style de l'arc.
     */
    var Arc = function( param ) {
        this.start = param.start;
        this.end = param.end;
        this.height = param.height;
        this.style = param.style ? param.style : new stateAutomaton.graphic.Style();

        computeControls( this );
    };

    var computeControls = function( self ){
        var baseself = new stateAutomaton.graphic.Line({
            start: self.start,
            end: self.end
        });

        self.control1 = new stateAutomaton.graphic.Point({
            coord:{
                x: self.start.getCoord().x + self.height * Math.cos( baseself.getAngle() + Math.PI / 2 + Math.PI / 11),
                y: self.start.getCoord().y + self.height * Math.sin( baseself.getAngle() + Math.PI / 2 + Math.PI / 11)
            }
        });

        self.control2 = new stateAutomaton.graphic.Point({
            coord:{
                x: self.end.getCoord().x + self.height * Math.cos( baseself.getAngle() + Math.PI / 2 - Math.PI / 11),
                y: self.end.getCoord().y + self.height * Math.sin( baseself.getAngle() + Math.PI / 2 - Math.PI / 11)
            }
        });

        self.middleControl = new stateAutomaton.graphic.Point({
            coord: {
                x: ( self.control1.getCoord().x + self.control2.getCoord().x ) / 2,
                y: ( self.control1.getCoord().y + self.control2.getCoord().y ) / 2
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

    Arc.prototype.setHeight = function( height ){
        this.height = height;
        computeControls( this );
    };

    Arc.prototype.getMiddleControlPoint = function(){
        computeControls( this );
        return this.middleControl;
    };

    /**
     * Retourne le point de contrôle associé au point de départ.
     * @return Point
     */
    Arc.prototype.getStartControlPoint = function(){
        computeControls( this );
        return this.control1;
    };

    /**
     * Retourne le point de contrôle associé au point d'arrivé.
     * @return Point
     */
    Arc.prototype.getEndControlPoint = function(){
        computeControls( this );
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
        this.style.apply( context );
        context.moveTo( this.start.getCoord().x, this.start.getCoord().y );
        context.bezierCurveTo( this.control1.getCoord().x, this.control1.getCoord().y, 
                               this.control2.getCoord().x, this.control2.getCoord().y,
                               this.end.getCoord().x, this.end.getCoord().y
        );
        context.stroke();
        this.style.restore( context );
    };

    window.stateAutomaton.graphic.Arc = Arc;
 })(window);