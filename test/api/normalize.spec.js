'use strict'
/* global describe, it, beforeEach, afterEach */

require('chai').should()
const path = require('path')

describe('normalize', () => {
  let yargs
  beforeEach(() => {
    yargs = require('../../')
  })

  afterEach(() => {
    delete require.cache[require.resolve('../../')]
  })

  it('normalizes paths passed as arguments', () => {
    const argv = yargs('--path /foo/bar//baz/asdf/quux/..')
      .normalize(['path'])
      .argv

    argv.path.should.equal(['', 'foo', 'bar', 'baz', 'asdf'].join(path.sep))
  })

  it('normalizes path when when it is updated', () => {
    const argv = yargs('--path /batman')
      .normalize(['path'])
      .argv

    argv.path = '/foo/bar//baz/asdf/quux/..'
    argv.path.should.equal(['', 'foo', 'bar', 'baz', 'asdf'].join(path.sep))
  })

  it('allows key to be specified with option shorthand', () => {
    const argv = yargs('--path /batman')
      .option('path', {
        normalize: true
      })
      .argv

    argv.path = '/foo/bar//baz/asdf/quux/..'
    argv.path.should.equal(['', 'foo', 'bar', 'baz', 'asdf'].join(path.sep))
  })

  it('can be disabled with option shorthand', () => {
    const argv = yargs('--path /batman')
      .option('path', {
        normalize: false
      })
      .argv

    argv.path = 'mongodb://url'
    argv.path.should.equal('mongodb://url')
  })
})
