import * as fs from 'fs';
const args = process.argv.slice(2);
if (args.length !== 1) {
    console.error('Please provide the name of the Brainfuck file as an argument.');
    process.exit(1);
}
const fileName = args[0];
if (!fs.existsSync(fileName)) {
    console.error(`File not found: ${fileName}`);
    process.exit(1);
}
const code = fs.readFileSync(fileName, 'utf-8');
const memory = new Uint8Array(30000);
const inputReceived = Array.from({ length: memory.length }, () => false);
let pointer = 0;
let output = '';
let inputMode = false;
for (let i = 0; i < code.length; i++) {
    const c = code[i];
    switch (c) {
        case '+':
            memory[pointer] = (memory[pointer] + 1) % 256;
            break;
        case '-':
            memory[pointer] = (memory[pointer] + 255) % 256;
            break;
        case '>':
            pointer++;
            break;
        case '<':
            pointer--;
            break;
        case '.':
            output += String.fromCharCode(...memory.filter((value) => value !== 0));
            break;
        case ',':
            if (!inputReceived[pointer]) {
                const input = readInputSync();
                for (let i = 0; i < input.length; i++) {
                    const ascii = input.charCodeAt(i);
                    memory[pointer + i] = ascii;
                }
                pointer += input.length;
                inputReceived[pointer] = true;
            }
            break;
        case '[':
            if (memory[pointer] === 0) {
                i = findLoopEnd(code, i);
            }
            break;
        case ']':
            if (memory[pointer] !== 0) {
                i = findLoopStart(code, i);
            }
            break;
        case '#':
            output += memory.slice(0, 1000).join(' ') + '\n';
            break;
        default:
            if (inputMode) {
                break;
            }
            output += `;${c}`;
    }
}
console.log(output);
function findLoopEnd(code, index) {
    let loopCounter = 0;
    if (code[index] !== '[')
        throw new Error(`Expected [ at index ${index}`);
    for (let i = index + 1; i < code.length; i++) {
        if (code[i] === '[')
            loopCounter++;
        else if (code[i] === ']') {
            if (loopCounter === 0)
                return i;
            else
                loopCounter--;
        }
    }
    throw new Error(`Unmatched [ at index ${index}`);
}
function findLoopStart(code, index) {
    let loopCounter = 0;
    if (code[index] !== ']')
        throw new Error(`Expected ] at index ${index}`);
    for (let i = index - 1; i >= 0; i--) {
        if (code[i] === ']')
            loopCounter++;
        else if (code[i] === '[') {
            if (loopCounter === 0)
                return i;
            else
                loopCounter--;
        }
    }
    throw new Error(`Unmatched ] at index ${index}`);
}
function readInputSync() {
    const input = fs.readFileSync('/dev/stdin', 'utf-8');
    return input.trim();
}
