#!/usr/bin/env node

/**
 * convert caps files to js module for fast startup
 * @license MIT
 * @copyright 2015 commenthol
 */

'use strict';

var fs = require('fs');
var path = require('path');
var cmd = require('commander');
var uaParser = require('ua-parser2');

/// local modules
var config = require('../config');


/// module vars
var serialized;

/// the program
cmd
	.version(require('../../package.json').version)
	.usage('[options] <file ...>')
	.option('-c, --config', 'use files from config')
	.option('-u, --uaparser <file>', 'ua-parser2 regexes.yaml file')
	.option('-o, --output <file>', 'write output to <file>')
	.parse(process.argv);

if (cmd.output) {
	config.fastload = config.output;
}
if (cmd.args && cmd.args.length > 0) {
	config.yaml = cmd.args.forEach(function(file){
		if (path.extname(file) === '.yaml') {
			return file;
		}
	});
}
if (!config.files) {
	cmd.help();
	return;
}

console.log('... reading files');
config.files.forEach(function(file){
	console.log('    ' + file);
});
serialized = caps2js(config.files);
console.log('... writing to ' + config.fastload);
fs.writeFileSync(config.fastload, serialized, 'utf8');
