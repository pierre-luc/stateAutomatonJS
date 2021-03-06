/*!
 * StateAutomatonJS - v0.6.7
 * @author Pierre-Luc BLOT
 * @created 13/11/15
 */
(function( window ){
    var stateAutomaton = {
        pattern: {},
        graphic: {
            defaultContext: null,
            antialiasing: true,
            /**
             * Retourne le context2D d'un canvas et permet d'activer l'anti-aliasing.
             * @param canvas:Element
             *  Référence vers un élément de type canvas
             * @param antialiasing:boolean
             *  Activation l'anti-aliasing, true par défaut.
             * @post
             *  Le premier context2D créé est sauvé en tant que context2D par défaut.
             */
            getContext: function( canvas, antialiasing ){
                if ( typeof canvas === "undefined" ){
                    if ( this.defaultContext === null ){
                        throw "Aucun context n'a été initialisé";
                    }
                    return this.defaultContext;
                }
                if ( typeof antialiasing === "undefined" ){
                    antialiasing = true;
                }
                var ctx = canvas.getContext( '2d' );
                if ( !this.antialiasing || !antialiasing ){
                    ctx.translate( 0.5, 0.5 ); // Move the canvas by 0.5px to fix blurring
                    ctx.imageSmoothingEnabled = true;
                    ctx.lineWidth = 0.5;
                } else {
                    ctx.imageSmoothingEnabled = true;
                    ctx.lineWidth = 1;
                }
                if ( this.defaultContext === null ){
                    this.defaultContext = ctx;
                }
                return ctx;
            },
            /**
             * Définit le context par défaut.
             * @param context:CanvasRenderingContext2D
             */
            setDefaultContext: function( context ){
                this.defaultContext = context;
            },
            /**
             * @param canvas
             * @param antialising
             */
            createEnvironment: function( canvas, antialiasing ){
                // résolu dans le fichier graphic/Environment.src.js
            }
        }
    };
    if ( typeof window.stateAutomaton === "undefined" ){
        window.stateAutomaton = stateAutomaton;
    }
})(window);
/**
 * Classe Point
 * @author Pierre-Luc BLOT
 * @created 13/11/15
 *
 * @requires ../StateAutomaton.src.js
 */
