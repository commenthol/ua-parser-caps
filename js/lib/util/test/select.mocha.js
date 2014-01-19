/**
 * mocha test suite for util/select.js
 *
 * Copyright (c) 2013 Commenthol
 * Released under the MIT License
 */

/*globals suite,test*/

"use strict";

var
	assert = require('assert'),
	select = require('../select').select;

suite('select from a null object', function(){

	var obj = null;
	var result = select(obj, ["test", "test"] );

	test('- results in null', function(){
		assert.deepEqual(result, null);
	});
});

suite('select with empty selectors', function(){

	var obj = {
		test: { a:1 }
	};
	var result = select(obj);

	test('- results in null', function(){
		assert.deepEqual(result, null);
	});
});

suite('select an existing object', function(){

	var obj = {
		test: {
			test: {
				test: { a: 1 }
			},
			test2: { b: 2 }
		}
	};

	var result = select(obj, ["test", "test"] );

	test('- result is an object', function(){
		assert.deepEqual(result, {test: { a: 1 }});
	});
});

suite('select a 0 value from an existing object', function(){

	var obj = {
		test: {
			test: 0,
			test2: { b: 2 }
		}
	};
	var result = select(obj, ["test", "test"] );

	test('- result is 0', function(){
		assert.deepEqual(result, 0);
	});
});

