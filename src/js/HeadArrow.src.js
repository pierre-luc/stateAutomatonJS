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

        var A = {
            x: this.origin.getCoord().x,
            y: this.origin.getCoord().y
        };
        /*
        context.beginPath();
        var r = Math.sqrt( this.height * this.height / 4 + this.width * this.width );
        var beta = Math.atan( this.height / ( 2 * this.width ) );

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
        /*/
        var size = context.lineWidth;
        context.beginPath();
        context.save();
        context.translate(A.x, A.y);
        context.rotate(this.angle);

        

        context.moveTo(-this.width, 0);
        context.lineTo(-this.width, -this.height);
        context.lineTo(0, 0);
        context.lineTo(-this.width, this.height);
        context.lineTo(-this.width, 0);
        context.closePath();
        context.fill();
        context.restore();
        //*/
    };
    window.stateAutomaton.graphic.HeadArrow = HeadArrow;
})(window);