(function(window) {
    'use strict';
    
    /**
     * @constructor
     * @param param.coord.x
     * @param param.coord.y
     * @param param.name;
     */
    var Point = function( param ){
        this.x = param.coord.x;
        this.y = param.coord.y;
        this.name = param.name;
    };
    /**
     * Retourne les coordonnées du point.
     * @return {x, y}
     */
    Point.prototype.getCoord = function(){
        return {
            x: this.x,
            y: this.y
        };
    };
    /**
     * Définit les coordonées du point.
     * @param coord.x
     * @param coord.y
     */
    Point.prototype.setCoord = function( coord ){
        this.x = coord.x;
        this.y = coord.y;
        $( this ).trigger( 'change' );
    };

    Point.prototype.setName = function( name ){
        this.name = name;
        $( this ).trigger( 'change' );
    };
    
    /**
     * Dessine le point dans le context2D.
     * @param context:CanvasRenderingContext2D
     *  Si context n'est pas pas définit, le context par défaut est chargé.
     */
    Point.prototype.draw = function( context ){
        if ( typeof context === "undefined" ){
            context = window.stateAutomaton.graphic.defaultContext;
        }
        context.beginPath();
        context.moveTo( this.x - 5, this.y );
        context.lineTo( this.x + 5, this.y );
        context.moveTo( this.x, this.y - 5 );
        context.lineTo( this.x, this.y + 5 );
        context.lineWidth = 1;
        context.stroke();
    };
    /**
     * Retourne la distance avec le point passé en argument.
     * @param point
     */
    Point.prototype.distance = function( point ){
        return Math.sqrt( 
            ( this.x - point.getCoord().x ) * ( this.x - point.getCoord().x ) +
            ( this.y - point.getCoord().y ) * ( this.y - point.getCoord().y )
        );
    };
    window.stateAutomaton.graphic.Point = Point;
})(window);
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
            )
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
/**
 * Classe Line
 * @author Pierre-Luc BLOT
 * @created 13/11/15
 *
 * @requires ../StateAutomaton.src.js
 * @requires Point.src.js
 * @requires Style.src.js
 */
 (function(window){
    'use strict';

    /**
     * @constructor
     * @param param.start:Point
     *  Point de départ
     * @param param.end:Point
     *  Point d'arrivé
     */
    var Line = function( param ) {
        this.start = param.start;
        this.end = param.end;
        
        var self = this;
        $( this ).on( 'start_change', function(){
            computeAngle( self );
        });

        $( this ).on( 'end_change', function(){
            computeAngle( self );
        });

        $( this.start ).on( 'change', function(){
           computeAngle( self );
        });

        $( this.end ).on( 'change', function(){
           computeAngle( self );
        });
        computeAngle( self );

        $( this ).on( 'change', function(){
            self.middle = new stateAutomaton.graphic.Point({
                coord:{
                    x: ( self.start.getCoord().x + self.end.getCoord().x ) / 2,
                    y: ( self.start.getCoord().y + self.end.getCoord().y ) / 2
                }
            });
        });

        this.norm = this.start.distance( this.end );
        this.style = param.style ? param.style : new stateAutomaton.graphic.Style();
    };

    var computeAngle = function( self ){
        if ( self.start.getCoord().x == self.end.getCoord().x ){
            self.angle = Math.PI / 2;
        } else if ( self.start.getCoord().y == self.end.getCoord().y ){
            self.angle = 0;
        } else {
            self.angle = Math.atan( 
                ( self.end.getCoord().y - self.start.getCoord().y ) / 
                ( self.end.getCoord().x - self.start.getCoord().x )
            );
        }
    };

    Line.prototype.getStyle = function(){
        return this.style;
    };
    Line.prototype.setStyle = function( style ){
        this.style = style;
    };

    /**
     * Retourne le point de départ de la ligne.
     * @return Point
     */
    Line.prototype.getStartPoint = function() {
        return this.start;
    };

    /**
     * Retourne le point d'arrivé de la ligne.
     * @return Point
     */
    Line.prototype.getEndPoint = function() {
        return this.end;
    };

    Line.prototype.setStartPoint = function( point ){
        this.start = point;
        $( this ).trigger( 'start_change' );
        $( this ).trigger( 'change' );
    };

    Line.prototype.setEndPoint = function( point ){
        this.end = point;
        $( this ).trigger( 'end_change' );
        $( this ).trigger( 'change' );
    };

    /**
     * Dessine la ligne entre le point de départ et d'arrivé.
     * @param context:CanvasRenderingContext2D
     *  Si context n'est pas pas définit, le context par défaut est chargé.
     */
    Line.prototype.draw = function( context ){
        if ( typeof context === "undefined" ){
            context = window.stateAutomaton.graphic.defaultContext;
        }
        context.beginPath();
        this.style.apply( context );
        context.moveTo( this.start.getCoord().x, this.start.getCoord().y );
        context.lineTo( this.end.getCoord().x, this.end.getCoord().y );
        context.stroke();
        this.style.restore( context );
    };

    /**
     * Retourne l'angle formé entre le point de départ et le point d'arrivé.
     * L'angle est exprimé en Radian et est orienté.
     */
    Line.prototype.getAngle = function(){
        return this.angle;
    };

    
    Line.prototype.getMiddle = function(){
        return this.middle;
    };

    Line.prototype.getNorm = function(){
        return this.norm;
    };

    Line.prototype.getVector = function(){
        return {
            x: this.end.getCoord().x - this.start.getCoord().x,
            y: this.end.getCoord().y - this.start.getCoord().y
        };
    };

    window.stateAutomaton.graphic.Line = Line;
 })(window);
