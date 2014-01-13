"use strict";

// module dependencies
var
  assert = require('assert'),
  fs     = require('fs'),
  jsyaml = require('js-yaml'),
  capsParser = require('../index'),
  extend = require('../util/extend').extend;

// directory of test resources
var resourcesDir = __dirname + "/../../test/resources/";
var capsDir = __dirname + "/../../";
var testcasesFile = 'test_capabilities.json';
//~ testcasesFile = 't.yaml';

var content = fs.readFileSync(resourcesDir + testcasesFile, 'utf8');
var testcases = JSON.parse(content);
//~ var testcases = jsyaml.safeLoad(content);


var capsFiles = [ 'caps_device_type.yaml', 'caps_user_view.yaml' ];

capsFiles = capsFiles.map( function(f){
  return capsDir + f;
});

suite('device type tests', function() {
  var capsparser = capsParser(capsFiles).caps;
  
  testcases.forEach(function(tc) {
    test(tc.string, function() {
      var capabilities = capsparser(tc).parse();
      assert.equal(tc.capabilities.device.type, capabilities.device.type);
      assert.equal(tc.capabilities.user.view, capabilities.user.view);
    });
  });
});

