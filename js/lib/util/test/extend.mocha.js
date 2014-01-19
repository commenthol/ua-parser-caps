/**
 * mocha test suite for util/extend.js
 *
 * Copyright (c) 2013 Commenthol
 * Released under the MIT License
 */

/*globals suite,test*/

"use strict";

var assert = require('assert'),
	extend = require('../extend').extend,
	merge  =  require('../extend').merge;


suite('extend tests', function() {

  suite('- extending values',function(){

    var source1 = { a:1, b:1};
    var source2 = { b:2, c:2};
    var source3 = { b:3, d:3};
    var result = extend (source1, source2, source3);

    test('- extended result', function(){
      assert.deepEqual(result, { a: 1, b: 3, c: 2, d: 3 });
    });
  });

  suite('- extending objects',function(){

    var source1 = { a: { a:1, b:1 } };
    var source2 = { b: { b:2, c:2 } };
    var source3 = { a: { b:3, d:null } };
    var result = extend (source1, source2, source3);

    test('- extended result', function(){
      assert.deepEqual(result, {
        a: { d: null, b: 3 },
        b: { c: 2, b: 2 }
      });
    });
  });

  suite('- extending objects of objects',function(){

    var source1 = { a: { a:1, b: { c: 2 } } };
    var source2 = { b: { b:2, c:2 } };
    var source3 = { a: { b: { d: 4 }, d:null } };
    var result = extend (source1, source2, source3);

    test('- extended result', function(){
      assert.deepEqual(result, {
        a: { d: null, b: { d: 4 } },
        b: { c: 2, b: 2 }
      });
    });
  });

  suite('- extending arrays',function(){

    var source1 = { a: [ 1, 2, 3 ] };
    var source2 = { b: [ 4, 5 ] };
    var source3 = { b: [ 6 ] };
    var result = extend (source1, source2, source3);

    test('- extended result', function(){
      assert.deepEqual(result, {
        a: [ 1, 2, 3 ],
        b: [ 6 ]
      });
    });
  });

  suite('- extending arrays of objects',function(){

    var source1 = { a: [ {a: 1} , {b: 2}, 3 ] };
    var source2 = { b: [ 3, {e: 4}, {f: 5} ] };
    var source3 = { b: [ {g: 6} ] };
    var result = extend (source1, source2, source3);

    test('- extended result', function(){
      assert.deepEqual(result, {
        a: [ {a: 1} , {b: 2}, 3 ],
        b: [ {g: 6} ]
      });
    });
  });

  suite('- manipulation after extending values',function(){

    var source1 = { a:1, b:1};
    var source2 = { b:2, c:2};
    var source3 = { b:3, d:3};
    var result = extend (source1, source2, source3);
    source3.b = { a: "a" };

    test('- extended result', function(){
      assert.deepEqual(result, { a: 1, b: 3, c: 2, d: 3 });
    });
  });

  suite('- manipulation after extending objects',function(){

    var source1 = { a: { a:1, b:1 } };
    var source2 = { b: { b:2, c:2 } };
    var source3 = { a: { b:3, d:3 } };
    var result = extend (source1, source2, source3);
    source2.b.b = { b: "a" };

    test('- extended result', function(){
      assert.deepEqual(result, {
        a: { d: 3, b: 3 },
        b: { c: 2, b: 2 }
      });
    });
  });
});

suite('merge tests', function() {

  suite('- merging values',function(){

    var source1 = { a:1, b:1};
    var source2 = { b:2, c:2};
    var source3 = { b:3, d:3};
    var result = merge (source1, source2, source3);

    test('- merged result', function(){
      assert.deepEqual(result, { a: 1, b: 3, c: 2, d: 3 });
    });
  });

  suite('- merging objects',function(){

    var source1 = { a: { a:1, b:1 } };
    var source2 = { a: { c: { a: null } }, b: { b:2, c:2 } };
    var source3 = { a: { b:3, d:3 } };
    var result = merge (source1, source2, source3);

    test('- merged result', function(){
      assert.deepEqual(result, {
        a: { a: 1, c: { a: null }, b: 3, d: 3 },
        b: { b: 2, c: 2 }
      });
    });
  });

  suite('- merging arrays',function(){

    var source1 = { a: [ 1, 2, 3 ] };
    var source2 = { b: [ 4, 5 ] };
    var source3 = { b: [ 6 ] };
    var result = merge (source1, source2, source3);

    test('- merged result', function(){
      assert.deepEqual(result, {
        a: [ 1, 2, 3 ],
        b: [ 4, 5, 6 ]
      });
    });
  });

  suite('- merging arrays of objects',function(){

    var source1 = { a: [ {a: 1} , {b: 2}, 3 ] };
    var source2 = { b: [ 3, {e: 4}, {f: 5} ] };
    var source3 = { a: [ 4, {g: 5}, 6 ], b: [ {g: 6} ] };
    var result = merge (source1, source2, source3);

    test('- merged result', function(){
      assert.deepEqual(result, {
        a: [ {a: 1} , {b: 2}, 3, 4, {g: 5}, 6 ],
        b: [ 3, {e: 4}, {f: 5}, {g: 6}]
      });
    });
  });

  suite('- merging arrays of objects of objects',function(){

    var source1 = { a: [ { aa: { ab: {ac: 1} } }, { ba: {bb: 2} }, 3 ] };
    var source2 = { a: [ { aa: { ab: {ac: 2} } }, { ba: {bb: 3} }, 4 ] };
    var source3 = { a: [ 4, {g: 5}, 6 ], b: [ {g: 6} ] };
    var result = merge (source1, source2, source3);

    test('- merged result', function(){
      assert.deepEqual(result, {
        a: [
          { aa: { ab: {ac: 1} } }, { ba: {bb: 2} }, 3,
          { aa: { ab: {ac: 2} } }, { ba: {bb: 3} }, 4,
          4, {g: 5}, 6
        ],
        b: [ {g: 6} ]
      });
    });
  });

  suite('- merging objects of objects',function(){

    var source1 = { a: { a:1, b:1 } };
    var source2 = { b: { b:2, c:2 } };
    var source3 = { a: { b: { e:3, f:4 }, d:3 } };
    var result = merge (source1, source2, source3);

    test('- merged result', function(){
      assert.deepEqual(result, {
        a: { a: 1, b: { e:3, f:4 }, d: 3 },
        b: { b: 2, c: 2 }
      });
    });
  });

  suite('- merging objects with null objects',function(){

    var source1 = { a: { a:1, b:1 } };
    var source2 = { b: { b:2, c:2 } };
    var source3 = { a: null };
    var result = merge (source1, source2, source3);

    test('- merged result', function(){
      assert.deepEqual(result, {
        a: { a:1, b:1 },
        b: { b:2, c:2 }
      });
    });
  });
});
