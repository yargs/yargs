'use strict'
/* global describe, it, beforeEach, afterEach */

const { expect } = require('chai')
const { globalMiddlewareFactory } = require('../lib/middleware')
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
    it('fails when the promise returned by the middleware rejects', (done) => {
      const error = new Error()
      const handlerErr = new Error('should not have been called')
      yargs('foo')
        .command('foo', 'foo command', () => {}, (argv) => done(handlerErr), [ (argv) => Promise.reject(error) ])
        .fail((msg, err) => {
          expect(msg).to.equal(null)
          expect(err).to.equal(error)
          done()
        })
        .parse()
    })

    it('calls the command handler when all middleware promises resolve', (done) => {
      const middleware = (key, value) => () => new Promise((resolve, reject) => {
        setTimeout(() => {
          return resolve({ [key]: value })
        }, 5)
      })
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
  })

  // see: https://github.com/yargs/yargs/issues/1281
  it("doesn't modify globalMiddleware array when executing middleware", () => {
    let count = 0
    yargs('bar')
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

    it('throws an error if promise returned and applyBeforeValidation enabled', function () {
      expect(() => {
        yargs(['mw'])
          .middleware([function (argv) {
            argv.mw = 'mw'
            argv.other = true
            return Promise.resolve(argv)
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
              throw Error('we should not get here')
            }
          )
          .exitProcess(false)
          .parse()
      }).to.throw('middleware cannot return a promise when applyBeforeValidation is true')
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
})
