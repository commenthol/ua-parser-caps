'use strict';

/**
 * Regenerates the test cases
 *
 * Copyright (c) 2013 Commenthol
 * Released under the MIT License
 */

"use strict";

// module dependencies
var uaparser = require('ua-parser2')();
var regen = require('./regen');

regen.add = function (userAgent) {
	var uaparsed = uaparser.parse(userAgent);
	this._testcases.push(uaparsed);
}

if (require.main === module) {
	var userAgent = (process.argv && process.argv[2] ? process.argv[2] : userAgent);
	if (userAgent) {
		regen.load();
		regen.add(userAgent);
		var out = regen.loop();
		regen.save(out);
	}
	else {
		console.error('user-agent missing');
	}
}
