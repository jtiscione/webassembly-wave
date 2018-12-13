#!/usr/bin/node
const fs = require('fs');
const walt = require('walt-compiler');

const outputFile = './waves.wasm';
if (fs.existsSync(outputFile)) {
  fs.unlinkSync(outputFile);
}
const source = fs.readFileSync('./waves.walt', 'utf8');
const buffer = walt.compile(source).buffer();
fs.writeFileSync(outputFile, new Uint8Array(buffer));
console.log('Done.');
