const input = process.stdin;
const output = process.stdout;
const memory = new Uint8Array(30000);
let pointer = 0;

input.setEncoding('utf-8');

input.on('data', function (code) {
  output.write(interpret(code));
});

input.on('end', function() {
  process.exit();
});

function interpret(code) {
  let output = '';
  let i = 0;
  while (i < code.length) {
    const c = code[i];
    switch (c) {
      case '+': memory[pointer]++; break;
      case '-': memory[pointer]--; break;
      case '>': pointer++; break;
      case '<': pointer--; break;
      case '.': output += String.fromCharCode(memory[pointer]); break;
      case ',':
        let inputChar;
        while (!inputChar) {
          inputChar = input.read(1);
        }
        memory[pointer] = inputChar.charCodeAt(0);
        break;
      case '[':
        if (memory[pointer] === 0) i = findLoopEnd(code, i);
        break;
      case ']':
        if (memory[pointer] !== 0) i = findLoopStart(code, i);
        break;
    }
    i++;
  }
  return output;
  process.exit();
}

function findLoopEnd(code, index) {
  let loopCounter = 0;
  let i = index;
  if (code[i] !== '[') throw new Error(`Expected [ at index ${index}`);
  while (true) {
    i++;
    if (i >= code.length) throw new Error(`Unmatched [ at index ${index}`);
    if (code[i] === '[') loopCounter++;
    else if (code[i] === ']') {
      if (loopCounter === 0) return i;
      else loopCounter--;
    }
  }
}

function findLoopStart(code, index) {
  let loopCounter = 0;
  let i = index;
  if (code[i] !== ']') throw new Error(`Expected ] at index ${index}`);
  while (true) {
    i--;
    if (i < 0) throw new Error(`Unmatched ] at index ${index}`);
    if (code[i] === ']') loopCounter++;
    else if (code[i] === '[') {
      if (loopCounter === 0) return i;
      else loopCounter--;
    }
  }
}
