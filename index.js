'use strict'
const acorn = require('acorn')

const restricted = ['continue', 'break', 'return', 'throw', 'yield']

function multiline (sourceCode, options) {
  const tokens = acorn.tokenizer(sourceCode, options)
  const positions = []

  let preToken = tokens.getToken()
  for (let token of tokens) {
    if (!restricted.includes(preToken.type.keyword) &&
      !['++/--', '=>'].includes(token.type.label)) {
      let betweenStr = sourceCode.slice(preToken.end, token.start)
      if (!betweenStr.includes('\n')) {
        positions.push(token.start)
      }
    }
    preToken = token
  }

  let result = applyFixes(sourceCode, positions)
  let newCode = result

  let oldASI = 0
  let newASI = 0
  acorn.parse(sourceCode, {
    onInsertedSemicolon: () => oldASI++
  })
  acorn.parse(newCode, {
    onInsertedSemicolon: () => newASI++
  })
  if (oldASI !== newASI) throw Error(`The number of ASI is changed! The old is ${oldASI}, the new is ${newASI}`)

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

module.exports = multiline
