const argv = require('yargs/yargs')(process.argv.slice(2)).command(
  'math',
  'math description',
  yargs =>
    yargs
      .command(
        'add <a> <b>',
        'add description',
        yargs =>
          yargs
            .positional('a', {
              describe: 'addend "a"',
              type: 'number',
              default: 0,
            })
            .positional('b', {
              describe: 'addend "b"',
              type: 'number',
              default: 0,
            }),
        argv => {
          const {a, b} = argv;
          console.log(`${a} + ${b} = ${a + b}`);
        }
      )
      .command(
        'sum <numbers..>',
        'sum description',
        yargs =>
          yargs
            .positional('numbers', {
              describe: 'numbers to sum',
              type: 'array',
              default: [],
            })
            .check(argv =>
              isArrayOfNumbers(argv.numbers)
                ? true
                : 'Positional argument "numbers" must only contain numbers'
            ),
        argv => {
          const sum = argv.numbers.reduce((a, b) => a + b, 0);
          console.log(`The sum of numbers is ${sum}`);
        }
      )
).parse();

console.log(argv);

function isArrayOfNumbers(arr) {
  return Array.isArray(arr) && arr.every(n => typeof n === 'number');
}

// NOTE: ".parse()" should only be used at top level, not inside builder functions.
