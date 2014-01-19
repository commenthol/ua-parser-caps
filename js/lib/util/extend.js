"use strict";

/**
 * Copyright (c) 2013 Commenthol 
 * Released under the MIT license
 */

/**
 * Extends multiple objects from 1..n object sources.
 * The resulting object is a deep clone of all objects provided.
 * 
 * e.g.
 * var source1 = { a:1, b:1};
 * var source2 = { b:2, c:2};
 * var source3 = { b:3, d:3};
 * var result = extend (source1, source2, source3);
 * result = {a:1, b:3, c:2, d:3};
 * 
 * @param  {Object} source1..sourceN
 * @return {Object}
 */
exports.extend = function extend() {
  var 
    i, j, 
    target = {};
  for (i in arguments) {
    for (j in arguments[i]) {
      if (arguments[i].hasOwnProperty(j)) {
        if (arguments[i][j] !== null && typeof(arguments[i][j]) === 'object' && !(arguments[i][j] instanceof Array)) {
          target[j] = extend({}, arguments[i][j]);
        }
        else {
          target[j] = arguments[i][j];
        }
      }
    }
  } 
  return target;
};

/**
 * Merges multiple objects from 1..n object sources.
 * The resulting object is a deep clone of all objects provided.
 * null objects do not merged into an already existing object.
 * 
 * e.g.
 * var source1 = { a: { a:1, b:1 } } ;
 * var source2 = { a: { c: { a: true } }, b: { b:2, c:2 } };
 * var source3 = { a: { b:3, d:3 } };
 * var result = merge (source1, source2, source3);
 * result = { a: { a: 1, c: { a: true }, b: 3, d: 3 }, b: { b: 2, c: 2 } };
 * 
 * @param  {Object} source1 .. sourceN
 * @return {Object}
 */
exports.merge = function merge() {
  var 
    i, j, k,
    target = {};
  for (i in arguments) {
    for (j in arguments[i]) {
      if (arguments[i].hasOwnProperty(j)) {
        if (arguments[i][j] !== null && typeof(arguments[i][j]) === 'object') {
          if (arguments[i][j] instanceof Array) {
            if (! target[j]) {
              target[j] = [];
            }
            for (k=0; k<arguments[i][j].length; k+=1) {
              target[j].push(arguments[i][j][k]);
            }
          }
          else {
            target[j] = merge(target[j], arguments[i][j]);
          }
        }
        else if (arguments[i][j] === null && target[j]) {
          // do nothing
        } 
        else {
          target[j] = arguments[i][j];
        }
      }
    }
  } 
  return target;
};

