'use strict'
/* global describe, it, beforeEach, afterEach */

require('chai').should()
const expect = require('chai').expect

describe('skipValidation', () => {
  let yargs
  beforeEach(() => {
    yargs = require('../../')
  })

  afterEach(() => {
    delete require.cache[require.resolve('../../')]
    yargs = undefined
  })

  it('skips validation if an option with skipValidation is present', () => {
    const argv = yargs(['--koala', '--skip'])
        .demand(1)
        .fail((msg) => {
          expect.fail()
        })
        .skipValidation(['skip', 'reallySkip'])
        .argv
    argv.koala.should.equal(true)
  })

  it('does not skip validation if no option with skipValidation is present', (done) => {
    const argv = yargs(['--koala'])
        .demand(1)
        .fail(msg => done())
        .skipValidation(['skip', 'reallySkip'])
        .argv
    argv.koala.should.equal(true)
  })

  it('allows key to be specified with option shorthand', () => {
    const argv = yargs(['--koala', '--skip'])
        .demand(1)
        .fail((msg) => {
          expect.fail()
        })
        .option('skip', {
          skipValidation: true
        })
        .argv
    argv.koala.should.equal(true)
  })

  it('allows having an option that skips validation but not skipping validation if that option is not used', () => {
    let skippedValidation = true
    yargs(['--no-skip'])
        .demand(5)
        .option('skip', {
          skipValidation: true
        })
        .fail((msg) => {
          skippedValidation = false
        })
        .argv
    expect(skippedValidation).to.equal(false)
  })
})
