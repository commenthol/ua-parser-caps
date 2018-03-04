'use strict'

var Mocha = require('mocha')
var fs = require('fs')
var path = require('path')

var mocha = new Mocha({
  ui: 'bdd',
  reporter: 'min'
})

var dirs = [ '.', '../lib/util/test' ]
var fileMatch = /\.mocha\.js$/

dirs.forEach(function (dir) {
  dir = path.join(__dirname, dir)
  fs.readdirSync(dir).filter(function (file) {
    return fileMatch.test(file)
  }).forEach(function (file) {
    mocha.addFile(
      path.join(dir, file)
    )
  })
})

mocha.run(function (failures) {
  process.on('exit', function () {
    process.exit(failures)
  })
})
