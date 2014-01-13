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
var jsSelect = require('js-select');
var capsfile = require('./lib/capsfile');
var extend   = require('./util/extend').extend;
var merge    = require('./util/extend').merge;
var select   = require('./util/select').select;
var config   = require('./config');

/**
 * convert all regex strings from the capabilities into regular 
 * expressions to speed up later processing
 * 
 * @param {Object} caps: capabilities
 * @api: private
 */
function convertRegexes(caps) {
  jsSelect(caps, ".regexes").update(function(regexes){
    var i, j;

    if (regexes) {
      for (i=0; i<regexes.length; i+=1) {
        for (j=0; j<regexes[i].length; j+=1) {
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
  
  return caps;
}

/**
 * normalize brand model names
 * put to lowercase and replace special chars by "-"
 * 
 * @param {String} str
 * 
 * @return {String} normalized string
 */
function normalizeDevice(str) {

  if (str) {
    str = str.toLowerCase();
    str = str.replace(/[ _]/g, " ");
  }
  
  return str;
}

/**
 * utility function to select a device family, brand or model 
 * If device is not found try again using a normalized form
 * 
 * @param {Object} selector
 * @param {String} attr : attribute 
 * 
 * @return {Object} found object
 */
function selectNormalizedDevice(selector, attr) {
  var obj;
  
  obj = select(selector, [ attr ]);
  if (obj === null) {
    obj = select(selector, [ normalizeDevice(attr) ]);
  }
  
  return obj;
}

/**
 * Prepare all brand and model nodes
 */
function convertDevice(caps) {
  var nodes;
  
  nodes = jsSelect(caps, ".brand .model, .brand, .device > .family");
  
  nodes.update(function(node){
    var attr, norm;
    for (attr in node) {
      norm = normalizeDevice(attr);
      if (attr !== norm) {
        node[norm] = node[attr];
      }
    }
    return node;
  });

  return caps;
}

/**
 * intitilize the capabilities parser with one or more capabilities files
 * 
 * @param {String|Array} files : file or files to load
 * @return methods offered
 */
module.exports = function(files) {
  var  
    F = {},
    capabilities;
  
  if (!files) {
    files = config.files || [];
  }
  capabilities = capsfile.loadSync(files); // TODO: change this to an async version for clustermode
  
  // TODO handle capabilities.error
  capabilities = convertRegexes(capabilities);
  capabilities = convertDevice(capabilities);
  
  /**
   * print capabilities tree
   */
  F.printCaps = function printCaps() {
    console.log(JSON.stringify(capabilities, null, ' '));
  };

  /**
   * prepare parser with a parsed user-agent-string from ua-parser
   *
   * @param {Object} uaparsed
   * @return methods offered
   */
  F.caps = function caps(uaparsed) {
    var applyDefaultCaps = true;  
    var recursion = {};
    var self = { cap: {} };
    
    self.uaparsed = extend({ string: '', os: {}, ua: {}, device: {}}, uaparsed);
    
    /**
     * initialization
     */
    function init() {
      applyDefaultCaps = true;
      recursion = { cnt: 0, max: 100, ok: true };
    }
    
    /**
     * get a single capability per item
     * 
     * @param {Object} item : item found after search
     * @param {Object} string : string for regex test (defaults to uaparsed.string) 
     */
    function getCap(item, type, string) {
      var i, j, k, 
        tmp, arr;

      string = string || self.uaparsed.string;

      //~ console.log(">>item");
      //~ console.log(item);
      if (item) {
        if (item.extends && recursion.ok) {
          for (i=0; i < item.extends.length; i+=1) {
            for (j=0; j < item.extends[i].length; j+=1) {
              tmp = item.extends[i][j];
              //~ console.log(">>tmp");
              //~ console.log(tmp)
              //~ console.log(recursion.cnt);
              recursion.cnt += 1;
              if (recursion.cnt > recursion.max) { 
                console.log("max recursion depth " + recursion.max + " reached");
                recursion.ok = false;
                break;
              }
              else {
                if (tmp.device) {
                  deviceCaps(tmp.device);
                }
                else if (tmp.os) {
                  osuaCaps(tmp.os, 'os');
                }
                else if (tmp.ua) {
                  osuaCaps(tmp.ua, 'ua');
                }
                recursion.cnt -= 1;
              }
            }
          }
        }
        if (item.capabilities) {
          self.cap = merge(self.cap, item.capabilities || {});
        }
        if (item.regexes) {
          for (i=0; i < item.regexes.length; i+=1) {
            for (j=0; j < item.regexes[i].length; j+=1) {
              tmp = item.regexes[i][j];
              
              if (tmp.capabilities &&
                ((tmp.regex    &&   tmp.regex.test(string)) ||
                 (tmp.regexNot && ! tmp.regexNot.test(string)))
              ){
                self.cap = merge(self.cap, tmp.capabilities);
                
                // dive into regexes chain 
                if (type === 'device') {
                  arr = ['model'];
                }
                else {
                  arr = ['major', 'minor'];
                }
                arr.forEach(function(p){
                  if (tmp[p]) {
                    getCap(tmp[p], type, self.uaparsed[type][p]);
                  }
                });
                
                break;
              }
            }
          }
        }
      }
    }

    /**
     * apply default capabilities if exists
     */
    function defaultCaps() {
      if (applyDefaultCaps && capabilities.default) {
        getCap(capabilities.default);
        applyDefaultCaps = false; // apply default capabilities only once
      }
    }

    /**
     * get capabilty per os or ua family
     * stores the result in `self.cap`
     * 
     * @param {Object} obj : object to seach in tree
     * @param {String} type : ("os"|"ua") search either for os or ua (defaults to "os")
     * @param {Object} selector : selector to start search from
     */
    function osuaCaps(obj, type, selector) {
      var family, major, minor;

      type = type || 'os';
      selector = selector || capabilities;

      //~ console.log(">>obj")
      //~ console.log(obj)
      if (obj && obj.family) {
        family = select(selector, [ type, "family" ]);
        getCap(family, type, obj.family);
        family = select(family, [ obj.family ]);
        getCap(family, type);
        uaOverwrite(family);
        if (obj.major) {
          major = select(family, [ "major" ]);
          getCap(major, type, obj.major);
          major = select(major, [ obj.major ]);
          getCap(major, type);
          uaOverwrite(major);
          if (obj.minor) {
            minor = select(major, [ "minor" ]);
            getCap(minor, type, obj.minor);
            minor = select(minor, [ obj.minor ]);
            getCap(minor, type);
            uaOverwrite(minor);
          }
        }
      }
    }

    /**
     * get capabilty per device
     * stores the result in `self.cap`
     * 
     * @param {Object} obj : object to seach in tree
     * @param {Object} selector : selector to start search from
     */
    function deviceCaps(obj, selector) {
      var 
        family, 
        brand, 
        model,
        type = "device";
      
      selector = selector || capabilities;

      //~ console.log(">>obj")
      //~ console.log(obj)
      if (obj && obj.family) {
        family = select(selector, [ "device" , "family" ]);
        getCap(family, type, obj.family);
        family = selectNormalizedDevice(family, obj.family);
        getCap(family, type);
        deviceOverwrite(family);
      }
      if (obj && obj.brand) {
        brand = select(selector, [ "device", "brand" ]);
        getCap(brand, type, obj.brand);
        brand = selectNormalizedDevice(brand, obj.brand);
        getCap(brand, type);
        deviceOverwrite(brand);
        if (obj.model) {
          model = select(brand, [ "model" ]);
          getCap(model, type, obj.model);
          model = selectNormalizedDevice(model, obj.model);
          getCap(model, type);
          deviceOverwrite(model);
        }
      }
    }

    /**
     * overwrite ua capabilities by os or device
     * 
     * @param {Object} selector : selector to start search from
     */
    function uaOverwrite(selector) {
      var i,
        sel;
      if (selector && selector.overwrites && selector.overwrites.length) {
        sel = selector.overwrites;
        for (i=0; i<sel.length; i++) {
          if (sel[i].os) {
            osuaCaps(self.uaparsed.os, 'os', sel[i]);
          }
          if (sel[i].device) {
            deviceCaps(self.uaparsed.device, sel[i]);
          }
        }
      }
    }

    /**
     * overwrite device capabilities by ua or os
     * 
     * @param {Object} selector : selector to start search from
     */
    function deviceOverwrite(selector) {
      var i,
        sel;
      if (selector && selector.overwrites && selector.overwrites.length) {
        sel = selector.overwrites;
        for (i=0; i<sel.length; i++) {
          if (sel[i].os) {
            osuaCaps(self.uaparsed.os, 'os', sel[i]);
          }
          if (sel[i].ua) {
            osuaCaps(self.uaparsed.ua, 'ua', sel[i]);
          }
        }
      }
    }

    /**
     * parse capabilities on "os"
     */
    self.parseOs = function parseOs() {
      defaultCaps();
      osuaCaps(self.uaparsed.os, 'os');
    };

    /**
     * parse capabilities on "ua"
     */
    self.parseUa = function parseUa() {
      defaultCaps();
      osuaCaps(self.uaparsed.ua, 'ua');
    };
    
    /**
     * parse capabilities on "device"
     */
    self.parseDevice = function parseDevice() {
      defaultCaps();
      deviceCaps(self.uaparsed.device);
    };

    /**
     * parse capabilities for "os", "ua", "device"
     */
    self.parse = function parse() {
      init();
      self.parseOs();
      self.parseUa();
      self.parseDevice();
      return self.cap;
    };

    // return the methods for parsing
    return self;
  };

  // return the methods of module
  return F;
};
