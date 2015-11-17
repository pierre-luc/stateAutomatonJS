/**
 * Classe Arrow
 * @author Pierre-Luc BLOT
 * @created 13/11/15
 *
 * @requires ../StateAutomaton.src.js
 * @requires Line.src.js
 * @requires HeadArrow.src.js
 * @requires Style.src.js
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
     * @param param.style: Style
     *  Style du tracé.
     */
    var Arrow = function( param ){
        this.start = param.start;
        this.end = param.end;
        this.style = param.style ? param.style : new stateAutomaton.graphic.Style();
        this.direction = 'right';
        if ( typeof param.direction == "string" ){
            this.direction = param.direction;
        }

        var dxs = 0,
            dys = 0,
            dxe = 0,
            dye = 0,
            angle = new stateAutomaton.graphic.Line({
                start: this.start,
                end: this.end
            }).getAngle();
            


        var S = new stateAutomaton.graphic.Point({
            coord:{
                x: this.start.getCoord().x + dxs,
                y: this.start.getCoord().y + dys
            }
        });
        var E = new stateAutomaton.graphic.Point({
            coord:{
                x: this.end.getCoord().x + dxe,
                y: this.end.getCoord().y + dye
            }
        });

        this.line = new stateAutomaton.graphic.Line({
            start: S,
            end: E,
            style: this.style
        });


        var angleStart = angle;
        var angleEnd = angle + Math.PI;
        var v = this.line.getVector();

        if ( v.x > 0 && v.y < 0 ){ // haut droite
            angleStart = angle + Math.PI;
            angleEnd = angle;
        }
        if ( v.x > 0 && v.y > 0 ){ // haut gauche
            angleStart = angle + Math.PI;
            angleEnd = angle;    
        }

        
        this.endHeadArrow = new stateAutomaton.graphic.HeadArrow({
            origin: this.start,
            angle:  angleStart,
            height: 5,
            width: 5,
            style: this.style
        });
    
        this.startHeadArrow = new stateAutomaton.graphic.HeadArrow({
            origin: this.end,
            angle: angleEnd,
            height: 5,
            width: 5,
            style: this.style
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