/**
 * Classe Arc
 * @author Pierre-Luc BLOT
 * @created 13/11/15
 *
 * @requires ../StateAutomaton.src.js
 * @requires Point.src.js
 * @requires Line.src.js
 * @requires Style.src.js
 */
 
 (function(window){
    'use strict';

    /**
     * Construit un Arc en utilisant une courbe de bezier avec deux points de contrôle.

     * @constructor
     * @param param.start: Point
     *  Point de départ de l'arc
     * @param param.end:Point
     *  Point d'arrive de l'arc
     * @param param.height:number
     *  Hauteur de l'arc.
     * @param param.style: Style
     *  Style de l'arc.
     */
    var Arc = function( param ) {
        this.start = param.start;
        this.end = param.end;
        this.height = param.height;
        this.style = param.style ? param.style : new stateAutomaton.graphic.Style();
        var self = this;
        
        $( this.start ).on( 'change', function(){
            computeControls( self );
            $( self ).trigger( 'change' );
        });

        $( this.end ).on( 'change', function(){
            computeControls( self );
            $( self ).trigger( 'change' );
        });

        $( this ).on( 'height_change', function(){
            computeControls( self );
            $( self ).trigger( 'change' );
        });

        $( this ).on( 'change', function(){
            self.middleControl.setCoord({
                x: ( self.control1.getCoord().x + self.control2.getCoord().x ) / 2,
                y: ( self.control1.getCoord().y + self.control2.getCoord().y ) / 2
            });
        });
        computeControls( self );
    };

    var computeControls = function( self ){
        var baseself = new stateAutomaton.graphic.Line({
            start: self.start,
            end: self.end
        });
        var height = self.height;
        if ( self.end.getCoord().x - self.start.getCoord().x < 0 ){
            height = - height;
        }        

        self.control1 = new stateAutomaton.graphic.Point({
            coord:{
                x: self.start.getCoord().x + height * Math.cos( baseself.getAngle() + Math.PI / 2 + Math.PI / 11),
                y: self.start.getCoord().y + height * Math.sin( baseself.getAngle() + Math.PI / 2 + Math.PI / 11)
            }
        });

        self.control2 = new stateAutomaton.graphic.Point({
            coord:{
                x: self.end.getCoord().x + height * Math.cos( baseself.getAngle() + Math.PI / 2 - Math.PI / 11),
                y: self.end.getCoord().y + height * Math.sin( baseself.getAngle() + Math.PI / 2 - Math.PI / 11)
            }
        });

        self.middleControl = new stateAutomaton.graphic.Point({
            coord: {
                x: ( self.control1.getCoord().x + self.control2.getCoord().x ) / 2,
                y: ( self.control1.getCoord().y + self.control2.getCoord().y ) / 2
            }
        });
    };

    /**
     * Retourne la hauteur du point de contrôle.
     * @return number
     */
    Arc.prototype.getHeight = function(){
        return this.height;
    };

    Arc.prototype.setHeight = function( height ){
        this.height = height;
        $( this ).trigger( 'height_change' );
    };

    Arc.prototype.getMiddleControlPoint = function(){
        return this.middleControl;
    };

    /**
     * Retourne le point de contrôle associé au point de départ.
     * @return Point
     */
    Arc.prototype.getStartControlPoint = function(){
        return this.control1;
    };

    /**
     * Retourne le point de contrôle associé au point d'arrivé.
     * @return Point
     */
    Arc.prototype.getEndControlPoint = function(){
        return this.control2;
    };

    /**
     * Retourne le point de départ de l'arc.
     * @return Point
     */
    Arc.prototype.getStartPoint = function(){
        return this.start;
    };

    /**
     * Retourne le point d'arrivé de l'arc.
     * @return Point
     */
    Arc.prototype.getEndPoint = function(){
        return this.end;
    };

    /**
     * Dessine le cercle dans le contexte2D.
     * @param context:CanvasRenderingContext2D
     *  Si context n'est pas pas définit, le context par défaut est chargé.
     */
    Arc.prototype.draw = function( context ){
        if ( typeof context === "undefined" ){
            context = window.stateAutomaton.graphic.defaultContext;
        }
        context.beginPath();        
        this.style.apply( context );
        context.moveTo( this.start.getCoord().x, this.start.getCoord().y );
        context.bezierCurveTo( this.control1.getCoord().x, this.control1.getCoord().y, 
                               this.control2.getCoord().x, this.control2.getCoord().y,
                               this.end.getCoord().x, this.end.getCoord().y
        );
        context.stroke();
        this.style.restore( context );
    };

    window.stateAutomaton.graphic.Arc = Arc;
 })(window);
