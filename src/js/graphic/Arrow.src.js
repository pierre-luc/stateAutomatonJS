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

        var self = this;
        $( this ).on( 'start_change', function(){
            configureArrow( self );
            $( self ).trigger( 'change' );
        });

        $( this ).on( 'end_change', function(){
            configureArrow( self );
            $( self ).trigger( 'change' );
        });

        $( this.start ).on( 'change', function(){
            configureArrow( self );
            $( self ).trigger( 'change' );
        });

        $( this.end ).on( 'change', function(){
            configureArrow( self );
            $( self ).trigger( 'change' );
        });
        configureArrow( self );
    };

    var configureArrow = function( self ){
        var dxs = 0,
            dys = 0,
            dxe = 0,
            dye = 0,
            angle = new stateAutomaton.graphic.Line({
                start: self.start,
                end: self.end
            }).getAngle();
            


        var S = new stateAutomaton.graphic.Point({
            coord:{
                x: self.start.getCoord().x + dxs,
                y: self.start.getCoord().y + dys
            }
        });
        var E = new stateAutomaton.graphic.Point({
            coord:{
                x: self.end.getCoord().x + dxe,
                y: self.end.getCoord().y + dye
            }
        });

        self.line = new stateAutomaton.graphic.Line({
            start: S,
            end: E,
            style: self.style
        });


        var angleStart = angle;
        var angleEnd = angle + Math.PI;
        var v = self.line.getVector();

        if ( v.x > 0 && v.y < 0 ){ // haut droite
            angleStart = angle + Math.PI;
            angleEnd = angle;
        }
        if ( v.x > 0 && v.y > 0 ){ // haut gauche
            angleStart = angle + Math.PI;
            angleEnd = angle;    
        }

        
        self.endHeadArrow = new stateAutomaton.graphic.HeadArrow({
            origin: self.start,
            angle:  angleStart,
            height: 5,
            width: 5,
            style: self.style
        });
    
        self.startHeadArrow = new stateAutomaton.graphic.HeadArrow({
            origin: self.end,
            angle: angleEnd,
            height: 5,
            width: 5,
            style: self.style
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

    Arrow.prototype.setStartPoint = function( point ){
        this.start = point;
        $( this ).trigger( 'start_change' );
    };

    Arrow.prototype.setEndPoint = function( point ){
        this.end = point;
        $( this ).trigger( 'end_change' );
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
