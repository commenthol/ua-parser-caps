"use strict";

/**
 * test suite for capsfile
 * 
 * Copyright (c) 2013 Commenthol 
 * Released under the MIT License
 */

var
  vows = require('vows'),
  assert = require('assert'),
  file = require('../lib/capsfile'),
  select = require('js-select');
  
// directory of test resources
var resourcesDir = __dirname + "/../../test/resources/parser/";

vows.describe('capsfile tests')
.addBatch({
  'loading one file': {
    topic: function() {
      return file.loadSync(resourcesDir + 'capstest_file1.yaml');
    },
    'shall contain os capabilities': function(result) {
      assert.notEqual(result.os, null);
    },
    'shall contain os capability osfamily1': function(result) {
      var nodes = select(result, '.os .osfamily1 .attr').nodes();
      assert.deepEqual(nodes,  [ 'osfamily1', 'osfamily1_major1', 'osfamily1_major1_minor1' ]);
    }
  },
  'loading two files': {
    topic: function() {
      return file.loadSync([resourcesDir + 'capstest_file1.yaml',resourcesDir + 'capstest_file2.yaml']);
    },
    'shall contain os capabilities': function(result) {
      assert.notEqual(result.os, null);
    },
    'shall contain merged os capability osfamily1': function(result) {
      var nodes = select(result, '.os .osfamily1 .attr').nodes();
      assert.deepEqual(nodes,  [ 'osfamily1_merged', 'osfamily1_major1_merged', 'osfamily1_major1_minor1_merged' ]);      
    },
    'shall contain merged os capability osfamily2': function(result) {
      var nodes = select(result, '.os .osfamily2 .attr').nodes();
      assert.deepEqual(nodes,  [ 'osfamily2', 'osfamily2_major1', 'osfamily2_major1_minor1' ]);      
    },
    'shall contain ua capabilities': function(result) {
      assert.notEqual(result.ua, null);
    },
    'shall contain merged ua overwrites': function(result) {
      var nodes = select(result, '.ua .overwrites .attr').nodes();
      assert.deepEqual(nodes, [ 
        'uafamily1_overwrite_osfamily1', 
        'uafamily1_overwrite_osfamily2', 
        'uafamily1_overwrite_osfamily3' 
      ]);      
    },
    'shall contain merged ua regexes': function(result) {
      var nodes = select(result, '.ua .regexes .attr').nodes();
      assert.deepEqual(nodes, [ 'uafamily2_regex_UA1', 'uafamily2_regex_UA2', 'uafamily2_regex_UA3' ]);      
    },
    //~ 'log result': function(result) {
      //~ console.log(JSON.stringify(result, null, ' '));
      //~ assert(true);
    //~ }
  },
  /*
  'trying to load a non-caps file': {
    topic: function() {
      return file.loadSync(__dirname + '/../lib/capsfile.js')
    },
    'results in an YAMLException': function(result) {
      assert(/YAMLException/.test(result.error), "error YAMLException not found");
    },
  },
  */
})
.export(module);
  

