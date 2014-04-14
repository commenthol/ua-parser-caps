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
var 
	Tree   = require('./tree'),
	parser = require('./parser'),
	config = require('../config'),
	extend = require('./util/extend').extend;

/**
 * initialize the capsparser
 * 
 * @param {Object|Array|String|Function} options 
 * @property {Array} options.files - array of files to load
 * @param {Function} cb - a callback function `cb(err, parser)` where `err` is any error from loading and `parser` the parser object;
 * @return {Object} the parser - Even in async loading a parser object operating on empty capabilities is returned. So any functions can be called savely.
 * 
 * if `options` is a Array or a String then the it is assumed that files are contained herein.
 * if `options` is a Function then async loading with the default config is assumed.
 */
var M = module.exports = function (options, cb) {
	var tree;
	var capsparser;

	switch (typeof(options)) {
		case "function": 
			cb = options; 
			options = config;
			break;
		case "object":
			if (Array.isArray(options)) {
				options = extend(config, { files: options });
			}
			else {
				options = extend(config, options);
			}
			break;
		case "string":
			options = extend(config, { files: [ options ] });
			break;
		default:
			options = config;
			break;
	}

	tree = new Tree();
	capsparser = parser.parser(tree.get());
	
	if (cb && typeof(cb) === 'function') {
		tree.load(options.files, function(err) {
			if (!err) {
				capsparser = parser.parser(tree.get());
			}
			cb(err, capsparser);
		});
	}
	else {
		tree.loadSync(options.files);
		capsparser = parser.parser(tree.get());
	}
	return capsparser;
};
