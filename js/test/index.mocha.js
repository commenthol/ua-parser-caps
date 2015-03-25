/**
 * test suite for caps parser
 *
 * Copyright (c) 2013 Commenthol
 * Released under the MIT License
 */

/*globals suite,test*/

"use strict";

// module dependencies
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var jsyaml = require('js-yaml');
var capsparserM = require('../index');
var extend = require('mergee').extend;

// directory of test resources
var resourcesDir = __dirname + "/../../test/resources/parser/";

var _debug = 0;

/**
 * generate the test batches from the testcases.yaml file
 *
 * @param {String} file : filename of testcases yaml file
 * @return {Object} batch for vows tests
 */
function batch(file) {
	// load tests
	var content = fs.readFileSync(resourcesDir + file, 'utf8');
	var testcases = jsyaml.safeLoad(content);

	testcases.forEach(function(tc) {

		// add path to all test files
		tc.setup.files = tc.setup.files.map(function(file) {
			return path.normalize(resourcesDir + file);
		});

		it('- ' + tc.test, function() {
			var capsparser = capsparserM(tc.setup.files);
			_debug && capsparser.printTree();
			var result = capsparser.parse(tc.setup.uaparsed);
			_debug && console.log('>>result:', JSON.stringify(result, null, ' '));
			assert.deepEqual(result, tc.result);
		});
	});
}

describe('capability parser tests basic', function() {
	batch("testcases_basic.yaml");
});

describe('capability parser tests regexes', function() {
	batch("testcases_regexes.yaml");
});

describe('capability parser tests extends', function() {
	batch("testcases_extends.yaml");
});

describe('capability parser tests filemerge', function() {
	batch("testcases_filemerge.yaml");
});

describe('capability parser tests brand-model', function() {
	batch("testcases_brandmodel.yaml");
});
