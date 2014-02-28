/**
 * run some performance tests
 */
 
var fs = require('fs'),
	uaParserCap;

var
	ts, te,
	uas, i, u, n=100000;

ts = +new Date();
uaParserCap = require('../index')();
te = +new Date();

console.log("Loading Parser in %d ms", (te-ts));

uas = JSON.parse(fs.readFileSync(__dirname + '/../../test_resources/test_capabilities.json', 'utf8'));

ts = +new Date();
for(i=0; i<n; i++) {
	u = Math.floor(Math.random()*uas.length);

	uaParserCap.parse(uas[u]);
}
te = +new Date();

console.log("Parsed %d UAs in %d ms @ %s uas/s (%s μs/ua)", n, (te-ts), (n*1000/(te-ts)).toFixed(1), ((te-ts)*1000/n).toFixed(1));