/**
 * Classe HeadArrow
 * @author Pierre-Luc BLOT
 * @created 13/11/15
 *
 * @requires ../StateAutomaton.src.js
 * @requires Style.src.js
 */
(function(window){
    'use strict';

    /**
     * @constructor
     * Construit la tête d'une flèche en fonction de sa longueur et sa largeur. 
     * Du point situé à la pointe de la flèche ainsi que d'un angle d'inclinaison.
     * @param param.origin: Point
     *  Pointe de la flèche.
     * @param param.height: number
     *  Largeur de la flèche.
     * @param param.width: number
     *  Longueur de la flèche.
     * @param param.angle: number
     *  Angle d'inclinaison exprimé en radians.
     * @param param.style: Style
     *  Style du tracé.
     */
    var HeadArrow = function( param ){
        this.origin = param.origin;
        this.angle = param.angle;
        this.style = param.style ? param.style : new stateAutomaton.graphic.Style();
        this.style.setFillColor( this.style.getColor() );
        
        this.height = param.height + this.style.getLineWidth(); 
        this.width = param.width + this.style.getLineWidth();
    };

    /**
     * Retourne le style de tracé de la tête de flèche.
     * @return Style
     */
    HeadArrow.prototype.getStyle = function(){
        return this.style;
    };

    /**
     * Retourne le point de la pointe de la tête de flèche.
     * @return Point
     */
    HeadArrow.prototype.getOrigin = function(){
        return this.origin;
    };

    /**
     * Retourne la largeur de la tête de flèche.
     * @return number
     */
    HeadArrow.prototype.getHeight = function(){
        return this.height - this.style.getLineWidth() + 1;
    };

    /**
     * Retourne la longueur de la tête de flèche.
     * @return number
     */
    HeadArrow.prototype.getWidth = function(){
        return this.width - this.style.getLineWidth() + 1;
    };

    /**
     * Dessine la tête de flèche dans le context2D
     * @param context:CanvasRenderingContext2D
     *  Si context n'est pas pas définit, le context par défaut est chargé.
     */  
    HeadArrow.prototype.draw = function( context ){
        if ( typeof context === "undefined" ){
            context = window.stateAutomaton.graphic.defaultContext;
        }

        var A = {
            x: this.origin.getCoord().x,
            y: this.origin.getCoord().y
        };
        /*
        context.beginPath();
        var r = Math.sqrt( this.height * this.height / 4 + this.width * this.width );
        var beta = Math.atan( this.height / ( 2 * this.width ) );

        var B = {
            x: this.origin.getCoord().x + r * Math.cos( this.angle - beta),
            y: this.origin.getCoord().y + r * Math.sin( this.angle -beta )
        };
        var C = {
            x: this.origin.getCoord().x + r * Math.cos( this.angle + beta ),
            y: this.origin.getCoord().y + r * Math.sin( this.angle + beta )
        };
        context.moveTo( A.x, A.y );
        context.lineTo( B.x, B.y );
        context.lineTo( C.x, C.y );
        context.fill();
        context.stroke();
        /*/
        var size = context.lineWidth;
        this.style.apply( context );
        context.beginPath();
        context.save();
        context.translate(A.x, A.y);
        context.rotate(this.angle);
        
        context.moveTo(-this.width , 0);
        context.lineTo(-this.width , -this.height );
        context.lineTo(0, 0);
        context.lineTo(-this.width , this.height );
        context.lineTo(-this.width ,0);
        context.closePath();
        context.fill();
        context.restore();
        this.style.restore( context );
        //*/
    };
    window.stateAutomaton.graphic.HeadArrow = HeadArrow;
})(window);


