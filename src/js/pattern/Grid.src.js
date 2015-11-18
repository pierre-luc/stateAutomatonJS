/**
 * Classe Grid
 * @author Pierre-Luc BLOT
 * @created 16/11/15
 *
 * @requires ../StateAutomaton.src.js
 * @requires ../graphic/Point.src.js
 */

 (function(window){
    'use strict';

    /**
     * Construit une grille permettant d'y placer des éléments.
     * @constructor
     * @param param.row: number
     * @param param.col: number
     * @param param.width: number
     * @param param.height: number
     */
    var Grid = function( param ) {
        this.row = param.row;
        this.col = param.col;
        this.width = param.width;
        this.height = param.height;
        this.colExtendCount = 0;
        this.rowExtendCount = 0;
        this.cell = {
            width: this.width / this.col,
            height: this.height / this.row
        };
    };

    Grid.prototype.getSizeCell = function(){
        return this.cell;
    };

    Grid.prototype.getRow = function(){
        return this.row;
    };

    Grid.prototype.getCol = function(){
        return this.col;
    };

    Grid.prototype.getHeight = function(){
        return this.height;
    };

    Grid.prototype.getWidth = function(){
        return this.width;
    };

    Grid.prototype.extendCol = function( canvas ){
        if ( typeof canvas === "undefined" ){
            throw "Un canvas doit être passé en paramètre";
        }
        var context = stateAutomaton.graphic.getContext( canvas );
 
        context.save();
        this.width += this.cell.width;
        ++this.col;
        ++this.colExtendCount;
        canvas.width = this.width;
    };


    Grid.prototype.extendRow = function( canvas ){
        if ( typeof canvas === "undefined" ){
            throw "Un canvas doit être passé en paramètre";
        }
        var context = stateAutomaton.graphic.getContext( canvas );
 
        context.save();
        this.height += this.cell.height;
        ++this.row;
        ++this.rowExtendCount;
        canvas.height = this.height;
    };

    Grid.prototype.getCellAt = function( col, row ){
        
        function createPoint( x, y, name ){
            return new stateAutomaton.graphic.Point({
                coord: { x:x, y:y },
                name: name ? name : ""
            });
        }

        var cell = {
            top: {
                left: createPoint( col * this.cell.width, row * this.cell.height ),
                center: createPoint( 
                    ( col * this.cell.width + ( col + 1 ) * this.cell.width ) / 2,
                    row * this.cell.height
                ),
                right: createPoint( ( col + 1 ) * this.cell.width, row * this.cell.height )
            },
            bottom: {
                left: createPoint( col * this.cell.width, ( row + 1 ) * this.cell.height ),
                center: createPoint( 
                    ( col * this.cell.width + ( col + 1 ) * this.cell.width ) / 2,
                    ( row + 1 ) * this.cell.height
                ),
                right: createPoint( ( col + 1 ) * this.cell.width, ( row + 1 ) * this.cell.height )
            },
            middle: createPoint( 
                (col * this.cell.width + (col + 1) * this.cell.width) / 2,
                (row * this.cell.height + (row + 1) * this.cell.height) / 2,
                "(" + col + ", " + row + ")"
            ),
            size: this.cell
        };
        return cell;
    };

    Grid.prototype.getMatrix = function(){
        var matrix = [];
        for ( var col = 0; col < this.col; ++col ){
            matrix[ col ] = [];
            for ( var row = 0; row < this.row; ++row ){
                matrix[ col ][ row ] = this.getCellAt( col, row );
            }
        }
        return matrix;
    };

    Grid.prototype.drawCell = function( cell, context ){
        if ( typeof context === "undefined" ){
            context = window.stateAutomaton.graphic.defaultContext;
        }
        context.beginPath();
        context.moveTo( cell.top.left.getCoord().x, cell.top.left.getCoord().y );
        context.lineTo( cell.top.right.getCoord().x, cell.top.right.getCoord().y );
        context.lineTo( cell.bottom.right.getCoord().x, cell.bottom.right.getCoord().y );
        context.lineTo( cell.bottom.left.getCoord().x, cell.bottom.left.getCoord().y );
        context.lineTo( cell.top.left.getCoord().x, cell.top.left.getCoord().y );
        context.stroke();
    };

    window.stateAutomaton.pattern.Grid = Grid;
 })(window);