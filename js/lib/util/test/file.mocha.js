/**
 * test suite for file
 *
 * Copyright (c) 2013 Commenthol
 * Released under the MIT License
 */

/*globals suite,test*/

"use strict";

var assert = require('assert');
var select = require('js-select');
var file = require('../file.js');

// directory of test resources
var resourcesDir = __dirname + "/../../../../test/resources/parser/";

// exclude broken tests
var broken_suite = function(){};

suite('capsfile tests', function() {

	suite('loading one file', function() {
		var result = file.loadSync(resourcesDir + 'capstest_file1.yaml');

		test('shall contain os capabilities', function() {
			assert.notEqual(result.os, null);
		});
		test('shall contain os capability osfamily1', function() {
			var nodes = select(result, '.os .osfamily1 .attr').nodes();
			assert.deepEqual(nodes, ['osfamily1', 'osfamily1_major1', 'osfamily1_major1_minor1']);
		});
	});

});
