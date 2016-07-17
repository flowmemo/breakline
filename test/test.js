'use strict'
import test from 'ava'
const path = require('path')
const bluebird = require('bluebird')
const fs = bluebird.promisifyAll(require('fs'))
const breakline = require('..')

const fixtures = fs.readdirSync('./fixtures').filter(n => n[0] !== '.')
const files = fixtures.map(filename =>
  fs.readFileAsync(path.join('./fixtures', filename), 'utf8'))

for (let i = 0; i < files.length; i++) {
  let file = files[i]
  test(`breakline "${fixtures[i]}"`, async t => {
    let sourceCode = await file
    let newCode = breakline(sourceCode)
    t.is(newCode.length, breakline(newCode).length)
  })
}
