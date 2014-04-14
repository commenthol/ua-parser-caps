/**
 * handle capabilities tree
 *
 * Copyright (c) 2013 commenthol
 * Released under the MIT License
 */

"use strict";

/**
 * Module dependencies
 */
var jsSelect = require('js-select');
var async    = require('async');
var extend   = require('./util/extend').extend;
var merge    = require('./util/extend').merge;
var capsFile = require('./util/file.js');
var parser   = require('./parser.js');


var M = module.exports = Tree;

/**
 * tree object constructor
 */
function Tree() {
	
	this.tree = {};
	this.isConverted = false;
} 

/**
 * load one or more capabilities files and join them to one single 
 * capabilities tree.
 *
 * @param {Array|String} files : filename(s) of the capability files to load
 */
Tree.prototype.loadSync = function (files) {
	var self = this;

	files = files || [];

  if (typeof(files) === 'string') {
    files = [ files ];
  }
	
	files.forEach(function (file){
		var tree;

		tree = capsFile.loadSync(file);
		self.add(tree);
	});
	
	self.convert();
};

/**
 * load one or more capabilities files asynchronously and join them to one single 
 * capabilities tree.
 *
 * @param {Array|String} files : filename(s) of the capability files to load
 * @param
 */
Tree.prototype.load = function (files, cb) {
	
	var self = this;

	files = files || [];

  if (typeof(files) === 'string') {
    files = [ files ];
  }
	
	async.eachSeries(files, function (file, callback){
		capsFile.load(file, function(err, tree){
			if (err) {
				callback(err);
			}
			else {
				self.add(tree);
				callback();
			}
		});
	}, function(err){
		if (err) {
			// TODO
		}
		else {
			self.convert();
		}
		cb(err);
	});
};


/**
 * add an new tree
 * 
 * @param {Object} tree
 */
Tree.prototype.add = function (tree) {
	
	if (! this.isConverted) {
		if (isTree(tree)) {
			tree = flattenExtends(tree);
			this.tree = merge(this.tree, moveIntoArray(tree));
		}
	}
};

/**
 * convert the tree for use within parser
 * 
 * @param {Object} tree
 */
Tree.prototype.convert = function () {
	
	if (! this.isConverted) {
		this.isConverted = true;
		this.tree = convertRegexes(this.tree);
		this.tree = convertDevice(this.tree);
	}
};

/**
 * returns the tree
 * 
 * @return {Object} tree
 */
Tree.prototype.get = function () {
	
	return this.tree;
};

/**
 * print the tree in case of debugging
 */
Tree.prototype.print = function () {
	
	console.log(JSON.stringify(this.tree, null, ' '));
};

/**
 * check if tree is a valid capabilities tree
 */
var isTree = function (tree) {
	
	return (tree && ( tree.default || tree.os || tree.ua || tree.device ));
};

/**
 * move the regexes into an array of arrays
 * 
 * @param {Object} tree : containing `regexes` arrays
 * @return {Object} tree with regexes array mapped into another array
 */
var moveIntoArray = M.moveIntoArray = function (tree) {
	
	if (tree !== null) {
		jsSelect(tree, ".regexes").update(function(node){
			node = [ node ];
			return moveIntoArray(node);
		});
	}
	return tree;
};

/**
 * flatten all `extends` before merging trees
 * 
 * @param {Object} tree : containing `extends`
 * @return {Object} tree with flattened extends
 */
var flattenExtends = M.flattenExtends = function (tree) {
	var parse;
	
	if (tree !== null) {
		parse = parser.parser(tree);
		
		jsSelect(tree, ":has(:root > .extends)").update(function(node){
			//~ console.log('>>ext:', node);
			return parse.flattenExtend(node);
		});
	}
	return tree;
};

/**
 * convert all regex strings from the capabilities into regular
 * expressions to speed up later processing
 *
 * @param {Object} tree with converted regular expressions
 */
var convertRegexes = M.convertRegexes = function (tree) {
	
	jsSelect(tree, ".regexes").update(function(regexes){
		var i, j;

		if (regexes) {
			for (i = 0; i < regexes.length; i += 1) {
				for (j = 0; j < regexes[i].length; j += 1) {
					if (regexes[i][j].regex && typeof(regexes[i][j].regex) === 'string') {
						regexes[i][j].regex = new RegExp(regexes[i][j].regex, 'i');
					}
					else if (regexes[i][j].regexNot && typeof(regexes[i][j].regexNot) === 'string') {
						regexes[i][j].regexNot = new RegExp(regexes[i][j].regexNot, 'i');
					}
				}
			}
		}

		return regexes;
	});

	return tree;
};

/**
 * Normalize all brand and model nodes
 *
 * @param {Object} tree: capabilities tree
 */
var convertDevice = M.convertDevice = function (tree) {
	var nodes;

	nodes = jsSelect(tree, ".brand .model, .brand, .device > .family");

	nodes.update(function(node){
		var attr, norm;
		
		for (attr in node) {
			norm = parser.normalizeDevice(attr);
			if (attr !== norm) {
				node[norm] = node[attr];
			}
		}
		return node;
	});

	return tree;
};

