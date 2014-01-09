"use strict";

/**
 * Copyright (c) 2013 Commenthol 
 * Released under the MIT license
 */

/**
 * select an object from an object tree `obj`.
 * `selectors` define the path to select the resulting object.
 * 
 * @param {Object} obj
 * @param {Array} selectors
 * 
 * @return {Object|String|Array} 
 */
function select(obj, selectors) {
  
  var i, tmpObj, attr;
  
  tmpObj = obj || {}; 

  if (selectors && selectors.length) {

    for (i=0; i<selectors.length; i+=1) {
      attr = selectors[i];
      if (tmpObj && tmpObj.hasOwnProperty(attr)) {
        tmpObj = tmpObj[attr];
      }
      else {
        return null;
      }
    } 

    return tmpObj;
  }
  
  return null;   
}

exports.select = select;
