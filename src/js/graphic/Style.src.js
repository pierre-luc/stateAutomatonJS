/**
 * Classe Style
 * @author Pierre-Luc BLOT
 * @created 16/11/15
 *
 * @requires ../StateAutomaton.src.js
 */

 (function(window){
    'use strict';

    /**
     * Construit un Style permettant de modifier le style d'un context.
     * @constructor
     * @param param.lineWidth: number
     *  Epaisseur du traçage. Default: 1
     * @param param.fillColor: string
     *  Couleur de remplissage. Default: white
     * @param param.color: string
     *  Couleur de traçage. Default: black
     * @param param.font: string
     *  Font utilisée pour le texte. Default: 20px Helvetica
     * @param param.textAlign: string
     *  Alignement du texte: left|center|right. Default: left
     * @param param.baseline: string
     *  Baseline: bottom|middle|top. Default: top
     * @param param.lineStyle: string
     *  Affichage des tracés en pointillé ou normal. 
     *  normal|dashed. Default: normal
     */
    var Style = function( param ) {
        if ( typeof param === "undefined" ){
            param = {};
        }
        this.lineWidth = param.lineWidth ? param.lineWidth : 1;
        this.fillStyle = param.fillColor ? param.fillColor : 'white';
        this.strokeStyle = param.color ? param.color : 'black';
        this.font = param.font ? param.font : '20px Helvetica';
        this.textAlign = param.textAlign ? param.textAlign : "left";
        this.textBaseline = param.baseline ? param.baseline : "top";
        this.lineStyle = param.lineStyle ? param.lineStyle : 'normal';
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
     * Définit le type d'alignement du texte.
     * @param o: string
     */
    Style.prototype.setTextAlign = function( s ){
        this.textAlign = s;
    };

    /**
     * Définit le type d'alignement baseline.
     * @param o: string
     */
    Style.prototype.setBaseline = function( o ){
        this.textBaseline = o;
    };

    /**
     * Définit la font utilisée.
     * @param o: string
     */
    Style.prototype.setFont = function( o ){
        this.font = o;
    };

    /**
     * Définit l'épaisseur du traçage.
     * @param o: number
     */
    Style.prototype.setLineWidth = function( o ){
        this.lineWidth = o;
    };

    /**
     * Définit la couleur de remplissage.
     * @param o: string
     */
    Style.prototype.setFillColor = function( o ){
        this.fillStyle = o;
    };

    /**
     *  Définit la couleur de traçage.
     * @param o: string
     */
    Style.prototype.setColor = function( o ){
        this.strokeStyle = o;
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
        this.context.lineStyle = context.getLineDash();

        // application du style
        for ( i in this.paramContext ){
            property = this.paramContext[ i ];
            context[ property ] = this[ property ];
        }

        switch( this.lineStyle ){
            case 'dashed':
                context.setLineDash( [ 5, 15 ] );
                break;
            case 'normal':
                context.setLineDash( [] );
                break;
            default:
                context.setLineDash( [] );
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
        context.setLineDash( this.context.lineStyle );
    };
    
    window.stateAutomaton.graphic.Style = Style;
 })(window);