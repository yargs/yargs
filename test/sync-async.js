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
    it('should return argv when sync handler returns', () => {
      expectReturns(['cmd'], () => {
        return yargs(['cmd'])
          .command('cmd', 'description', () => { }, () => { })
          .parse()
      })
    })

    it('should throw when syntax is incorrect and handler sync', () => {
      expectThrows(/Unknown argument: unknown-cmd/, () => {
        return yargs(['unknown-cmd'])
          .command('cmd', 'description', () => { }, () => { })
          .strict()
          .exitProcess(false)
          .parse()
      })
    })

    it('should throw when sync handler throws', () => {
      expectThrows(/handler error/, () => {
        return yargs(['cmd'])
          .command('cmd', 'description', () => { }, () => {
            throw new Error('handler error')
          })
          .exitProcess(false)
          .parse()
      })
    })

    it('should resolve argv when async handler resolves', (done) => {
      expectResolves(done, ['cmd'], () => {
        return yargs(['cmd'])
          .command('cmd', 'description', () => { }, () => Promise(
            (resolve) => process.nextTick(resolve)
          ))
          .parse()
      })
    })

    it('should throw when syntax is incorrect and handler is async', () => {
      expectThrows(/Unknown argument: unknown-cmd/, () => {
        return yargs(['unknown-cmd'])
          .command('cmd', 'description', () => { }, () => Promise(
            (resolve) => process.nextTick(resolve)
          ))
          .strict()
          .exitProcess(false)
          .parse()
      })
    })

    it('should reject when async handler rejects', (done) => {
      expectRejects(done, /handler error/, () => {
        return yargs(['cmd'])
          .command('cmd', 'description', () => { }, () => Promise(
            (_, reject) => process.nextTick(reject, 'handler error')
          ))
          .strict()
          .exitProcess(false)
          .parse()
      })
    })
  })

  describe('parseAsync', () => {
    it('should resolve argv when sync handler returns', (done) => {
      expectResolves(done, ['cmd'], () => {
        return yargs(['cmd'])
          .command('cmd', 'description', () => { }, () => { })
          .parseAsync()
      })
    })

    it('should reject when syntax is incorrect and handler sync', (done) => {
      expectRejects(done, /Unknown argument: unknown-cmd/, () => {
        return yargs(['unknown-cmd'])
          .command('cmd', 'description', () => { }, () => { })
          .strict()
          .exitProcess(false)
          .parseAsync()
      })
    })

    it('should reject when sync command handler throws', (done) => {
      expectRejects(done, /handler error/, () => {
        return yargs(['cmd'])
          .command('cmd', 'description', () => { }, () => {
            throw new Error('handler error')
          })
          .exitProcess(false)
          .parseAsync()
      })
    })

    it('should resolve argv when async handler resolves', (done) => {
      expectResolves(done, ['cmd'], () => {
        return yargs(['cmd'])
          .command('cmd', 'description', () => { }, () => Promise(
            (resolve) => process.nextTick(resolve)
          ))
          .parseAsync()
      })
    })

    it('should reject when syntax is incorrect and handler async', (done) => {
      expectRejects(done, /Unknown argument: unknown-cmd/, () => {
        return yargs(['unknown-cmd'])
          .command('cmd', 'description', () => { }, () => Promise(
            (resolve) => process.nextTick(resolve)
          ))
          .strict()
          .exitProcess(false)
          .parseAsync()
      })
    })

    it('should reject when async handler rejects', (done) => {
      expectRejects(done, /handler error/, () => {
        return yargs(['cmd'])
          .command('cmd', 'description', () => { }, () => Promise(
            (_, reject) => process.nextTick(reject, 'handler error')
          ))
          .exitProcess(false)
          .parseAsync()
      })
    })
  })

  describe('parseSync', () => {
    it('should return argv when handler is sync', () => {
      expectReturns(['cmd'], () => {
        return yargs(['cmd'])
          .command('cmd', 'description', () => { }, () => { })
          .parseSync()
      })
    })

    it('should throw when syntax is incorrect and handler sync', () => {
      expectThrows(/Unknown argument: unknown-cmd/, () => {
        return yargs(['unknown-cmd'])
          .command('cmd', 'description', () => { }, () => { })
          .strict()
          .exitProcess(false)
          .parseSync()
      })
    })

    it('should throw when sync command handler throws', () => {
      expectThrows(/handler error/, () => {
        return yargs(['cmd'])
          .command('cmd', 'description', () => { }, () => {
            throw new Error('handler error')
          })
          .exitProcess(false)
          .parseSync()
      })
    })

    it('should throw when async handler resolves', () => {
      expectThrows(/asynchronous parsing results/, () => {
        return yargs(['cmd'])
          .command('cmd', 'description', () => { }, () => Promise(
            (resolve) => process.nextTick(resolve)
          ))
          .exitProcess(false)
          .parseSync()
      })
    })

    it('should throw when syntax is incorrect and handler is async', () => {
      expectThrows(/Unknown argument: unknown-cmd/, () => {
        return yargs(['unknown-cmd'])
          .command('cmd', 'description', () => { }, () => Promise(
            (resolve) => process.nextTick(resolve)
          ))
          .strict()
          .exitProcess(false)
          .parseSync()
      })
    })

    it('should throw when async handler rejects', () => {
      expectThrows(/asynchronous parsing results/, () => {
        return yargs(['cmd'])
          .command('cmd', 'description', () => { }, () => Promise(
            (_, reject) => process.nextTick(reject)
          ))
          .exitProcess(false)
          .parseSync()
      })
    })
  })
})

function expectReturns (positionals, parse) {
  checkOutput(() => {
    const argv = parse()
    expect(isPromise(argv)).to.equal(false)
    expect(argv._).to.deep.equal(positionals)
  })
}

function expectThrows (message, parse) {
  checkOutput(() => {
    expect(parse).to.throw(message)
  })
}

function expectResolves (done, positionals, parse) {
  checkOutput(() => {
    const argvPromise = parse()
    expect(isPromise(argvPromise)).to.equal(true)
    argvPromise.then(
      (argv) => {
        expect(argv._).to.deep.equal(positionals)
        done()
      },
      () => done('the promise should have been resolved')
    )
  })
}

function expectRejects (done, message, parse) {
  checkOutput(() => {
    const argvPromise = parse()
    expect(isPromise(argvPromise)).to.equal(true)
    argvPromise.then(
      () => done('the promise should have been rejected'),
      (err) => {
        expect(err.message).to.match(message)
        done()
      }
    )
  })
}
