/**
 * Load one or more capabilities files and join them to one single 
 * capabilities file.
 * 
 * Copyright (c) 2013 Commenthol 
 * Released under the MIT License
 */

"use strict";

var
  fs = require('fs'),
  jsyaml = require('js-yaml'),
  select = require('js-select'),
  merge = require('../util/extend.js').merge;

var M = {};

/**
 * move the regexes into an array of arrays
 * @param {Object} content with regexes array
 * @return {Object} content with regexes array mapped into another array
 */
function moveIntoArray(content) {
  if (content !== null) {
    select(content, ".regexes, .extends").update(function(_content){
      _content = [ _content ];
      return moveIntoArray(_content);
    });
  }
  return content;
}

/**
 * load one or more capabilities files and join them to one single 
 * capabilities file.
 *
 * @param {Array|String} files : filename(s) of the capability files to load
 * @return {Object} capabilities
 * @api: public
 */
M.loadSync = function loadSync (files) {
  var
    i,
    content,
    caps = {};
  
  if (typeof(files) === 'string') {
    files = [ files ];
  }
  
  for (i=0; i<files.length; i+=1) {
    //~ try {
      content = fs.readFileSync(files[i], 'utf8');
      content = jsyaml.safeLoad(content);
      
      // test if content is a capabilities file
      // TODO: make a test to verify the structure of the file.
      if (content.os || content.ua || content.device ) {
        caps = merge (caps, moveIntoArray(content));
      }
      else {
        caps = { error: files[i] + ' is not a valid capabilities file.' };
        break;
      }
    //~ }
    //~ catch(e) {
      //~ console.log(e);
      //~ debugger;
      //~ caps = { error: 'parsing ' + files[i] + ' failed with ' + e.name + ' ' + JSON.stringify(e)}; 
      //~ break;
    //~ }
  }
  
  return caps;
}


module.exports = M;
