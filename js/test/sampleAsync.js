"use strict";

/**
 * sample file for asynch loading
 */

var userAgent = "Mozilla/5.0 (Linux; Android 4.3.1; LG-E980 Build/JLS36I) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.59 Mobile Safari/537.36";

var uaparser = require('ua-parser2')();
var capsparser = require('../index')(function(err,parser){
  /// async loading completed
  if (!err) {
    capsparser = parser;

    var uaparsed = uaparser.parse(userAgent);
    console.log(uaparsed);

    var capabilities = capsparser.parse(uaparsed);
    console.log(capabilities);
  }
});

var uaparsed = uaparser.parse(userAgent);
console.log(uaparsed);

/// using the functions is save albeight the caps files are not yet loaded
var capabilities = capsparser.parse(uaparsed);
console.log(capabilities);