/**
 * Classe ArcArrow
 * @author Pierre-Luc BLOT
 * @created 13/11/15
 *
 * @requires ../StateAutomaton.src.js
 * @requires HeadArrow.src.js
 * @requires Line.src.js
 * @requires Style.src.js
 */

 (function(window){
    'use strict';

    /**
     * Construit un ArcArrow en utilisant une courbe de bezier avec deux points de contrôle.
     
     * @constructor
     * @param param.start: Point
     *  Point de départ de l'arcArrow
     * @param param.end:Point
     *  Point d'arrive de l'arcArrow
     * @param param.height:number
     *  Hauteur de l'arcArrow.
     * @param param.direction: string
     *  'both' : bidirectionnelle
     *  'left' : tête de flèche sur le point de départ
     *  'right' : tête de flèche sur le point d'arrivé
     *  'right' par défaut.
     * @param param.style: Style
     *  Style de l'arc.
     */
    var ArcArrow = function( param ) {
        this.style = param.style ? param.style : new stateAutomaton.graphic.Style();
        param.style = this.style;
        this.arc = new stateAutomaton.graphic.Arc( param );

        var self = this;
        $( this.arc ).on( 'change', function(){
            makeArrows( self );
            $( self ).trigger( 'change' );
        });
            
        makeArrows( this );

        this.direction = 'right';
        if ( typeof param.direction == "string" ){
            this.direction = param.direction;
        }
    };
    // cubic helper formula at T distance
    var cubicN = function(T, a, b, c, d) {
        var t2 = T * T;
        var t3 = t2 * T;
        return a + (-a * 3 + T * (3 * a - a * T)) * T + (3 * b + T * (-6 * b + b * 3 * T)) * T + (c * 3 - c * 3 * T) * t2 + d * t3;
    };

    var getCubicBezierXYatT = function(startPt, controlPt1, controlPt2, endPt, T) {
        var x = cubicN(T, startPt.x, controlPt1.x, controlPt2.x, endPt.x);
        var y = cubicN(T, startPt.y, controlPt1.y, controlPt2.y, endPt.y);
        return ({
            x: x,
            y: y
        });
    };

    var computeAngleBezierStartOrEnd = function(bez, dir) {
        var w = 0.1;
        var pointNearEnd, S, E, D, T;
        if ( dir == "end" ){
            S = {x: bez.sx, y: bez.sy};
            E = {x: bez.ex,y: bez.ey};
            D = E;
            T = 0.99 - w;
        } else {
            S = {x: bez.sx,y: bez.sy};
            E = {x: bez.ex,y: bez.ey};
            D = S;
            T = 0.01 + w;
        }            
        pointNearEnd = getCubicBezierXYatT(
            S, {x: bez.cx1, y: bez.cy1}, {x: bez.cx2, y: bez.cy2},
            E, T
        );
        var dx = D.x - pointNearEnd.x;
        var dy = D.y - pointNearEnd.y;
        return Math.atan2(dy, dx);
    };

    var makeArrows = function( self ){
        var bez1 = {
            sx: self.arc.getStartPoint().getCoord().x,
            sy: self.arc.getStartPoint().getCoord().y,
            cx1: self.arc.getStartControlPoint().getCoord().x,
            cy1: self.arc.getStartControlPoint().getCoord().y,
            cx2: self.arc.getEndControlPoint().getCoord().x,
            cy2: self.arc.getEndControlPoint().getCoord().y,
            ex: self.arc.getEndPoint().getCoord().x,
            ey: self.arc.getEndPoint().getCoord().y
        };

        self.arrowRight = new stateAutomaton.graphic.HeadArrow({
            origin: self.arc.getEndPoint(),
            height: 5,
            width: 5,
            angle: computeAngleBezierStartOrEnd(bez1, 'end'),
            style: self.style
        });

        self.arrowLeft = new stateAutomaton.graphic.HeadArrow({
            origin: self.arc.getStartPoint(),
            height: 5,
            width: 5,
            angle: computeAngleBezierStartOrEnd(bez1, 'start'),
            style: self.style
        });
    };

    /**
     * Retourne la direction des flèches.
     */
    ArcArrow.prototype.getDirection = function(){
        return this.direction;
    };

    /**
     * Retourne le point de départ de l'arcArrow.
     * @return Point
     */
    ArcArrow.prototype.getArc = function(){
        return this.arc;
    };

    /**
     * Dessine le cercle dans le contexte2D.
     * @param context:CanvasRenderingContext2D
     *  Si context n'est pas pas définit, le context par défaut est chargé.
     */
    ArcArrow.prototype.draw = function( context ){
        if ( typeof context === "undefined" ){
            context = window.stateAutomaton.graphic.defaultContext;
        }
        this.arc.draw( context );

        if ( this.direction == 'left' || this.direction == 'both' ){
            this.arrowLeft.draw( context );
        }
        if ( this.direction == 'right' || this.direction == 'both' ){
            this.arrowRight.draw( context );
        }
    };

    window.stateAutomaton.graphic.ArcArrow = ArcArrow;
 })(window);
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

