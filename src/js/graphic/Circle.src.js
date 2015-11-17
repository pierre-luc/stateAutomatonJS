/**
 * Classe Circle
 * @author Pierre-Luc BLOT
 * @created 13/11/15
 *
 * @requires ../StateAutomaton.src.js
 * @requires Point.src.js
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
		context.arc( this.center.getCoord().x, this.center.getCoord().y, this.radius, 0, Math.PI * 2, true );
		context.stroke();
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