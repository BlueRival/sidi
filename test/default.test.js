"use strict";

var Container = require( '../' ).Container;
var assert = require( 'assert' );

describe( 'SiDI', function () {
	describe( 'container', function () {

		var container = null;

		beforeEach( function () {
			container = new Container();
		} );

		describe( 'simple storage', function () {

			var data1;
			var data2;
			var data2Copy;

			beforeEach( function () {
				data1 = {
					"some": "stuff",
					"in":   [ "here" ]
				};

				data2 = {
					"some":  "more",
					"stuff": [ "in", "here" ]
				};

				data2Copy = {
					"some":  "more",
					"stuff": [ "in", "here" ]
				};
			} );

			it( 'is an object', function () {
				assert.equal( typeof container, 'object' );
			} );

			it( 'can set() (chainable) and get() data', function () {

				container.set( 'data1', data1 ).set( 'data2', data2 );

				var data1Get = container.get( 'data1' );
				var data2Get = container.get( 'data2' );

				assert.strictEqual( data1Get, data1 );
				assert.strictEqual( data2Get, data2 );

			} );

			it( 'will get() the same object that was set()', function () {

				container.set( 'data2', data2 );
				container.set( 'data2Copy', data2Copy );

				assert.strictEqual( container.get( 'data2' ), data2 );
				assert.strictEqual( container.get( 'data2Copy' ), data2Copy );
				assert.notStrictEqual( container.get( 'data2' ), container.get( 'data2Copy' ) );
				assert.deepEqual( container.get( 'data2' ), container.get( 'data2Copy' ) );

			} );

			it( 'will overwrite with set()', function () {

				container.set( 'data', data1 );
				container.set( 'data', data2 );

				assert.strictEqual( container.get( 'data' ), data2 );
				assert.notStrictEqual( container.get( 'data' ), data1 );
				assert.notStrictEqual( data1, data2 );

			} );

			it( 'will clear() data', function () {

				container.clear( 'data' )
					.clear( 'data1' )
					.clear( 'data2' )
					.clear( 'data2Copy' );

				assert.strictEqual( container.get( 'data' ), undefined );
				assert.strictEqual( container.get( 'data1' ), undefined );
				assert.strictEqual( container.get( 'data2' ), undefined );
				assert.strictEqual( container.get( 'data2Copy' ), undefined );

			} );

			it( 'will get() undefined for previously unset fields', function () {

				assert.strictEqual( container.get( 'should.be.undefined' ), undefined );

			} );

		} );

		describe( 'factory storage', function () {

			var Class = null;
			var classInstantiationCount = 0;
			var lastParams = null;
			var aMethodCallCount = 0;

			beforeEach( function () {

				classInstantiationCount = 0;
				lastParams = null;
				aMethodCallCount = 0;

				Class = function () {
					classInstantiationCount++;
					lastParams = arguments;
				};
				Class.prototype.aMethod = function () {
					aMethodCallCount++;
				};

			} );

			it( 'will setFactory() (chainable) and create() from a factory', function () {

				container.setFactory( 'class', Class ).setFactory( 'class2', Class );

				var c = container.create( 'class' );
				assert.ok( c instanceof Class );

				c = container.create( 'class2' );
				assert.ok( c instanceof Class );

			} );

			it( 'will pass arguments with create()', function () {

				container.setFactory( 'class', Class );

				container.create( 'class', 'param1', { field2: 'param2' } );

				assert.strictEqual( lastParams[0], 'param1' );
				assert.deepEqual( lastParams[1], { field2: 'param2' } );
				assert.strictEqual( lastParams[2], undefined );

			} );

			it( 'will do proper inheritance with create()', function () {

				container.setFactory( 'class', Class );

				var c = container.create( 'class' );

				c.aMethod();

				assert.strictEqual( aMethodCallCount, 1 );

			} );

			it( 'will clear() a factory', function () {

				container.setFactory( 'class', Class );

				container.clearFactory( 'class' );

				var c = container.create( 'class' );

				assert.strictEqual( c, undefined );

			} );

		} );

	} );
} );