/**
 * Classe Circle
 * @author Pierre-Luc BLOT
 * @created 13/11/15
 *
 * @requires ../StateAutomaton.src.js
 * @requires Point.src.js
 * @requires Style.src.js
 */

 (function(window){
	'use strict';

	/**
	 * Construit un Cercle à partir d'un Point représentant le centre du cercle et d'un rayon ou d'un Point 
	 * par lequel il passe.
	 *
	 * @constructor
	 * @param param.center:Point
	 * @param param.radius:number || param.point:Point
	 * @param param.style
	 */
	var Circle = function( param ) {
		this.center = param.center;
		this.pointRadius = null;
		var radius = param.radius;
		if ( typeof param.radius !== "number" ){
			this.setPointRadius( param.point );
		} else {
			this.setRadius( param.radius );
		}
		this.style = param.style ? param.style : new stateAutomaton.graphic.Style();
	};

	/**
	 * Retourne le centre du cercle.
	 * @return Point
	 */
	Circle.prototype.getCenter = function() {
		return this.center;
	};

	/**
	 * Retourne le rayon du cercle.
	 */
	Circle.prototype.getRadius = function() {
		return this.radius;
	};

	/**
	 * Définit un nouveau centre pour le cercle.
	 * @param center: Point
	 *	Centre du cercle.
	 */
	Circle.prototype.setCenter = function( center ){
		this.center = center;
		$( this ).trigger( 'change' );
	};

	/**
	 * Met à jour le centre du cercle.
	 * @param center: Point
	 *	Centre du cercle.
	 */
	Circle.prototype.updateCenter = function( center ){
		this.center.setCoord( center.getCoord() );
		if ( this.pointRadius !== null ){
			this.setPointRadius( this.pointRadius );
		}
		$( this ).trigger( 'change' );
	};

	/**
	 * Définit un nouveau rayon pour le cercle.
	 * @param radius:number
	 */
	Circle.prototype.setRadius = function( radius ){
		this.radius = radius;
		$( this ).trigger( 'change' );
	};

	/**
	 * Définit un nouveau rayon pour le cercle.
	 * @param radius:Point
	 */
	Circle.prototype.setPointRadius = function( radius ){
		this.pointRadius = radius;
		this.radius = this.center.distance( radius );
		$( this ).trigger( 'change' );
	};

	/**
	 * Dessine le cercle dans le contexte2D.
	 * @param context:CanvasRenderingContext2D
	 *	Si context n'est pas pas définit, le context par défaut est chargé.
	 */
	Circle.prototype.draw = function( context ){
		if ( typeof context === "undefined" ){
			context = window.stateAutomaton.graphic.defaultContext;
		}
		context.beginPath();
		this.style.apply( context );
		context.arc( this.center.getCoord().x, this.center.getCoord().y, this.radius, 0, Math.PI * 2, true );
		context.stroke();
		this.style.restore( context );
	};

	/**
	 * Retourne le point sur le cercle grâce à son angle.
	 */
	Circle.prototype.getPoint = function( angle ){
		return new stateAutomaton.graphic.Point({
			coord: { 
				x: this.center.getCoord().x + this.radius * Math.cos( angle ),
				y: this.center.getCoord().y + this.radius * Math.sin( angle )
			}
		});
	};

	window.stateAutomaton.graphic.Circle = Circle;
 })(window);
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