/**
 * Classe TransitionCurve
 * @author Pierre-Luc BLOT
 * @created 18/11/15
 *
 * @requires ../StateAutomaton.src.js
 * @requires ../graphic/Text.src.js
 * @requires ../graphic/Style.src.js
 * @requires ../graphic/ArcArrow.src.js
 */

 (function(window){
    'use strict';

    /**
     * Construit une transition
     * @constructor
     * @param param.name: string
     * @param param.start: State
     * @param param.end: State
     */
    var TransitionCurve = function( param ) {
        var self = this;

        this.name = param.name;
        this.start = param.start;
        this.end = param.end;
        this.position = param.position ? param.position : 'top';
        
        this.style = new stateAutomaton.graphic.Style({
            color: 'black',
            fillColor: 'black',
            textAlign: 'center',
            baseline: 'middle'
        });        
        
        $( this ).on( 'change', function(){
            change( self );
        });

        $( this.start ).on( 'change', function(){
            change( self );
        });

        $( this.end ).on( 'change', function(){
            change( self );
        });

        change( self );
    };

    var change = function( self ){
        if ( self.start.getCenter() !== null && self.end.getCenter() !== null ){
            var s = self.start,
                e = self.end;

            var u = {
                x: e.getCenter().getCoord().x - s.getCenter().getCoord().x,
                y: e.getCenter().getCoord().y - s.getCenter().getCoord().y
            };
            
            var sp, ep, dir = self.position == 'top' ? 1 : -1;
            if ( u.x < 0 && u.y < 0 ){
                if ( dir == 1 ){
                    sp = s.getCircle().getPoint( -Math.PI / 4 );
                    ep = e.getCircle().getPoint( -Math.PI / 4 );
                } else {
                    sp = s.getCircle().getPoint( Math.PI );
                    ep = e.getCircle().getPoint( -3 * Math.PI / 2 );
                }
            } else if ( u.x > 0 && u.y < 0 ){
                sp = s.getCircle().getPoint( -Math.PI / 2 );
                ep = e.getCircle().getPoint( Math.PI );
            } else if ( u.x > 0 && u.y > 0 ){
                sp = s.getCircle().getPoint( 0 );
                ep = e.getCircle().getPoint( -Math.PI / 2 );
            } else if ( u.x < 0 && u.y > 0 ){
                if ( dir == 1 ){
                    sp = s.getCircle().getPoint( -3 * Math.PI / 4 );
                    ep = e.getCircle().getPoint( -Math.PI / 2 );
                } else {
                    sp = s.getCircle().getPoint( -3 * Math.PI / 2 );
                    ep = e.getCircle().getPoint( 0 );
                }
            } else if ( u.y === 0 ){
                if ( u.x > 0 ){
                    if ( dir == 1 ){
                        sp = s.getCircle().getPoint( -Math.PI / 2 );
                        ep = e.getCircle().getPoint( -Math.PI / 2 );
                        dir *= -1;
                    } else {
                        dir = -1;
                        sp = s.getCircle().getPoint( -3 * Math.PI / 2 );
                        ep = e.getCircle().getPoint( -3 * Math.PI / 2 );
                    }
                } else {
                    if ( dir == 1 ){
                        sp = s.getCircle().getPoint( -Math.PI / 2 );
                        ep = e.getCircle().getPoint( -Math.PI / 2 );
                    } else {
                        dir = -1;
                        sp = s.getCircle().getPoint( -3 * Math.PI / 2 );
                        ep = e.getCircle().getPoint( -3 * Math.PI / 2 );
                    }
                }
            } else if ( u.x === 0 ){
                if ( dir == 1 ){
                    sp = s.getCircle().getPoint( Math.PI );
                    ep = e.getCircle().getPoint( Math.PI );
                } else {
                    sp = s.getCircle().getPoint( 0 );
                    ep = e.getCircle().getPoint( 0 );
                }
            }
            self.arc = new stateAutomaton.graphic.ArcArrow({
                start: sp,
                end: ep,
                height: dir * sp.distance( ep ) / 4,
                style: self.style
            });
        }
    };

    TransitionCurve.prototype.getPosition = function(){
        return this.position;
    };

    TransitionCurve.prototype.getName = function(){
        return this.name;
    };

    TransitionCurve.prototype.getStart = function(){
        return this.start;
    };

    TransitionCurve.prototype.getEnd = function(){
        return this.end;
    };

    TransitionCurve.prototype.getStyle = function(){
        return this.style;
    };


    TransitionCurve.prototype.draw = function( context ){
        if ( typeof context === "undefined" ){
            context = window.stateAutomaton.graphic.defaultContext;
        }
        this.style.apply( context );
        this.arc.draw( context );
        this.style.restore( context );
    };

    window.stateAutomaton.automaton.TransitionCurve = TransitionCurve;
 })(window);
