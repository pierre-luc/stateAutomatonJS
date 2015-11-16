/**
 * Classe Style
 * @author Pierre-Luc BLOT
 * @created 16/11/15
 *
 * @requires StateAutomaton.src.js
 */

 (function(window){
    'use strict';

    /**
     * Construit un Style permettant de modifier le style d'un context.
     * @constructor
     * @param param.lineWidth: number
     *  Epaisseur du traçage
     * @param param.fillColor: string
     *  Couleur de remplissage
     * @param param.color: string
     *  Couleur de traçage
     * @param param.font: string
     *  Font utilisée pour le texte
     * @param param.textAlign: string
     *  Alignement du texte: left|center|right
     * @param param.baseline: string
     *  Baseline: bottom|middle|top
     */
    var Style = function( param ) {
        this.lineWidth = param.lineWidth ? param.lineWidth : 1;
        this.fillStyle = param.fillColor ? param.fillColor : 'white';
        this.strokeStyle = param.color ? param.color : 'black';
        this.font = param.font ? param.font : '20px Helvetica';
        this.textAlign = param.textAlign ? param.textAlign : "left";
        this.textBaseline = param.baseline ? param.baseline : "top";

        this.context = {};
        this.paramContext = [ 
            'lineWidth', 'fillStyle', 'strokeStyle', 'textBaseline', 'textAlign', 'font'
        ];
    };

    /**
     * Retourne le type d'alignement du texte.
     * @return string
     */
    Style.prototype.getTextAlign = function(){
        return this.textAlign;
    };

    /**
     * Retourne le type d'alignement baseline.
     * @return string
     */
    Style.prototype.getBaseline = function(){
        return this.textBaseline;
    };

    /**
     * Retourne la font utilisée.
     * @return string
     */
    Style.prototype.getFont = function(){
        return this.font;
    };

    /**
     * Retourne l'épaisseur du traçage.
     * @return number
     */
    Style.prototype.getLineWidth = function(){
        return this.lineWidth;
    };

    /**
     * Retourne la couleur de remplissage.
     * @return string
     */
    Style.prototype.getFillColor = function(){
        return this.fillStyle;
    };

    /**
     *  Retourne la couleur de traçage.
     * @return string
     */
    Style.prototype.getColor = function(){
        return this.strokeStyle;
    };

    /**
     * Applique le style au context et sauve l'état du contexte.
     */
    Style.prototype.apply = function( context ){
        var i, property;
        // sauvegarde du style du context
        for ( i in this.paramContext ){
            property = this.paramContext[ i ];
            this.context[ property ] = context[ property ];
        }
        // application du style
        for ( i in this.paramContext ){
            property = this.paramContext[ i ];
            context[ property ] = this[ property ];
        }
        
    };

    /**
     * Permet de rétablir l'état du context sauvé.
     */
    Style.prototype.restore = function( context ){
        for ( var i in this.paramContext ){
            var property = this.paramContext[ i ];
            context[ property ] = this.context[ property ];
        }
    };
    
    window.stateAutomaton.graphic.Style = Style;
 })(window);