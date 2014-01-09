/**
 * Copyright (c) 2013 commenthol
 * Released under the MIT License
 */

"use strict";

/**
 * Configuration file for ua-parser-caps
 * 
 * @property {Array} files
 */
var config = {
  files: [ 
    __dirname + "/../caps_device_type.yaml", 
    __dirname + "/../caps_user_view.yaml" 
  ]
};

module.exports = config;
