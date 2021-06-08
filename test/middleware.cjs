'use strict';
/* global describe, it, beforeEach, afterEach */
/* eslint-disable no-unused-vars */

const assert = require('assert');
const {expect} = require('chai');
let yargs;
require('chai').should();

function clearRequireCache() {
  delete require.cache[require.resolve('../index.cjs')];
  delete require.cache[require.resolve('../build/index.cjs')];
}

async function wait() {
  return new Promise(resolve => {
    setTimeout(resolve, 10);
  });
}

describe('middleware', () => {
  beforeEach(() => {
    yargs = require('../index.cjs');
  });
  afterEach(() => {
    clearRequireCache();
  });

  it('runs the middleware before reaching the handler', done => {
    yargs(['mw'])
      .middleware(argv => {
        argv.mw = 'mw';
      })
      .command(
        'mw',
        'adds func to middleware',
        () => {},
        argv => {
          argv.mw.should.equal('mw');
          return done();
        }
      )
      .parse();
  });

  it('runs all middleware before reaching the handler', done => {
    yargs(['mw'])
      .middleware([
        function (argv) {
          argv.mw1 = 'mw1';
        },
        function (argv) {
          argv.mw2 = 'mw2';
        },
      ])
      .command(
        'mw',
        'adds func list to middleware',
        () => {},
        argv => {
          argv.mw1.should.equal('mw1');
          argv.mw2.should.equal('mw2');
          return done();
        }
      )
      .exitProcess(false)
      .parse();
  });

  it('should be able to register middleware regardless of when middleware is called', done => {
    yargs(['mw'])
      .middleware(argv => {
        argv.mw1 = 'mw1';
      })
      .command(
        'mw',
        'adds func list to middleware',
        () => {},
        argv => {
          // we should get the argv filled with data from the middleware
          argv.mw1.should.equal('mw1');
          argv.mw2.should.equal('mw2');
          argv.mw3.should.equal('mw3');
          argv.mw4.should.equal('mw4');
          return done();
        }
      )
      .middleware(argv => {
        argv.mw2 = 'mw2';
      })
      .middleware([
        function (argv) {
          argv.mw3 = 'mw3';
        },
        function (argv) {
          argv.mw4 = 'mw4';
        },
      ])
      .exitProcess(false)
      .parse();
  });

  // see: https://github.com/yargs/yargs/issues/1281
  it("doesn't modify globalMiddleware array when executing middleware", () => {
    let count = 0;
    yargs('bar')
      .middleware(argv => {
        count++;
      })
      .command(
        'foo',
        'foo command',
        () => {},
        () => {},
        [
          () => {
            count++;
          },
        ]
      )
      .command(
        'bar',
        'bar command',
        () => {},
        () => {},
        [
          () => {
            count++;
          },
        ]
      )
      .exitProcess(false)
      .parse();
    count.should.equal(2);
  });

  it('allows middleware to be added in builder', done => {
    yargs(['mw'])
      .command(
        'mw',
        'adds func to middleware',
        yargs => {
          yargs.middleware(argv => {
            argv.mw = 'mw';
          });
        },
        argv => {
          argv.mw.should.equal('mw');
          return done();
        }
      )
      .exitProcess(false)
      .parse();
  });

  it('passes yargs object to middleware', done => {
    yargs(['mw'])
      .command(
        'mw',
        'adds func to middleware',
        yargs => {
          yargs.middleware((argv, yargs) => {
            expect(typeof yargs.help).to.equal('function');
            argv.mw = 'mw';
          });
        },
        argv => {
          argv.mw.should.equal('mw');
          return done();
        }
      )
      .exitProcess(false)
      .parse();
  });

  it('applies aliases before middleware is called', done => {
    yargs(['mw', '--foo', '99'])
      .middleware(argv => {
        argv.f.should.equal(99);
        argv.mw = 'mw';
      })
      .command(
        'mw',
        'adds func to middleware',
        yargs => {
          yargs.middleware(argv => {
            argv.f.should.equal(99);
            argv.mw2 = 'mw2';
          });
        },
        argv => {
          argv.mw.should.equal('mw');
          argv.mw2.should.equal('mw2');
          return done();
        }
      )
      .alias('foo', 'f')
      .exitProcess(false)
      .parse();
  });

  describe('applyBeforeValidation=true', () => {
    it('runs before validation', done => {
      yargs(['mw'])
        .middleware(argv => {
          argv.mw = 'mw';
        }, true)
        .command(
          'mw',
          'adds func to middleware',
          {
            mw: {
              demand: true,
              string: true,
            },
          },
          argv => {
            argv.mw.should.equal('mw');
            return done();
          }
        )
        .exitProcess(false)
        .parse();
    });

    it('resolves async middleware, before applying validation', async () => {
      const argv = await yargs(['mw'])
        .fail(false)
        .middleware(
          [
            async function (argv) {
              return new Promise(resolve => {
                setTimeout(() => {
                  argv.mw = 'mw';
                  argv.other = true;
                  return resolve(argv);
                }, 5);
              });
            },
          ],
          true
        )
        .command('mw', 'adds func to middleware', {
          mw: {
            demand: true,
            string: true,
          },
        })
        .parse();
      argv.other.should.equal(true);
      argv.mw.should.equal('mw');
    });

    it('still throws error when async middleware is used', async () => {
      try {
        const argv = await yargs(['mw'])
          .fail(false)
          .middleware(
            [
              async function (argv) {
                return new Promise(resolve => {
                  setTimeout(() => {
                    argv.other = true;
                    return resolve(argv);
                  }, 5);
                });
              },
            ],
            true
          )
          .command('mw', 'adds func to middleware', {
            mw: {
              demand: true,
              string: true,
            },
          })
          .parse();
        throw Error('unreachable');
      } catch (err) {
        err.message.should.match(/Missing required argument/);
      }
    });

    it('runs before validation, when middleware is added in builder', done => {
      yargs(['mw'])
        .command(
          'mw',
          'adds func to middleware',
          yargs => {
            // we know that this middleware is being run in the context of the
            // mw command.
            yargs.middleware(argv => {
              argv.mw = 'mw';
            }, true);
          },
          argv => {
            argv.mw.should.equal('mw');
            return done();
          }
        )
        .demand('mw')
        .exitProcess(false)
        .parse();
    });

    it('applies aliases before middleware is called, for global middleware', done => {
      yargs(['mw', '--foo', '99'])
        .middleware(argv => {
          argv.f.should.equal(99);
          argv.mw = 'mw';
        }, true)
        .command(
          'mw',
          'adds func to middleware',
          {
            mw: {
              demand: true,
            },
          },
          argv => {
            argv.mw.should.equal('mw');
            return done();
          }
        )
        .alias('foo', 'f')
        .exitProcess(false)
        .parse();
    });

    it('applies aliases before middleware is called, when middleware is added in builder', done => {
      yargs(['mw', '--foo', '99'])
        .command(
          'mw',
          'adds func to middleware',
          yargs => {
            yargs
              .middleware(argv => {
                argv.f.should.equal(99);
                argv.mw = 'mw';
              }, true)
              .demand('mw');
          },
          argv => {
            argv.mw.should.equal('mw');
            return done();
          }
        )
        .alias('foo', 'f')
        .exitProcess(false)
        .parse();
    });
  });

  // addresses https://github.com/yargs/yargs/issues/1237
  describe('async', () => {
    it('fails when the promise returned by the middleware rejects', done => {
      const error = new Error();
      const handlerErr = new Error('should not have been called');
      yargs('foo')
        .command(
          'foo',
          'foo command',
          () => {},
          argv => done(handlerErr),
          [argv => Promise.reject(error)]
        )
        .fail((msg, err) => {
          expect(msg).to.equal(null);
          expect(err).to.equal(error);
          done();
        })
        .parse();
    });

    it('it allows middleware rejection to be caught', async () => {
      const argvPromise = yargs('foo')
        .command(
          'foo',
          'foo command',
          () => {},
          () => {}
        )
        .middleware(async () => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              return reject(Error('error from middleware'));
            }, 5);
          });
        })
        .fail(false)
        .parse();
      try {
        await argvPromise;
        throw Error('unreachable');
      } catch (err) {
        err.message.should.match(/error from middleware/);
      }
    });

    it('it awaits middleware before awaiting handler, when applyBeforeValidation is "false"', async () => {
      let log = '';
      const argvPromise = yargs('foo --bar')
        .command(
          'foo',
          'foo command',
          () => {},
          async () => {
            return new Promise(resolve => {
              setTimeout(() => {
                log += 'handler';
                return resolve();
              }, 5);
            });
          }
        )
        .middleware(async argv => {
          return new Promise(resolve => {
            setTimeout(() => {
              log += 'middleware';
              argv.fromMiddleware = 99;
              return resolve();
            }, 20);
          });
        }, false)
        .parse();
      const argv = await argvPromise;
      log.should.equal('middlewarehandler');
      argv.fromMiddleware.should.equal(99);
      argv.bar.should.equal(true);
    });

    it('calls the command handler when all middleware promises resolve', done => {
      const middleware = (key, value) => () =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            return resolve({[key]: value});
          }, 5);
        });
      yargs('foo hello')
        .command(
          'foo <pos>',
          'foo command',
          () => {},
          argv => {
            argv.hello.should.equal('world');
            argv.foo.should.equal('bar');
            done();
          },
          [middleware('hello', 'world'), middleware('foo', 'bar')]
        )
        .fail((msg, err) => {
          return done(Error('should not have been called'));
        })
        .exitProcess(false)
        .parse();
    });

    it('calls an async middleware only once for nested subcommands', done => {
      let callCount = 0;
      const argv = yargs('cmd subcmd')
        .command('cmd', 'cmd command', yargs => {
          yargs.command('subcmd', 'subcmd command', yargs => {});
        })
        .middleware(
          argv =>
            new Promise(resolve => {
              callCount++;
              resolve(argv);
            })
        )
        .parse();

      if (!(argv instanceof Promise)) done(Error('argv should be a Promise'));

      argv
        .then(() => {
          callCount.should.equal(1);
          done();
        })
        .catch(err => done(err));
    });

    describe('$0', () => {
      it('applies global middleware when no commands are provided, with implied $0', async () => {
        const argv = await yargs('--foo 99')
          .middleware(argv => {
            return new Promise(resolve => {
              setTimeout(() => {
                argv.foo = argv.foo * 3;
                return resolve();
              }, 20);
            });
          })
          .parse();
        argv.foo.should.equal(297);
      });

      it('applies middleware before performing validation, with implied $0', async () => {
        const argvEventual = yargs('--foo 100')
          .option('bar', {
            demand: true,
          })
          .middleware(async argv => {
            return new Promise(resolve => {
              setTimeout(() => {
                argv.foo = argv.foo * 2;
                argv.bar = 'hello';
                return resolve();
              }, 100);
            });
          }, true)
          .check(argv => argv.foo > 100)
          .parse();
        const argv = await argvEventual;
        argv.foo.should.equal(200);
        argv.bar.should.equal('hello');
      });

      it('applies middleware before performing validation, with explicit $0', async () => {
        const argvEventual = yargs('--foo 100')
          .usage('$0', 'usage', () => {})
          .option('bar', {
            demand: true,
          })
          .middleware(async argv => {
            return new Promise(resolve => {
              setTimeout(() => {
                argv.foo = argv.foo * 2;
                argv.bar = 'hello';
                return resolve();
              }, 100);
            });
          }, true)
          .check(argv => argv.foo > 100)
          .parse();
        const argv = await argvEventual;
        argv.foo.should.equal(200);
        argv.bar.should.equal('hello');
      });
    });
  });

  describe('synchronous $0', () => {
    it('applies global middleware when no commands are provided', () => {
      const argv = yargs('--foo 99')
        .middleware(argv => {
          argv.foo = argv.foo * 2;
        })
        .parse();
      argv.foo.should.equal(198);
    });
    it('applies global middleware when default command is provided, with explicit $0', () => {
      const argv = yargs('--foo 100')
        .usage(
          '$0',
          'usage',
          () => {},
          argv => {
            argv.foo = argv.foo * 3;
          }
        )
        .middleware(argv => {
          argv.foo = argv.foo * 2;
        })
        .parse();
      argv.foo.should.equal(600);
    });
    it('applies middleware before performing validation, with implicit $0', () => {
      const argv = yargs('--foo 100')
        .option('bar', {
          demand: true,
        })
        .middleware(argv => {
          argv.foo = argv.foo * 2;
          argv.bar = 'hello';
        }, true)
        .check(argv => argv.foo > 100)
        .parse();
      argv.foo.should.equal(200);
      argv.bar.should.equal('hello');
    });
  });

  // Refs: https://github.com/yargs/yargs/issues/1351
  it('should run even if no command is matched', () => {
    const argv = yargs('snuh --foo 99')
      .middleware(argv => {
        argv.foo = argv.foo * 2;
      })
      .command(
        'bar',
        'bar command',
        () => {},
        () => {}
      )
      .parse();
    argv.foo.should.equal(198);
  });

  it('throws error if middleware not function', () => {
    let err;
    assert.throws(() => {
      yargs('snuh --foo 99').middleware(['hello']).parse();
    }, /middleware must be a function/);
  });

  describe('async check', () => {
    describe('success', () => {
      it('returns promise if check is async', async () => {
        const argvPromise = yargs('--foo 100')
          .middleware(argv => {
            argv.foo *= 2;
          }, true)
          .check(async argv => {
            wait();
            return argv.foo >= 200;
          })
          .parse();
        (!!argvPromise.then).should.equal(true);
        const argv = await argvPromise;
        argv.foo.should.equal(200);
      });
      it('returns promise if check and middleware is async', async () => {
        const argvPromise = yargs('--foo 100')
          .middleware(async argv => {
            wait();
            argv.foo *= 2;
          }, true)
          .check(async argv => {
            wait();
            return argv.foo >= 200;
          })
          .parse();
        (!!argvPromise.then).should.equal(true);
        const argv = await argvPromise;
        argv.foo.should.equal(200);
      });
      it('allows async check to be used with command', async () => {
        let output = '';
        const argv = await yargs('cmd --foo 300')
          .command(
            'cmd',
            'a command',
            yargs => {
              yargs.check(async argv => {
                wait();
                output += 'first';
                return argv.foo >= 200;
              });
            },
            async argv => {
              wait();
              output += 'second';
            }
          )
          .parse();
        argv._.should.include('cmd');
        argv.foo.should.equal(300);
        output.should.equal('firstsecond');
      });
      it('allows async check to be used with command and middleware', async () => {
        let output = '';
        const argv = await yargs('cmd --foo 100')
          .command(
            'cmd',
            'a command',
            yargs => {
              yargs.check(async argv => {
                wait();
                output += 'second';
                return argv.foo >= 200;
              });
            },
            async argv => {
              wait();
              output += 'fourth';
            },
            [
              async argv => {
                wait();
                output += 'third';
                argv.foo *= 2;
              },
            ]
          )
          .middleware(async argv => {
            wait();
            output += 'first';
            argv.foo *= 2;
          }, true)
          .parse();
        argv._.should.include('cmd');
        argv.foo.should.equal(400);
        output.should.equal('firstsecondthirdfourth');
      });
    });
    describe('failure', () => {
      it('allows failed check to be caught', async () => {
        await assert.rejects(
          yargs('--f 33')
            .alias('foo', 'f')
            .fail(false)
            .check(async argv => {
              wait();
              return argv.foo > 50;
            })
            .parse(),
          /Argument check failed/
        );
      });
      it('allows error to be caught before calling command', async () => {
        let output = '';
        await assert.rejects(
          yargs('cmd --foo 100')
            .fail(false)
            .command(
              'cmd',
              'a command',
              yargs => {
                yargs.check(async argv => {
                  wait();
                  output += 'first';
                  return argv.foo >= 200;
                });
              },
              async argv => {
                wait();
                output += 'second';
              }
            )
            .parse(),
          /Argument check failed/
        );
        output.should.equal('first');
      });
      it('allows error to be caught before calling command and middleware', async () => {
        let output = '';
        await assert.rejects(
          yargs('cmd --foo 10')
            .fail(false)
            .command(
              'cmd',
              'a command',
              yargs => {
                yargs.check(async argv => {
                  wait();
                  output += 'second';
                  return argv.foo >= 200;
                });
              },
              async argv => {
                wait();
                output += 'fourth';
              },
              [
                async argv => {
                  wait();
                  output += 'third';
                  argv.foo *= 2;
                },
              ]
            )
            .middleware(async argv => {
              wait();
              output += 'first';
              argv.foo *= 2;
            }, true)
            .parse(),
          /Argument check failed/
        );
        output.should.equal('firstsecond');
      });
    });
    it('applies aliases prior to calling check', async () => {
      const argv = await yargs('--f 99')
        .alias('foo', 'f')
        .check(async argv => {
          wait();
          return argv.foo > 50;
        })
        .parse();
      argv.foo.should.equal(99);
    });
  });

  describe('async coerce', () => {
    it('allows two commands to register different coerce methods', async () => {
      const y = yargs()
        .command('command1', 'first command', yargs => {
          yargs.coerce('foo', async arg => {
            wait();
            return new Date(arg);
          });
        })
        .command('command2', 'second command', yargs => {
          yargs.coerce('foo', async arg => {
            wait();
            return new Number(arg);
          });
        })
        .coerce('foo', async _arg => {
          return 'hello';
        });
      const r1 = await y.parse('command1 --foo 2020-10-10');
      expect(r1.foo).to.be.an.instanceof(Date);
      const r2 = await y.parse('command2 --foo 302');
      r2.foo.should.equal(302);
    });
    it('coerce is applied to argument and aliases', async () => {
      let callCount = 0;
      const argvPromise = yargs()
        .alias('f', 'foo')
        .coerce('foo', async arg => {
          wait();
          callCount++;
          return new Date(arg.toString());
        })
        .parse('-f 2014');
      (!!argvPromise.then).should.equal(true);
      const argv = await argvPromise;
      callCount.should.equal(1);
      expect(argv.foo).to.be.an.instanceof(Date);
      expect(argv.f).to.be.an.instanceof(Date);
    });
    it('applies coerce before validation', async () => {
      const argv = await yargs()
        .option('foo', {
          choices: [10, 20, 30],
        })
        .coerce('foo', async arg => {
          wait();
          return (arg *= 2);
        })
        .parse('--foo 5');
      argv.foo.should.equal(10);
    });
    it('allows error to be caught', async () => {
      await assert.rejects(
        yargs()
          .fail(false)
          .option('foo', {
            choices: [10, 20, 30],
          })
          .coerce('foo', async arg => {
            await wait();
            return (arg *= 2);
          })
          .parse('--foo 2'),
        /Choices: 10, 20, 30/
      );
    });
  });
});
