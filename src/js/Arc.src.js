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

        this.middleControl = new stateAutomaton.graphic.Point({
            coord: {
                x: ( this.control1.getCoord().x + this.control2.getCoord().x ) / 2,
                y: ( this.control1.getCoord().y + this.control2.getCoord().y ) / 2
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

    Arc.prototype.getMiddleControlPoint = function(){
        return this.middleControl;
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