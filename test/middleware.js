'use strict'
/* global describe, it, beforeEach, afterEach */

const middlewareFactory = require('../lib/middleware')
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

    middlewareFactory(globalMiddleware)(['callback1', 'callback2'])

    globalMiddleware.should.have.lengthOf(2)
  })

  it('should add a single callback to global middleware', () => {
    const globalMiddleware = []

    middlewareFactory(globalMiddleware)(function () {})

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
          // we should get the argv filled with data from the middleware
          argv.mw.should.equal('mw')
          return done()
        }
      )
      .exitProcess(false) // defaults to true.
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
          // we should get the argv filled with data from the middleware
          argv.mw1.should.equal('mw1')
          argv.mw2.should.equal('mw2')
          return done()
        }
      )
      .exitProcess(false) // defaults to true.
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
      .exitProcess(false) // defaults to true.
      .parse()
  })
})
