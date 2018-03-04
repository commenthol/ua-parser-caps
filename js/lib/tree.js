/**
 * handle capabilities tree
 *
 * Copyright (c) 2013 commenthol
 * Released under the MIT License
 */

'use strict'

/**
 * Module dependencies
 */
var path = require('path')
var jsSelect = require('js-select')
var async = require('async')
var merge = require('mergee').mergeExt
var capsFile = require('./util/file.js')
var parser = require('./parser.js')

/**
 * tree object constructor
 */
function Tree () {
  this.tree = {}
  this.isConverted = false
}

module.exports = Tree

/**
 * load one or more capabilities files and join them to one single
 * capabilities tree.
 *
 * @param {Array|String} files : filename(s) of the capability files to load
 */
Tree.prototype.loadSync = function (files) {
  var self = this

  files = files || []

  if (typeof (files) === 'string') {
    files = [ files ]
  }

  if (files.length === 1 && !this._fastload(files[0])) {
    // tree is fast loaded
    return
  }

  files.forEach(function (file) {
    var tree

    tree = capsFile.loadSync(file)
    self.add(tree)
  })

  self.convert()
}

/**
 * load one or more capabilities files asynchronously and join them to one single
 * capabilities tree.
 *
 * @param {Array|String} files : filename(s) of the capability files to load
 * @param
 */
Tree.prototype.load = function (files, cb) {
  var self = this

  files = files || []

  if (typeof (files) === 'string') {
    files = [ files ]
  }

  if (files.length === 1 && !this._fastload(files[0])) {
    // tree is fast loaded
    return cb()
  }

  async.eachSeries(files, function (file, callback) {
    capsFile.load(file, function (err, tree) {
      if (err) {
        callback(err)
      } else {
        self.add(tree)
        callback()
      }
    })
  }, function (err) {
    if (err) {
      // TODO
    } else {
      self.convert()
    }
    cb(err)
  })
}

/**
 * fast load capabilities as node module
 * @param {String} file - the module name to require
 * @return {Error}
 */
Tree.prototype._fastload = function (file) {
  if (path.extname(file) === '.js') {
    try {
      this.tree = require(file)
      return
    } catch (e) {
      return e
    }
  }
  return new Error('bad extension')
}

/**
 * add an new tree
 *
 * @param {Object} tree
 */
Tree.prototype.add = function (tree) {
  if (!this.isConverted) {
    if (Tree.isTree(tree)) {
      Tree.flattenExtends(tree)
      this.tree = merge({ ignoreNull: true }, this.tree, Tree.moveIntoArray(tree))
    }
  }
}

/**
 * convert the tree for use within parser
 *
 * @param {Object} tree
 */
Tree.prototype.convert = function () {
  if (!this.isConverted) {
    this.isConverted = true
    this.tree = Tree.convertRegexes(this.tree)
    this.tree = Tree.convertDevice(this.tree)
  }
}

/**
 * returns the tree
 *
 * @return {Object} tree
 */
Tree.prototype.get = function () {
  return this.tree
}

/**
 * print the tree in case of debugging
 */
Tree.prototype.print = function () {
  console.log(JSON.stringify(this.tree, null, ' '))
}

/**
 * check if tree is a valid capabilities tree
 */
Tree.isTree = function (tree) {
  return (tree && (tree.default || tree.os || tree.ua || tree.device))
}

/**
 * @private
 */
Tree._find = function _find (opts, obj, fn) {
  var i

  if (typeof obj === 'object' && obj) {
    if (Array.isArray(obj)) {
      for (i = 0; i < obj.length; i++) {
        _find(opts, obj[i], fn)
      }
    } else if (opts.key in obj) {
      obj = fn(obj)
    } else {
      for (i in obj) {
        if (obj.hasOwnProperty(i) && !opts.test[i]) {
          _find(opts, obj[i], fn)
        }
      }
    }
  }
}

/**
 * flatten all `extends` before merging trees
 *
 * @param {Object} tree : containing `extends`
 * @return {Object} tree with flattened extends
 */
Tree.flattenExtends = function (tree) {
  var parse = parser.parser(tree)
  var opts = {
    key: 'extends',
    test: { capabilities: 1 }
  }

  Tree._find(opts, tree, function (node) {
    return parse.flattenExtend(node)
  })

  return tree
}

/**
 * move the regexes into an array of arrays
 *
 * @param {Object} tree : containing `regexes` arrays
 * @return {Object} tree with regexes array mapped into another array
 */
Tree.moveIntoArray = function moveIntoArray (tree) {
  jsSelect(tree, '.regexes').update(function (node) {
    node = [ node ]
    return moveIntoArray(node)
  })
  return tree
}

/**
 * convert all regex strings from the capabilities into regular
 * expressions to speed up later processing
 *
 * @param {Object} tree with converted regular expressions
 */
Tree.convertRegexes = function (tree) {
  jsSelect(tree, '.regexes').update(function (regexes) {
    var i, j

    if (regexes) {
      for (i = 0; i < regexes.length; i += 1) {
        for (j = 0; j < regexes[i].length; j += 1) {
          if (regexes[i][j].regex && typeof (regexes[i][j].regex) === 'string') {
            regexes[i][j].regex = new RegExp(regexes[i][j].regex, 'i')
          } else if (regexes[i][j].regex_not && typeof (regexes[i][j].regex_not) === 'string') {
            regexes[i][j].regex_not = new RegExp(regexes[i][j].regex_not, 'i')
          }
        }
      }
    }

    return regexes
  })

  return tree
}

/**
 * Normalize all brand and model nodes
 *
 * @param {Object} tree: capabilities tree
 */
Tree.convertDevice = function (tree) {
  var nodes

  nodes = jsSelect(tree, '.brand .model, .brand, .device > .family')

  nodes.update(function (node) {
    var attr, norm

    for (attr in node) {
      norm = parser.normalizeDevice(attr)
      if (attr !== norm) {
        node[norm] = node[attr]
      }
    }
    return node
  })

  return tree
}
