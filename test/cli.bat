rm -rf test/_output cli.js.breakline
node cli.js test/fixtures -d test/_output
node cli.js test/cli.js
rm -rf test/_output cli.js.breakline

