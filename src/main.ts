// @ts-ignore
import * as readlineSync from 'readline-sync';
const memory: number[] = new Array(30000).fill(0);
const inputReceived: boolean[] = new Array(memory.length).fill(false);
let pointer = 0;
console.log("Enter Brainfuck code below.");
readlineSync.promptLoop(async (code: string) => {
  const output = await interpret(code);
  console.log(output);
  process.exit();
});
async function interpret(code: string) {
  let output = '';
  let inputMode = false;
  for (let i = 0; i < code.length; i++) {
    const c = code[i];
    switch (c) {
      case '+': memory[pointer] = (memory[pointer] + 1) % 256; break;
      case '-': memory[pointer] = (memory[pointer] + 255) % 256; break;
      case '>': pointer++; break;
      case '<': pointer--; break;
      case '.': output += String.fromCharCode(...memory.filter((value) => value !== 0)); break;
      case ',':
        if (!inputReceived[pointer]) {
          const input = await readInput();
          for (let i = 0; i < input.length; i++) {
            const ascii = input.charCodeAt(i);
            memory[pointer + i] = ascii;
          }
          pointer += input.length;
          inputReceived[pointer] = true;
        }        
        break;
      case '[': if (memory[pointer] === 0) i = findLoopEnd(code, i); break;
      case ']': if (memory[pointer] !== 0) i = findLoopStart(code, i); break;
      case '#': output += output += memory.slice(0, 1000).join(' ') + '\n'; break;
    }
  }
  return output;
}
function findLoopEnd(code: string, index: number) {
  let loopCounter = 0;
  if (code[index] !== '[') throw new Error(`Expected [ at index ${index}`);
  for (let i = index + 1; i < code.length; i++) {
    if (code[i] === '[') loopCounter++;
    else if (code[i] === ']') {
      if (loopCounter === 0) return i;
      else loopCounter--;
    }
  }
  throw new Error(`Unmatched [ at index ${index}`);
}
function findLoopStart(code: string, index: number) {
  let loopCounter = 0;
  if (code[index] !== ']') throw new Error(`Expected ] at index ${index}`);
  for (let i = index - 1; i >= 0; i--) {
    if (code[i] === ']') loopCounter++;
    else if (code[i] === '[') {
      if (loopCounter === 0) return i;
      else loopCounter--;
    }
  }
  throw new Error(`Unmatched ] at index ${index}`);
}
function readInput(): Promise<string> {
  return new Promise((resolve) => {
    const input = readlineSync.question('Enter a value: ');
    resolve(input);
  });
}