"use strict";

var util = require( "util" );

var Container = function () {

	// private data, do not access these outside
	this._data = {};
	this._factories = {};

};

module.exports = Container;

/**
 * set()
 *
 * Set a value.
 *
 * [Chainable]
 *
 * @param {string} name The name of the value to set
 * @param {*} value The value to set
 * @returns {Container}
 */
Container.prototype.set = function ( name, value ) {

	// undefined is the default state, no need to store it
	if ( typeof value !== 'undefined' ) {
		this._data[name] = value;
	}

	return this;
};

/**
 * get()
 *
 * Retrieve a value.
 *
 * @param {string} name The name of the value to retrieve
 *
 * @returns {*} Can be any type, returns `undefined` if name never set
 *
 */
Container.prototype.get = function ( name ) {
	if ( this._data.hasOwnProperty( name ) ) {
		return this._data[name];
	} else {
		return undefined;
	}
};

/**
 * clear()
 *
 * Clear (remove) a previously set value. Subsequent calls to .get() on this name will
 * return undefined until the name is set again.
 *
 * [Chainable]
 *
 * @param {string} name The name of the value to clear
 * @returns {Container}
 */
Container.prototype.clear = function ( name ) {

	if ( this._data.hasOwnProperty( name ) ) {
		delete this._data[name];
	}

	return this;

};

/**
 * setFactory()
 *
 * Sets a class to be used for creating objects
 *
 * [Chainable]
 *
 * @param {string} name The name of the class to use for this factory
 * @param {function} Class The class constructor function to use for the factory
 * @returns {Container}
 */
Container.prototype.setFactory = function ( name, Class ) {

	if ( typeof Class === 'function' ) {

		// extend the class so that we can use 'apply' with 'new'
		var ClassWrap = function ( params ) {
			Class.apply( this, params );
		};

		util.inherits( ClassWrap, Class );

		this._factories[name] = ClassWrap;

	}

	return this;

};

/**
 * create()
 *
 * Create an instance of the class using a set factory.
 *
 * @param {string} name The name of the factory to use
 * @param {*} [params] Any number of parameters, which will be passed to the constructor of the factory
 * @returns {*} An object, or undefined if name does not identify a valid factory
 */
Container.prototype.create = function ( name, params ) {

	if ( this._factories.hasOwnProperty( name ) ) {
		return new (this._factories[name])( Array.prototype.slice.call( arguments, 1 ) );
	} else {
		return undefined;
	}

};

/**
 * clearFactory()
 *
 * Clears the specified factory
 *
 * @param {string} name The factory to clear
 * @returns {Container}
 */
Container.prototype.clearFactory = function ( name ) {

	if ( this._factories.hasOwnProperty( name ) ) {
		delete this._factories[name];
	}

	return this;

};
