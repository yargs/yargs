#!/usr/bin/env node
import yargs from 'yargs';
import fs from 'node:fs';

const argv = yargs(process.argv.slice(2))
  .usage('Count the lines in a file.\nUsage: $0')
  .options({
    file: {
      demand: true,
      alias: 'f',
      description: 'Load a file',
    },
    base: {
      alias: 'b',
      description: 'Numeric base to use for output',
      default: 10,
    },
  })
  .parse();
const s = fs.createReadStream(argv.file);

let lines = 0;
s.on('data', function (buf) {
  lines += buf.toString().match(/\n/g).length;
});

s.on('end', function () {
  console.log(lines.toString(argv.base));
});
