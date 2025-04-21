#!/usr/bin/env node
import yargs from 'yargs';
import fs from 'node:fs';

const argv = yargs(process.argv.slice(2))
  .usage('Count the lines in a file.\nUsage: $0')
  .demand('f')
  .alias('f', 'file')
  .describe('f', 'Load a file')
  .parse();
const s = fs.createReadStream(argv.file);

let lines = 0;
s.on('data', function (buf) {
  lines += buf.toString().match(/\n/g).length;
});

s.on('end', function () {
  console.log(lines);
});
