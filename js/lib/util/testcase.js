'use strict'

var m = require('mergee')
var uaParser = require('ua-parser2')
var capsParser = require('../../index')

/**
 * @param {Object}
 * @return {Function}
 */
function testcase (options) {
  options = options || {}

  var uaparser = uaParser(options.uaparser)
  var capsparser = capsParser(options.capsparser)

  var self = {
    /**
     * @param {String} userAgent - user-Agent string
     * @return {Object} testcase
     */
    generate: function (userAgent) {
      var uap = uaparser.parse(userAgent)
      var tc = capsparser.parse(uap)
      console.log(tc)
      tc = m.pick(tc, 'device.type, user.view, browser')
      tc.string = userAgent
      return tc
    }
  }

  return self
}

module.exports = testcase

var x = testcase().generate('Mozilla/5.0 (Linux; Android 4.3.1; LG-E980 Build/JLS36I) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.59 Mobile Safari/537.36')

console.log(x)
