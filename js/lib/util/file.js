/**
 * Load one or more capabilities files and join them to one single 
 * capabilities file.
 * 
 * Copyright (c) 2013 Commenthol 
 * Released under the MIT License
 */

"use strict";

var fs = require('fs');
var jsyaml = require('js-yaml');

var M = module.exports;

/**
 * load one capabilities file
 *
 * @param {String} files : filename(s) of the capability files to load
 * @return {Object} tree
 */
M.loadSync = function loadSync(file) {
  var
    content, 
    tree;
  
  content = fs.readFileSync(file, 'utf8');
  tree = jsyaml.safeLoad(content);
  
  return tree;
};
