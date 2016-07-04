'use strict'
const fs = require('fs')
const acorn = require('acorn')

const options = {
  locations: true
}
const locs = []
const code = fs.readFileSync('./test/fixtures/1.js', {encoding: 'utf8'})
const tk = acorn.tokenizer(code, options)
for (let token of tk) {
  locs.push(token.loc)
  console.log(token.end)
}
