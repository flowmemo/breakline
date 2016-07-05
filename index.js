'use strict'
const acorn = require('acorn')
const applyFixes = require('./util.js').applyFixes
const restricted = ['++', '--', 'continue', 'break', 'return', 'throw', '=>', 'yield']
function multiline (sourceCode, options) {
  const tokens = acorn.tokenizer(sourceCode, options)
  const messages = []

  let preTokenType
  for (let token of tokens) {
    if (!restricted.includes(preTokenType) && token.type.label !== '++/--') {
      messages.push({
        fix: {
          range: [token.start, token.start],
          text: ['\n']
        }
      })
    }
    preTokenType = token.type.keyword
  }

  let result = applyFixes({ text: sourceCode }, messages)
  let newCode = result.output

  // ensure the number of ASI is unchanged
  let oldASI = 0
  let newASI = 0
  // console.log(newCode)
  acorn.parse(sourceCode, {
    onInsertedSemicolon: () => oldASI++
  })
  acorn.parse(newCode, {
    onInsertedSemicolon: () => newASI++
  })
  if (oldASI !== newASI) throw Error('Breakline failed! The number of ASI is changed!')

  return newCode
}

module.exports = multiline
