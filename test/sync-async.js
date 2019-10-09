'use strict'
/* global describe, it, beforeEach, afterEach */

const expect = require('chai').expect
const checkOutput = require('./helpers/utils').checkOutput
const isPromise = require('../lib/is-promise')
let yargs

describe('yargs sync/async tests', () => {
  beforeEach(() => {
    yargs = require('../')
  })

  afterEach(() => {
    delete require.cache[require.resolve('../')]
  })

  describe('parse', () => {
    it('should return a value when handler is sync', () => {
      const argv = yargs(['cmd'])
        .command('cmd', 'description', () => { }, () => { })
        .parse()
      expect(isPromise(argv)).to.equal(false)
      expect(argv._).to.deep.equal(['cmd'])
    })

    it('should throw when syntax is incorrect', () => {
      checkOutput(() => {
        expect(() => {
          yargs(['unknown-cmd'])
            .command('cmd', 'description', () => { }, () => { })
            .strict()
            .exitProcess(false)
            .parse()
        }).to.throw(/Unknown argument: unknown-cmd/)
      })
    })

    it('should throw when sync command handler throws', () => {
      checkOutput(() => {
        expect(() => {
          yargs(['cmd'])
            .command('cmd', 'description', () => { }, () => {
              throw new Error('handler error')
            })
            .exitProcess(false)
            .parse()
        }).to.throw(/handler error/)
      })
    })

    it('should return a resolved promise when async handler resolves', (done) => {
      const argvPromise = yargs(['cmd'])
        .command('cmd', 'description', () => { }, () => Promise(
          (resolve) => setTimeout(() => resolve(), 50)
        ))
        .parse()
      expect(isPromise(argvPromise)).to.equal(true)
      argvPromise.then(
        (argv) => {
          expect(argv._).to.deep.equal(['cmd'])
          done()
        },
        () => done('the promise should have been resolved')
      )
    })

    it('should throw when syntax is incorrect although handler is async', () => {
      checkOutput(() => {
        expect(() => {
          yargs(['unknown-cmd'])
            .command('cmd', 'description', () => { }, () => Promise(
              (resolve) => setTimeout(() => resolve(), 50)
            ))
            .strict()
            .exitProcess(false)
            .parse()
        }).to.throw(/Unknown argument: unknown-cmd/)
      })
    })

    it('should return a rejected promise when async handler rejects', (done) => {
      checkOutput(() => {
        const argvPromise = yargs(['cmd'])
          .command('cmd', 'description', () => { }, () => Promise(
            (_, reject) => setTimeout(() => reject('handler error'), 50)
          ))
          .strict()
          .exitProcess(false)
          .parse()
        expect(isPromise(argvPromise)).to.equal(true)
        argvPromise.then(
          () => done('the promise should have been rejected'),
          (err) => {
            expect(err.message).to.match(/handler error/)
            done()
          }
        )
      })
    })
  })

  describe('parseSync', () => {
    it('should return a value when handler is sync', () => {
      const argv = yargs(['cmd'])
        .command('cmd', 'description', () => { }, () => { })
        .parseSync()
      expect(isPromise(argv)).to.equal(false)
      expect(argv._).to.deep.equal(['cmd'])
    })

    it('should throw when syntax is incorrect', () => {
      checkOutput(() => {
        expect(() => {
          yargs(['unknown-cmd'])
            .command('cmd', 'description', () => { }, () => { })
            .strict()
            .exitProcess(false)
            .parseSync()
        }).to.throw(/Unknown argument: unknown-cmd/)
      })
    })

    it('should throw when sync command handler throws', () => {
      checkOutput(() => {
        expect(() => {
          yargs(['cmd'])
            .command('cmd', 'description', () => { }, () => {
              throw new Error('handler error')
            })
            .exitProcess(false)
            .parseSync()
        }).to.throw(/handler error/)
      })
    })

    it('should throw when async handler resolves', () => {
      checkOutput(() => {
        expect(() => {
          yargs(['cmd'])
            .command('cmd', 'description', () => { }, () => Promise(
              (resolve) => setTimeout(() => resolve(), 50)
            ))
            .exitProcess(false)
            .parseSync()
        }).to.throw(/asynchronous parsing results/)
      })
    })

    it('should throw when syntax is incorrect although handler is async', () => {
      checkOutput(() => {
        expect(() => {
          yargs(['unknown-cmd'])
            .command('cmd', 'description', () => { }, () => Promise(
              (resolve) => setTimeout(() => resolve(), 50)
            ))
            .strict()
            .exitProcess(false)
            .parseSync()
        }).to.throw(/Unknown argument: unknown-cmd/)
      })
    })

    it('should throw when async handler rejects', () => {
      checkOutput(() => {
        expect(() => {
          yargs(['cmd'])
            .command('cmd', 'description', () => { }, () => Promise(
              (_, reject) => setTimeout(() => reject(), 50)
            ))
            .exitProcess(false)
            .parseSync()
        }).to.throw(/asynchronous parsing results/)
      })
    })
  })
})
