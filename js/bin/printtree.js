/*!
 * print out the merged capability tree as yaml file
 * might be useful for testing and debugging purposes
 */

'use strict'

var fs = require('fs')
var path = require('path')
var jsyaml = require('js-yaml')
var capsparser = require('../index')()

var tree
var out
var file = path.join(__dirname, '../../tree.yaml')

tree = capsparser.getTree()
out = jsyaml.dump(tree)

fs.writeFileSync(file, out, 'utf8')
