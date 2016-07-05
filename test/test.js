'use strict'
// import test from 'ava'
const fs = require('fs')
const path = require('path')
const ug = require('uglify-js')
const multiline = require('../index.js')
// console.log(multiline)

var code = fs.readFileSync(path.resolve(__dirname, 'fixtures/1.js'), {encoding: 'utf8'})
console.log(code)
var newCode = multiline(code)
// console.log(newCode)
var ast = ug.parse(code)
var compressor = ug.Compressor()
var compressed = ast.transform(compressor)
var ugCode = compressed.print_to_string()
console.log(ugCode)