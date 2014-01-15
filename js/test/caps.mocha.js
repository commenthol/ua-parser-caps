/**
 * test suite for parsing capabilities
 *
 * check capabilities for parsed user-agent strings
 *
 * Copyright (c) 2013 Commenthol
 * Released under the MIT License
 */

/*globals suite,test*/

"use strict";

// module dependencies
var assert = require('assert'),
	fs = require('fs'),
	path = require('path'),
	jsyaml = require('js-yaml'),
	capsParser = require('../index'),
	extend = require('../util/extend').extend;

// directory of test resources
var resourcesDir = __dirname + "/../../test/resources/",
	capsDir = __dirname + "/../../",
	testcasesFile = 'test_capabilities.json',
	content = fs.readFileSync(resourcesDir + testcasesFile, 'utf8'),
	testcases = JSON.parse(content);

// capability files under test
var capsFiles = ['caps_device_type.yaml', 'caps_user_view.yaml'];

capsFiles = capsFiles.map(function(file) {
	return path.normalize(capsDir + file);
});

suite('device type tests', function() {
	var capsparser = capsParser(capsFiles).parser;

	testcases.forEach(function(tc) {
		suite(tc.string, function() {
			var capabilities = capsparser(tc).parse();
			test('shall return device type', function() {
				assert.equal(tc.capabilities.device.type, capabilities.device.type);
			});
			test('shall return user view', function() {
				assert.equal(tc.capabilities.user.view, capabilities.user.view);
			});
		});
	});
});
