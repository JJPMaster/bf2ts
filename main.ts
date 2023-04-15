//@license magnet:?xt=urn:btih:5ac446d35272cc2e4e85e4325b146d0b7ca8f50c&dn=unlicense.txt Unlicense
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
const startingArray: Array<number> = new Array(30000);
var currentCell: number = 0;
var codeOutput;
readline.question('', code => {
  console.log(codeOutput);
}
