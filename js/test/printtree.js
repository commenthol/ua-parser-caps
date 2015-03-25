/*!
 * print out the merged capability tree as yaml file
 * might be useful for testing and debugging purposes
 */

"use strict";

var fs = require('fs');
var jsyaml = require('js-yaml');
var uaparser = require('ua-parser2');
var capsparser = require('../index')();

var tree;
var out;
var file = __dirname + "/../../tree.yaml";

tree = capsparser.getTree();
out = jsyaml.dump(tree);

fs.writeFileSync(file, out, 'utf8');

