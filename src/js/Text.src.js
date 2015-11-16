/**
 * Classe Text
 * @author Pierre-Luc BLOT
 * @created 16/11/15
 *
 * @requires StateAutomaton.src.js
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
     */
    var Text = function( param ) {
        this.text = param.text;
        this.point = param.point;

         // todo:  les param non explicit seront implémentés ultérieurement
        this.font = param.font ? param.font : '20px Helvetica'; // param non explicit
        this.textAlign = param.textAlign ? param.textAlign : "left"; // param non explicit
        this.textBaseline = param.baseline ? param.baseline : "top"; // param non explicit
        var fillColor = 'black'; // param non explicit
        if ( param.color ){
            fillColor = o.color.fill ? o.color.fill : fillColor;
        }
        this.fillColor = fillColor;
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
        context.font = this.font;
        context.textAlign = this.textAlign;
        context.textBaseline = this.textBaseline;
        context.fillStyle = this.fillColor;
        context.fillText( this.text, this.point.getCoord().x, this.point.getCoord().y );
        context.stroke();
    };

    window.stateAutomaton.graphic.Text = Text;
 })(window);