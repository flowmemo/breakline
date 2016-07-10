'use strict'
import test from 'ava'
const path = require('path')
const bluebird = require('bluebird')
const fs = bluebird.promisifyAll(require('fs'))
const chalk = require('chalk')
const breakline = require('..')

const fixtures = fs.readdirSync('./fixtures').filter(n => n[0] !== '.')
test('brealine all files', async t => {
  t.plan(fixtures.length)
  const files = fixtures.map(filename =>
    fs.readFileAsync(path.resolve('./fixtures', filename), 'utf8'))
  for (let i = 0; i < files.length; i++) {
    let file = files[i]
    let sourceCode = await file
    try {
      breakline(sourceCode)
      console.log(chalk.green(`breakline "${fixtures[i]}" passed`))
      t.pass()
    } catch (err) {
      console.error(chalk.green(`breakline "${fixtures[i]}" failed`))
    }
  }
})
