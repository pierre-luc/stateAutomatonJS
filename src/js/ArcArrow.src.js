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