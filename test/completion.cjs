'use strict';
/* global describe, it, before, beforeEach, after */
/* eslint-disable no-unused-vars */
const checkUsage = require('./helpers/utils.cjs').checkOutput;
const yargs = require('../index.cjs');

require('chai').should();

describe('Completion', () => {
  beforeEach(() => {
    yargs.getInternalMethods().reset();
  });

  after(() => {
    yargs.getInternalMethods().reset();
  });

  describe('default completion behavior', () => {
    const firstArgumentOptions = [
      ['--get-yargs-completions'], // proper args after hideBin is used
      ['./completion', '--get-yargs-completions'], // yargs is called like this in tests a lot
    ];
    for (const firstArguments of firstArgumentOptions) {
      describe(`calling yargs(${firstArguments.join(', ')}, …)`, () => {
        it('avoids repeating already included commands', () => {
          process.env.SHELL = '/bin/bash';
          const r = checkUsage(
            () =>
              yargs([...firstArguments, 'apple'])
                .command('foo', 'bar')
                .command('apple', 'banana').argv
          );

          // should not suggest foo for completion unless foo is subcommand of apple
          r.logs.should.not.include('apple');
        });

        it('avoids repeating already included options', () => {
          const r = checkUsage(
            () =>
              yargs([...firstArguments, './completion', '--foo', '--'])
                .options({
                  foo: {describe: 'foo option'},
                  bar: {describe: 'bar option'},
                })
                .completion().argv
          );

          r.logs.should.include('--bar');
          r.logs.should.not.include('--foo');
        });

        it('avoids repeating options whose aliases are already included', () => {
          const r = checkUsage(
            () =>
              yargs([...firstArguments, './completion', '-f', '--'])
                .options({
                  foo: {describe: 'foo option', alias: 'f'},
                  bar: {describe: 'bar option'},
                })
                .completion().argv
          );

          r.logs.should.include('--bar');
          r.logs.should.not.include('--foo');
        });

        it('completes short options with a single dash when the user did not already enter two dashes', () => {
          const r = checkUsage(
            () =>
              yargs([...firstArguments, './completion', '']).options({
                f: {describe: 'f option', alias: 'foo'},
              }).argv
          );

          r.logs.should.include('-f');
          r.logs.should.not.include('--f');
        });

        it('completes short options with two dashes when the user already entered two dashes', () => {
          const r = checkUsage(
            () =>
              yargs([...firstArguments, './completion', '--']).options({
                f: {describe: 'f option', alias: 'foo'},
              }).argv
          );

          r.logs.should.include('--f');
          r.logs.should.not.include('-f');
        });

        it('completes single digit options with two dashes', () => {
          const r = checkUsage(
            () =>
              yargs([...firstArguments, './completion', '']).options({
                1: {describe: '1 option', alias: 'one'},
              }).argv
          );

          r.logs.should.include('--1');
          r.logs.should.not.include('-1');
        });

        it('completes with no- prefix flags defaulting to true when boolean-negation is set', () => {
          const r = checkUsage(
            () =>
              yargs([...firstArguments, './completion', ''])
                .options({
                  foo: {describe: 'foo flag', type: 'boolean', default: true},
                  bar: {describe: 'bar flag', type: 'boolean'},
                })
                .parserConfiguration({'boolean-negation': true}).argv
          );

          r.logs.should.include('--no-foo');
          r.logs.should.include('--foo');
          r.logs.should.not.include('--no-bar');
          r.logs.should.include('--bar');
        });

        it('avoids repeating flags whose negated counterparts are already included', () => {
          const r = checkUsage(
            () =>
              yargs([
                ...firstArguments,
                './completion',
                '--no-foo',
                '--no-bar',
                '',
              ])
                .options({
                  foo: {describe: 'foo flag', type: 'boolean', default: true},
                  bar: {describe: 'bar flag', type: 'boolean'},
                  baz: {describe: 'bar flag', type: 'boolean'},
                })
                .parserConfiguration({'boolean-negation': true}).argv
          );

          r.logs.should.not.include('--no-foo');
          r.logs.should.not.include('--foo');
          r.logs.should.not.include('--no-bar');
          r.logs.should.not.include('--bar');
          r.logs.should.include('--baz');
        });

        it('ignores no- prefix flags when boolean-negation is not set', () => {
          const r = checkUsage(
            () =>
              yargs([
                ...firstArguments,
                './completion',
                '--no-bar',
                '',
              ]).options({
                foo: {describe: 'foo flag', type: 'boolean', default: true},
                bar: {describe: 'bar flag', type: 'boolean'},
              }).argv
          );

          r.logs.should.not.include('--no-foo');
          r.logs.should.include('--foo');
          r.logs.should.not.include('--no-bar');
          r.logs.should.include('--bar');
        });

        it('includes flags that have default', () => {
          const r = checkUsage(
            () =>
              yargs([
                './completion',
                '--get-yargs-completions',
                '--used',
                '--no-usedwithnegation',
                '-x',
                '',
              ])
                .help(false)
                .version(false)
                .options({
                  used: {type: 'boolean', default: true},
                  usedwithnegation: {type: 'boolean', default: true},
                  usedwithalias: {
                    type: 'boolean',
                    alias: ['x', 'y'],
                    default: true,
                  },
                  somebool: {type: 'boolean', default: false},
                  somebool2: {type: 'boolean', default: true},
                  somestringwithalias: {
                    type: 'string',
                    alias: 's',
                    default: 'foo',
                  },
                })
                .help(false)
                .parserConfiguration({'boolean-negation': true}).argv
          );

          r.logs
            .sort()
            .should.deep.eq([
              '--no-somebool2',
              '--somebool',
              '--somebool2',
              '--somestringwithalias',
              '-s',
            ]);
        });

        it('completes options for the correct command', () => {
          process.env.SHELL = '/bin/bash';
          const r = checkUsage(
            () =>
              yargs([...firstArguments, 'cmd2', '--o'])
                .help(false)
                .version(false)
                .command('cmd1', 'first command', subYargs => {
                  subYargs.options({
                    opt1: {
                      describe: 'first option',
                    },
                  });
                })
                .command('cmd2', 'second command', subYargs => {
                  subYargs.options({
                    opt2: {
                      describe: 'second option',
                    },
                  });
                })
                .completion().argv
          );

          r.logs.should.have.length(1);
          r.logs.should.include('--opt2');
        });

        it('ignores positionals for the correct command', () => {
          process.env.SHELL = '/bin/bash';
          const r = checkUsage(
            () =>
              yargs([...firstArguments, 'cmd', '--o'])
                .help(false)
                .version(false)
                .command('cmd', 'command', subYargs => {
                  subYargs
                    .options({
                      opt: {
                        describe: 'option',
                      },
                    })
                    .positional('pos-opt', {type: 'string'});
                }).argv
          );

          r.logs.should.have.length(1);
          r.logs.should.include('--opt');
          r.logs.should.not.include('--pos-opt');
        });

        it('does not complete hidden commands', () => {
          process.env.SHELL = '/bin/bash';
          const r = checkUsage(
            () =>
              yargs([...firstArguments, 'cmd'])
                .command('cmd1', 'first command')
                .command('cmd2', false)
                .completion('completion', false).argv
          );

          r.logs.should.have.length(1);
          r.logs.should.include('cmd1');
        });

        it('does not include positional arguments', () => {
          process.env.SHELL = '/bin/bash';
          const r = checkUsage(() => {
            return yargs([...firstArguments, 'cmd'])
              .command('cmd1 [arg]', 'first command')
              .command('cmd2 <arg>', 'second command')
              .completion('completion', false).argv;
          });

          r.logs.should.have.length(2);
          r.logs.should.include('cmd1');
          r.logs.should.include('cmd2');
        });

        it('works if command has no options', () => {
          process.env.SHELL = '/bin/bash';
          const r = checkUsage(
            () =>
              yargs([...firstArguments, 'foo', '--b'])
                .help(false)
                .version(false)
                .command('foo', 'foo command', subYargs => {
                  return subYargs.completion().parse();
                })
                .completion().argv
          );

          r.logs.should.have.length(0);
        });

        it("returns arguments as completion suggestion, if next contains '-'", () => {
          process.env.SHELL = '/bin/basg';
          const r = checkUsage(
            () =>
              yargs([...firstArguments, '-f'])
                .option('foo', {
                  describe: 'foo option',
                })
                .command('bar', 'bar command')
                .completion().argv
          );

          r.logs.should.include('--foo');
          r.logs.should.not.include('bar');
        });

        it('completes choices if previous option requires a choice', () => {
          process.env.SHELL = '/bin/bash';
          const r = checkUsage(() => {
            return yargs([...firstArguments, './completion', '--fruit'])
              .options({
                fruit: {
                  describe: 'fruit option',
                  choices: ['apple', 'banana', 'pear'],
                },
                amount: {describe: 'amount', type: 'number'},
              })
              .completion('completion', false).argv;
          });

          r.logs.should.have.length(3);
          r.logs.should.include('apple');
          r.logs.should.include('banana');
          r.logs.should.include('pear');
        });

        it('completes choices if previous option requires a choice and space has been entered', () => {
          process.env.SHELL = '/bin/bash';
          const r = checkUsage(() => {
            return yargs([...firstArguments, './completion', '--fruit', ''])
              .options({
                fruit: {
                  describe: 'fruit option',
                  choices: ['apple', 'banana', 'pear'],
                },
                amount: {describe: 'amount', type: 'number'},
              })
              .completion('completion', false).argv;
          });

          r.logs.should.have.length(3);
          r.logs.should.include('apple');
          r.logs.should.include('banana');
          r.logs.should.include('pear');
        });

        it('completes choices if previous option requires a choice and a partial choice has been entered', () => {
          process.env.SHELL = '/bin/bash';
          const r = checkUsage(() => {
            return yargs([...firstArguments, './completion', '--fruit', 'ap'])
              .options({
                fruit: {
                  describe: 'fruit option',
                  choices: ['apple', 'banana', 'pear'],
                },
                amount: {describe: 'amount', type: 'number'},
              })
              .completion('completion', false).argv;
          });

          r.logs.should.have.length(1);
          r.logs.should.include('apple');
          r.logs.should.not.include('banana');
          r.logs.should.not.include('pear');
        });

        it('completes choices if previous option or one of its aliases requires a choice', () => {
          process.env.SHELL = '/bin/bash';
          const r = checkUsage(() => {
            return yargs([...firstArguments, './completion', '-f'])
              .options({
                fruit: {
                  alias: ['f', 'not-a-vegetable'],
                  describe: 'fruit option',
                  choices: ['apple', 'banana', 'pear'],
                },
                amount: {describe: 'amount', type: 'number'},
              })
              .completion('completion', false).argv;
          });

          r.logs.should.have.length(3);
          r.logs.should.include('apple');
          r.logs.should.include('banana');
          r.logs.should.include('pear');
        });

        it('completes choices if previous option or one of its aliases requires a choice and space has been entered', () => {
          process.env.SHELL = '/bin/bash';
          const r = checkUsage(() => {
            return yargs([
              ...firstArguments,
              './completion',
              '--not-a-vegetable',
              '',
            ])
              .options({
                fruit: {
                  alias: ['f', 'not-a-vegetable'],
                  describe: 'fruit option',
                  choices: ['apple', 'banana', 'pear'],
                },
                amount: {describe: 'amount', type: 'number'},
              })
              .completion('completion', false).argv;
          });

          r.logs.should.have.length(3);
          r.logs.should.include('apple');
          r.logs.should.include('banana');
          r.logs.should.include('pear');
        });

        it('completes choices if previous option or one of its aliases requires a choice and a partial choice has been entered', () => {
          process.env.SHELL = '/bin/bash';
          const r = checkUsage(() => {
            return yargs([...firstArguments, './completion', '-f', 'ap'])
              .options({
                fruit: {
                  alias: 'f',
                  describe: 'fruit option',
                  choices: ['apple', 'banana', 'pear'],
                },
                amount: {describe: 'amount', type: 'number'},
              })
              .completion('completion', false).argv;
          });

          r.logs.should.have.length(1);
          r.logs.should.include('apple');
          r.logs.should.not.include('banana');
          r.logs.should.not.include('pear');
        });

        it('completes choices for first positional', () => {
          process.env.SHELL = '/bin/bash';
          const r = checkUsage(
            () =>
              yargs([...firstArguments, './completion', 'cmd', ''])
                .help(false)
                .version(false)
                .command('cmd [fruit] [fruit2]', 'command', subYargs => {
                  subYargs
                    .positional('fruit', {choices: ['apple', 'banana', 'pear']})
                    .positional('fruit2', {
                      choices: ['apple2', 'banana2', 'pear2'],
                    })
                    .options({amount: {describe: 'amount', type: 'number'}});
                }).argv
          );

          r.logs.should.have.length(4);
          r.logs.should.include('apple');
          r.logs.should.include('banana');
          r.logs.should.include('pear');
          r.logs.should.include('--amount');
        });

        it('options choices should not be display with positional choices', () => {
          process.env.SHELL = '/bin/bash';
          const r = checkUsage(
            () =>
              yargs([
                ...firstArguments,
                './completion',
                'cmd',
                'apple',
                '--foo',
                '',
              ])
                .help(false)
                .version(false)
                .command('cmd [fruit]', 'command', subYargs => {
                  subYargs
                    .positional('fruit', {choices: ['apple', 'banana', 'pear']})
                    .options('foo', {
                      choices: ['bar', 'buz'],
                    })
                    .options({amount: {describe: 'amount', type: 'number'}});
                }).argv
          );

          r.logs.should.have.length(2);
          r.logs.should.include('bar');
          r.logs.should.include('buz');
          r.logs.should.not.include('apple');
        });

        it('completes choices for positional with prefix', () => {
          process.env.SHELL = '/bin/bash';
          const r = checkUsage(
            () =>
              yargs([...firstArguments, './completion', 'cmd', 'a'])
                .help(false)
                .version(false)
                .command('cmd [fruit] [fruit2]', 'command', subYargs => {
                  subYargs
                    .positional('fruit', {
                      choices: ['apple1', 'banana1', 'pear1'],
                    })
                    .positional('fruit2', {
                      choices: ['apple2', 'banana2', 'pear2'],
                    })
                    .options({amount: {describe: 'amount', type: 'number'}});
                }).argv
          );

          r.logs.should.have.length(1);
          r.logs.should.include('apple1');
        });

        it('completes choices for second positional after option', () => {
          process.env.SHELL = '/bin/bash';
          const r = checkUsage(
            () =>
              yargs([
                ...firstArguments,
                './completion',
                'cmd',
                'apple',
                '--amount',
                '1',
                '',
              ])
                .help(false)
                .version(false)
                .command('cmd [fruit] [fruit2]', 'command', subYargs => {
                  subYargs
                    .positional('fruit', {
                      choices: ['apple1', 'banana1', 'pear1'],
                    })
                    .positional('fruit2', {
                      choices: ['apple2', 'banana2', 'pear2'],
                    })
                    .options({amount: {describe: 'amount', type: 'number'}});
                }).argv
          );

          r.logs.should.have.length(3);
          r.logs.should.include('apple2');
          r.logs.should.include('banana2');
          r.logs.should.include('pear2');
        });

        it('completes choices for nested command', () => {
          process.env.SHELL = '/bin/bash';
          const r = checkUsage(
            () =>
              yargs([...firstArguments, './completion', 'wrapper', 'cmd', ''])
                .help(false)
                .version(false)
                .command({
                  command: 'wrapper',
                  builder: subYargs =>
                    subYargs.command('cmd [fruit]', 'command', subYargs2 => {
                      subYargs2.positional('fruit', {choices: ['apple']});
                    }),
                }).argv
          );

          r.logs.should.have.length(1);
          r.logs.should.include('apple');
        });

        it('works if positional has no choices', () => {
          process.env.SHELL = '/bin/bash';
          const r = checkUsage(
            () =>
              yargs([...firstArguments, './completion', 'wrapper', 'cmd', 'a'])
                .help(false)
                .version(false)
                .command({
                  command: 'wrapper',
                  builder: subYargs =>
                    subYargs.command('cmd [fruit]', 'command', subYargs2 => {
                      subYargs2.positional('fruit', {});
                    }),
                }).argv
          );

          r.logs.should.have.length(0);
        });
      });
    }
  });

  describe('generateCompletionScript()', () => {
    it('replaces completion command variable with custom completion command in script', () => {
      const r = checkUsage(
        () => yargs([]).completion('flintlock').showCompletionScript(),
        ['ndm']
      );

      r.logs[0].should.match(/ndm flintlock >>/);
    });

    it('if $0 has a .js extension, a ./ prefix is added', () => {
      const r = checkUsage(() => yargs([]).showCompletionScript(), ['test.js']);

      r.logs[0].should.match(/\.\/test.js --get-yargs-completions/);
    });

    it('allows $0 and cmd to be set', () => {
      const r = checkUsage(() =>
        yargs([]).showCompletionScript(
          '/path/to/my/app',
          'show-completions-script'
        )
      );

      r.logs[0].should.match(
        /Installation: \/path\/to\/my\/app show-completions-script/
      );
    });
  });

  describe('completion()', () => {
    it('shows completion script if command registered with completion(cmd) is called', () => {
      const r = checkUsage(
        () => yargs(['completion']).completion('completion').argv,
        ['ndm']
      );

      r.logs[0].should.match(/ndm --get-yargs-completions/);
    });

    it('allows a custom function to be registered for completion', () => {
      const r = checkUsage(
        () =>
          yargs(['--get-yargs-completions'])
            .help('h')
            .completion('completion', (current, argv) => ['cat', 'bat']).argv
      );

      r.logs.should.include('cat');
      r.logs.should.include('bat');
    });

    it('passes current arg for completion and the parsed arguments thus far to custom function', () => {
      const r = checkUsage(
        () =>
          yargs(['ndm', '--get-yargs-completions', '--cool', 'ma']).completion(
            'completion',
            (current, argv) => {
              if (current === 'ma' && argv.cool) return ['success!'];
            }
          ).argv
      );

      r.logs.should.include('success!');
    });

    it('allows the custom completion function to use the default completion w/o filter', done => {
      checkUsage(
        () => {
          yargs(['./completion', '--get-yargs-completions'])
            .command('foo', 'bar')
            .command('apple', 'banana')
            .completion(
              'completion',
              (current, argv, completionFilter, done) => {
                completionFilter();
              }
            )
            .parse();
        },
        null,
        (err, r) => {
          if (err) throw err;
          r.logs.should.include('apple');
          r.logs.should.include('foo');
          return done();
        }
      );
    });

    it('allows custom completion to be combined with default completion, using filter', done => {
      checkUsage(
        () => {
          yargs(['./completion', '--get-yargs-completions'])
            .command('foo', 'bar')
            .command('apple', 'banana')
            .completion(
              'completion',
              (current, argv, completionFilter, done) => {
                completionFilter((err, completions) => {
                  const filteredCompletions = completions.filter(
                    completion => completion === 'foo'
                  );
                  done(filteredCompletions);
                });
              }
            )
            .parse();
        },
        null,
        (err, r) => {
          if (err) throw err;
          r.logs.should.include('foo');
          r.logs.should.not.include('apple');
          return done();
        }
      );
    });

    it('allows calling callback instead of default completion function', done => {
      checkUsage(
        () => {
          yargs(['./completion', '--get-yargs-completions'])
            .command('foo', 'bar')
            .command('apple', 'banana')
            .completion(
              'completion',
              (current, argv, completionFilter, done) => {
                done(['orange']);
              }
            )
            .parse();
        },
        null,
        (err, r) => {
          if (err) throw err;
          r.logs.should.include('orange');
          r.logs.should.not.include('foo');
          return done();
        }
      );
    });

    it('if a promise is returned, completions can be asynchronous', done => {
      checkUsage(
        cb => {
          yargs(['--get-yargs-completions'])
            .completion(
              'completion',
              (current, argv) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    resolve(['apple', 'banana']);
                  }, 10);
                })
            )
            .parse();
        },
        null,
        (err, r) => {
          if (err) throw err;
          r.logs.should.include('apple');
          r.logs.should.include('banana');
          return done();
        }
      );
    });

    it('if a promise is returned, errors are handled', done => {
      checkUsage(
        () => {
          yargs(['--get-yargs-completions'])
            .completion(
              'completion',
              (current, argv) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    reject(new Error('Test'));
                  }, 10);
                })
            )
            .parse();
        },
        null,
        err => {
          err.message.should.equal('Test');
          return done();
        }
      );
    });

    it('if a callback parameter is provided, completions can be asynchronous', done => {
      checkUsage(
        () => {
          yargs(['--get-yargs-completions'])
            .completion('completion', (current, argv, completion) => {
              setTimeout(() => {
                completion(['apple', 'banana']);
              }, 10);
            })
            .parse();
        },
        null,
        (err, r) => {
          if (err) throw err;
          r.logs.should.include('apple');
          r.logs.should.include('banana');
          return done();
        }
      );
    });
  });

  describe('bash', () => {
    it('returns a list of commands as completion suggestions', () => {
      process.env.SHELL = '/bin/bash';
      const r = checkUsage(
        () =>
          yargs(['./completion', '--get-yargs-completions', ''])
            .command('foo', 'bar')
            .command('apple', 'banana')
            .completion().argv
      );

      r.logs.should.include('apple');
      r.logs.should.include('foo');
    });

    it('avoids interruption from command recommendations', () => {
      process.env.SHELL = '/bin/bash';
      const r = checkUsage(
        () =>
          yargs([
            './completion',
            '--get-yargs-completions',
            './completion',
            'a',
          ])
            .command('apple', 'fruit')
            .command('aardvark', 'animal')
            .recommendCommands()
            .completion().argv
      );

      r.errors.should.deep.equal([]);
      r.logs.should.include('apple');
      r.logs.should.include('aardvark');
    });

    it('avoids interruption from default command', () => {
      process.env.SHELL = '/bin/bash';
      const r = checkUsage(
        () =>
          yargs(['./usage', '--get-yargs-completions', './usage', ''])
            .usage('$0 [thing]', 'skipped', subYargs => {
              subYargs.command('aardwolf', 'is a thing according to google');
            })
            .command('aardvark', 'animal')
            .completion().argv
      );

      r.errors.should.deep.equal([]);
      r.logs.should.not.include('aardwolf');
      r.logs.should.include('aardvark');
    });

    it('completes options for a command', () => {
      process.env.SHELL = '/bin/bash';
      const r = checkUsage(
        () =>
          yargs(['./completion', '--get-yargs-completions', 'foo', '--b'])
            .command('foo', 'foo command', subYargs =>
              subYargs
                .options({
                  bar: {
                    describe: 'bar option',
                  },
                })
                .help(true)
                .version(false)
            )
            .completion().argv
      );

      r.logs.should.have.length(2);
      r.logs.should.include('--bar');
      r.logs.should.include('--help');
    });

    it('does not complete hidden options for command', () => {
      process.env.SHELL = '/bin/bash';
      const r = checkUsage(
        () =>
          yargs(['./completion', '--get-yargs-completions', 'foo', '--b'])
            .command('foo', 'foo command', subYargs =>
              subYargs
                .options({
                  bar: {
                    describe: 'bar option',
                  },
                  buz: {
                    describe: 'buz option',
                    hidden: true,
                  },
                })
                .help(true)
                .version(false)
            )
            .completion().argv
      );

      r.logs.should.have.length(2);
      r.logs.should.include('--bar');
      r.logs.should.not.include('--buz');
      r.logs.should.include('--help');
    });

    describe('generateCompletionScript()', () => {
      it('replaces application variable with $0 in script', () => {
        process.env.SHELL = '/bin/bash';
        const r = checkUsage(() => yargs([]).showCompletionScript(), ['ndm']);

        r.logs[0].should.match(/bashrc/);
        r.logs[0].should.match(/ndm --get-yargs-completions/);
      });
    });

    // fixes for #177.
    it('does not apply validation when --get-yargs-completions is passed in', () => {
      process.env.SHELL = '/bin/bash';
      const r = checkUsage(() => {
        try {
          return yargs(['./completion', '--get-yargs-completions', '--'])
            .option('foo', {})
            .completion()
            .strict().argv;
        } catch (e) {
          console.log(e.message);
        }
      });

      r.errors.length.should.equal(0);
      r.logs.should.include('--foo');
    });

    describe('getCompletion()', () => {
      it('returns default completion to callback', () => {
        process.env.SHELL = '/bin/bash';
        const r = checkUsage(() => {
          yargs()
            .command('foo', 'bar')
            .command('apple', 'banana')
            .completion()
            .getCompletion([''], (_err, completions) => {
              (completions || []).forEach(completion => {
                console.log(completion);
              });
            });
        });
        r.logs.should.include('apple');
        r.logs.should.include('foo');
      });
      it('returns default completion to callback for options', () => {
        process.env.SHELL = '/bin/bash';
        const r = checkUsage(() => {
          yargs()
            .option('apple')
            .option('foo')
            .completion()
            .getCompletion(['$0', '-'], (_err, completions) => {
              (completions || []).forEach(completion => {
                console.log(completion);
              });
            });
        });
        r.logs.should.include('--apple');
        r.logs.should.include('--foo');
      });
    });
  });

  describe('zsh', () => {
    it('returns a list of commands as completion suggestions', () => {
      process.env.SHELL = '/bin/zsh';
      const r = checkUsage(
        () =>
          yargs(['./completion', '--get-yargs-completions', ''])
            .command('foo', 'bar')
            .command('apple', 'banana')
            .completion().argv
      );

      r.logs.should.include('apple:banana');
      r.logs.should.include('foo:bar');
    });

    it('avoids interruption from command recommendations', () => {
      process.env.SHELL = '/bin/zsh';
      const r = checkUsage(
        () =>
          yargs([
            './completion',
            '--get-yargs-completions',
            './completion',
            'a',
          ])
            .command('apple', 'fruit')
            .command('aardvark', 'animal')
            .recommendCommands()
            .completion().argv
      );

      r.errors.should.deep.equal([]);
      r.logs.should.include('apple:fruit');
      r.logs.should.include('aardvark:animal');
    });

    it('avoids interruption from default command', () => {
      process.env.SHELL = '/bin/zsh';
      const r = checkUsage(
        () =>
          yargs(['./usage', '--get-yargs-completions', './usage', ''])
            .usage('$0 [thing]', 'skipped', subYargs => {
              subYargs.command('aardwolf', 'is a thing according to google');
            })
            .command('aardvark', 'animal')
            .completion().argv
      );

      r.errors.should.deep.equal([]);
      r.logs.should.not.include('aardwolf');
      r.logs.should.include('aardvark:animal');
    });

    it('completes options for a command', () => {
      process.env.SHELL = '/bin/zsh';
      const r = checkUsage(
        () =>
          yargs(['./completion', '--get-yargs-completions', 'foo', '--b'])
            .command('foo', 'foo command', subYargs =>
              subYargs
                .options({
                  bar: {
                    describe: 'bar option',
                  },
                })
                .help(true)
                .version(false)
            )
            .completion().argv
      );

      r.logs.should.have.length(2);
      r.logs.should.include('--bar:bar option');
      r.logs.should.include('--help:Show help');
    });

    it('completes options and aliases with the same description', () => {
      process.env.SHELL = '/bin/zsh';
      const r = checkUsage(
        () =>
          yargs(['./completion', '--get-yargs-completions', '-'])
            .options({
              foo: {describe: 'Foo option', alias: 'f', type: 'string'},
              bar: {describe: 'Bar option', alias: ['b', 'B'], type: 'string'},
            })
            .help(false)
            .version(false)
            .completion().argv
      );

      r.logs.should.have.length(5);
      r.logs.should.include('--foo:Foo option');
      r.logs.should.include('-f:Foo option');
      r.logs.should.include('--bar:Bar option');
      r.logs.should.include('-b:Bar option');
      r.logs.should.include('-B:Bar option');
    });

    it('completes options with line break', () => {
      process.env.SHELL = '/bin/zsh';
      const r = checkUsage(
        () =>
          yargs(['./completion', '--get-yargs-completions', '-'])
            .options({
              foo: {describe: 'Foo option\nFoo option', type: 'string'},
            })
            .help(false)
            .version(false)
            .completion().argv
      );

      r.logs.should.have.length(1);
      r.logs.should.include('--foo:Foo option Foo option');
    });

    it('replaces application variable with $0 in script', () => {
      process.env.SHELL = '/bin/zsh';
      const r = checkUsage(() => yargs([]).showCompletionScript(), ['ndm']);

      r.logs[0].should.match(/zshrc/);
      r.logs[0].should.match(/ndm --get-yargs-completions/);
    });

    describe('getCompletion()', () => {
      it('returns default completion to callback', () => {
        process.env.SHELL = '/bin/zsh';
        const r = checkUsage(() => {
          yargs()
            .command('foo', 'bar')
            .command('apple', 'banana')
            .completion()
            .getCompletion([''], (_err, completions) => {
              (completions || []).forEach(completion => {
                console.log(completion);
              });
            });
        });

        r.logs.should.include('apple:banana');
        r.logs.should.include('foo:bar');
      });
    });

    it('does not apply validation when --get-yargs-completions is passed in', () => {
      process.env.SHELL = '/bin/zsh';
      const r = checkUsage(() => {
        try {
          return yargs(['./completion', '--get-yargs-completions', '--'])
            .option('foo', {describe: 'bar'})
            .completion()
            .strict().argv;
        } catch (e) {
          console.log(e.message);
        }
      });

      r.errors.length.should.equal(0);
      r.logs.should.include('--foo:bar');
    });

    it('completes with no- prefix flags defaulting to true when boolean-negation is set', () => {
      process.env.SHELL = '/bin/zsh';

      const r = checkUsage(
        () =>
          yargs(['./completion', '--get-yargs-completions', '--'])
            .options({
              foo: {describe: 'foo flag', type: 'boolean', default: true},
              bar: {describe: 'bar flag', type: 'boolean'},
            })
            .parserConfiguration({'boolean-negation': true}).argv
      );

      r.logs.should.eql([
        '--help:Show help',
        '--version:Show version number',
        '--foo:foo flag',
        '--no-foo:foo flag',
        '--bar:bar flag',
      ]);
    });

    it('bails out early when full command matches', () => {
      process.env.SHELL = '/bin/zsh';
      const r = checkUsage(() => {
        try {
          return yargs(['./completion', '--get-yargs-completions', 'dream'])
            .commandDir('./fixtures/cmddir', {recurse: true})
            .demand(1)
            .strict()
            .completion().argv;
        } catch (e) {
          console.log(e.message);
        }
      });
      r.errors.length.should.equal(0);
      r.logs.should.include('of-memory:Dream about a specific memory');
    });
  });

  describe('async', () => {
    before(() => {
      process.env.SHELL = '/bin/bash';
    });
    describe('getCompletion', () => {
      it('allows completions to be awaited', async () => {
        const completions = await yargs()
          .command('foo', 'bar')
          .command('apple', 'banana')
          .completion()
          .getCompletion(['']);
        completions.should.eql(['foo', 'apple', 'completion']);
      });
    });
    // See: https://github.com/yargs/yargs/issues/1235
    describe('completion', () => {
      it('does not apply validation if async completion command provided', async () => {
        const completions = await yargs(['--get-yargs-completions', 'foo'])
          .command('foo <bar>', 'foo command')
          .completion('completion', false, async () => {
            return new Promise(resolve => {
              setTimeout(() => {
                return resolve(['foo', 'bar', 'apple']);
              }, 5);
            });
          })
          .getCompletion(['foo']);
        completions.should.eql(['foo', 'bar', 'apple']);
      });
    });
  });

  describe('parser-configuration', () => {
    const configurations = [
      {'strip-dashed': true},
      {'camel-case-expansion': true, 'strip-aliased': true},
    ];

    for (const configuration of configurations) {
      it(`should support ${Object.keys(configuration).join(' ')}`, () => {
        process.env.SHELL = '/bin/bash';

        const r = checkUsage(
          () =>
            yargs(['--get-yargs-completions', 'a'])
              .parserConfiguration(configuration)
              .command('apple', 'banana').argv
        );

        r.logs.should.include('apple');
      });
    }
  });
});
