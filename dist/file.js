#!/usr/bin/env node
//@license magnet:?xt=urn:btih:5ac446d35272cc2e4e85e4325b146d0b7ca8f50c&dn=unlicense.txt Unlicense
import * as fs from 'fs';
import * as rl from 'readline-sync';
const memory = new Uint8Array(30000);
let pointer = 0;
async function main() {
    const filename = process.argv[2];
    if (!filename) {
        console.error('No input file specified');
        process.exit(1);
    }
    const code = fs.readFileSync(filename, 'utf-8');
    const output = await interpret(code);
    console.log(output);
}
async function interpret(code) {
    let output = '';
    let i = 0;
    while (i < code.length) {
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
                for (let i = 0; i < memory.length; i++) {
                    if (memory[i] !== 0) {
                        output += String.fromCharCode(memory[i]);
                    }
                }
                break;
            case ',':
                const input = rl.question("Enter a character: ");
                const ascii = input.charCodeAt(0);
                memory[pointer] = ascii;
                memory[pointer + 1] = 0; // exit the loop
                break;
            case '[':
                if (memory[pointer] === 0)
                    i = findLoopEnd(code, i);
                break;
            case ']':
                if (memory[pointer] !== 0)
                    i = findLoopStart(code, i);
                break;
        }
        i++;
    }
    return output;
}
function findLoopEnd(code, index) {
    let loopCounter = 0;
    let i = index;
    if (code[i] !== '[')
        throw new Error(`Expected [ at index ${index}`);
    while (true) {
        i++;
        if (i >= code.length)
            throw new Error(`Unmatched [ at index ${index}`);
        if (code[i] === '[')
            loopCounter++;
        else if (code[i] === ']') {
            if (loopCounter === 0)
                return i;
            else
                loopCounter--;
        }
    }
}
function findLoopStart(code, index) {
    let loopCounter = 0;
    let i = index;
    if (code[i] !== ']')
        throw new Error(`Expected ] at index ${index}`);
    while (true) {
        i--;
        if (i < 0)
            throw new Error(`Unmatched ] at index ${index}`);
        if (code[i] === ']')
            loopCounter++;
        else if (code[i] === '[') {
            if (loopCounter === 0)
                return i;
            else
                loopCounter--;
        }
    }
}
main().catch(console.error);
