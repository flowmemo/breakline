'use strict'
import test from 'ava'
const os = require('os')
const OS = os.type()
const cp = require('child_process')
process.chdir('..')
test('test cli', t => {
  let result
  if (OS.indexOf('Windows') > -1) {
    result = cp.spawnSync('cmd.exe', ['/c', 'test/cli.bat'])
  } else {
    result = cp.spawnSync('/bin/sh', ['test/cli.sh'])
  }
  t.is(result.status, 0)
})
