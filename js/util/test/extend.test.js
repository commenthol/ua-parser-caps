"use strict";

/**
 * test suite for util/extend.js
 * 
 * Copyright (c) 2013 Commenthol 
 * Released under the MIT License
 */

var
  vows   = require('vows'),
  assert = require('assert'),
  extend = require('../extend').extend,
  merge  =  require('../extend').merge;
  
vows.describe('extend merged')
.addBatch({
  'extending values': {
    topic: function() {
      var source1 = { a:1, b:1};
      var source2 = { b:2, c:2};
      var source3 = { b:3, d:3};
      return extend (source1, source2, source3);
    },
    'extended result': function(result) {
      assert.deepEqual(result, { a: 1, b: 3, c: 2, d: 3 });
    },
  },
  'extending objects': {
    topic: function() {
      var source1 = { a: { a:1, b:1 } } ;
      var source2 = { b: { b:2, c:2 } };
      var source3 = { a: { b:3, d:null } };
      return extend (source1, source2, source3);
    },
    'extended result': function(result) {
      assert.deepEqual(result, { 
        a: { d: null, b: 3 },
        b: { c: 2, b: 2 } 
      });
    },
  },
  'extending objects of objects': {
    topic: function() {
      var source1 = { a: { a:1, b: { c: 2 } } } ;
      var source2 = { b: { b:2, c:2 } };
      var source3 = { a: { b: { d: 4 }, d:null } };
      return extend (source1, source2, source3);
    },
    'extended result': function(result) {
      assert.deepEqual(result, { 
        a: { d: null, b: { d: 4 } }, 
        b: { c: 2, b: 2 }
      });
    },
  },
  'extending arrays': {
    topic: function() {
      var source1 = { a: [ 1, 2, 3 ] };
      var source2 = { b: [ 4, 5 ] };
      var source3 = { b: [ 6 ] };
      return extend (source1, source2, source3);
    },
    'extended result': function(result) {
      assert.deepEqual(result, { 
        a: [ 1, 2, 3 ],
        b: [ 6 ] 
      });
    },
  },
  'extending arrays of objects': {
    topic: function() {
      var source1 = { a: [ {a: 1} , {b: 2}, 3 ] };
      var source2 = { b: [ 3, {e: 4}, {f: 5} ] };
      var source3 = { b: [ {g: 6} ] };
      return extend (source1, source2, source3);
    },
    'extended result': function(result) {
      assert.deepEqual(result, { 
        a: [ {a: 1} , {b: 2}, 3 ],
        b: [ {g: 6} ] 
      });
    },
  },
  'manipulation after extending values': {
    topic: function() {
      var source1 = { a:1, b:1};
      var source2 = { b:2, c:2};
      var source3 = { b:3, d:3};
      var result = extend (source1, source2, source3);
      source3.b = { a: "a" };
      return result;
    },
    'extended result': function(result) {
      assert.deepEqual(result, { a: 1, b: 3, c: 2, d: 3 });
    },
  },
  'manipulation after extending objects': {
    topic: function() {
      var source1 = { a: { a:1, b:1 } } ;
      var source2 = { b: { b:2, c:2 } };
      var source3 = { a: { b:3, d:3 } };
      var result = extend (source1, source2, source3);
      source2.b.b = { b: "a" };
      return result;
    },
    'extended result': function(result) {
      assert.deepEqual(result, { 
        a: { d: 3, b: 3 },
        b: { c: 2, b: 2 } 
      });
    },
  },
})
.addBatch({
  'merging values': {
    topic: function() {
      var source1 = { a:1, b:1};
      var source2 = { b:2, c:2};
      var source3 = { b:3, d:3};
      return merge (source1, source2, source3);
    },
    'merged result': function(result) {
      assert.deepEqual(result, { a: 1, b: 3, c: 2, d: 3 });
    },
  },
  'merging objects': {
    topic: function() {
      var source1 = { a: { a:1, b:1 } } ;
      var source2 = { a: { c: { a: null } }, b: { b:2, c:2 } };
      var source3 = { a: { b:3, d:3 } };
      return merge (source1, source2, source3);
    },
    'merged result': function(result) {
      assert.deepEqual(result, { 
        a: { a: 1, c: { a: null }, b: 3, d: 3 },
        b: { b: 2, c: 2 } 
      });
    },
  },
  'merging arrays': {
    topic: function() {
      var source1 = { a: [ 1, 2, 3 ] };
      var source2 = { b: [ 4, 5 ] };
      var source3 = { b: [ 6 ] };
      return merge (source1, source2, source3);
    },
    'merged result': function(result) {
      assert.deepEqual(result, { 
        a: [ 1, 2, 3 ],
        b: [ 4, 5, 6 ] 
      });
    },
  },
  'merging arrays of objects': {
    topic: function() {
      var source1 = { a: [ {a: 1} , {b: 2}, 3 ] };
      var source2 = { b: [ 3, {e: 4}, {f: 5} ] };
      var source3 = { a: [ 4, {g: 5}, 6 ], b: [ {g: 6} ] };
      return merge (source1, source2, source3);
    },
    'merged result': function(result) {
      assert.deepEqual(result, { 
        a: [ {a: 1} , {b: 2}, 3, 4, {g: 5}, 6 ],
        b: [ 3, {e: 4}, {f: 5}, {g: 6}] 
      });
    },
  },
  'merging arrays of objects of objects': {
    topic: function() {
      var source1 = { a: [ { aa: { ab: {ac: 1} } }, { ba: {bb: 2} }, 3 ] };
      var source2 = { a: [ { aa: { ab: {ac: 2} } }, { ba: {bb: 3} }, 4 ] };
      var source3 = { a: [ 4, {g: 5}, 6 ], b: [ {g: 6} ] };
      return merge (source1, source2, source3);
    },
    'merged result': function(result) {
      assert.deepEqual(result, { 
        a: [ 
          { aa: { ab: {ac: 1} } }, { ba: {bb: 2} }, 3, 
          { aa: { ab: {ac: 2} } }, { ba: {bb: 3} }, 4,
          4, {g: 5}, 6
        ],
        b: [ {g: 6} ] 
      });
    },
  },
  'merging objects of objects': {
    topic: function() {
      var source1 = { a: { a:1, b:1 } } ;
      var source2 = { b: { b:2, c:2 } };
      var source3 = { a: { b: { e:3, f:4 }, d:3 } };
      return merge (source1, source2, source3);
    },
    'merged result': function(result) {
      assert.deepEqual(result, { 
        a: { a: 1, b: { e:3, f:4 }, d: 3 },
        b: { b: 2, c: 2 } 
      });
    },
  },
  'merging objects with null objects': {
    topic: function() {
      var source1 = { a: { a:1, b:1 } } ;
      var source2 = { b: { b:2, c:2 } };
      var source3 = { a: null };
      return merge (source1, source2, source3);
    },
    'merged result': function(result) {
      assert.deepEqual(result, { 
        a: { a:1, b:1 },
        b: { b:2, c:2 } 
      });
    },
  },
})
.export(module);
