/**
 * Copyright (c) 2013 commenthol
 * Released under the MIT License
 */

'use strict'

var path = require('path')

/**
 * Configuration file for ua-parser-caps
 *
 * @property {Array} files
 */
var config = {
  fastload: path.join(__dirname, 'caps.js'),
  files: [
    path.join(__dirname, '../caps_device_type.yaml'),
    path.join(__dirname, '../caps_user_view.yaml'),
    path.join(__dirname, '../caps_ie_compatibility.yaml')
  ]
}

module.exports = config
