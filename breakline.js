'use strict'
const acorn = require('acorn')
const walk = require('acorn/dist/walk.js')
const debug = require('debug')('breakline')

const restricted = ['continue', 'break', 'return', 'throw', 'yield']

function breakline (sourceCode, options) {
  options = Object.assign({
    ecmaVersion: 6,
    allowHashBang: true,
    allowReturnOutsideFunction: true,
    allowImportExportEverywhere: true,
    locations: true
  }, options)

  const tokens = acorn.tokenizer(sourceCode, options)
  const positions = []
  const updateExp = [] // deal with ++/--

  let preToken = tokens.getToken()
  for (let token of tokens) {
    let betweenStr = sourceCode.slice(preToken.end, token.start)
    if (!betweenStr.includes('\n')) {
      // acorn don't treat 'yield' as a keyword
      // https://github.com/ternjs/acorn/commit/8e9306239eb5f13d6e66c9b5ca58c38c343e7128

      let maybreakable = !(
        restricted.indexOf(preToken.type.keyword) > -1 ||
        ['=>'].indexOf(token.type.label) > -1 ||
        (preToken.type.label === 'name' && preToken.value === 'yield') ||
        ([preToken.type.label, token.type.label].indexOf('template') > -1)
      )
      if (maybreakable) {
        if (token.type.label === '++/--') updateExp.push(token.start) // deal with ++/--
        else positions.push(token.start) // truely breakable
      }
    }
    preToken = token
  }

  // ensure the number of ASI is not changed
  let oldASI = 0
  let newASI = 0
  const ast = acorn.parse(sourceCode, Object.assign(options, {
    onInsertedSemicolon: (a, b) => {
      oldASI++
      debug(a, b)
    }
  }))
  debug('=======')
  for (let pos of updateExp) {
    const res = walk.findNodeAfter(ast, pos, 'UpdateExpression')
    if (res && res.node.prefix && res.node.start === pos) positions.push(pos)
  }
  positions.sort((a, b) => a - b)
  let newCode = applyFixes(sourceCode, positions)
  debug(`the number of inserted linebreak is ${positions.length}`)

  acorn.parse(newCode, Object.assign(options, {
    onInsertedSemicolon: (a, b) => {
      newASI++
      debug(a, b)
    }
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
