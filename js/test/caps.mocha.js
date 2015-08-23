/**
 * test describe for parsing capabilities
 *
 * check capabilities for parsed user-agent strings
 *
 * Copyright (c) 2013 Commenthol
 * Released under the MIT License
 */

'use strict';

/* global describe, it */

// module dependencies
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var	splitLine = require('streamss').SplitLine;
var jsonArray = require('streamss').JsonArray;
var through = require('streamss').Through;
var capsParser = require('../index');

// test config
var config = {
	testcases: __dirname + "/../../test/resources/test_capabilities.json",
	//~ testcases: __dirname + "/../../x.json",
	caps: {
		dir: __dirname + "/../../",
		files: [
			'caps_device_type.yaml',
			'caps_user_view.yaml',
			'caps_ie_compatibility.yaml'
		],
	}
};

config.caps.files = config.caps.files.map(function(file) {
	return path.normalize(config.caps.dir + file);
});

var capsparser = capsParser(config.caps.files);

function msg(name, actual, expected, string) {
	string = (string ? string + '\n' : '' );
	return string + name +
		"\n     is: " + JSON.stringify(actual) +
		"\n should: " + JSON.stringify(expected);
}

function test(tc, encoding, done) {

	describe('', function(){
		it(tc.string, function(){

			var capabilities = capsparser.parse(tc);

			// device type
			assert.equal(capabilities.device.type, tc.capabilities.device.type);
			// user view
			assert.equal(capabilities.user.view, tc.capabilities.user.view);
			// compatibility mode
			if (tc.capabilities.browser && tc.capabilities.browser.ie_compatibility_mode) {
				assert.deepEqual(capabilities.browser, tc.capabilities.browser);
			}
		});
	});

	done();
}

describe('device type tests', function(){
	this.timeout(50000);

	it('exec', function(testDone){
		fs.createReadStream(config.testcases)
			.pipe(splitLine({chomp: true}))
			.pipe(jsonArray.parse())
			.pipe(through.obj(test, function(){
					testDone();
				})
			);
	});
});

