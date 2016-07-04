# muliline.js
Break you Javascript code into mulilines as many as possible.

## How
We define *atom* in js.
example:
```js
function foo() {}
```
all of token in above code are *atom*
They can be write as this:
```js
function
foo
(
)
{
}
```

eslint:
assertASTDidntChange
insertTextAfter
SourceCodeFixer.applyFixes