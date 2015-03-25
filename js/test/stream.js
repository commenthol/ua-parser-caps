'use strict';

var es =  require('event-stream')
  , fs =  require('fs')
  , path =  require('path')
  , assert = require('assert')
  , capsParser = require('../index')
  , extend = require('mergee').extend;

// test resources
var capsDir = __dirname + "/../../"
  , resourcesDir = __dirname + "/../../test/resources/"
	//~ , testcasesFile = 'test_capabilities.json';
	, testcasesFile = 'x.json';

// capability files under test
var capsFiles = [
	'caps_device_type.yaml',
	'caps_user_view.yaml',
	'caps_ie_compatibility.yaml'
];

capsFiles = capsFiles.map(function(file) {
	return path.normalize(capsDir + file);
});

var capsparser = capsParser(capsFiles);
var REGEX_DATA = /^\s*({.*})\s*,\s*$/;

var describe = function F(name, cb) {
  F.name = name;
  cb();
}

var it = function (name, cb) {
  try {
    cb();
  }
  catch (e) {
    console.log();
  }
}

function _parse() {
  return es.map(function (data, cb) {
    if (data && REGEX_DATA.test(data)){
      try {
        data = JSON.parse(data.replace(REGEX_DATA,'$1'));
        cb(null, data);
      }
      catch(e) {
        cb(e);
      }
    }
    else {
      cb();
    }
  });
};

function _test () {
  return es.map(function (tc, cb) {
    if (tc.string) {
      var capabilities = capsparser.parse(tc);
      describe(tc.string, function(){
        it('- device type', function() {
          assert.equal(capabilities.device.type, tc.capabilities.device.type + 'x');
        });
        it('- user view', function() {
          assert.equal(capabilities.user.view, tc.capabilities.user.view);
        });
        it('- ie compatibility mode', function() {
          if (tc.capabilities.browser && tc.capabilities.browser.ie_compatibility_mode) {
            assert.deepEqual(capabilities.browser, tc.capabilities.browser);
          }
        });
      });
    }
  });
}

var st = fs.createReadStream(resourcesDir + testcasesFile, { encoding: 'utf-8' });

st.pipe(es.split())
  .pipe(_parse())
  .pipe(_test());

st.on('end', function(){
  process.stdout.write("\nREPL stream ended.\n");
});
