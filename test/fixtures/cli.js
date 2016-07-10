#!/usr/bin/env node
'use strict'
const fs = require('fs')
const breakline = require('.')

const argv = require('minimist')(process.argv.slice(2))
const files = argv._
files.forEach((file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) throw err
    const newCode = breakline(data)
    fs.writeFile(file + '.breakline', newCode, {
      encoding: 'utf8',
      flag: 'wx'
    }, err => { if (err) throw err })
  })
})
