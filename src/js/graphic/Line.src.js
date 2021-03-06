/**
 * Classe Line
 * @author Pierre-Luc BLOT
 * @created 13/11/15
 *
 * @requires ../StateAutomaton.src.js
 * @requires Point.src.js
 * @requires Style.src.js
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
        
        var self = this;
        $( this ).on( 'start_change', function(){
            computeAngle( self );
        });

        $( this ).on( 'end_change', function(){
            computeAngle( self );
        });

        $( this.start ).on( 'change', function(){
           computeAngle( self );
        });

        $( this.end ).on( 'change', function(){
           computeAngle( self );
        });
        computeAngle( self );

        $( this ).on( 'change', function(){
            self.middle = new stateAutomaton.graphic.Point({
                coord:{
                    x: ( self.start.getCoord().x + self.end.getCoord().x ) / 2,
                    y: ( self.start.getCoord().y + self.end.getCoord().y ) / 2
                }
            });
        });

        this.norm = this.start.distance( this.end );
        this.style = param.style ? param.style : new stateAutomaton.graphic.Style();
    };

    var computeAngle = function( self ){
        if ( self.start.getCoord().x == self.end.getCoord().x ){
            self.angle = Math.PI / 2;
        } else if ( self.start.getCoord().y == self.end.getCoord().y ){
            self.angle = 0;
        } else {
            self.angle = Math.atan( 
                ( self.end.getCoord().y - self.start.getCoord().y ) / 
                ( self.end.getCoord().x - self.start.getCoord().x )
            );
        }
    };

    Line.prototype.getStyle = function(){
        return this.style;
    };
    Line.prototype.setStyle = function( style ){
        this.style = style;
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

    Line.prototype.setStartPoint = function( point ){
        this.start = point;
        $( this ).trigger( 'start_change' );
        $( this ).trigger( 'change' );
    };

    Line.prototype.setEndPoint = function( point ){
        this.end = point;
        $( this ).trigger( 'end_change' );
        $( this ).trigger( 'change' );
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
        this.style.apply( context );
        context.moveTo( this.start.getCoord().x, this.start.getCoord().y );
        context.lineTo( this.end.getCoord().x, this.end.getCoord().y );
        context.stroke();
        this.style.restore( context );
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

    Line.prototype.getVector = function(){
        return {
            x: this.end.getCoord().x - this.start.getCoord().x,
            y: this.end.getCoord().y - this.start.getCoord().y
        };
    };

    window.stateAutomaton.graphic.Line = Line;
 })(window);