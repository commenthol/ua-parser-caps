/**
 * test suite for capsfile
 *
 * Copyright (c) 2013 Commenthol
 * Released under the MIT License
 */

/*globals suite,test*/

"use strict";

var assert = require('assert'),
	file = require('../lib/capsfile'),
	select = require('js-select');

// directory of test resources
var resourcesDir = __dirname + "/../../test/resources/parser/";

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

	suite('loading two files', function() {
		var result = file.loadSync([resourcesDir + 'capstest_file1.yaml', resourcesDir + 'capstest_file2.yaml']);

		test ('shall contain os capabilities', function() {
			assert.notEqual(result.os, null);
		});
		test ('shall contain merged os capability osfamily1', function() {
			var nodes = select(result, '.os .osfamily1 .attr').nodes();
			assert.deepEqual(nodes, ['osfamily1_merged', 'osfamily1_major1_merged', 'osfamily1_major1_minor1_merged']);
		});
		test ('shall contain merged os capability osfamily2', function() {
			var nodes = select(result, '.os .osfamily2 .attr').nodes();
			assert.deepEqual(nodes, ['osfamily2', 'osfamily2_major1', 'osfamily2_major1_minor1']);
		});
		test ('shall contain ua capabilities', function() {
			assert.notEqual(result.ua, null);
		});
		test ('shall contain merged ua overwrites', function() {
			var nodes = select(result, '.ua .overwrites .attr').nodes();
			assert.deepEqual(nodes, [
				'uafamily1_overwrite_osfamily1',
				'uafamily1_overwrite_osfamily2',
				'uafamily1_overwrite_osfamily3'
			]);
		});
		test ('shall contain merged ua regexes', function() {
			var nodes = select(result, '.ua .regexes .attr').nodes();
			assert.deepEqual(nodes, ['uafamily2_regex_UA1', 'uafamily2_regex_UA2', 'uafamily2_regex_UA3']);
		});
	});

	broken_suite('trying to load a non-caps file', function() {
		var result = file.loadSync(__dirname + '/../lib/capsfile.js');

		test('results in an YAMLException', function() {
			assert(/YAMLException/.test(result.error), "error YAMLException not found");
		});
	});

});
