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

var M = {
	// our testcases
	_testcases: null,
	// capability files under test
	capsFiles: [
		__dirname + '/../../' + 'caps_device_type.yaml',
		__dirname + '/../../' + 'caps_user_view.yaml',
		__dirname + '/../../' + 'caps_ie_compatibility.yaml'
	],
	testcasesFile: __dirname + '/../../test/resources/' + 'test_capabilities.json',

	/**
	 * load testcases
	 * @throws
	 */
	load: function() {
		var content = fs.readFileSync(this.testcasesFile, 'utf8');
		this._testcases = JSON.parse(content);
	},
	/**
	 * save testcases
	 * @param {String}
	 */
	save: function(out) {
		fs.writeFileSync(this.testcasesFile, out, 'utf8');
	},
	/**
	 * loop over testcases
	 * @return {String}
	 */
	loop: function() {
		var self = this;
		var out = "[\n";
		var line = "";

		this._capsparser = capsParser(this.capsFiles);

		this._testcases.forEach(function(tc) {
			out += ( line ? line + ',\n' : '');
			line = JSON.stringify(self.renew(tc));
		});
		out += line + '\n]\n';
		return out;
	},
	/**
	 * @param {Object} tc - testcase
	 * @return {Object}
	 */
	renew: function(tc) {
		var capabilities = this._capsparser.parse(tc);

		['device', 'user', 'browser'].forEach(function(p){
			if (!tc.capabilities && capabilities)
				tc.capabilities = {};
			if (!tc.capabilities[p] && capabilities[p])
				tc.capabilities[p] = {};
		});

		// overwrite
		tc.capabilities.device.type = capabilities.device.type;
		tc.capabilities.user.view = capabilities.user.view;

		if (tc.capabilities.browser && tc.capabilities.browser.ie_compatibility_mode) {
			tc.capabilities.browser = capabilities.browser;
		}

		return tc;
	},
	/**
	 * regenerate the testcases
	 */
	regenerate: function() {
		this.load();
		var out = this.loop();
		this.save(out);
	},
};

module.exports = M;

if (require.main === module) {
	M.console = true;
	M.regenerate();
}
