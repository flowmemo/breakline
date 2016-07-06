'use strict'
const acorn = require('acorn')
const applyFixes = require('./util.js').applyFixes
const restricted = ['continue', 'break', 'return', 'throw', 'yield']
function multiline(sourceCode, options) {
  const tokens = acorn.tokenizer(sourceCode, options)
  const messages = []

  let preToken = tokens.getToken()
  for (let token of tokens) {
    if (!restricted.includes(preToken.type.keyword) &&
      !['++/--', '=>'].includes(token.type.label)) {
      let betweenStr = sourceCode.slice(preToken.end, token.start)
      if (!betweenStr.includes('\n')) {
        // if a linebreak is between two token, don't add another
        messages.push({
          fix: {
            range: [token.start, token.start],
            text: ['\n']
          }
        })
      }
    }
    preToken = token
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
