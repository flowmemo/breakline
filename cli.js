#!/usr/bin/env node
'use strict'
const fs = require('fs-extra')
const path = require('path')
const breakline = require('.')
const glob = require('glob')
const debug = require('debug')('cli')

const info = `
breakline: break your JS code into valid multilines as many as possible

Usage:
breakline <files or directory> [options]

Optioins:
--help, -h
  Show help info.
-o <directory>  
  Output directory.
--suffix <true|false>
  add '.breakline' suffix to the output files. The default is true.
`
const argv = require('minimist')(process.argv.slice(2))
const outDir = argv.d || ''
let suffix = '.breakline'
if (argv.suffix === false) suffix = ''
const cwd = process.cwd()
debug(argv._)
if (argv._.length === 0 || argv.h || argv.help) return console.log(info)
for (let item of argv._) {
  let files = []
  item = path.relative(cwd, path.resolve(item)) // remove trailing slash
  debug(item)
  if (fs.statSync(item).isDirectory()) {
    files = files.concat(glob.sync(item + '/**/*.js'))
  } else files.push(item)
  files.forEach(file => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) throw err
      let newCode
      try {
        newCode = breakline(data)
      } catch (err) {
        console.error(`break ${file} failed!`)
        throw err
      }
      const curDir = path.dirname(item)
      const outFile = path.join(outDir, path.relative(curDir, file))
      const dirPath = path.dirname(outFile)
      var writeFile = () => fs.writeFile(outFile + suffix, newCode, {
        encoding: 'utf8',
        flag: 'wx'
      }, err => { if (err) throw err })
      fs.ensureDir(dirPath, writeFile)
    })
  })
}
