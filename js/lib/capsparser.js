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

var M = module.exports = function (files) {
	var tree;
	var capsparser;
	
	files = files || config.files || [],
	
	tree = new Tree();
	
	tree.loadSync(files);

	capsparser = parser.parser(tree.get());

	return capsparser;
}
