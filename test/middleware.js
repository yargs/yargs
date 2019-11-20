'use strict'
/* global describe, it, beforeEach, afterEach */

const { expect, use } = require('chai')
use(require('chai-as-promised'))
const { globalMiddlewareFactory } = require('../lib/middleware')
const { sleep } = require('./helpers/utils')
let yargs
require('chai').should()

describe('middleware', () => {
  beforeEach(() => {
    yargs = require('../')
  })
  afterEach(() => {
    delete require.cache[require.resolve('../')]
  })

  it('should add a list of callbacks to global middleware', () => {
    const globalMiddleware = []

    globalMiddlewareFactory(globalMiddleware)([() => {}, () => {}])

    globalMiddleware.should.have.lengthOf(2)
  })

  it('should throw exception if middleware is not a function', () => {
    const globalMiddleware = []

    expect(() => {
      globalMiddlewareFactory(globalMiddleware)(['callback1', 'callback2'])
    }).to.throw('middleware must be a function')
  })

  it('should add a single callback to global middleware', () => {
    const globalMiddleware = []

    globalMiddlewareFactory(globalMiddleware)(function () {})

    globalMiddleware.should.have.lengthOf(1)
  })

  it('runs the middleware before reaching the handler', function (done) {
    yargs(['mw'])
      .middleware(function (argv) {
        argv.mw = 'mw'
      })
      .command(
        'mw',
        'adds func to middleware',
        function () {},
        function (argv) {
          argv.mw.should.equal('mw')
          return done()
        }
      )
      .parse()
  })

  it('runs all middleware before reaching the handler', function (done) {
    yargs(['mw'])
      .middleware([
        function (argv) {
          argv.mw1 = 'mw1'
        },
        function (argv) {
          argv.mw2 = 'mw2'
        }
      ])
      .command(
        'mw',
        'adds func list to middleware',
        function () {},
        function (argv) {
          argv.mw1.should.equal('mw1')
          argv.mw2.should.equal('mw2')
          return done()
        }
      )
      .exitProcess(false)
      .parse()
  })

  it('should be able to register middleware regardless of when middleware is called', function (done) {
    yargs(['mw'])
      .middleware(function (argv) {
        argv.mw1 = 'mw1'
      })
      .command(
        'mw',
        'adds func list to middleware',
        function () {},
        function (argv) {
          // we should get the argv filled with data from the middleware
          argv.mw1.should.equal('mw1')
          argv.mw2.should.equal('mw2')
          argv.mw3.should.equal('mw3')
          argv.mw4.should.equal('mw4')
          return done()
        }
      )
      .middleware(function (argv) {
        argv.mw2 = 'mw2'
      })
      .middleware([
        function (argv) {
          argv.mw3 = 'mw3'
        },
        function (argv) {
          argv.mw4 = 'mw4'
        }
      ])
      .exitProcess(false)
      .parse()
  })

  // addresses https://github.com/yargs/yargs/issues/1237
  describe('async', () => {
    it('fails when the promise returned by the middleware rejects', async () => {
      const middlewareFailureErr = new Error('to be passed to fail')
      const handlerFailureErr = new Error('should not have been called')
      let failCalled = true
      await yargs('foo')
        .command('foo', 'foo command', () => {},
          (argv) => {
            throw handlerFailureErr
          },
          [async (argv) => {
            await sleep(10)
            throw middlewareFailureErr
          }]
        )
        .fail((msg, err) => {
          expect(msg).to.equal(null)
          expect(err).to.equal(middlewareFailureErr)
          failCalled = true
        })
        .parse()
      failCalled.should.equal(true)
    })

    it('fails when the middleware calls an (err, value) callback with an error', async () => {
      const middlewareFailureErr = new Error('to be passed to fail')
      const handlerFailureErr = new Error('should not have been called')
      let failCalled = true
      await yargs('foo')
        .command('foo', 'foo command', () => {},
          (argv) => {
            throw handlerFailureErr
          },
          [(argv, yargs, done) => {
            setTimeout(() => {
              done(middlewareFailureErr)
            }, 10)
          }]
        )
        .fail((msg, err) => {
          expect(msg).to.equal(null)
          expect(err).to.equal(middlewareFailureErr)
          failCalled = true
        })
        .parse()
      failCalled.should.equal(true)
    })

    it('calls the command handler when all middleware promises resolve', (done) => {
      const middleware = (key, value) => async () => {
        await sleep(5)
        return { [key]: value }
      }
      yargs('foo hello')
        .command('foo <pos>', 'foo command', () => {}, (argv) => {
          argv.hello.should.equal('world')
          argv.foo.should.equal('bar')
          done()
        }, [ middleware('hello', 'world'), middleware('foo', 'bar') ])
        .fail((msg, err) => {
          return done(Error('should not have been called'))
        })
        .exitProcess(false)
        .parse()
    })

    it('calls an async middleware only once for nested subcommands', async () => {
      let callCount = 0
      await yargs('cmd subcmd')
        .command(
          'cmd',
          'cmd command',
          function (yargs) {
            yargs.command(
              'subcmd',
              'subcmd command',
              function (yargs) {}
            )
          }
        )
        .middleware((argv) => new Promise((resolve) => {
          callCount++
          resolve(argv)
        }))
        .parse()

      callCount.should.equal(1)
    })
  })

  // see: https://github.com/yargs/yargs/issues/1281
  it("doesn't modify globalMiddleware array when executing middleware", async () => {
    let count = 0
    await yargs('bar')
      .middleware((argv) => {
        count++
      })
      .command('foo', 'foo command', () => {}, () => {}, [
        () => {
          count++
        }
      ])
      .command('bar', 'bar command', () => {}, () => {}, [
        () => {
          count++
        }
      ])
      .exitProcess(false)
      .parse()
    count.should.equal(2)
  })

  it('allows middleware to be added in builder', (done) => {
    yargs(['mw'])
      .command(
        'mw',
        'adds func to middleware',
        function (yargs) {
          yargs.middleware(function (argv) {
            argv.mw = 'mw'
          })
        },
        function (argv) {
          argv.mw.should.equal('mw')
          return done()
        }
      )
      .exitProcess(false)
      .parse()
  })

  it('passes yargs object to middleware', (done) => {
    yargs(['mw'])
      .command(
        'mw',
        'adds func to middleware',
        function (yargs) {
          yargs.middleware(function (argv, yargs) {
            expect(typeof yargs.help).to.equal('function')
            argv.mw = 'mw'
          })
        },
        function (argv) {
          argv.mw.should.equal('mw')
          return done()
        }
      )
      .exitProcess(false)
      .parse()
  })

  it('applies aliases before middleware is called', (done) => {
    yargs(['mw', '--foo', '99'])
      .middleware(function (argv) {
        argv.f.should.equal(99)
        argv.mw = 'mw'
      })
      .command(
        'mw',
        'adds func to middleware',
        function (yargs) {
          yargs.middleware((argv) => {
            argv.f.should.equal(99)
            argv.mw2 = 'mw2'
          })
        },
        function (argv) {
          argv.mw.should.equal('mw')
          argv.mw2.should.equal('mw2')
          return done()
        }
      )
      .alias('foo', 'f')
      .exitProcess(false)
      .parse()
  })

  describe('applyBeforeValidation=true', () => {
    it('runs before validation', function (done) {
      yargs(['mw'])
        .middleware(function (argv) {
          argv.mw = 'mw'
        }, true)
        .command(
          'mw',
          'adds func to middleware',
          {
            'mw': {
              'demand': true,
              'string': true
            }
          },
          function (argv) {
            argv.mw.should.equal('mw')
            return done()
          }
        )
        .exitProcess(false)
        .parse()
    })

    it('runs async before validation by returning a promise', async function () {
      let handlerCalled = false
      await yargs(['mw'])
        .middleware([async function (argv) {
          await sleep(5)
          argv.mw = 'mw'
          return argv
        }], true)
        .command(
          'mw',
          'adds func to middleware',
          {
            'mw': {
              'demand': true,
              'string': true
            }
          },
          function (argv) {
            argv.mw.should.equal('mw')
            handlerCalled = true
          }
        )
        .exitProcess(false)
        .parse()
      handlerCalled.should.equal(true)
    })

    it('runs async before validation by calling an (err, value) callback without error', async function () {
      let handlerCalled = false
      await yargs(['mw'])
        .middleware([function (argv, yargs, done) {
          setTimeout(() => {
            argv.mw = 'mw'
            done(undefined, argv)
          }, 5)
        }], true)
        .command(
          'mw',
          'adds func to middleware',
          {
            'mw': {
              'demand': true,
              'string': true
            }
          },
          function (argv) {
            argv.mw.should.equal('mw')
            handlerCalled = true
          }
        )
        .exitProcess(false)
        .parse()
      handlerCalled.should.equal(true)
    })

    it('runs before validation, when middleware is added in builder', (done) => {
      yargs(['mw'])
        .command(
          'mw',
          'adds func to middleware',
          function (yargs) {
            // we know that this middleware is being run in the context of the
            // mw command.
            yargs.middleware(function (argv) {
              argv.mw = 'mw'
            }, true)
          },
          function (argv) {
            argv.mw.should.equal('mw')
            return done()
          }
        )
        .demand('mw')
        .exitProcess(false)
        .parse()
    })

    it('applies aliases before middleware is called, for global middleware', (done) => {
      yargs(['mw', '--foo', '99'])
        .middleware(function (argv) {
          argv.f.should.equal(99)
          argv.mw = 'mw'
        }, true)
        .command(
          'mw',
          'adds func to middleware',
          {
            'mw': {
              'demand': true
            }
          },
          function (argv) {
            argv.mw.should.equal('mw')
            return done()
          }
        )
        .alias('foo', 'f')
        .exitProcess(false)
        .parse()
    })

    it('applies aliases before middleware is called, when middleware is added in builder', (done) => {
      yargs(['mw', '--foo', '99'])
        .command(
          'mw',
          'adds func to middleware',
          function (yargs) {
            yargs
              .middleware((argv) => {
                argv.f.should.equal(99)
                argv.mw = 'mw'
              }, true)
              .demand('mw')
          },
          function (argv) {
            argv.mw.should.equal('mw')
            return done()
          }
        )
        .alias('foo', 'f')
        .exitProcess(false)
        .parse()
    })
  })

  describe('middleware chains', () => {
    let ids
    const chainedMiddlewareFactory = (id, failing = false) => async (argv) => {
      await sleep(10)
      argv.ids = (argv.ids || []).concat([id])
      if (failing) throw new Error(`middleware ${id} failed`)
      ids = argv.ids
    }

    beforeEach(() => {
      ids = []
    })

    it('should chain middlewares in the right order', async () => {
      const argv = await yargs(['cmd'])
        .middleware(chainedMiddlewareFactory(1), true)
        .middleware(chainedMiddlewareFactory(3))
        .middleware(chainedMiddlewareFactory(2), true)
        .middleware(chainedMiddlewareFactory(4))
        .command('cmd', 'test command', () => {}, () => {}, [
          chainedMiddlewareFactory(5),
          chainedMiddlewareFactory(6)
        ])
        .parse()
      argv.ids.should.eql([1, 2, 3, 4, 5, 6])
    })

    it('should stop chaining middlewares and fail if a global middleware fails before validation', async () => {
      let failCalled = false
      await yargs(['cmd'])
        .middleware(chainedMiddlewareFactory(1, true), true)
        .middleware(chainedMiddlewareFactory(3))
        .middleware(chainedMiddlewareFactory(2), true)
        .middleware(chainedMiddlewareFactory(4))
        .command('cmd', 'test command', () => {}, () => {}, [
          chainedMiddlewareFactory(5),
          chainedMiddlewareFactory(6)
        ])
        .fail((msg, err) => {
          err.message.should.equal('middleware 1 failed')
          ids.should.eql([])
          failCalled = true
        })
        .parse()
      failCalled.should.equal(true)
    })

    it('should stop chaining middlewares and fail if a global middleware fails after validation', async () => {
      let failCalled = false
      await yargs(['cmd'])
        .middleware(chainedMiddlewareFactory(1), true)
        .middleware(chainedMiddlewareFactory(3, true))
        .middleware(chainedMiddlewareFactory(2), true)
        .middleware(chainedMiddlewareFactory(4))
        .command('cmd', 'test command', () => {}, () => {}, [
          chainedMiddlewareFactory(5),
          chainedMiddlewareFactory(6)
        ])
        .fail((msg, err) => {
          err.message.should.equal('middleware 3 failed')
          ids.should.eql([1, 2])
          failCalled = true
        })
        .parse()
      failCalled.should.equal(true)
    })

    it('should stop chaining middlewares and fail if a command middleware fails', async () => {
      let failCalled = false
      await yargs(['cmd'])
        .middleware(chainedMiddlewareFactory(1), true)
        .middleware(chainedMiddlewareFactory(3))
        .middleware(chainedMiddlewareFactory(2), true)
        .middleware(chainedMiddlewareFactory(4))
        .command('cmd', 'test command', () => {}, () => {}, [
          chainedMiddlewareFactory(5, true),
          chainedMiddlewareFactory(6)
        ])
        .fail((msg, err) => {
          err.message.should.equal('middleware 5 failed')
          ids.should.eql([1, 2, 3, 4])
          failCalled = true
        })
        .parse()
      failCalled.should.equal(true)
    })
  })
})
