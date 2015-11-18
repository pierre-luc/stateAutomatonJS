/**
 * Classe State
 * @author Pierre-Luc BLOT
 * @created 18/11/15
 *
 * @requires ../StateAutomaton.src.js
 * @requires ../graphic/Text.src.js
 * @requires ../graphic/Style.src.js
 * @requires ../graphic/Circle.src.js
 */

 (function(window){
    'use strict';

    /**
     * Construit un état
     * @constructor
     * @param param.name: string
     * @param param.position.col: number
     * @param param.position.row: number
     */
    var State = function( param ) {
        var self = this;

        this.name = param.name;
        this.position = param.position;
        this.style = new stateAutomaton.graphic.Style({
            color: 'black',
            fillColor: 'black',
            textAlign: 'center',
            baseline: 'middle'
        });

        this.center = null;
        this.size = null;
        
        $( this ).on( 'change', function(){
            change( self );
        });
    };

    var change = function( self ){
        self.circle = new stateAutomaton.graphic.Circle({
            center: self.center,
            radius: self.size
        });
        self.text = new stateAutomaton.graphic.Text({
            text: self.name,
            point: self.center,
            textAlign: 'center',
            style: self.style
        });
    };

    State.prototype.getPosition = function(){
        return this.position;
    };

    State.prototype.getName = function(){
        return this.name;
    };

    State.prototype.getCenter = function(){
        return this.center;
    };

    State.prototype.getCircle = function(){
        return this.circle;
    };

    State.prototype.getStyle = function(){
        return this.style;
    };

    /**
     * @param param.size: number
     * @param param.center: Point
     */
    State.prototype.define = function( param ){
        this.size = param.size;
        this.center = param.center;
        $( this ).trigger( 'change' );
    };

    State.prototype.draw = function( context ){
        if ( typeof context === "undefined" ){
            context = window.stateAutomaton.graphic.defaultContext;
        }
        if ( typeof this.center === null ){
            throw "Le centre ne doit pas être null.";
        }
        if ( typeof this.size === null ){
            throw "La taille ne pas être null.";
        }

        this.style.apply( context );
        this.circle.draw( context );
        this.text.draw( context );
        this.style.restore( context );
    };

    window.stateAutomaton.automaton.State = State;
 })(window);
