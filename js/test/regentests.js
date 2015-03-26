/**
 * Regenerates the test cases
 *
 * Copyright (c) 2013 Commenthol
 * Released under the MIT License
 */

"use strict";

// module dependencies
var fs = require('fs');
var path = require('path');
var capsParser = require('../index');

// directory of test resources
var resourcesDir = __dirname + "/../../test/resources/",
	capsDir = __dirname + "/../../",
	testcasesFile = 'test_capabilities.json',
	content = fs.readFileSync(resourcesDir + testcasesFile, 'utf8'),
	testcases = JSON.parse(content);

// capability files under test
var capsFiles = [
	'caps_device_type.yaml',
	'caps_user_view.yaml',
	'caps_ie_compatibility.yaml'
];

capsFiles = capsFiles.map(function(file) {
	return path.normalize(capsDir + file);
});

var capsparser = capsParser(capsFiles);
var out = "[\n";
var line = "";

testcases.forEach(function(tc) {
	var capabilities = capsparser.parse(tc);

	tc.capabilities.device.type = capabilities.device.type;
	tc.capabilities.user.view = capabilities.user.view;

	if (tc.capabilities.browser && tc.capabilities.browser.ie_compatibility_mode) {
		tc.capabilities.browser = capabilities.browser;
	}

	out += ( line ? line + ',\n' : '');
	line = JSON.stringify(tc);
});
out += line + '\n]\n';

fs.writeFileSync(resourcesDir + testcasesFile, out, { encoding: 'utf8' });


