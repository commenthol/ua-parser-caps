# ua-parser-caps

> Adding capabilities to *ua-parser2*

**NOTE: This projects data-sets (yaml files) are outdated as not beiing maintained any more...**

[![NPM version](https://badge.fury.io/js/ua-parser-caps.svg)](https://www.npmjs.com/package/ua-parser-caps/)
[![Build Status](https://secure.travis-ci.org/commenthol/ua-parser-caps.svg?branch=master)](https://travis-ci.org/commenthol/ua-parser-caps)

`ua-parser-caps` is a parser build upon the extracted data provided by [ua-parser2][].
It adds capabilities to User-Agent String(s) with the following features:

* Capabilities can be added using the dimensions OS, User-Agent and device.
* Capabilities can be applied per regular-expression either on complete User-Agent strings or on any extracted value provided by the parsing result from `ua-parser2`.
* Capabilities can be extended per OS, User-Agent and Device.
  * Extends can be chained (use capability3 based on capability2 based on capability1 ...).
* Capabilities can be overwritten if criterias from another dimension match.
* Capabilities can be attributed within separate files. This allows to choose the proper capabilities for your use-case.

## Table of Contents

<!-- !toc (minlevel=2 omit="Table of Contents") -->

* [Capability Files](#capability-files)
* [Usage](#usage)
* [Specification](#specification)
* [Files](#files)
* [Contribution and License Agreement](#contribution-and-license-agreement)
* [License](#license)

<!-- toc! -->

## Capability Files

Within this project the following capability-files are provided:

* `caps_device_type.yaml` contains a device-type classification of a User-Agent String.
* `caps_user_view.yaml` contains a user view default preference classification.
* `caps_ie_compatibility.yaml` contains information on Internet Explorer capability mode.

Details of the capabilities can be found within the files.

The set of capability files you want to use in your project can be changed within the file `js/config.js`.

### Fastloading

To speed up the loading and parsing of the YAML files a preparsed js-module is generated.

Use `js/bin/caps2js.js -c` or `make caps` to generate a new version if the YAML files have changed.

npm packages always contain the latest capability files.


## Usage

A sample usage is provided using the file `js/test/sample.js`.

```javascript
var uaparser = require('ua-parser2')();
var capsparser = require('ua-parser-caps')();
var userAgent = 'Mozilla/5.0 (Linux; Android 4.3.1; LG-E980 Build/JLS36I) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.59 Mobile Safari/537.36';

var uaparsed = uaparser.parse(userAgent);
var capabilities = capsparser.parse(uaparsed);
console.log(capabilities);
```

outputs:

```json
{ device: { type: 'phablet' },
  user: { view: 'mobile' },
  info:
   { href:
      { '1': 'http://www.lg.com/uk/mobile',
        '2': 'http://www.lg.com/us/',
        '3': 'https://support.google.com/googleplay/answer/1727131?hl=en#L' } },
  screen: { size: 5.5, width: 1080, height: 1920 } }
```
See [sample.js](./js/test/sample.js).

**Asynchronous Loading**

```js
var userAgent = "Mozilla/5.0 (Linux; Android 4.3.1; LG-E980 Build/JLS36I) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.59 Mobile Safari/537.36";

var uaparser = require('ua-parser2')();
require('ua-parser-caps')(function(err, capsparser){
  /// async loading completed
  if (!err) {
    var uaparsed = uaparser.parse(userAgent);
    var capabilities = capsparser.parse(uaparsed);
    console.log(capabilities);
  }
});
```
See [sampleAsync.js](./js/test/sampleAsync.js).


## Specification

If you are interested to contribute data or even write your own capability files then please take a look into the [specification][spec].


## Files


* `./`
  * `caps_*.yaml` capability files

* `./doc`
  * `specification.md` Specification on capability files.

* `./js`
  * `index.js` A node.js implementation of `ua-parser-cap`. <br>
  * `config.js` Configuration file for the parser.

* `./js/test`
  * test files for the parser.

* `./test/resources/parser`
  * test files as yaml files to test a `ua-parser-cap` implementation. <br>


## Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your code to be distributed under the MIT license. You are also implicitly verifying that all code is your original work.

If you contribute data to this project, you are implicitly allowing your code to be distributed under the CC-BY-4.0 license. You are also implicitly verifying that all data is your original work.

Please read the [contributors' guide][contribute].


## License

Copyright (c) 2013 commenthol

Software is released under [MIT][license]. <br>
Data provided within Yaml-Files is released under [CC-BY-4.0][license].


[nodejs]: http://nodejs.org
[ua-parser2]: https://github.com/commenthol/ua-parser2
[license]: ./LICENSE
[contribute]: ./CONTRIBUTING.md
[spec]: ./doc/specification.md
