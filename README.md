ua-parser-caps [![Build Status](https://secure.travis-ci.org/commenthol/ua-parser-caps.png?branch=master)](https://travis-ci.org/commenthol/ua-parser-caps)
==============

Adding capabilities to *ua-parser*

`ua-parser-caps` is a parser build upon the extracted data provided by [ua-parser][ua-parser].
It adds capabilities to User-Agent String(s) with the following features:

* Capabilities can be added using the dimensions OS, User-Agent and device.
* Capabilities can be applied per regular-expression either on complete User-Agent strings or on any extracted value provided by the parsing result from `ua-parser`.
* Capabilities can be extended per OS, User-Agent and Device.
  * Extends can be chained (use capability3 based on capability2 based on capability1 ...).
* Capabilities can be overwritten if criterias from another dimension match. 
* Capabilities can be attributed within separate files. This allows to choose the proper capabilities for your use-case.


## Capability Files

Within this project two capability-files are provided:

* `caps_device_type.yaml` contains a device-type classification of a User-Agent String.
* `caps_user_view.yaml` contains a user view default preference classification.

Details of the capabilities can be found within the files.

The set of capability files you want to use in your project can be changed within the file `js/config.js`.


## Usage [node.js][nodejs]

A sample usage is provided using the file `js/test/sample.js`.

````js
var uaparser = require('ua-parser');
var caps     = require('../index')().caps;
var userAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Mobile/11A465";

var uaparsed = uaparser.parse(userAgent);
console.log(uaparsed);

var capability = caps(uaparsed).parse();
console.log(capability);

````
outputs:

````json
{ string: 'Mozilla/5.0 (Linux; Android 4.3.1; LG-E980 Build/JLS36I) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.59 Mobile Safari/537.36',
  ua: 
   { family: 'Chrome Mobile',
     major: '31',
     minor: '0',
     patch: '1650' },
  userAgent: 
   { family: 'Chrome Mobile',
     major: '31',
     minor: '0',
     patch: '1650' },
  os: 
   { family: 'Android',
     major: '4',
     minor: '3',
     patch: '1',
     patchMinor: null },
  device: { family: 'LG-E980', brand: 'LG', model: 'E980' },
  family: 'Chrome Mobile',
  major: 31,
  minor: 0,
  patch: 1650 }
{ device: { type: 'phablet' },
  user: { view: 'mobile' },
  info: 
   { href: 
      { '1': 'http://www.lg.com/uk/mobile',
        '2': 'http://www.lg.com/us/',
        '3': 'https://support.google.com/googleplay/answer/1727131?hl=en#L' } },
  screen: { size: 5.5, width: 1080, height: 1920 } }
````

## Specification

If you are interested to contribute data or even write your own capability files then please take a look into the [specification][spec].


## Files 


`./` <br>
`caps_*.yaml`: capability files 

`./test/resources/parser` <br>
test files as yaml files to test a `ua-parser-cap` implementation. <br>

`./test/resources/parser` <br>
TODO test files as ?? files to test the capability files.
 
`./doc` <br>
`specification.md`: Specification on capability files.

`./js` <br>
`index.js`: A node.js implementation of `ua-parser-cap`. <br>
`config.js`: Configuration file for the parser.

`./js/test` <br>
test files for the parser.


## Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your code to be distributed under the MIT license. You are also implicitly verifying that all code is your original work.

If you contribute data to this project, you are implicitly allowing your code to be distributed under the CC-BY-4.0 license. You are also implicitly verifying that all data is your original work.

Please read the [contributors' guide][contribute].


## License

Copyright (c) 2013 commenthol 

Software is released under [MIT][license]. <br>
Data provided within Yaml-Files is released under [CC-BY-4.0][license].


[nodejs]: http://nodejs.org
[ua-parser]: https://github.com/tobie/ua-parser
[license]: ./LICENSE
[contribute]: ./CONTRIBUTING.md
[spec]: ./doc/specification.md
