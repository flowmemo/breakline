'use strict'
import test from 'ava'
const path = require('path')
const bluebird = require('bluebird')
const fs = bluebird.promisifyAll(require('fs'))
const multiline = require('..')

const fixtures = fs.readdirSync('./fixtures').filter(n => n[0] !== '.')
test('brealine all files', async t => {
  t.plan(fixtures.length)
  const files = fixtures.map(filename =>
    fs.readFileAsync(path.resolve('./fixtures', filename), 'utf8'))
  for (let file of files) {
    let sourceCode = await file
    multiline(sourceCode)
    t.pass()
  }
})

