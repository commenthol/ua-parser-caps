/**
 * capability parser
 *
 * Copyright (c) 2013 commenthol
 * Released under the MIT License
 */

"use strict";

/**
 * Module dependencies
 */
var Tree   = require('./tree.js');
var parser = require('./parser.js');
var config = require('../config.js');

var M = module.exports = function (options) {
	var tree;
	var capsparser;

	switch (typeof(options)) {
		case "object":
			if (typeof(options.length) === 'number') {
				options = { files: options };
			}
			break;
		case "string":
			options = { files: [ options ] };
			break;
		default:
			options = { files: config.files }
			break;
	}
	
	tree = new Tree();
	
	tree.loadSync(options.files);

	capsparser = parser.parser(tree.get());

	return capsparser;
}
