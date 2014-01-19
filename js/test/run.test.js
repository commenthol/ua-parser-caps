"use strict";

var Mocha = require('mocha'),
	fs = require('fs'),
	path = require('path');

var mocha = new Mocha({
	ui: 'tdd',
	reporter: 'dot',
});

var dirs = [ '/.', '/../lib/util/test' ];
var fileMatch = /\.mocha\.js$/;

dirs.forEach(function(dir){
	dir = __dirname + dir;
	fs.readdirSync(dir).filter(function(file){
		return fileMatch.test(file);
	}).forEach(function(file){
		mocha.addFile(
			path.join(dir, file)
		);
	});
});

mocha.run(function(failures){
	process.on('exit', function () {
		process.exit(failures);
	});
});
