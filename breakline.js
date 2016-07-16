'use strict'
const acorn = require('acorn')
const debug = require('debug')('breakline')

const restricted = ['continue', 'break', 'return', 'throw', 'yield']

function breakline (sourceCode, options) {
  options = Object.assign({
    ecmaVersion: 6,
    allowHashBang: true,
    allowReturnOutsideFunction: true,
    allowImportExportEverywhere: true
  }, options)

  const tokens = acorn.tokenizer(sourceCode, options)
  const positions = []

  let preToken = tokens.getToken()
  for (let token of tokens) {
    // acorn don't treat 'yield' as a keyword
    // https://github.com/ternjs/acorn/commit/8e9306239eb5f13d6e66c9b5ca58c38c343e7128
    let breakable = !(
      restricted.indexOf(preToken.type.keyword) > -1 ||
      ['++/--', '=>'].indexOf(token.type.label) > -1 ||
      (preToken.type.label === 'name' && preToken.value === 'yield') ||
      ([preToken.type.label, token.type.label].indexOf('template') > -1)
    )

    if (breakable) {
      let betweenStr = sourceCode.slice(preToken.end, token.start)
      if (!betweenStr.includes('\n')) positions.push(token.start)
    }
    preToken = token
  }

  let newCode = applyFixes(sourceCode, positions)
  debug(`the number of inserted linebreak is ${positions.length}`)

  // ensure the number of ASI is not changed
  let oldASI = 0
  let newASI = 0
  acorn.parse(sourceCode, Object.assign(options, {
    onInsertedSemicolon: () => oldASI++
  }))
  acorn.parse(sourceCode, Object.assign(options, {
    onInsertedSemicolon: () => newASI++
  }))
  debug(`oldASI is ${oldASI}, newASI is ${newASI}`)
  if (oldASI !== newASI) {
    throw Error(
      `The number of ASI is changed! The old is ${oldASI}, the new is ${newASI}`
      )
  }
  return newCode
}

function applyFixes (code, positions) {
  let start = 0
  let newCode = ''
  for (let i = 0; i < positions.length; i++) {
    let curSeg = code.slice(start, positions[i])
    newCode += curSeg + '\n'
    start = positions[i]
  }
  newCode += code.slice(start, code.length)
  return newCode
}

module.exports = breakline
