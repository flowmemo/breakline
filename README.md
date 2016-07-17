# breakline
break your JS code into valid multilines as many as possible.

[![Travis branch](https://img.shields.io/travis/flowmemo/breakline/master.svg?style=flat-square)](https://travis-ci.org/flowmemo/breakline)
[![AppVeyor branch](https://img.shields.io/appveyor/ci/flowmemo/breakline/master.svg?style=flat-square&label=Win%20Test)](https://ci.appveyor.com/project/flowmemo/breakline/branch/master)
[![Coveralls branch](https://img.shields.io/coveralls/flowmemo/breakline/master.svg?style=flat-square)](https://coveralls.io/github/flowmemo/breakline?branch=master)
[![npm](https://img.shields.io/npm/v/breakline.svg?style=flat-square)](https://www.npmjs.com/package/breakline)

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

It uses [acorn](https://github.com/ternjs/acorn) to parse code. You can pass `acorn`'s `options` object as the second argument of `breakline`, like `breakline(sourceCode, {ecmaVersion: 5})`. The default `options` of `breakline` is {ecmaVersion: 6, allowHashBang: true}.

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
## CLI
This tool can be used from the command line. Install it globally by `npm install breakline -g`.

### Usage
breakline <files or directory> [options]

### Optioins
--help, -h
  Show help info.
-d <directory>  
  Output directory.
--nosuffix
  don't add '.breakline' suffix to the output files.

### Example
```shell
$ breakline your.js
```
This command will create a file named 'your.js.breakline'.

## License
MIT © [flowmemo](http://weibo.com/flowmemo)