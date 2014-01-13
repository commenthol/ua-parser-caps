"use strict";

var uaparser = require('ua-parser');
var capsparser = require('../index')().caps;

var userAgent = "Mozilla/5.0 (Linux; Android 4.3.1; LG-E980 Build/JLS36I) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.59 Mobile Safari/537.36";

var uaparsed = uaparser.parse(userAgent);
console.log(uaparsed);

var capabilities = capsparser(uaparsed).parse();
console.log(capabilities);
