# breakline
Break Javascript code into mulilines as many as possible.

## Usage
### Demo
```js
const breakline = require('breakline')
const code = 'var a = 1'
console.log(breakline(code))
/* the result is:
var
a
=
1
*/
```

It uses [acorn](https://github.com/ternjs/acorn) to parse code. You can pass `acorn`'s `options` object as the second argument of `breakline`, like `breakline(sourceCode, {ecmaVersion: 5})`. The default `options` of `breakline` is {ecmaVersion: 6}.

## How
This tool does nothing except inserts line feeds `\n` in appropriate positions, which would not trigger [**Automatic Semicolon Insertion**](http://www.ecma-international.org/ecma-262/6.0/#sec-automatic-semicolon-insertion). It won't delete anything or modify the AST(**A**bstrac **S**yntax **T**ree) of your code. It just inserts `\n`.


## Example
input:

```js
function getScienceFiction () {
  return 'The Three-Body Problem'
}
console.log(getScienceFiction())
```
output:

```js
function
getScienceFiction
(
)
{
  return 'The Three-Body Problem'
}
console
.
log
(
getScienceFiction
(
)
)
```
## TODO 
CLI support

## License
MIT © flowmemo