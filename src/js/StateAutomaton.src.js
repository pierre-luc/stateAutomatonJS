/*!
 * StateAutomatonJS - v0.6.0
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