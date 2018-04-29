'use strict'
/* global describe, it, beforeEach, afterEach */

require('chai').should()

describe('narg', () => {
  let yargs
  beforeEach(() => {
    yargs = require('../../')
  })

  afterEach(() => {
    delete require.cache[require.resolve('../../')]
    yargs = undefined
  })

  it('accepts a key as the first argument and a count as the second', () => {
    const argv = yargs('--foo a b c')
      .nargs('foo', 2)
      .argv

    argv.foo.should.deep.equal(['a', 'b'])
    argv._.should.deep.equal(['c'])
  })

  it('accepts a hash of keys and counts', () => {
    const argv = yargs('--foo a b c')
      .nargs({
        foo: 2
      })
      .argv

    argv.foo.should.deep.equal(['a', 'b'])
    argv._.should.deep.equal(['c'])
  })

  it('allows key to be specified with option shorthand', () => {
    const argv = yargs('--foo a b c')
      .option('foo', {
        nargs: 2
      })
      .argv

    argv.foo.should.deep.equal(['a', 'b'])
    argv._.should.deep.equal(['c'])
  })
})
