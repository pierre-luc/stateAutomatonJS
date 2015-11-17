/**
 * Classe Text
 * @author Pierre-Luc BLOT
 * @created 16/11/15
 *
 * @requires ../StateAutomaton.src.js
 * @requires Style.src.js
 */

 (function(window){
    'use strict';

    /**
     * Construit un Texte à partir d'un point de départ.
     * @constructor
     * @param param.start: Point
     *  Point de départ du texte
     * @param param.text: string
     *  Texte à afficher
     * @param param.style: Style
     *  Style du tracé.
     */
    var Text = function( param ) {
        this.text = param.text;
        this.point = param.point;
        var self = this;
        $( this.point ).on( 'change', function(){
            $( self ).trigger( 'change' );
        });

        this.style = param.style ? param.style : new stateAutomaton.graphic.Style();
         // todo:  les param non explicit seront implémentés ultérieurement
        this.font = this.style.getFont();
        this.textAlign = this.style.getTextAlign();
        this.textBaseline = this.style.getBaseline();
        this.fillColor = this.style.getFillColor();
    };

    /** 
     * Retourne le style de la ligne.
     * @return Style
     */
    Text.prototype.getStyle = function(){
        return this.style;
    };

    /**
     * Retourne le texte à afficher.
     * @return string
     */
    Text.prototype.getText = function(){
        return this.text;
    };

    /**
     * Retourne le point où le texte sera affiché.
     */
    Text.prototype.getPoint = function(){
        return this.point;
    };

    Text.prototype.setPoint = function( point ){
        this.point = point;
        $( this ).trigger( 'change' );
    };

    /**
     * @return textPxLength: longueur du texte dessiné en pixel.
     */
    Text.prototype.getTextPxLength = function( context ){
        if ( typeof context == "undefined" ){
            throw "Le context du canvas doit être définit.";
        }
        return context.measureText( this.text );
    };

    /**
     * Dessine le cercle dans le contexte2D.
     * @param context:CanvasRenderingContext2D
     *  Si context n'est pas pas définit, le context par défaut est chargé.
     */
    Text.prototype.draw = function( context ){
        if ( typeof context === "undefined" ){
            context = window.stateAutomaton.graphic.defaultContext;
        }
        context.beginPath();        
        this.style.apply( context );
        context.fillText( this.text, this.point.getCoord().x, this.point.getCoord().y );
        context.stroke();
        this.style.restore( context );
    };

    window.stateAutomaton.graphic.Text = Text;
 })(window);