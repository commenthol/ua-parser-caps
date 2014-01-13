/**
 * test suite for caps parser
 * 
 * Copyright (c) 2013 Commenthol
 * Released under the MIT License
 */

"use strict";

// module dependencies
var
  vows   = require('vows'),
  assert = require('assert'),
  fs     = require('fs'),
  jsyaml = require('js-yaml'),
  capsparserF = require('../index'),
  extend = require('../util/extend').extend;

// directory of test resources
var resourcesDir = __dirname + "/../../test/resources/parser/";

/**
 * generate the test batches from the testcases.yaml file
 * 
 * @param {String} file : filename of testcases yaml file
 * @return {Object} batch for vows tests
 */
function batch(file) {
  var i, j;
  var _batch = {};
  var content = fs.readFileSync(resourcesDir + file, 'utf8');
  var testcases = jsyaml.safeLoad(content);

  for (i=0; i<testcases.length; i+=1) {
    var tc = testcases[i];
    //~ console.log(tc);

    // add path to all test files
    for (j=0; j<tc.setup.files.length; j+=1) {
      tc.setup.files[j] = resourcesDir + tc.setup.files[j];
    }

    _batch[tc.test] = (function(tc){
      var test = {};
      test.topic = function() {
        var capsparser = capsparserF(tc.setup.files);
        //~ capsparser.printCaps();
        var c = capsparser.caps(tc.setup.uaparsed).parse();
        //~ console.log(c);
        return c;
      };
      test[tc.resultmsg] = function (result) {
        assert.deepEqual(result, tc.result);
      };
      return test;
    })(tc);

  }
  return _batch;
}

vows.describe('capabilities tests')
.addBatch(batch("testcases_basic.yaml"))
.addBatch(batch("testcases_overwrites.yaml"))
.addBatch(batch("testcases_regexes.yaml"))
.addBatch(batch("testcases_extends.yaml"))
.addBatch(batch("testcases_filemerge.yaml"))
.addBatch(batch("testcases_brandmodel.yaml"))
.export(module);
