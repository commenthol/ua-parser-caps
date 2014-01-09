"use strict";

/**
 * test suite for util/select.js
 * 
 * Copyright (c) 2013 Commenthol 
 * Released under the MIT License
 */

var
  vows   = require('vows'),
  assert = require('assert'),
  select = require('../select').select;
  
vows.describe('select')
.addBatch({
  'select from a null object': {
    topic: function() {
      var obj = null;      
      return select(obj, ["test", "test"] );
    },
    'results in null': function(result) {
      assert.deepEqual(result, null);
    },
  },
  'select with empty selectors': {
    topic: function() {
      var obj = {
        test: { a:1 }
      };      
      return select(obj);
    },
    'results in null': function(result) {
      assert.deepEqual(result, null);
    },
  },
  'select an existing object': {
    topic: function() {
      var obj = {
        test: {
          test: {
            test: { a: 1 }
          },
          test2: { b: 2 }
        }
      };
      
      return select(obj, ["test", "test"] );
    },
    'result an object': function(result) {
      assert.deepEqual(result, {test: { a: 1 }});
    },
  },
  'select a 0 value from an existing object': {
    topic: function() {
      var obj = {
        test: {
          test: 0,
          test2: { b: 2 }
        }
      };
      return select(obj, ["test", "test"] );
    },
    'result an object': function(result) {
      assert.deepEqual(result, 0);
    },
  },
})
.export(module);

