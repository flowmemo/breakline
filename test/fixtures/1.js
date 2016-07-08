'use strict'
function foo () {
  var a = 12
  console.log(a)
}

var bestSFbook = 'The ' /* hello */ + 'Three-Body ' + 'Problem'

function bar () {
  return {
    artist: 'Jay Chou',
    songs: ['Piaoyi', 'YeDeDiQiZhang']
  }
}

foo()
var songs = bar().songs
for (let i = 0; i < songs.length; i++) {
  console.log(songs[i]);
}
console.log(bestSFbook)

setTimeout(() => {}, 1)
function *foo () {
  let i = 1
  let j = yield 2
  j = yield * foo()
  return 3
}
