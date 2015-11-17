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
        if ( typeof antialiasing === "undefined" ){
            antialiasing = true;
        }
        this.antialiasing = antialiasing;
        this.canvas = canvas;
        this.context = stateAutomaton.graphic.getContext( canvas, antialiasing );
        this.elements = [];
    };

    Environment.prototype.getWidth = function(){
        return this.canvas.width;
    };

    Environment.prototype.getHeight = function(){
        return this.canvas.width;
    };

    Environment.prototype.addElement = function( element ){
        if ( typeof element === "undefined" ){
            throw "Impossible d'ajouter undefined";
        }
        this.elements.push( element );
    };

    Environment.prototype.addElements = function( elements ){
        if ( typeof elements === "undefined" ){
            throw "Impossible d'ajouter undefined";
        }
        for ( var i in elements ){
            this.addElement( elements[ i ] );
        }
    };


    Environment.prototype.getContext = function(){
        return this.context;
    };

    var clear = function( self ){
        if ( !self.antialiasing ){
            self.context.translate( -0.5, -0.5 );
        }
        self.context.clearRect( 0, 0, self.canvas.width, self.canvas.height );
        if ( !self.antialiasing ){
            self.context.translate( 0.5, 0.5 );
        }
    };

    Environment.prototype.clear = function(){
        this.elements = [];
        clear( this );
    };

    Environment.prototype.redraw = function(){
        this.context.save();
        clear( this );

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