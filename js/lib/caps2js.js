/**
 * @license MIT
 * @copyright 2015 commenthol
 */

'use strict'

var Tree = require('./tree')
var serialize = require('serialize-to-js').serializeToModule

/**
 * serialize the merged caps tree
 * @param {Array} files - yaml files to load and merge
 * @param {Function} [cb] - callback
 * @return {String} serialized module
 */
function caps2js (files, cb) {
  var tree = new Tree()

  function _serialize () {
    return serialize(tree.get(), { reference: true })
  }

  if (cb) {
    tree.load(files, function (err) {
      if (err) return cb(err)
      cb(null, _serialize())
    })
  } else {
    tree.loadSync(files)
    return _serialize()
  }
}

module.exports = caps2js
