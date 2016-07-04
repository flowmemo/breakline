'use strict'
function foo () {
  var a = 12
  console.log(a)
}

var bestSFbook = 'The ' + 'Three-Body ' + 'Problem'

function bar () {
  return {
    artist: 'Jay Chou',
    songs: ['Piaoyi', 'YeDeDiQiZhang']
  }
}

console.log(foo() + bestSFbook + JSON.stringify(bar()))

