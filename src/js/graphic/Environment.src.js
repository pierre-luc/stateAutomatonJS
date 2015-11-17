/**
 * Classe Environment
 * @author Pierre-Luc BLOT
 * @created 17/11/15
 *
 * @requires ../StateAutomaton.src.js
 */

 (function(window){
    'use strict';

    /**
     * Construit un environnement graphic associé à un canvas.
     * @constructor
     * @param canvas
     * @param antialiasing
     */
    var Environment = function( canvas, antialiasing ) {
        if ( typeof canvas === "undefined" ){
            throw "Un canvas est nécessaire pour construire un environnement graphique.";
        }
        this.canvas = canvas;
        this.context = stateAutomaton.graphic.getContext( canvas, antialiasing );
        this.elementsCount = 0;
        this.elements = {};
    };


    Environment.prototype.getWidth = function(){
        return this.canvas.width;
    };

    Environment.prototype.getHeight = function(){
        return this.canvas.width;
    };

    Environment.prototype.addElement = function( name, element ){
        if ( typeof this.elements[ name ] === "undefined" ){
            this.elements[ name ] = element;
            ++this.elementsCount;
        }
    };

    Environment.prototype.addElements = function( elements ){
        for ( var i in elements ){
            this.addElement( i, elements[ i ] );
        }
    };

    Environment.prototype.getElement = function( name ){
        return this.elements[ name ];
    };

    Environment.prototype.getContext = function(){
        return this.context;
    };

    Environment.prototype.clear = function(){
        this.elements = [];
        this.context.clearRect( 0, 0, this.canvas.width, this.canvas.height );
    };

    Environment.prototype.redraw = function(){
        this.context.save();
        this.context.clearRect( 0, 0, this.canvas.width, this.canvas.height );
        this.draw();
        this.context.restore();
    };

    Environment.prototype.draw = function(){
        for ( var i in this.elements ){
            this.elements[ i ].draw( this.context );
        }
    };

    Environment.prototype.getImage = function(){
        var image = new Image();
        image.src = this.canvas.toDataUrl();
        return image;
    };

    window.stateAutomaton.graphic.createEnvironment = function( canvas, antialiasing ){
        return new stateAutomaton.graphic.Environment( canvas, antialiasing );
    };
    window.stateAutomaton.graphic.Environment = Environment;
 })(window);